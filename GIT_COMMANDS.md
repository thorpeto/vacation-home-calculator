# Git Commands für GitHub Pages Deployment

## 📋 Schritt-für-Schritt Anleitung

### 1. Alle Änderungen committen und pushen
```bash
# Status überprüfen
git status

# Alle Dateien hinzufügen
git add .

# Commit erstellen
git commit -m "Configure GitHub Pages deployment with Next.js static export"

# Auf GitHub pushen
git push origin main
```

### 2. GitHub Repository Settings
1. Gehen Sie zu GitHub.com → Ihr Repository
2. Klicken Sie auf **Settings** (Tab oben)
3. Scrollen Sie zu **Pages** (linke Sidebar)
4. Bei **Source** wählen Sie **"GitHub Actions"**
5. Klicken Sie **Save**

### 3. Deployment überwachen
```bash
# GitHub Actions Status überprüfen:
# GitHub.com → Ihr Repository → Actions Tab
```

## 🎯 Wichtige Dateien für GitHub Pages

Die folgenden Dateien wurden für GitHub Pages konfiguriert:

- ✅ `next.config.js` - Static export Konfiguration
- ✅ `.github/workflows/deploy.yml` - GitHub Actions Workflow
- ✅ `package.json` - Build Scripts
- ✅ `DEPLOYMENT.md` - Detaillierte Anleitung
- ✅ `README.md` - Aktualisierte Dokumentation

## 🌐 Nach dem Deployment

Ihre Webapp wird verfügbar sein unter:
```
https://[IHR-GITHUB-USERNAME].github.io/vacation-home-calculator
```

Ersetzen Sie `[IHR-GITHUB-USERNAME]` mit Ihrem tatsächlichen GitHub Benutzernamen.

## ⏱️ Timing

- **Erstes Deployment**: 5-10 Minuten
- **Folgende Deployments**: 2-5 Minuten
- **Automatisch bei jedem Push auf main Branch**
