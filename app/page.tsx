"use client";

import { useState, useMemo } from "react";
import fieldInfos from "./fieldInfos";

// --- Lokale Implementierung der Berechnungslogik (eingebettet, damit kein externes Modul benötigt wird) ---

interface Inputs {
  kaufpreis: number;
  eigenkapital: number;
  zinssatz_percent: number;
  tilgungssatz_percent: number;
  wochen_pro_jahr: number;
  mietpreis_pro_woche: number;
  gebaeudeanteil_percent: number;
  afa_nutzungsdauer_jahre: number;
  einkommen_steuersatz_percent: number;
  anteil_vermietung_percent: number;
  // Neue Kostenpositionen
  instandhaltung_percent: number;
  verwaltung_percent: number;
  leerstand_percent: number;
  nebenkosten_jahr: number;
  buchungsgebuehren_percent: number;
  endreinigung_pro_gast: number;
  marketing_jahr: number;
  reparaturen_jahr: number;
}

type Results = {
  darlehenssumme: number;
  zinskosten_jahr: number;
  tilgung_jahr: number;
  annuitaet_jahr: number;
  monatliche_rate: number;
  afa_jahr: number;
  absetzbare_kosten: number;
  jahre_bis_abbezahlt: number | null;
  // Neue Kostenberechnungen
  instandhaltung_jahr: number;
  gesamte_fixkosten_jahr: number;
};

type ScenarioRow = {
  wochen: number;
  einnahmen: number;
  zu_versteuern: number;
  steuerlast: number;
  operativer_cashflow: number;
  operativer_cashflow_nach_steuer: number;
  freier_cashflow: number;
  cashflow_vor_steuer: number; // Deprecated, für Kompatibilität
  netto_nach_steuer: number;   // Deprecated, für Kompatibilität
};

function pct(v: number) {
  return v / 100;
}

