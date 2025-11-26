# 📸 Rola Portfolio - Documentation Complète

Portfolio website pour Rola Khayyat - Photographe & Curatrice

## 🏗️ Architecture du projet

```
rola-portfolio/
├── templates/              # Templates HTML/JS avec placeholders
│   ├── index.template.html
│   ├── main.template.html
│   └── main.template.js
├── public/                 # Fichiers statiques (copiés tels quels)
│   ├── styles.css
│   └── landing.js
├── admin/                  # Interface d'administration
│   ├── index.html
│   ├── admin.css
│   └── admin.js
├── dist/                   # Fichiers générés (ignoré par git)
│   ├── index.html
│   ├── main.html
│   ├── main.js
│   ├── landing.js
│   ├── styles.css
│   └── images/
├── build.js                # Script de build
├── firebase-config.js      # Configuration Firebase
├── package.json            # Dépendances Node.js
└── README.md              # Ce fichier
```

## 🚀 Installation

### 1. Installer Node.js
Téléchargez et installez Node.js depuis [nodejs.org](https://nodejs.org/)

### 2. Installer les dépendances
```bash
npm install
```

## 🔧 Configuration

### Firebase (Déjà configuré)
Le fichier `firebase-config.js` contient déjà votre configuration Firebase :
- ✅ Firestore Database
- ✅ Firebase Storage
- ✅ Firebase Authentication

### Structure Firestore

#### Collection `settings` → Document `site`
```javascript
{
  landing_image: "images/lebanon1.jpg",
  title_fr: "Rola KHAYYAT",
  title_ar: "رولا خياط",
  about: "Rola Khayyat is a Lebanese...",
  contact: "For inquiries...",
  instagram_url: "https://www.instagram.com/...",
  last_publish: "2024-11-26 14:23"
}
```

#### Collection `projects` → Documents multiples
```javascript
{
  name: "Project A",
  description: "Description optionnelle",
  category: "curatorial" | "personal",
  order: 1,
  images: ["image1.jpg", "image2.jpg", "image3.jpg"]
}
```

### Firebase Storage
Toutes les images sont stockées dans : `gs://rola-portfolio.appspot.com/images/`

## 🛠️ Utilisation

### Build local (test)
```bash
npm run build
```

Ce script :
1. ✅ Se connecte à Firebase
2. ✅ Récupère toutes les données Firestore
3. ✅ Télécharge toutes les images de Storage
4. ✅ Génère les fichiers HTML/JS dans `/dist/`
5. ✅ Copie les fichiers statiques (CSS, JS)

### Tester le site localement
```bash
npm run dev
```
Ouvre le site sur http://localhost:8080

## 🌐 Déploiement sur Vercel

### 1. Créer un compte Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Connecte-toi avec GitHub
3. Importe ce repository

### 2. Configuration Vercel
Dans les settings du projet Vercel :

**Build & Development Settings :**
- Build Command : `npm run build`
- Output Directory : `dist`
- Install Command : `npm install`

**Environment Variables :**
Aucune variable nécessaire (Firebase config est publique)

### 3. Récupérer le Deploy Hook

1. Dans Vercel → Settings → Git → Deploy Hooks
2. Créer un nouveau hook : "Admin Publish"
3. Copier l'URL générée (ressemble à : `https://api.vercel.com/v1/integrations/deploy/prj_xxx/yyy`)

### 4. Configurer le Deploy Hook dans l'admin

Éditer `admin/admin.js` ligne 43 :
```javascript
const VERCEL_DEPLOY_HOOK = 'COLLER_ICI_L_URL_DU_DEPLOY_HOOK';
```

Commit et push ce changement.

## 👩‍💼 Interface Admin

### Accès
L'admin sera accessible à : `https://votre-site.vercel.app/admin/`

### Connexion
Utiliser les identifiants Firebase créés :
- Email : `admin@rolakhayyat.com` (ou l'email configuré)
- Mot de passe : (celui défini dans Firebase)

### Fonctionnalités

#### 1. Paramètres du site
- **Landing Page** : Changer l'image hero, titres FR/AR
- **About** : Modifier le texte biographique
- **Contact** : Modifier les informations de contact et lien Instagram

#### 2. Gestion des projets
- **Créer** un nouveau projet
- **Modifier** un projet existant
- **Supprimer** un projet
- **Upload d'images** : Drag & drop ou sélection
- **Réorganiser** : Changer l'ordre d'affichage

#### 3. Publication
- Bouton **"PUBLIER SUR LE SITE"**
- Déclenche un rebuild Vercel
- Site mis à jour en 2-3 minutes

## 🔄 Workflow complet

```
1. Rola se connecte à l'admin
   ↓
2. Modifie des paramètres / ajoute des projets
   ↓
3. Clique sur "PUBLIER SUR LE SITE"
   ↓
4. Webhook appelle Vercel
   ↓
5. Vercel exécute `npm run build`
   ↓
6. build.js lit Firebase → génère /dist/
   ↓
7. Vercel déploie le nouveau /dist/
   ↓
8. Site à jour ! ✓
```

## 📝 Scripts disponibles

```bash
npm run build    # Générer les fichiers dans /dist/
npm run dev      # Build + serveur local sur :8080
npm run serve    # Serveur local seulement
```

## 🐛 Troubleshooting

### Le build échoue
- Vérifier que Firebase est bien configuré
- Vérifier que les collections Firestore existent
- Vérifier les permissions Firebase

### Les images ne s'affichent pas
- Vérifier que les images sont bien uploadées dans Storage
- Vérifier les règles de sécurité Storage (public read)

### Le deploy hook ne fonctionne pas
- Vérifier l'URL du webhook dans `admin.js`
- Vérifier que le projet Vercel est bien configuré

### Erreur "Document settings/site introuvable"
Créer le document dans Firestore :
```javascript
// Dans la console Firebase
Collection: settings
Document ID: site
Fields:
  landing_image: "images/lebanon1.jpg"
  title_fr: "Rola KHAYYAT"
  title_ar: "رولا خياط"
  about: "Votre texte..."
  contact: "Votre texte..."
  instagram_url: "https://instagram.com/..."
```

## 🔒 Sécurité

### Firebase Authentication
- Seuls les utilisateurs autorisés peuvent se connecter à l'admin
- Session expire après 2h d'inactivité

### Firestore Rules (recommandées)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Settings : lecture publique, écriture authentifiée
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Projects : lecture publique, écriture authentifiée
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules (recommandées)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 💰 Coûts

### Vercel (Plan gratuit - Hobby)
- ✅ Deploy Hooks illimités
- ✅ 100 déploiements/jour
- ✅ 100 GB bande passante/mois
- ✅ Domaine personnalisé gratuit

**Suffisant pour :** ~10 000 visiteurs/mois

### Firebase (Plan Spark - gratuit)
- ✅ 5 GB stockage
- ✅ 1 GB téléchargement/jour
- ✅ 50K lectures Firestore/jour

**Suffisant pour :** un portfolio standard

## 🆘 Support

Pour toute question :
1. Vérifier ce README
2. Vérifier les logs Vercel
3. Vérifier la console Firebase
4. Contacter Jawed : [javed.fr](https://javed.fr)

## 📄 Licence

© 2025 Rola KHAYYAT - Tous droits réservés
Website par [Jawed](https://javed.fr)
