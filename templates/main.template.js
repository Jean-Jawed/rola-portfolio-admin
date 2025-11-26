// Project data - Generated dynamically from Firebase
const projects = {{PROJECTS_JSON}};

// State
let currentImages = [];
let currentImageIndex = 0;

// DOM elements
const contentArea = document.getElementById('contentArea');
const placeholder = contentArea.querySelector('.placeholder');
const gallery = document.getElementById('gallery');
const aboutContent = document.getElementById('aboutContent');
const contactContent = document.getElementById('contactContent');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeLightbox = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Site title click to reload
document.getElementById('siteTitle').addEventListener('click', () => {
    window.location.href = 'main.html';
});

// Hamburger menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        hamburger.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

// Menu interactions - Expandable sections
document.querySelectorAll('.expandable').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-title') || e.target.classList.contains('expandable')) {
            item.classList.toggle('expanded');
        }
    });
});

// Project selection
document.querySelectorAll('.submenu-item').forEach(item => {
    item.addEventListener('click', () => {
        const project = item.getAttribute('data-project');
        loadProject(project);
        setActiveMenu(item);
        closeMobileMenu();
    });
});

// Page navigation
document.querySelectorAll('.menu-item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
        const page = item.getAttribute('data-page');
        
        if (page === 'about') {
            showAbout();
            setActiveMenu(item);
            closeMobileMenu();
        } else if (page === 'contact') {
            showContact();
            setActiveMenu(item);
            closeMobileMenu();
        } else if (page === 'insta') {
            const url = item.getAttribute('data-url');
            window.open(url, '_blank');
        }
    });
});

function closeMobileMenu() {
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        sidebarOverlay.classList.remove('active');
    }
}

function setActiveMenu(activeItem) {
    document.querySelectorAll('.menu-item, .submenu-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

function hideAllContent() {
    placeholder.classList.add('hidden');
    gallery.classList.remove('visible');
    aboutContent.classList.remove('visible');
    contactContent.classList.remove('visible');
    contentArea.scrollTop = 0;
}

function loadProject(projectName) {
    currentImages = projects[projectName];
    
    hideAllContent();
    
    setTimeout(() => {
        gallery.innerHTML = '';
        
        currentImages.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = `images/${image}`;
            img.alt = `Project image ${index + 1}`;
            img.loading = index === 0 ? 'eager' : 'lazy';
            
            item.appendChild(img);
            item.addEventListener('click', () => openLightbox(index));
            
            gallery.appendChild(item);
        });
        
        contentArea.classList.add('has-content');
        gallery.classList.add('visible');
        
        // Preload next image on scroll
        gallery.addEventListener('scroll', preloadNextImage);
    }, 300);
}

function preloadNextImage() {
    const scrollPosition = gallery.scrollLeft;
    const itemWidth = gallery.querySelector('.gallery-item')?.offsetWidth || 0;
    const currentIndex = Math.floor(scrollPosition / itemWidth);
    
    if (currentIndex + 1 < currentImages.length) {
        const nextImage = new Image();
        nextImage.src = `images/${currentImages[currentIndex + 1]}`;
    }
}

function showAbout() {
    hideAllContent();
    
    setTimeout(() => {
        contentArea.classList.add('has-content');
        aboutContent.classList.add('visible');
    }, 300);
}

function showContact() {
    hideAllContent();
    
    setTimeout(() => {
        contentArea.classList.add('has-content');
        contactContent.classList.add('visible');
    }, 300);
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = `images/${currentImages[index]}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightboxFunc() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        lightboxImage.src = `images/${currentImages[currentImageIndex]}`;
    }
}

function showNextImage() {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        lightboxImage.src = `images/${currentImages[currentImageIndex]}`;
    }
}

// Event listeners for lightbox
closeLightbox.addEventListener('click', closeLightboxFunc);
prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightboxFunc();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightboxFunc();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
});

// Fade in on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
            sidebarOverlay.classList.remove('active');
        }
    }, 250);
});
