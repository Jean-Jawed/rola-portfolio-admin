#!/usr/bin/env node

/**
 * BUILD SCRIPT - Rola Portfolio
 * 
 * Ce script :
 * 1. Se connecte à Firebase
 * 2. Récupère toutes les données (Firestore)
 * 3. Télécharge toutes les images (Storage)
 * 4. Génère les fichiers HTML et JS dans /dist/
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');
const { getStorage, ref, listAll, getDownloadURL } = require('firebase/storage');
const https = require('https');
const firebaseConfig = require('./firebase-config');

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Couleurs pour les logs
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour télécharger une image
async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

// Fonction principale de build
async function build() {
    try {
        log('\n🚀 DÉMARRAGE DU BUILD...', 'blue');
        
        // 1. Nettoyer /dist/ (rebuild complet)
        log('\n📁 Nettoyage du dossier /dist/...', 'yellow');
        if (fs.existsSync('./dist')) {
            fs.rmSync('./dist', { recursive: true, force: true });
        }
        fs.mkdirSync('./dist', { recursive: true });
        fs.mkdirSync('./dist/images', { recursive: true });
        log('   ✓ Dossier /dist/ nettoyé', 'green');
        
        // 2. Récupérer les paramètres du site depuis Firestore
        log('\n🔥 Récupération des données Firestore...', 'yellow');
        const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
        
        if (!settingsDoc.exists()) {
            throw new Error('Document settings/site introuvable dans Firestore !');
        }
        
        const settings = settingsDoc.data();
        log('   ✓ Paramètres du site récupérés', 'green');
        
        // 3. Récupérer tous les projets
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsData = {};
        const curatorialProjects = [];
        const personalProjects = [];
        
        projectsSnapshot.forEach((doc) => {
            const data = doc.data();
            const projectId = doc.id;
            
            projectsData[projectId] = data.images || [];
            
            if (data.category === 'curatorial') {
                curatorialProjects.push({
                    id: projectId,
                    name: data.name,
                    order: data.order || 999
                });
            } else if (data.category === 'personal') {
                personalProjects.push({
                    id: projectId,
                    name: data.name,
                    order: data.order || 999
                });
            }
        });
        
        // Trier par ordre
        curatorialProjects.sort((a, b) => a.order - b.order);
        personalProjects.sort((a, b) => a.order - b.order);
        
        log(`   ✓ ${projectsSnapshot.size} projets récupérés`, 'green');
        
        // 4. Télécharger toutes les images depuis Firebase Storage
        log('\n📷 Téléchargement des images...', 'yellow');
        const imagesRef = ref(storage, 'images');
        const imagesList = await listAll(imagesRef);
        
        let downloadCount = 0;
        for (const itemRef of imagesList.items) {
            const url = await getDownloadURL(itemRef);
            const filename = itemRef.name;
            const filepath = path.join('./dist/images', filename);
            
            await downloadImage(url, filepath);
            downloadCount++;
            process.stdout.write(`\r   Téléchargement : ${downloadCount}/${imagesList.items.length} images`);
        }
        console.log('');
        log(`   ✓ ${downloadCount} images téléchargées`, 'green');
        
        // 5. Générer index.html
        log('\n📄 Génération de index.html...', 'yellow');
        let indexTemplate = fs.readFileSync('./templates/index.template.html', 'utf8');
        
        indexTemplate = indexTemplate
            .replace(/\{\{LANDING_IMAGE\}\}/g, settings.landing_image || 'images/default.jpg')
            .replace(/\{\{TITLE_FR\}\}/g, settings.title_fr || 'Rola KHAYYAT')
            .replace(/\{\{TITLE_AR\}\}/g, settings.title_ar || 'رولا خياط');
        
        fs.writeFileSync('./dist/index.html', indexTemplate);
        log('   ✓ index.html généré', 'green');
        
        // 6. Générer main.html
        log('\n📄 Génération de main.html...', 'yellow');
        let mainTemplate = fs.readFileSync('./templates/main.template.html', 'utf8');
        
        // Générer la liste des projets curatoriaux
        const curatorialHTML = curatorialProjects
            .map(p => `<div class="submenu-item" data-project="${p.id}">${p.name}</div>`)
            .join('\n                    ');
        
        // Générer la liste des projets personnels
        const personalHTML = personalProjects
            .map(p => `<div class="submenu-item" data-project="${p.id}">${p.name}</div>`)
            .join('\n                    ');
        
        mainTemplate = mainTemplate
            .replace('{{CURATORIAL_PROJECTS}}', curatorialHTML)
            .replace('{{PERSONAL_PROJECTS}}', personalHTML)
            .replace(/\{\{TITLE_FR\}\}/g, settings.title_fr || 'Rola KHAYYAT')
            .replace(/\{\{LANDING_IMAGE\}\}/g, settings.landing_image || 'images/default.jpg')
            .replace('{{ABOUT_TEXT}}', settings.about || 'About text not available.')
            .replace('{{CONTACT_TEXT}}', settings.contact || 'Contact information not available.')
            .replace(/\{\{INSTAGRAM_URL\}\}/g, settings.instagram_url || 'https://www.instagram.com/');
        
        fs.writeFileSync('./dist/main.html', mainTemplate);
        log('   ✓ main.html généré', 'green');
        
        // 7. Générer main.js
        log('\n📄 Génération de main.js...', 'yellow');
        let mainJsTemplate = fs.readFileSync('./templates/main.template.js', 'utf8');
        
        const projectsJSON = JSON.stringify(projectsData, null, 2);
        mainJsTemplate = mainJsTemplate.replace('{{PROJECTS_JSON}}', projectsJSON);
        
        fs.writeFileSync('./dist/main.js', mainJsTemplate);
        log('   ✓ main.js généré', 'green');
        
        // 8. Copier les fichiers statiques
        log('\n📋 Copie des fichiers statiques...', 'yellow');
        fs.copyFileSync('./public/styles.css', './dist/styles.css');
        fs.copyFileSync('./public/landing.js', './dist/landing.js');
        log('   ✓ Fichiers statiques copiés', 'green');
        
        // 9. Copier le dossier admin
        log('\n👤 Copie de l\'interface admin...', 'yellow');
        fs.mkdirSync('./dist/admin', { recursive: true });
        fs.copyFileSync('./admin/index.html', './dist/admin/index.html');
        fs.copyFileSync('./admin/admin.css', './dist/admin/admin.css');
        fs.copyFileSync('./admin/admin.js', './dist/admin/admin.js');
        log('   ✓ Interface admin copiée', 'green');
        
        // Résumé
        log('\n✅ BUILD TERMINÉ AVEC SUCCÈS !', 'green');
        log(`\n📊 Résumé :`, 'blue');
        log(`   - ${downloadCount} images téléchargées`, 'blue');
        log(`   - ${curatorialProjects.length} projets curatoriaux`, 'blue');
        log(`   - ${personalProjects.length} projets personnels`, 'blue');
        log(`   - Tous les fichiers dans ./dist/\n`, 'blue');
        
    } catch (error) {
        log('\n❌ ERREUR PENDANT LE BUILD :', 'red');
        console.error(error);
        process.exit(1);
    }
}

// Exécuter le build
build();