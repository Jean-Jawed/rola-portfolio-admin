#!/usr/bin/env node

/**
 * SCRIPT D'INITIALISATION FIREBASE
 * 
 * Ce script crée les données de test dans Firestore
 * À exécuter une seule fois pour setup initial
 * 
 * Usage: node init-firebase.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection, addDoc } = require('firebase/firestore');
const firebaseConfig = require('./firebase-config');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirebase() {
    console.log('🔥 Initialisation de Firebase...\n');
    
    try {
        // 1. Créer le document settings/site
        console.log('📝 Création du document settings/site...');
        await setDoc(doc(db, 'settings', 'site'), {
            landing_image: 'images/lebanon1.jpg',
            title_fr: 'Rola KHAYYAT',
            title_ar: 'رولا خياط',
            about: `Rola Khayyat is a Lebanese interdisciplinary artist and curator based in Brooklyn, NY. Her work explores new dimensions on the representation of war, memory, and identity. Rola has curated shows in Beirut, Thessaloniki, and New York, such as the BEYroute for the third Thessaloniki Bienniale, Lattice Work at the Black and White gallery, Simmer at Kunstraum LLC. and Light in Wartime at apexart. Her work has been exhibited widely, including exhibitions at the Macedonian Museum of Contemporary Art, Okk / raum 29, Catalyst Arts Belfast Photo Festival 2013, the 21st International Istanbul Art Fair and North of History (NY). Khayyat received her B.A. in historical studies from the American University of Beirut (2003), a diploma in Intensive Drawing from the Florence Academy of Art (2005) and an MFA in Visual Arts from Columbia University (2016).`,
            contact: 'For inquiries, please reach out via email or social media.',
            instagram_url: 'https://www.instagram.com/',
            last_publish: null
        });
        console.log('✅ Document settings/site créé\n');
        
        // 2. Créer des projets d'exemple
        console.log('📷 Création de projets d\'exemple...');
        
        const projects = [
            {
                name: 'Project A',
                description: 'First curatorial project',
                category: 'curatorial',
                order: 1,
                images: ['laqqam1.jpg', 'laqqam2.jpg', 'lebanon1.jpg']
            },
            {
                name: 'Project B',
                description: 'Second curatorial project',
                category: 'curatorial',
                order: 2,
                images: ['lebanon2.jpg', 'lebanon3.jpg', 'sunrise1.jpg']
            },
            {
                name: 'Project C',
                description: 'Third curatorial project',
                category: 'curatorial',
                order: 3,
                images: ['sunrise2.jpg', 'laqqam1.jpg', 'laqqam2.jpg']
            },
            {
                name: 'Project 1',
                description: 'First personal work',
                category: 'personal',
                order: 1,
                images: ['lebanon1.jpg', 'lebanon2.jpg', 'lebanon3.jpg']
            },
            {
                name: 'Project 2',
                description: 'Second personal work',
                category: 'personal',
                order: 2,
                images: ['sunrise1.jpg', 'sunrise2.jpg', 'laqqam1.jpg']
            },
            {
                name: 'Project 3',
                description: 'Third personal work',
                category: 'personal',
                order: 3,
                images: ['laqqam2.jpg', 'lebanon1.jpg', 'lebanon2.jpg']
            }
        ];
        
        for (const project of projects) {
            await addDoc(collection(db, 'projects'), project);
            console.log(`  ✅ Projet "${project.name}" créé`);
        }
        
        console.log('\n🎉 INITIALISATION TERMINÉE !\n');
        console.log('📋 Prochaines étapes :');
        console.log('1. Upload des images dans Firebase Storage (dossier images/)');
        console.log('2. Créer les comptes utilisateurs dans Firebase Authentication');
        console.log('3. Exécuter npm run build pour tester\n');
        
    } catch (error) {
        console.error('❌ Erreur :', error);
        process.exit(1);
    }
    
    process.exit(0);
}

initializeFirebase();
