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

## 🔧 Manuelle Deployment-Option

Falls Sie manuell deployen möchten:

```bash
# 1. Build für Produktion erstellen
npm run build

# 2. Das 'out' Verzeichnis enthält alle statischen Dateien
# Diese können Sie manuell auf GitHub Pages hochladen
```

## 📋 Was wurde konfiguriert

### Next.js Konfiguration (`next.config.js`)
```javascript
{
  output: 'export',           // Statischer Export
  trailingSlash: true,        // URLs mit Slash am Ende
  images: {
    unoptimized: true         // Bilder nicht optimieren (für statisches Hosting)
  }
}
```

### GitHub Actions Workflow
- **Trigger**: Push auf `main` Branch
- **Node.js Version**: 18
- **Build Command**: `npm run build`
- **Deploy Target**: `./out` Verzeichnis

## 🌐 Zugriff auf die Webapp

Nach erfolgreichem Deployment ist Ihre Webapp verfügbar unter:
```
https://[IHR-GITHUB-USERNAME].github.io/vacation-home-calculator
```

## 🔄 Deployment-Status überprüfen

1. Gehen Sie zu **Actions** in Ihrem GitHub Repository
2. Überprüfen Sie den Status des Deployment-Workflows
3. Bei Erfolg erscheint ein grüner Haken

## ⚠️ Wichtige Hinweise

- Das erste Deployment kann 5-10 Minuten dauern
- Änderungen werden automatisch bei jedem Push deployed
- GitHub Pages unterstützt nur statische Websites (keine Server-Side-Rendering)
- Die Webapp funktioniert vollständig clientseitig mit JavaScript

## 🔧 Fehlerbehebung

### Problem: 404 Fehler
- Überprüfen Sie, ob GitHub Pages auf "GitHub Actions" eingestellt ist
- Warten Sie 5-10 Minuten nach dem ersten Deployment

### Problem: CSS nicht geladen
- Überprüfen Sie die `next.config.js` Konfiguration
- Stellen Sie sicher, dass `trailingSlash: true` gesetzt ist

### Problem: Build fehlgeschlagen
- Überprüfen Sie die GitHub Actions Logs
- Stellen Sie sicher, dass alle Dependencies in `package.json` korrekt sind

## 📱 Alternative: Vercel Deployment

Für ein noch einfacheres Deployment können Sie auch Vercel verwenden:

```bash
npm install -g vercel
vercel --prod
```
