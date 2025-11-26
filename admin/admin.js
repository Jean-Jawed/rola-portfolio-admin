// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4W5XqKTVFsMpjINwzmCZD-zTui1IcdRo",
    authDomain: "rola-portfolio.firebaseapp.com",
    projectId: "rola-portfolio",
    storageBucket: "rola-portfolio.firebasestorage.app",
    messagingSenderId: "322391245856",
    appId: "1:322391245856:web:82af28c9c84babe140a845"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Vercel Deploy Hook URL (à configurer après déploiement)
const VERCEL_DEPLOY_HOOK = 'YOUR_VERCEL_DEPLOY_HOOK_URL';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userEmail = document.getElementById('userEmail');

// Settings elements
const landingImagePreview = document.getElementById('landingImagePreview');
const landingImageInput = document.getElementById('landingImageInput');
const titleFr = document.getElementById('titleFr');
const titleAr = document.getElementById('titleAr');
const aboutText = document.getElementById('aboutText');
const contactText = document.getElementById('contactText');
const instagramUrl = document.getElementById('instagramUrl');

// Projects elements
const newProjectBtn = document.getElementById('newProjectBtn');
const curatorialProjectsList = document.getElementById('curatorialProjectsList');
const personalProjectsList = document.getElementById('personalProjectsList');
const projectModal = document.getElementById('projectModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const projectName = document.getElementById('projectName');
const projectDescription = document.getElementById('projectDescription');
const projectOrder = document.getElementById('projectOrder');
const projectImages = document.getElementById('projectImages');
const projectImageInput = document.getElementById('projectImageInput');
const saveProjectBtn = document.getElementById('saveProjectBtn');
const cancelProjectBtn = document.getElementById('cancelProjectBtn');

// Publish elements
const publishBtn = document.getElementById('publishBtn');
const publishStatus = document.getElementById('publishStatus');
const lastPublish = document.getElementById('lastPublish');

// Toast
const toast = document.getElementById('toast');

// State
let currentUser = null;
let currentEditingProject = null;
let uploadedProjectImages = [];
let settingsData = null;

// ==================== AUTH ====================
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        userEmail.textContent = user.email;
        showDashboard();
    } else {
        showLogin();
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loginError.textContent = '';
    } catch (error) {
        loginError.textContent = 'Identifiants incorrects';
    }
});

logoutBtn.addEventListener('click', async () => {
    await signOut(auth);
});

function showLogin() {
    loginScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    loadAllData();
}

// ==================== LOAD DATA ====================
async function loadAllData() {
    await loadSettings();
    await loadProjects();
}

async function loadSettings() {
    try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
        if (settingsDoc.exists()) {
            settingsData = settingsDoc.data();
            
            // Landing page
            if (settingsData.landing_image) {
                landingImagePreview.style.backgroundImage = `url(${settingsData.landing_image})`;
            }
            titleFr.value = settingsData.title_fr || '';
            titleAr.value = settingsData.title_ar || '';
            
            // About
            aboutText.value = settingsData.about || '';
            
            // Contact
            contactText.value = settingsData.contact || '';
            instagramUrl.value = settingsData.instagram_url || '';
        }
    } catch (error) {
        showToast('Erreur de chargement des paramètres', 'error');
    }
}

async function loadProjects() {
    try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        
        const curatorialProjects = [];
        const personalProjects = [];
        
        projectsSnapshot.forEach((doc) => {
            const data = doc.data();
            const project = {
                id: doc.id,
                ...data
            };
            
            if (data.category === 'curatorial') {
                curatorialProjects.push(project);
            } else if (data.category === 'personal') {
                personalProjects.push(project);
            }
        });
        
        // Sort by order
        curatorialProjects.sort((a, b) => (a.order || 999) - (b.order || 999));
        personalProjects.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        displayProjects(curatorialProjects, curatorialProjectsList);
        displayProjects(personalProjects, personalProjectsList);
        
    } catch (error) {
        showToast('Erreur de chargement des projets', 'error');
    }
}

function displayProjects(projects, container) {
    container.innerHTML = '';
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="color: #999; padding: 1rem;">Aucun projet</p>';
        return;
    }
    
    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'project-item';
        
        const imageCount = project.images ? project.images.length : 0;
        
        item.innerHTML = `
            <div class="project-info">
                <h5>📷 ${project.name}</h5>
                <p class="project-meta">${imageCount} photo${imageCount > 1 ? 's' : ''} · Ordre: ${project.order || '-'}</p>
            </div>
            <div class="project-actions">
                <button class="btn-small btn-edit" onclick="editProject('${project.id}')">Modifier</button>
                <button class="btn-small btn-delete" onclick="deleteProject('${project.id}', '${project.name}')">❌</button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// ==================== SAVE SETTINGS ====================
document.getElementById('saveLandingBtn').addEventListener('click', async () => {
    try {
        const updates = {
            title_fr: titleFr.value,
            title_ar: titleAr.value
        };
        
        // Upload new landing image if selected
        if (landingImageInput.files[0]) {
            const file = landingImageInput.files[0];
            const imageUrl = await uploadImage(file, 'landing-image.jpg', 'landingProgress');
            updates.landing_image = imageUrl;
        }
        
        await setDoc(doc(db, 'settings', 'site'), updates, { merge: true });
        showToast('Landing page sauvegardée ✓', 'success');
        await loadSettings();
    } catch (error) {
        showToast('Erreur de sauvegarde', 'error');
    }
});

document.getElementById('saveAboutBtn').addEventListener('click', async () => {
    try {
        await setDoc(doc(db, 'settings', 'site'), {
            about: aboutText.value
        }, { merge: true });
        showToast('About sauvegardé ✓', 'success');
    } catch (error) {
        showToast('Erreur de sauvegarde', 'error');
    }
});

document.getElementById('saveContactBtn').addEventListener('click', async () => {
    try {
        await setDoc(doc(db, 'settings', 'site'), {
            contact: contactText.value,
            instagram_url: instagramUrl.value
        }, { merge: true });
        showToast('Contact sauvegardé ✓', 'success');
    } catch (error) {
        showToast('Erreur de sauvegarde', 'error');
    }
});

// ==================== IMAGE UPLOAD ====================
async function uploadImage(file, filename, progressId) {
    const progressBar = document.getElementById(progressId);
    progressBar.classList.add('active');
    
    try {
        const storageRef = ref(storage, `images/${filename}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        
        setTimeout(() => progressBar.classList.remove('active'), 500);
        return url;
    } catch (error) {
        progressBar.classList.remove('active');
        throw error;
    }
}

landingImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            landingImagePreview.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// ==================== PROJECT MANAGEMENT ====================
newProjectBtn.addEventListener('click', () => {
    currentEditingProject = null;
    uploadedProjectImages = [];
    modalTitle.textContent = '➕ Nouveau Projet';
    projectName.value = '';
    projectDescription.value = '';
    document.querySelector('input[name="category"][value="curatorial"]').checked = true;
    projectOrder.value = '1';
    projectImages.innerHTML = '';
    projectModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    projectModal.classList.add('hidden');
});

cancelProjectBtn.addEventListener('click', () => {
    projectModal.classList.add('hidden');
});

// Global functions for project actions
window.editProject = async (projectId) => {
    try {
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (!projectDoc.exists()) return;
        
        const project = projectDoc.data();
        currentEditingProject = projectId;
        uploadedProjectImages = project.images || [];
        
        modalTitle.textContent = '✏️ Modifier le Projet';
        projectName.value = project.name;
        projectDescription.value = project.description || '';
        document.querySelector(`input[name="category"][value="${project.category}"]`).checked = true;
        projectOrder.value = project.order || 1;
        
        displayProjectImages();
        projectModal.classList.remove('hidden');
    } catch (error) {
        showToast('Erreur de chargement du projet', 'error');
    }
};

window.deleteProject = async (projectId, projectName) => {
    if (!confirm(`Supprimer le projet "${projectName}" ?\nCette action est irréversible.`)) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'projects', projectId));
        showToast('Projet supprimé ✓', 'success');
        await loadProjects();
    } catch (error) {
        showToast('Erreur de suppression', 'error');
    }
};

projectImageInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
        const filename = `${Date.now()}-${file.name}`;
        const url = await uploadImage(file, filename, 'projectProgress');
        uploadedProjectImages.push(filename);
    }
    
    displayProjectImages();
});

function displayProjectImages() {
    projectImages.innerHTML = '';
    
    uploadedProjectImages.forEach((filename, index) => {
        const item = document.createElement('div');
        item.className = 'project-image-item';
        item.style.backgroundImage = `url(images/${filename})`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'project-image-remove';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => {
            uploadedProjectImages.splice(index, 1);
            displayProjectImages();
        };
        
        item.appendChild(removeBtn);
        projectImages.appendChild(item);
    });
}

saveProjectBtn.addEventListener('click', async () => {
    const name = projectName.value.trim();
    if (!name) {
        showToast('Le nom du projet est requis', 'error');
        return;
    }
    
    const category = document.querySelector('input[name="category"]:checked').value;
    
    const projectData = {
        name,
        description: projectDescription.value.trim(),
        category,
        order: parseInt(projectOrder.value) || 1,
        images: uploadedProjectImages
    };
    
    try {
        if (currentEditingProject) {
            await updateDoc(doc(db, 'projects', currentEditingProject), projectData);
            showToast('Projet mis à jour ✓', 'success');
        } else {
            await addDoc(collection(db, 'projects'), projectData);
            showToast('Projet créé ✓', 'success');
        }
        
        projectModal.classList.add('hidden');
        await loadProjects();
    } catch (error) {
        showToast('Erreur de sauvegarde du projet', 'error');
    }
});

// ==================== PUBLISH ====================
publishBtn.addEventListener('click', async () => {
    if (!confirm('Publier les modifications sur le site ?\nLe site sera mis à jour dans 2-3 minutes.')) {
        return;
    }
    
    publishStatus.className = 'publish-status loading';
    publishStatus.textContent = '⏳ Publication en cours...';
    publishBtn.disabled = true;
    
    try {
        // Call Vercel deploy hook
        if (VERCEL_DEPLOY_HOOK && VERCEL_DEPLOY_HOOK !== 'YOUR_VERCEL_DEPLOY_HOOK_URL') {
            await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
            
            publishStatus.className = 'publish-status success';
            publishStatus.textContent = '✓ Publication démarrée ! Le site sera mis à jour dans 2-3 minutes.';
            
            const now = new Date().toLocaleString('fr-FR');
            lastPublish.textContent = `Dernière publication : ${now}`;
            
            // Save last publish date
            await setDoc(doc(db, 'settings', 'site'), {
                last_publish: now
            }, { merge: true });
        } else {
            publishStatus.className = 'publish-status error';
            publishStatus.textContent = '⚠️ Deploy Hook non configuré. Voir README.md';
        }
    } catch (error) {
        publishStatus.className = 'publish-status error';
        publishStatus.textContent = '❌ Erreur de publication. Réessayez.';
    }
    
    publishBtn.disabled = false;
    setTimeout(() => {
        publishStatus.textContent = '';
        publishStatus.className = 'publish-status';
    }, 5000);
});

// ==================== TOAST ====================
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
