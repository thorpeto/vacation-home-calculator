"use client";

import { useState, useMemo } from "react";

// --- Lokale Implementierung der Berechnungslogik (eingebettet, damit kein externes Modul benötigt wird) ---

type Inputs = {
  kaufpreis: number;
  eigenkapital: number;
  zinssatz_percent: number;
  tilgung_percent: number;
  fixkosten_jahr: number;
  mietpreis_pro_woche: number;
  steuersatz_percent: number;
  gebaeudeanteil_percent: number;
  anteil_vermietung_percent: number;
  afa_nutzungsdauer_jahre?: number;
};

type Results = {
  darlehenssumme: number;
  zinskosten_jahr: number;
  tilgung_jahr: number;
  annuitaet_jahr: number;
  monatliche_rate: number;
  afa_jahr: number;
  absetzbare_kosten: number;
  jahre_bis_abbezahlt: number | null;
};

type ScenarioRow = {
  wochen: number;
  einnahmen: number;
  zu_versteuern: number;
  steuerlast: number;
  cashflow_vor_steuer: number;
  netto_nach_steuer: number;
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
  const tilgung_jahr = round2(darlehenssumme * pct(inputs.tilgung_percent));
  const annuitaet_jahr = round2(zinskosten_jahr + tilgung_jahr);
  const monatliche_rate = round2(annuitaet_jahr / 12);
  const afa_jahr = round2((inputs.kaufpreis * pct(inputs.gebaeudeanteil_percent)) / afa_nutzungsdauer);

  const absetzbare_kosten = round2((inputs.fixkosten_jahr + zinskosten_jahr + afa_jahr) * pct(inputs.anteil_vermietung_percent));

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
  };
}

function generateScenarioTable(inputs: Inputs, minWeeks = 8, maxWeeks = 40): ScenarioRow[] {
  const base = computeBaseResults(inputs);
  const rows: ScenarioRow[] = [];

  for (let w = minWeeks; w <= maxWeeks; w++) {
    const einnahmen = round2(w * inputs.mietpreis_pro_woche);
    const zu_versteuern = round2(einnahmen - base.absetzbare_kosten);
    const steuerlast = round2(Math.max(0, zu_versteuern) * pct(inputs.steuersatz_percent));
    const cashflow_vor_steuer = round2(einnahmen - inputs.fixkosten_jahr - base.zinskosten_jahr - base.tilgung_jahr);
    const netto_nach_steuer = round2(cashflow_vor_steuer - steuerlast);

    rows.push({
      wochen: w,
      einnahmen,
      zu_versteuern,
      steuerlast,
      cashflow_vor_steuer,
      netto_nach_steuer,
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
    tilgung_percent: 2,
    fixkosten_jahr: 6000,
    mietpreis_pro_woche: 1400,
    steuersatz_percent: 30,
    gebaeudeanteil_percent: 80,
    anteil_vermietung_percent: 65,
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
    tilgung_percent: "Tilgung (%)",
    fixkosten_jahr: "Fixkosten pro Jahr (€)",
    mietpreis_pro_woche: "Mietpreis pro Woche (€)",
    steuersatz_percent: "Steuersatz (%)",
    gebaeudeanteil_percent: "Gebäudeanteil (%)",
    anteil_vermietung_percent: "Anteil Vermietung (%)",
    afa_nutzungsdauer_jahre: "AfA Nutzungsdauer (Jahre)"
  };

  const resultLabels: Record<keyof Results, string> = {
    darlehenssumme: "Darlehenssumme (€)",
    zinskosten_jahr: "Zinskosten pro Jahr (€)",
    tilgung_jahr: "Tilgung pro Jahr (€)",
    annuitaet_jahr: "Annuität pro Jahr (€)",
    monatliche_rate: "Monatliche Rate (€)",
    afa_jahr: "AfA pro Jahr (€)",
    absetzbare_kosten: "Absetzbare Kosten (€)",
    jahre_bis_abbezahlt: "Jahre bis abbezahlt"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Ferienhaus Vollrechner</h1>

        {/* Eingaben */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">Eingabeparameter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inputKeys.map((key) => (
              <div key={String(key)} className="flex flex-col">
                <label className="text-sm font-medium mb-2 text-gray-600">
                  {fieldLabels[key]}
                </label>
                <input
                  type="number"
                  step="any"
                  name={String(key)}
                  value={String(inputs[key] ?? "")}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
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
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Cashflow vor Steuer (€)</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-700">Netto nach Steuer (€)</th>
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
                    <td className={`p-3 font-medium ${row.cashflow_vor_steuer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fmt(row.cashflow_vor_steuer)}
                    </td>
                    <td className={`p-3 font-bold ${row.netto_nach_steuer >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {fmt(row.netto_nach_steuer)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hinweise */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Wichtige Hinweise</h3>
          <ul className="text-sm text-blue-700 space-y-2">
            <li>• Die Berechnungen sind Näherungen und ersetzen keine professionelle Beratung</li>
            <li>• Änderungen der Zinssätze und Steuergesetze können die Ergebnisse beeinflussen</li>
            <li>• Zusätzliche Kosten wie Renovierungen oder Leerstand sind nicht berücksichtigt</li>
            <li>• Die AfA (Abschreibung für Abnutzung) wird standardmäßig mit 50 Jahren berechnet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
