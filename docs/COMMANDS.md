# 🛠️ Commandes Utiles - Rola Portfolio

Ce fichier contient toutes les commandes utiles pour travailler avec le projet.

---

## 📦 Installation & Setup

```bash
# Installer Node.js (si pas déjà fait)
# Télécharger depuis https://nodejs.org/

# Cloner le projet (si depuis GitHub)
git clone https://github.com/USERNAME/rola-portfolio.git
cd rola-portfolio

# Installer les dépendances
npm install

# Initialiser Firebase avec des données de test
node init-firebase.js
```

---

## 🔨 Build & Development

```bash
# Build complet (génère /dist/)
npm run build

# Build + serveur local
npm run dev
# Ouvre http://localhost:8080

# Serveur local seulement (sans rebuild)
npm run serve

# Build en mode verbose (avec tous les logs)
node build.js
```

---

## 🧪 Tests & Debugging

```bash
# Vérifier la structure des dossiers
ls -la

# Vérifier le contenu de /dist/
ls -la dist/

# Vérifier les logs de build
node build.js 2>&1 | tee build.log

# Tester une page HTML
open dist/index.html  # Mac
start dist/index.html # Windows
xdg-open dist/index.html # Linux

# Vérifier les dépendances
npm list

# Audit de sécurité
npm audit
npm audit fix
```

---

## 🔥 Firebase

```bash
# Installer Firebase CLI (optionnel)
npm install -g firebase-tools

# Login Firebase
firebase login

# Initialiser Firebase dans le projet
firebase init

# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les règles Storage
firebase deploy --only storage

# Voir les logs Firebase
firebase functions:log
```

---

## 🚀 Git & GitHub

```bash
# Initialiser Git
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub, puis :
git remote add origin https://github.com/USERNAME/rola-portfolio.git
git branch -M main
git push -u origin main

# Commandes courantes
git status
git add .
git commit -m "Description des changements"
git push

# Créer une branche pour développement
git checkout -b develop
git push -u origin develop
```

---

## 🌐 Vercel

```bash
# Installer Vercel CLI (optionnel)
npm install -g vercel

# Login Vercel
vercel login

# Déployer manuellement depuis le terminal
vercel

# Déployer en production
vercel --prod

# Voir les logs de déploiement
vercel logs

# Lister les déploiements
vercel ls
```

---

## 🖼️ Images

```bash
# Compresser toutes les images dans un dossier
# (nécessite imagemagick : brew install imagemagick)
for img in images/*.jpg; do
  convert "$img" -quality 85 "$img"
done

# Convertir en WebP
for img in images/*.jpg; do
  cwebp -q 85 "$img" -o "${img%.jpg}.webp"
done

# Redimensionner toutes les images à max 1920px de largeur
for img in images/*.jpg; do
  convert "$img" -resize 1920x1920\> "$img"
done
```

---

## 🧹 Maintenance

```bash
# Nettoyer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Nettoyer le dossier dist
rm -rf dist
npm run build

# Mettre à jour les dépendances
npm update

# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour Firebase
npm install firebase@latest
```

---

## 📊 Analytics & Monitoring

```bash
# Voir la taille du bundle
du -sh dist/*

# Analyser les performances
# Utiliser Lighthouse dans Chrome DevTools
# Ou : npm install -g lighthouse
lighthouse https://ton-site.vercel.app --view

# Tester la vitesse
# PageSpeed Insights : https://pagespeed.web.dev/
```

---

## 🔍 Debugging Firebase

```bash
# Tester les règles Firestore
# Dans Firebase Console → Firestore → Règles → Onglet "Simulateur"

# Vérifier les données Firestore
# Firebase Console → Firestore → Data

# Vérifier les images Storage
# Firebase Console → Storage

# Vérifier les utilisateurs
# Firebase Console → Authentication → Users

# Logs d'authentification
# Firebase Console → Authentication → Usage
```

---

## 🚨 En cas de problème

### Build échoue
```bash
# Vérifier Node.js installé
node --version

# Vérifier npm
npm --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier Firebase config
cat firebase-config.js
```

### Admin ne se connecte pas
```bash
# Vérifier les comptes Firebase
# Firebase Console → Authentication → Users

# Vérifier les règles Firestore
# Firebase Console → Firestore → Règles

# Vérifier la console du navigateur
# F12 → Console (chercher les erreurs)
```

### Images ne s'affichent pas
```bash
# Vérifier que les images sont dans Storage
# Firebase Console → Storage → images/

# Vérifier les règles Storage
# Firebase Console → Storage → Règles

# Vérifier le build
npm run build
ls -la dist/images/
```

### Deploy Vercel échoue
```bash
# Vérifier les logs Vercel
# Vercel Dashboard → Project → Deployments → Cliquer sur le deploy

# Tester le build localement
npm run build

# Vérifier vercel.json
cat vercel.json
```

---

## 📱 Tests responsive

```bash
# Tester sur différents appareils avec Chrome DevTools
# F12 → Toggle device toolbar (Ctrl+Shift+M)

# Tester avec différentes résolutions
# 375x667 (iPhone SE)
# 390x844 (iPhone 12/13)
# 768x1024 (iPad)
# 1920x1080 (Desktop)
```

---

## 💡 Astuces

### Développement rapide
```bash
# Terminal 1 : Watch les changements et rebuild auto
# (nécessite nodemon : npm install -g nodemon)
nodemon --watch templates --watch public --exec "npm run build"

# Terminal 2 : Serveur local
npm run serve
```

### Backup Firebase
```bash
# Exporter Firestore (nécessite Firebase CLI)
firebase firestore:export backup/

# Importer Firestore
firebase firestore:import backup/
```

### Optimisation des images avant upload
```bash
# Installer sharp (outil Node.js)
npm install sharp

# Créer un script optimize-images.js
# (voir documentation sharp)
```

---

## 📚 Ressources utiles

- **Node.js** : https://nodejs.org/
- **Firebase Console** : https://console.firebase.google.com/
- **Vercel Dashboard** : https://vercel.com/dashboard
- **Firebase Docs** : https://firebase.google.com/docs
- **Vercel Docs** : https://vercel.com/docs

---

**Besoin d'aide ? Consulte README.md pour plus de détails !**
