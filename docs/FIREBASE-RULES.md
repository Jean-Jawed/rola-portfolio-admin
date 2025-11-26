# 🔒 Règles de Sécurité Firebase

Ce fichier contient les règles de sécurité recommandées pour Firestore et Storage.

## 📄 Firestore Rules

À copier/coller dans Firebase Console → Firestore → Règles

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Collection settings : lecture publique, écriture authentifiée
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Collection projects : lecture publique, écriture authentifiée
    match /projects/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Explication :
- **Lecture publique** (`allow read: if true`) : Le site public doit pouvoir lire les données
- **Écriture authentifiée** (`allow write: if request.auth != null`) : Seuls les admins connectés peuvent modifier

---

## 📦 Storage Rules

À copier/coller dans Firebase Console → Storage → Règles

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Dossier images : lecture publique, écriture authentifiée
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                    request.resource.size < 10 * 1024 * 1024 && // Max 10MB
                    request.resource.contentType.matches('image/.*'); // Seulement images
    }
  }
}
```

### Explication :
- **Lecture publique** : Les visiteurs doivent voir les images
- **Écriture authentifiée** : Seuls les admins peuvent uploader
- **Limite de taille** : Max 10MB par image
- **Type de fichier** : Seulement des images

---

## 🔐 Bonnes Pratiques

### 1. Comptes utilisateurs
- Ne jamais partager les identifiants admin
- Utiliser des mots de passe forts
- Activer la vérification en 2 étapes si possible

### 2. Firestore
- ✅ Ces règles permettent la lecture publique (nécessaire pour le site)
- ✅ Seuls les utilisateurs authentifiés peuvent modifier
- ⚠️ Ne stockez jamais de données sensibles dans Firestore

### 3. Storage
- ✅ Limitation de taille (10MB) pour éviter les abus
- ✅ Vérification du type MIME (seulement images)
- ⚠️ Toujours compresser les images avant upload

### 4. Authentication
Dans Firebase Console → Authentication → Settings :
- Activer **Email/Password** uniquement
- Désactiver les inscriptions publiques
- Ajouter manuellement les comptes admin

---

## 🚨 En cas de problème

### Erreur "Missing or insufficient permissions"
→ Vérifiez que les règles Firestore sont bien configurées

### Erreur "Unauthorized" lors de l'upload
→ Vérifiez que les règles Storage sont bien configurées

### Images non chargées sur le site
→ Vérifiez que `allow read: if true` est bien présent dans Storage Rules

---

## 📝 Checklist de sécurité

- [ ] Règles Firestore configurées
- [ ] Règles Storage configurées
- [ ] Comptes admin créés manuellement
- [ ] Inscriptions publiques désactivées
- [ ] Mots de passe forts utilisés
- [ ] Clés API jamais committées dans le code (c'est OK, elles sont publiques)
- [ ] Test : un utilisateur non connecté peut voir le site
- [ ] Test : un utilisateur non connecté ne peut PAS modifier via console

---

**Important :** Les règles Firebase sont testables dans la console Firebase avec le simulateur !
