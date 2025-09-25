const fieldInfos: Record<string, string> = {
  kaufpreis: "Reiner Kaufpreis der Immobilie (ohne Nebenkosten).",
  darlehenssumme: "Darlehenssumme = Kaufpreis + Kaufnebenkosten (Makler, Grunderwerbsteuer, Notar, Grundbuch) minus Eigenkapital. Dies ist der Betrag, der finanziert werden muss.",
  eigenkapital: "Eigenes eingebrachtes Kapital. Je höher, desto geringer die Finanzierungssumme und die Zinslast.",
  makler_percent: "Maklerprovision in Prozent des Kaufpreises. Üblich in Schleswig-Holstein: 3,57%.",
  grunderwerbsteuer_percent: "Grunderwerbsteuer in Prozent des Kaufpreises. Schleswig-Holstein: 6,5%.",
  notar_percent: "Notarkosten in Prozent des Kaufpreises. Üblich: 1,5%.",
  grundbuch_percent: "Grundbuchkosten in Prozent des Kaufpreises. Üblich: 0,5%.",
  zinssatz_percent: "Effektiver Jahreszins des Darlehens in Prozent. Wird vom Kreditinstitut vorgegeben.",
  tilgungssatz_percent: "Jährlicher Tilgungssatz in Prozent der Darlehenssumme. Bestimmt, wie schnell das Darlehen zurückgezahlt wird.",
  wochen_pro_jahr: "Geplante Anzahl der Wochen pro Jahr, in denen die Immobilie vermietet werden soll.",
  mietpreis_pro_woche: "Durchschnittlicher Mietpreis pro Woche, den Sie für die Immobilie ansetzen können.",
  mietpreis_pro_tag: "Durchschnittlicher Mietpreis pro Tag. Wird automatisch mit dem Wochenwert synchronisiert (und umgekehrt). Für die Berechnung zählt der Wochenwert.",
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
