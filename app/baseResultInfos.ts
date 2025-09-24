// Info-Texte für Basis-Ergebnisse
const baseResultInfos: Record<string, string> = {
  darlehenssumme: "Die Darlehenssumme ergibt sich aus Kaufpreis minus Eigenkapital. Sie ist die Grundlage für die Zins- und Tilgungsberechnung.",
  zinskosten_jahr: "Jährliche Zinskosten auf die Darlehenssumme. Berechnet als Darlehenssumme × Zinssatz.",
  tilgung_jahr: "Jährliche Tilgung des Darlehens. Berechnet als Darlehenssumme × Tilgungssatz. Die Tilgung reduziert die Restschuld.",
  annuitaet_jahr: "Summe aus Zins und Tilgung pro Jahr. Das ist die jährliche Belastung durch das Darlehen.",
  monatliche_rate: "Die monatliche Rate, die für das Darlehen zu zahlen ist. Annuität pro Jahr geteilt durch 12.",
  afa_jahr: "Jährlicher Abschreibungsbetrag (AfA) für das Gebäude. Relevant für die steuerliche Absetzbarkeit.",
  absetzbare_kosten: "Summe der Kosten, die steuerlich abgesetzt werden können (Fixkosten, Zinsen, AfA × Vermietungsanteil).",
  jahre_bis_abbezahlt: "Anzahl der Jahre, bis das Darlehen bei gleichbleibender Tilgung vollständig abbezahlt ist.",
  instandhaltung_jahr: "Jährliche Rücklage für Instandhaltung, berechnet als Prozentsatz vom Kaufpreis.",
  gesamte_fixkosten_jahr: "Summe aller laufenden Fixkosten pro Jahr (Instandhaltung, Nebenkosten, Marketing, Reparaturen).",
  restschuld_10jahre: "Die verbleibende Darlehensschuld nach 10 Jahren konstanter Tilgung. Zeigt, wie viel nach Ablauf der Zinsbindung noch offen ist."
};

export default baseResultInfos;
