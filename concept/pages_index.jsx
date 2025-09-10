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

  const fmt = (n: number | null | undefined) => (n == null ? "-" : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Ferienhaus Vollrechner</h1>

      {/* Eingaben */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {inputKeys.map((key) => (
          <div key={String(key)} className="flex flex-col">
            <label className="text-sm font-medium mb-1 capitalize">{String(key).replace(/_/g, " ")}</label>
            <input
              type="number"
              step="any"
              name={String(key)}
              value={String(inputs[key] ?? "")}
              onChange={handleChange}
              className="p-2 border rounded-lg shadow-sm"
            />
          </div>
        ))}
      </div>

      {/* Ergebnisse (Basiswerte) */}
      <h2 className="text-xl font-semibold mb-4">Basis-Ergebnisse</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.entries(result.base).map(([key, value]) => (
          <div key={key} className="p-4 bg-white rounded-xl shadow">
            <span className="font-medium capitalize">{key.replace(/_/g, " ")}: </span>
            <span>{fmt(value as number)}</span>
          </div>
        ))}
      </div>

      {/* Szenarientabelle */}
      <h2 className="text-xl font-semibold mb-4">Szenarien (8–40 Wochen Vermietung)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Wochen</th>
              <th className="p-2">Einnahmen</th>
              <th className="p-2">Zu versteuern</th>
              <th className="p-2">Steuerlast</th>
              <th className="p-2">Cashflow vor Steuer</th>
              <th className="p-2">Netto nach Steuer</th>
            </tr>
          </thead>
          <tbody>
            {result.scenarios.map((row) => (
              <tr key={row.wochen} className="border-t">
                <td className="p-2">{row.wochen}</td>
                <td className="p-2">{fmt(row.einnahmen)}</td>
                <td className="p-2">{fmt(row.zu_versteuern)}</td>
                <td className="p-2">{fmt(row.steuerlast)}</td>
                <td className="p-2">{fmt(row.cashflow_vor_steuer)}</td>
                <td className="p-2">{fmt(row.netto_nach_steuer)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
