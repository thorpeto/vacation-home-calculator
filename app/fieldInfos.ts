// Info-Texte für alle Eingabefelder
const fieldInfos: Record<string, string> = {
  kaufpreis: "Gesamter Kaufpreis der Immobilie inklusive aller Nebenkosten (z.B. Notar, Grunderwerbsteuer, Makler).",
  eigenkapital: "Eigenes eingebrachtes Kapital. Je höher, desto geringer die Finanzierungssumme und die Zinslast.",
  zinssatz_percent: "Effektiver Jahreszins des Darlehens in Prozent. Wird vom Kreditinstitut vorgegeben.",
  tilgungssatz_percent: "Jährlicher Tilgungssatz in Prozent der Darlehenssumme. Bestimmt, wie schnell das Darlehen zurückgezahlt wird.",
  wochen_pro_jahr: "Geplante Anzahl der Wochen pro Jahr, in denen die Immobilie vermietet werden soll.",
  mietpreis_pro_woche: "Durchschnittlicher Mietpreis pro Woche, den Sie für die Immobilie ansetzen können.",
  einkommen_steuersatz_percent: "Ihr persönlicher Einkommensteuersatz. Relevant für die Berechnung der Steuerlast auf Mieteinnahmen.",
  gebaeudeanteil_percent: "Anteil des Gebäudes am Gesamtkaufpreis (Rest ist Grundstück, nicht abschreibbar).",
  anteil_vermietung_percent: "Prozentualer Anteil der Zeit, in der die Immobilie vermietet wird (Rest ist Eigennutzung).",
  afa_nutzungsdauer_jahre: "Abschreibungsdauer für das Gebäude in Jahren. Standard für Wohngebäude: 50 Jahre.",
  instandhaltung_percent: "Jährliche Rücklage für Instandhaltung, als Prozentwert vom Kaufpreis.",
  verwaltung_percent: "Prozentualer Anteil der Verwaltungskosten an den Mieteinnahmen (z.B. Hausverwaltung, Schlüsselübergabe).",
  leerstand_percent: "Geschätzter Anteil der Zeit, in der die Immobilie nicht vermietet ist (Leerstand).",
  nebenkosten_jahr: "Jährliche Nebenkosten wie Strom, Wasser, Internet, Grundsteuer usw.",
  buchungsgebuehren_percent: "Prozentualer Anteil der Buchungsgebühren (z.B. Airbnb, Booking.com) an den Mieteinnahmen.",
  endreinigung_pro_gast: "Kosten für die Endreinigung pro Gast bzw. pro Buchung.",
  marketing_jahr: "Jährliche Ausgaben für Marketing, Fotos, Inserate usw.",
  reparaturen_jahr: "Jährliche Rücklage für kleinere Reparaturen und Wartung."
};

export default fieldInfos;