function round2(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function computeBaseResults(inputs: Inputs): Results {
  const afa_nutzungsdauer = inputs.afa_nutzungsdauer_jahre ?? 50;

  const darlehenssumme = round2(inputs.kaufpreis - inputs.eigenkapital);
  const zinskosten_jahr = round2(darlehenssumme * pct(inputs.zinssatz_percent));
  const tilgung_jahr = round2(darlehenssumme * pct(inputs.tilgungssatz_percent));
  const annuitaet_jahr = round2(zinskosten_jahr + tilgung_jahr);
  const monatliche_rate = round2(annuitaet_jahr / 12);
  const afa_jahr = round2((inputs.kaufpreis * pct(inputs.gebaeudeanteil_percent)) / afa_nutzungsdauer);

  // Neue realistische Kostenberechnungen
  const instandhaltung_jahr = round2(inputs.kaufpreis * pct(inputs.instandhaltung_percent));
  const gesamte_fixkosten_jahr = round2(
    instandhaltung_jahr + 
    inputs.nebenkosten_jahr + 
    inputs.marketing_jahr + 
    inputs.reparaturen_jahr
  );

  const absetzbare_kosten = round2((gesamte_fixkosten_jahr + zinskosten_jahr + afa_jahr) * pct(inputs.anteil_vermietung_percent));

  const jahre_bis_abbezahlt = tilgung_jahr > 0 ? round2(darlehenssumme / tilgung_jahr) : null;

  return {
    darlehenssumme,
    zinskosten_jahr,
    tilgung_jahr,
    annuitaet_jahr,
    monatliche_rate,
    afa_jahr,
    absetzbare_kosten,
    jahre_bis_abbezahlt,
    instandhaltung_jahr,
    gesamte_fixkosten_jahr,
  };
}

function generateScenarioTable(inputs: Inputs, minWeeks = 8, maxWeeks = 40): ScenarioRow[] {
  const base = computeBaseResults(inputs);
  const rows: ScenarioRow[] = [];

  for (let w = minWeeks; w <= maxWeeks; w++) {
    // Bruttoeinnahmen vor Leerstand
    const brutto_einnahmen = round2(w * inputs.mietpreis_pro_woche);
    
    // Berücksichtigung des Leerstands
    const einnahmen = round2(brutto_einnahmen * (1 - pct(inputs.leerstand_percent)));
    
    // Variable Kosten pro Woche
    const verwaltungskosten = round2(einnahmen * pct(inputs.verwaltung_percent));
    const buchungsgebuehren = round2(einnahmen * pct(inputs.buchungsgebuehren_percent));
    const endreinigung_gesamt = round2(w * inputs.endreinigung_pro_gast);
    
    // Gesamte variable Kosten
    const variable_kosten = round2(verwaltungskosten + buchungsgebuehren + endreinigung_gesamt);
    
    // Netto-Einnahmen nach variablen Kosten
    const netto_einnahmen = round2(einnahmen - variable_kosten);
    
    // Steuerberechnung
    const absetzbare_kosten = round2((base.gesamte_fixkosten_jahr + base.zinskosten_jahr + base.afa_jahr) * pct(inputs.anteil_vermietung_percent));
    const zu_versteuern = round2(Math.max(0, brutto_einnahmen - absetzbare_kosten));
    const steuerlast = round2(Math.max(0, zu_versteuern) * pct(inputs.einkommen_steuersatz_percent));    // Korrekte Cashflow-Berechnung mit allen neuen Kosten
    const operativer_cashflow = round2(netto_einnahmen - base.gesamte_fixkosten_jahr - base.zinskosten_jahr);
    const operativer_cashflow_nach_steuer = round2(operativer_cashflow - steuerlast);
    
    // Freier Cashflow = Operativer Cashflow nach Steuern - Tilgung
    const freier_cashflow = round2(operativer_cashflow_nach_steuer - base.tilgung_jahr);
    
    // Deprecated Felder für Kompatibilität (alte falsche Berechnung)
    const cashflow_vor_steuer = round2(einnahmen - base.gesamte_fixkosten_jahr - base.zinskosten_jahr - base.tilgung_jahr);
    const netto_nach_steuer = round2(cashflow_vor_steuer - steuerlast);

    rows.push({
      wochen: w,
      einnahmen: netto_einnahmen, // Verwende Netto-Einnahmen nach allen Abzügen
      zu_versteuern,
      steuerlast,
      operativer_cashflow,
      operativer_cashflow_nach_steuer,
      freier_cashflow,
      cashflow_vor_steuer, // Deprecated
      netto_nach_steuer,   // Deprecated
    });
  }

  return rows;
}

function computeAll(inputs: Inputs, minWeeks = 8, maxWeeks = 40) {
  return {
    inputs,
    base: computeBaseResults(inputs),
    scenarios: generateScenarioTable(inputs, minWeeks, maxWeeks),
  };
}

// --- React-Komponente ---
export default function Home() {
  const [inputs, setInputs] = useState<Inputs>({
    kaufpreis: 320000,
    eigenkapital: 100000,
    zinssatz_percent: 3.5,
    tilgungssatz_percent: 2,
    wochen_pro_jahr: 26,
    mietpreis_pro_woche: 1400,
    einkommen_steuersatz_percent: 30,
    gebaeudeanteil_percent: 80,
    afa_nutzungsdauer_jahre: 50,
    anteil_vermietung_percent: 70,
    // Realistische Kostenpositionen mit Standardwerten
    instandhaltung_percent: 1.5,           // 1,5% des Kaufpreises
    verwaltung_percent: 12,                // 12% der Mieteinnahmen
    leerstand_percent: 0,                  // Kein Leerstand als Ausgangswert
    nebenkosten_jahr: 2400,               // 200€/Monat (Strom, Wasser, Internet, Grundsteuer)
    buchungsgebuehren_percent: 8,          // 8% der Buchungen (Airbnb, Booking.com)
    endreinigung_pro_gast: 80,            // 80€ pro Gast/Buchung
    marketing_jahr: 1200,                  // 100€/Monat (Fotos, Anzeigen)
    reparaturen_jahr: 500,                 // 500€/Jahr Reparaturen
  });

  const result = useMemo(() => computeAll(inputs, 8, 40), [inputs]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.name as keyof Inputs;
    const raw = e.target.value;
    const parsed = raw === "" ? 0 : parseFloat(raw);
    setInputs((prev) => ({ ...prev, [name]: Number.isNaN(parsed) ? 0 : parsed } as Inputs));
  }

  const inputKeys = Object.keys(inputs) as (keyof Inputs)[];

  const fmt = (n: number | null | undefined) => (n == null ? "-" : n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  // Definiere Labels für bessere Anzeige
  const fieldLabels: Record<keyof Inputs, string> = {
    kaufpreis: "Kaufpreis (€)",
    eigenkapital: "Eigenkapital (€)",
    zinssatz_percent: "Zinssatz (%)",
    tilgungssatz_percent: "Tilgung (%)",
    wochen_pro_jahr: "Wochen pro Jahr",
    mietpreis_pro_woche: "Mietpreis pro Woche (€)",
    einkommen_steuersatz_percent: "Steuersatz (%)",
    gebaeudeanteil_percent: "Gebäudeanteil (%)",
    anteil_vermietung_percent: "Anteil Vermietung (%)",
    afa_nutzungsdauer_jahre: "AfA Nutzungsdauer (Jahre)",
    // Neue Kostenfelder
    instandhaltung_percent: "Instandhaltung (% Kaufpreis)",
    verwaltung_percent: "Verwaltung (% Mieteinnahmen)",
    leerstand_percent: "Leerstand (%)",
    nebenkosten_jahr: "Nebenkosten pro Jahr (€)",
    buchungsgebuehren_percent: "Buchungsgebühren (%)",
    endreinigung_pro_gast: "Endreinigung pro Gast (€)",
    marketing_jahr: "Marketing pro Jahr (€)",
    reparaturen_jahr: "Reparaturen pro Jahr (€)"
  };

  const resultLabels: Record<keyof Results, string> = {
    darlehenssumme: "Darlehenssumme (€)",
    zinskosten_jahr: "Zinskosten pro Jahr (€)",
    tilgung_jahr: "Tilgung pro Jahr (€)",
    annuitaet_jahr: "Annuität pro Jahr (€)",
    monatliche_rate: "Monatliche Rate (€)",
    afa_jahr: "AfA pro Jahr (€)",
    absetzbare_kosten: "Absetzbare Kosten (€)",
    jahre_bis_abbezahlt: "Jahre bis abbezahlt",
    instandhaltung_jahr: "Instandhaltung pro Jahr (€)",
    gesamte_fixkosten_jahr: "Gesamte Fixkosten pro Jahr (€)"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Ferienhaus Vollrechner</h1>

        {/* Eingaben */}
        <div className="space-y-8 mb-8">
          {/* Grunddaten */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-blue-700">💰 Grunddaten & Finanzierung</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['kaufpreis', 'eigenkapital', 'zinssatz_percent', 'tilgungssatz_percent', 'mietpreis_pro_woche'].map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-600 flex items-center gap-1 relative">
                    {fieldLabels[key as keyof Inputs]}
                    <InfoIconWithPopover infoKey={key} />
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={String(inputs[key as keyof Inputs] ?? "")}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Kosten */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-red-700">🏠 Laufende Kosten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['instandhaltung_percent', 'nebenkosten_jahr', 'reparaturen_jahr', 'marketing_jahr'].map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-600 flex items-center gap-1 relative">
                    {fieldLabels[key as keyof Inputs]}
                    <InfoIconWithPopover infoKey={key} />
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={String(inputs[key as keyof Inputs] ?? "")}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Variable Kosten */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-orange-700">📊 Variable Kosten</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['verwaltung_percent', 'buchungsgebuehren_percent', 'endreinigung_pro_gast', 'leerstand_percent'].map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-600 flex items-center gap-1 relative">
                    {fieldLabels[key as keyof Inputs]}
                    <InfoIconWithPopover infoKey={key} />
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={String(inputs[key as keyof Inputs] ?? "")}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Steuerliche Parameter */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-green-700">📋 Steuerliche Parameter</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['einkommen_steuersatz_percent', 'gebaeudeanteil_percent', 'anteil_vermietung_percent', 'afa_nutzungsdauer_jahre'].map((key) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium mb-2 text-gray-600 flex items-center gap-1 relative">
                    {fieldLabels[key as keyof Inputs]}
                    <InfoIconWithPopover infoKey={key} />
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={key}
                    value={String(inputs[key as keyof Inputs] ?? "")}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ergebnisse (Basiswerte) */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Basis-Ergebnisse</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(result.base).map(([key, value]) => (
              <div key={key} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {resultLabels[key as keyof Results]}
                </div>
                <div className="text-lg font-bold text-blue-800">
                  {fmt(value as number)}
                </div>
              </div>
            ))}
          </div>

          {/* Neue Boxen für Rentabilität nach Steuern und freien Cashflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Rentabilität nach Steuern */}
            {(() => {
              const firstPositiveAfterTax = result.scenarios.find(row => row.operativer_cashflow_nach_steuer > 0);
              return (
                <div className="rounded-lg border p-4 bg-green-50 text-green-900 flex flex-col items-center">
                  <div className="font-semibold text-lg mb-1">
                    {firstPositiveAfterTax
                      ? <>Positiv nach Steuern ab Woche {firstPositiveAfterTax.wochen}</>
                      : <>Keine Rentabilität nach Steuern bei den aktuellen Annahmen</>
                    }
                  </div>
                  {firstPositiveAfterTax && (
                    <div className="text-sm text-green-700">
                      Erster positiver Cashflow nach Steuern: {fmt(firstPositiveAfterTax.operativer_cashflow_nach_steuer)} €
                    </div>
                  )}
                </div>
              );
            })()}
            {/* Rentabilität freier Cashflow */}
            {(() => {
              const firstPositiveFreeCashflow = result.scenarios.find(row => row.freier_cashflow > 0);
              return (
                <div className="rounded-lg border p-4 bg-green-50 text-green-900 flex flex-col items-center">
                  <div className="font-semibold text-lg mb-1">
                    {firstPositiveFreeCashflow
                      ? <>Rentabel ab Woche {firstPositiveFreeCashflow.wochen} mit {fmt(firstPositiveFreeCashflow.freier_cashflow)} €</>
                      : <>Kein positiver freier Cashflow bei den aktuellen Annahmen</>
                    }
                  </div>
                  {firstPositiveFreeCashflow && (
                    <div className="text-sm text-green-700">
                      Erster positiver freier Cashflow: {fmt(firstPositiveFreeCashflow.freier_cashflow)} €
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Szenarientabelle */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Szenarien (8–40 Wochen Vermietung)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Wochen</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Einnahmen (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Zu versteuern (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Steuerlast (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Operativer Cashflow (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Nach Steuern (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Freier Cashflow (€)</th>
                </tr>
              </thead>
              <tbody>
                {result.scenarios.map((row, index) => (
                  <tr 
                    key={row.wochen} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800">{row.wochen}</td>
                    <td className="p-3 text-gray-700">{fmt(row.einnahmen)}</td>
                    <td className="p-3 text-gray-700">{fmt(row.zu_versteuern)}</td>
                    <td className="p-3 text-gray-700">{fmt(row.steuerlast)}</td>
                    <td className={`p-3 font-medium ${row.operativer_cashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(row.operativer_cashflow)}
                    </td>
                    <td className={`p-3 font-medium ${row.operativer_cashflow_nach_steuer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(row.operativer_cashflow_nach_steuer)}
                    </td>
                    <td className={`p-3 font-bold ${row.freier_cashflow >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {fmt(row.freier_cashflow)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Erklärung der Cashflow-Berechnung */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Cashflow-Analyse verstehen</h3>
          <div className="space-y-4">
            
            {/* Cashflow-Stufen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">1️⃣ Operativer Cashflow</h4>
                <p className="text-sm text-blue-700 mb-2">Einnahmen minus Betriebskosten und Zinsen</p>
                <p className="text-xs text-blue-600">→ Operative Rentabilität der Immobilie</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">2️⃣ Nach Steuern</h4>
                <p className="text-sm text-blue-700 mb-2">Operativer Cashflow minus Steuerlast</p>
                <p className="text-xs text-blue-600">→ Nach Berücksichtigung der Einkommensteuer</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-green-200 ring-2 ring-green-300">
                <h4 className="font-semibold text-green-800 mb-2">3️⃣ Freier Cashflow</h4>
                <p className="text-sm text-green-700 mb-2">Nach Steuern minus Tilgung</p>
                <p className="text-xs text-green-600">→ <strong>Tatsächlich verfügbares Geld</strong></p>
              </div>
              
            </div>
            
            {/* Wichtige Hinweise */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 Wichtig zu verstehen:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-yellow-700">
                <div>
                  <p><strong>Tilgung ≠ Verlust:</strong></p>
                  <p className="text-xs">Tilgung baut Ihr Vermögen auf, ist aber kein verfügbares Geld</p>
                </div>
                <div>
                  <p><strong>Break-Even Punkt:</strong></p>
                  <p className="text-xs">Investment rechnet sich ab positivem freien Cashflow</p>
                </div>
              </div>
            </div>
            
            {/* Erfolgs-Indikator */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-semibold text-green-800">Investment erfolgreich wenn:</p>
                  <p className="text-sm text-green-700">Der freie Cashflow positiv wird → Das Ferienhaus bringt Ihnen monatlich Geld</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Kostenaufschlüsselung */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Berücksichtigte Kosten</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>
              <h4 className="font-semibold mb-2">Fixe Kosten:</h4>
              <ul className="space-y-1">
                <li>• Instandhaltung: {inputs.instandhaltung_percent}% des Kaufpreises</li>
                <li>• Nebenkosten: {fmt(inputs.nebenkosten_jahr)}/Jahr</li>
                <li>• Marketing: {fmt(inputs.marketing_jahr)}/Jahr</li>
                <li>• Reparaturen: {fmt(inputs.reparaturen_jahr)}/Jahr</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Variable Kosten:</h4>
              <ul className="space-y-1">
                <li>• Leerstand: {inputs.leerstand_percent}% der geplanten Auslastung</li>
                <li>• Verwaltung: {inputs.verwaltung_percent}% der Einnahmen</li>
                <li>• Buchungsgebühren: {inputs.buchungsgebuehren_percent}% der Einnahmen</li>
                <li>• Endreinigung: {fmt(inputs.endreinigung_pro_gast)}/Gast</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hinweise */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Wichtige Hinweise</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Die Berechnungen berücksichtigen jetzt realistische Kostenpositionen</li>
            <li>• Tilgung ist kein Verlust, sondern Vermögensaufbau (Eigenkapitalerhöhung)</li>
            <li>• Änderungen der Zinssätze und Steuergesetze können die Ergebnisse beeinflussen</li>
            <li>• Zusätzliche Kosten wie Renovierungen oder Leerstand sind nicht berücksichtigt</li>
            <li>• Die AfA (Abschreibung für Abnutzung) wird standardmäßig mit 50 Jahren berechnet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Info-Icon-Komponente mit Popover
function InfoIconWithPopover({ infoKey }: { infoKey: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="ml-1 cursor-pointer relative inline-block" tabIndex={0}
      onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      onBlur={() => setOpen(false)}
      onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}
    >
      {/* Modernes Info-Icon (Material Design Stil) */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="inline align-middle">
        <circle cx="12" cy="12" r="12" fill="#2563eb" />
        <text x="12" y="13" textAnchor="middle" alignmentBaseline="middle" fontSize="13" fill="#fff" fontFamily="Arial" dominantBaseline="middle">i</text>
      </svg>
      {open && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-blue-200 rounded-lg shadow-lg p-3 text-xs text-gray-800 animate-fade-in" style={{ minWidth: '180px' }}>
          {fieldInfos[infoKey]}
        </div>
      )}
    </span>
  );
}
