# 🚀 Guide de Démarrage Rapide - Rola Portfolio

## ⚡ Installation (5 minutes)

### 1. Prérequis
- Node.js installé → [télécharger ici](https://nodejs.org/)
- Un compte GitHub (gratuit)
- Un compte Vercel (gratuit, connexion via GitHub)

### 2. Installation des dépendances
```bash
cd rola-portfolio
npm install
```

### 3. Test local
```bash
npm run build
npm run serve
```
Ouvre http://localhost:8080

---

## 🌐 Déploiement Vercel (10 minutes)

### Étape 1 : Push sur GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/rola-portfolio.git
git push -u origin main
```

### Étape 2 : Import dans Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "New Project"
3. Importe ton repo GitHub `rola-portfolio`
4. Configure :
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
5. Clique sur "Deploy"

### Étape 3 : Configure le Deploy Hook
1. Dans Vercel → Settings → Git → Deploy Hooks
2. Crée un hook nommé "Admin Publish"
3. Copie l'URL générée
4. Édite `admin/admin.js` ligne 43 :
```javascript
const VERCEL_DEPLOY_HOOK = 'COLLE_ICI_L_URL';
```
5. Commit et push ce changement

---

## 🔧 Configuration Firebase (Déjà fait !)

✅ Firebase est déjà configuré dans `firebase-config.js`

### Ce qu'il faut vérifier :

#### 1. Firestore - Document settings/site existe
Va dans Firebase Console → Firestore → Créer si nécessaire :
```
Collection: settings
Document ID: site
Fields:
  landing_image: "images/lebanon1.jpg"
  title_fr: "Rola KHAYYAT"
  title_ar: "رولا خياط"
  about: "Rola Khayyat is a Lebanese..."
  contact: "For inquiries..."
  instagram_url: "https://instagram.com/..."
```

#### 2. Storage - Dossier images/ existe
Va dans Firebase Console → Storage → Crée le dossier `images/`

#### 3. Authentication - Comptes créés
Vérifie que les comptes admin existent dans Authentication

---

## 🎯 Utilisation de l'admin

### Accès
```
https://ton-site.vercel.app/admin/
```

### Workflow
1. **Connexion** avec email/password Firebase
2. **Modifier** paramètres ou projets
3. **Upload** des images
4. **Publier** → Le site se met à jour en 2-3 min

---

## ✅ Checklist finale

- [ ] Node.js installé
- [ ] `npm install` exécuté
- [ ] Build local fonctionne (`npm run build`)
- [ ] Projet sur GitHub
- [ ] Projet déployé sur Vercel
- [ ] Deploy Hook configuré dans admin.js
- [ ] Document Firestore `settings/site` existe
- [ ] Comptes Firebase Authentication créés
- [ ] Test de connexion admin réussi
- [ ] Test de publication réussi

---

## 🆘 Problèmes courants

### "Document settings/site introuvable"
→ Crée le document dans Firestore (voir section Firebase)

### Les images ne s'affichent pas
→ Vérifie les règles Storage (lecture publique activée)

### Le deploy hook ne fonctionne pas
→ Vérifie que l'URL dans admin.js est correcte

### Build Vercel échoue
→ Vérifie que `npm run build` fonctionne en local

---

## 📞 Besoin d'aide ?

Consulte le **README.md** complet pour plus de détails !

---

**Bon courage ! 🚀**
