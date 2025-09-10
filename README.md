# Ferienhaus Vollrechner

Eine moderne Webapp zur Berechnung der Rentabilität von Ferienhaus-Investitionen.

## Features

- **Vollständige Finanzanalyse**: Berechnung von Darlehenssumme, Zinsen, Tilgung und monatlichen Raten
- **Steuerliche Optimierung**: Berücksichtigung von AfA (Abschreibung für Abnutzung) und absetzbaren Kosten
- **Szenarioanalyse**: Detaillierte Darstellung verschiedener Vermietungsszenarien (8-40 Wochen)
- **Responsive Design**: Optimiert für Desktop und mobile Geräte
- **Echtzeitberechnungen**: Sofortige Aktualisierung bei Änderung der Eingabeparameter

## Berechnungsgrundlagen

Die Webapp berechnet folgende Werte:

### Basis-Ergebnisse
- Darlehenssumme (Kaufpreis - Eigenkapital)
- Jährliche Zinskosten
- Jährliche Tilgung
- Monatliche Rate
- AfA (Abschreibung für Abnutzung)
- Absetzbare Kosten

### Szenarioanalyse
Für verschiedene Vermietungsdauern (8-40 Wochen):
- Mieteinnahmen
- Zu versteuernder Betrag
- Steuerlast
- Cashflow vor Steuern
- Netto-Cashflow nach Steuern

## Installation und Start

```bash
# Repository klonen
git clone <repository-url>
cd vacation-home-calculator

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Webapp ist dann unter `http://localhost:3000` erreichbar.

## Technologie-Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useMemo)

## Eingabeparameter

| Parameter | Beschreibung | Standardwert |
|-----------|--------------|--------------|
| Kaufpreis | Gesamtpreis der Immobilie | 320.000 € |
| Eigenkapital | Verfügbares Eigenkapital | 100.000 € |
| Zinssatz | Jährlicher Zinssatz für Darlehen | 3,5% |
| Tilgung | Jährliche Tilgungsrate | 2% |
| Fixkosten | Jährliche Fixkosten (Versicherung, etc.) | 6.000 € |
| Mietpreis | Wöchentlicher Mietpreis | 1.400 € |
| Steuersatz | Persönlicher Steuersatz | 30% |
| Gebäudeanteil | Anteil des Gebäudes am Kaufpreis | 80% |
| Anteil Vermietung | Anteil der vermieteten Nutzung | 65% |
| AfA Nutzungsdauer | Nutzungsdauer für Abschreibung | 50 Jahre |

## Wichtige Hinweise

⚠️ **Haftungsausschluss**: Die Berechnungen stellen Näherungswerte dar und ersetzen keine professionelle Steuer- oder Finanzberatung.

- Änderungen der Zinssätze können die Ergebnisse erheblich beeinflussen
- Steuergesetze können sich ändern
- Zusätzliche Kosten wie Renovierungen oder Leerstandszeiten sind nicht berücksichtigt
- Die AfA-Berechnung basiert auf aktuellen steuerlichen Bestimmungen

## Build für Produktion

```bash
# Production Build erstellen
npm run build

# Production Server starten
npm start
```

## Lizenz

MIT License