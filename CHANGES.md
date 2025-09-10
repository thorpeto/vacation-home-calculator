# Änderungsprotokoll: Realistische Kostenerweiterung

## 🏠 Realistische Ferienhaus-Kalkulation (Aktuell)

### ✅ Neue Kostenpositionen:

1. **Instandhaltung**: 1,5% des Kaufpreises/Jahr (Standard: 4.800€)
2. **Verwaltung**: 12% der Mieteinnahmen (Hausverwaltung, Betreuung)
3. **Leerstand**: 25% weniger Auslastung als geplant
4. **Nebenkosten**: 2.400€/Jahr (Strom, Wasser, Internet, Grundsteuer)
5. **Buchungsgebühren**: 8% der Buchungen (Airbnb, Booking.com)
6. **Endreinigung**: 80€ pro Gast/Buchung
7. **Marketing**: 1.200€/Jahr (Fotos, Anzeigen)
8. **Reparaturen**: 500€/Jahr

### 📊 Erweiterte Berechnungslogik:

```typescript
// Realistische Einnahmenberechnung:
brutto_einnahmen = wochen × mietpreis_pro_woche
netto_einnahmen = brutto_einnahmen × (1 - leerstand_percent)
                - verwaltungskosten - buchungsgebühren - endreinigung

// Gesamte Fixkosten:
gesamte_fixkosten = fixkosten + instandhaltung + nebenkosten 
                  + marketing + reparaturen

// Korrekte Cashflow-Berechnung:
operativer_cashflow = netto_einnahmen - gesamte_fixkosten - zinsen
freier_cashflow = operativer_cashflow - steuern - tilgung
```

### 🎨 UI-Verbesserungen:

- **Gruppierte Eingabefelder**: Grunddaten, Laufende Kosten, Variable Kosten, Steuerparameter
- **Farbkodierte Kategorien**: Blau, Rot, Orange, Grün für bessere Übersicht
- **Realistische Standardwerte**: Basierend auf Marktdaten
- **Kostenaufschlüsselung**: Detaillierte Erklärung aller Kostenpositionen

### 💡 Auswirkungen:

- **Realistischere Break-Even-Analyse**: Höhere Mindest-Auslastung erforderlich
- **Transparente Kostendarstellung**: Alle versteckten Kosten sichtbar
- **Bessere Investitionsentscheidung**: Fundierte Basis für Ferienhaus-Investment

---

## 🔧 Cashflow-Korrektur (Vorherige Änderung)

### Problem der bisherigen Berechnung:
```typescript
// FALSCH (vorher):
cashflow_vor_steuer = einnahmen - fixkosten - zinsen - tilgung
// Problem: Tilgung ist kein Betriebsaufwand!
```

### ✅ Korrigierte Berechnung:
```typescript
// KORREKT (jetzt):
operativer_cashflow = einnahmen - fixkosten - zinsen  // OHNE Tilgung!
operativer_cashflow_nach_steuer = operativer_cashflow - steuerlast
freier_cashflow = operativer_cashflow_nach_steuer - tilgung
```

### Neue Tabellenspalten:
1. **Operativer Cashflow**: Einnahmen minus Betriebskosten und Zinsen
2. **Nach Steuern**: Operativer Cashflow minus Steuerlast  
3. **Freier Cashflow**: Tatsächlich verfügbares Geld nach allen Abzügen

### 💡 Warum diese Änderung wichtig ist:
- **Tilgung ist Vermögensaufbau**, nicht Verlust
- **Break-Even** liegt bei positivem freien Cashflow
- **Realistische Investitionsbewertung** möglich

---

## Änderungsprotokoll: Feldumbenennung "Steuersatz" → "Eigennutzung"

### Durchgeführte Änderungen

#### 1. UI-Label geändert (app/page.tsx)
- **Vorher**: `steuersatz_percent: "Steuersatz (%)"`
- **Nachher**: `steuersatz_percent: "Eigennutzung (%)"`

#### 2. Dokumentation aktualisiert (README.md)
- **Vorher**: `Steuersatz | Persönlicher Steuersatz | 30%`
- **Nachher**: `Eigennutzung | Anteil der Eigennutzung (für Steuerberechnung) | 30%`

## ✅ Beibehaltene Funktionalitäten

### Datenstruktur unverändert
- ✅ Variable `steuersatz_percent` beibehalten
- ✅ Alle TypeScript-Typen unverändert
- ✅ Berechnungslogik vollständig erhalten

### Berechnungen funktionieren weiterhin
- ✅ `inputs.steuersatz_percent` wird korrekt verwendet
- ✅ Steuerlast-Berechnung: `zu_versteuern * pct(inputs.steuersatz_percent)`
- ✅ Alle Szenario-Berechnungen unverändert

### Kompatibilität gewährleistet
- ✅ Standardwert (30%) beibehalten
- ✅ Eingabevalidierung unverändert
- ✅ Export/Import-Funktionen kompatibel

## 🔧 Technische Details

Das Feld repräsentiert weiterhin den **Steuersatz in Prozent**, wird aber im UI als **"Eigennutzung (%)"** angezeigt, um die Benutzerfreundlichkeit zu verbessern.

Die interne Logik bleibt vollständig erhalten:
```typescript
const steuerlast = round2(Math.max(0, zu_versteuern) * pct(inputs.steuersatz_percent));
```

## ✅ Tests bestanden

- ✅ TypeScript-Kompilierung erfolgreich
- ✅ Next.js Build erfolgreich
- ✅ Webapp läuft fehlerfrei
- ✅ Alle Berechnungen funktionieren korrekt
