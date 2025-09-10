# GitHub Pages Deployment Anleitung

## 🚀 Automatisches Deployment mit GitHub Actions

### Schritt 1: Repository Setup
1. Stellen Sie sicher, dass Ihr Code auf GitHub gepusht ist
2. Gehen Sie zu Ihrem Repository auf GitHub.com

### Schritt 2: GitHub Pages aktivieren
1. Gehen Sie zu **Settings** > **Pages** in Ihrem Repository
2. Unter **Source** wählen Sie **"GitHub Actions"**
3. Klicken Sie auf **Save**

### Schritt 3: Automatisches Deployment
Das Deployment erfolgt automatisch bei jedem Push auf den `main` Branch durch die GitHub Actions Workflow-Datei (`.github/workflows/deploy.yml`).

## 🔧 Fehlerbehebung "Page not found"

Falls die Seite nicht lädt oder "Page not found" anzeigt:

### Lösung 1: Warten
- Das erste Deployment kann 5-10 Minuten dauern
- Überprüfen Sie den Status unter **Actions** > **Deploy Next.js to GitHub Pages**

### Lösung 2: Repository Settings prüfen
1. Gehen Sie zu **Settings** > **Pages**
2. Stellen Sie sicher, dass Source auf **"GitHub Actions"** steht
3. Nicht auf "Deploy from a branch" 

### Lösung 3: Cache leeren
- Drücken Sie Ctrl+F5 (Windows) oder Cmd+Shift+R (Mac)
- Oder öffnen Sie die Seite im Inkognito-Modus

## 🌐 URL-Struktur

Ihre Webapp wird verfügbar sein unter:
```
https://[IHR-GITHUB-USERNAME].github.io/vacation-home-calculator
```

## 📋 Technische Konfiguration

### Next.js Konfiguration
- **Statischer Export**: `output: 'export'`
- **Bedingte basePath**: Nur für GitHub Actions aktiviert
- **Trailing Slash**: Für bessere Kompatibilität
- **Unoptimierte Bilder**: Für statisches Hosting

### GitHub Actions Features
- **Node.js 18** Environment
- **Automatische .nojekyll** Datei
- **404.html Fallback** für SPA-Routing
- **Build Caching** für schnellere Deployments

## 🔄 Deployment-Status überprüfen

1. Gehen Sie zu **Actions** in Ihrem GitHub Repository
2. Klicken Sie auf den neuesten Workflow-Lauf
3. Überprüfen Sie den Status:
   - 🟢 **Grün**: Deployment erfolgreich
   - 🟡 **Gelb**: Deployment läuft
   - 🔴 **Rot**: Deployment fehlgeschlagen

## ⚠️ Wichtige Hinweise

- Das erste Deployment kann 5-10 Minuten dauern
- Änderungen werden automatisch bei jedem Push deployed  
- GitHub Pages unterstützt nur statische Websites (keine Server-Side-Rendering)
- Die Webapp funktioniert vollständig clientseitig mit JavaScript
- Bei Problemen überprüfen Sie die GitHub Actions Logs

## 🔧 Lokales Testen

```bash
# Build für GitHub Pages erstellen
npm run build

# Lokalen Server starten
cd out && python3 -m http.server 8080
# Dann öffnen: http://localhost:8080
```

## 📱 Alternative: Vercel Deployment

Für ein noch einfacheres Deployment können Sie auch Vercel verwenden:

```bash
npm install -g vercel
vercel --prod
```
