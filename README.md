# Ferienhaus Vollrechner

Eine moderne Webapp zur realistischen Berechnung der Rentabilität von Ferienhaus-Investitionen.

## Features

- **Vollständige Finanzanalyse**: Berechnung von Darlehenssumme, Zinsen, Tilgung, monatlicher Rate
- **Realistische Kostenstruktur**: Alle laufenden, variablen und versteckten Kosten werden einzeln berücksichtigt
- **Szenarioanalyse**: Detaillierte Darstellung verschiedener Vermietungsszenarien (8–40 Wochen)
- **Steuerliche Optimierung**: Berücksichtigung von AfA (Abschreibung), absetzbaren Kosten und Steuersatz
- **Info-Icons**: Jedes Eingabefeld hat ein Info-Icon mit verständlicher Erklärung
- **Break-Even-Anzeige**: Zeigt ab welcher Woche das Investment nach Steuern und mit freiem Cashflow positiv wird
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
- Gesamte Fixkosten pro Jahr (Instandhaltung, Nebenkosten, Marketing, Reparaturen)

### Szenarioanalyse
Für verschiedene Vermietungsdauern (8–40 Wochen):
- Einnahmen (nach Leerstand)
- Variable Kosten (Verwaltung, Buchungsgebühren, Endreinigung)
- Zu versteuernder Betrag
- Steuerlast
- Operativer Cashflow (ohne Tilgung)
- Cashflow nach Steuern
- Freier Cashflow (nach Steuern und Tilgung)
- Break-Even-Wochen (ab wann positiv)

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

Die Webapp ist dann unter `http://localhost:3000` (oder Port-Hinweis im Terminal) erreichbar.

## Technologie-Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useMemo)

## Eingabeparameter & Erklärungen

Jedes Eingabefeld hat ein Info-Icon mit einer kurzen Erklärung zum Zweck und zur richtigen Eingabe.

| Parameter                | Beschreibung                                                                 | Standardwert |
|--------------------------|------------------------------------------------------------------------------|-------------|
| Kaufpreis                | Gesamter Kaufpreis inkl. Nebenkosten                                         | 320.000 €   |
| Eigenkapital             | Eigenes eingebrachtes Kapital                                                | 100.000 €   |
| Zinssatz                 | Effektiver Jahreszins des Darlehens (%)                                      | 3,5 %       |
| Tilgung                  | Jährlicher Tilgungssatz (%)                                                  | 2 %         |
| Wochen pro Jahr          | Geplante Vermietungswochen pro Jahr                                          | 26          |
| Mietpreis pro Woche      | Durchschnittlicher Mietpreis pro Woche                                       | 1.400 €     |
| Instandhaltung           | Rücklage für Instandhaltung (% vom Kaufpreis)                                | 1,5 %       |
| Nebenkosten              | Jährliche Nebenkosten (Strom, Wasser, Grundsteuer, etc.)                     | 2.400 €     |
| Reparaturen              | Rücklage für Reparaturen pro Jahr                                            | 500 €       |
| Marketing                | Jährliche Marketingkosten                                                    | 1.200 €     |
| Verwaltung               | Verwaltungskosten (% der Mieteinnahmen)                                      | 12 %        |
| Buchungsgebühren         | Buchungsgebühren (z.B. Airbnb, Booking.com) (% der Mieteinnahmen)            | 8 %         |
| Endreinigung pro Gast    | Kosten für Endreinigung pro Buchung                                          | 80 €        |
| Leerstand                | Anteil der Zeit ohne Vermietung (%)                                          | 0 %         |
| Steuersatz               | Persönlicher Einkommensteuersatz (%)                                         | 30 %        |
| Gebäudeanteil            | Anteil des Gebäudes am Kaufpreis (%)                                         | 80 %        |
| Anteil Vermietung        | Anteil der Zeit, in der vermietet wird (%)                                   | 70 %        |
| AfA Nutzungsdauer        | Abschreibungsdauer für das Gebäude (Jahre, Standard: 50)                     | 50          |

## Neue UI-Features

- **Info-Icons**: Bei jedem Eingabefeld, mit Mouseover/Klick erscheint eine verständliche Erklärung
- **Break-Even-Anzeige**: Zeigt ab welcher Woche das Investment nach Steuern und mit freiem Cashflow positiv wird
- **Farbkodierte Eingabebereiche**: Grunddaten (blau), Kosten (rot/orange), Steuern (grün)
- **Alle Kosten transparent einzeln sichtbar**

## Wichtige Hinweise

⚠️ **Haftungsausschluss**: Die Berechnungen stellen Näherungswerte dar und ersetzen keine professionelle Steuer- oder Finanzberatung.

- Änderungen der Zinssätze, Steuergesetze oder individueller Kosten können die Ergebnisse erheblich beeinflussen
- Die AfA-Berechnung basiert auf aktuellen steuerlichen Bestimmungen (50 Jahre für Wohngebäude)
- Alle Werte sind anpassbar, um individuelle Szenarien zu simulieren

## Build für Produktion

```bash
# Production Build erstellen
npm run build

# Für statischen Export (GitHub Pages)
npm run export
```

## 🚀 Deployment

### GitHub Pages (Automatisch)
1. Code auf GitHub pushen
2. In Repository Settings → Pages → Source: "GitHub Actions" wählen
3. Automatisches Deployment bei jedem Push auf `main`

Die Webapp ist dann verfügbar unter:
```
https://[IHR-GITHUB-USERNAME].github.io/vacation-home-calculator
```

Detaillierte Deployment-Anleitung siehe [DEPLOYMENT.md](DEPLOYMENT.md)

### Alternativen
- **Vercel**: `npm install -g vercel && vercel --prod`
- **Netlify**: Drag & Drop des `out/` Ordners

## Lizenz

MIT License