// Landing page interactions
const landingContainer = document.getElementById('landingContainer');
const landingImage = document.getElementById('landingImage');

// Parallax effect on mouse move
landingContainer.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    landingImage.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
});

// Reset on mouse leave
landingContainer.addEventListener('mouseleave', () => {
    landingImage.style.transform = 'scale(1.1)';
});

// Transition to main.html on click
landingContainer.addEventListener('click', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        window.location.href = 'main.html';
    }, 800);
});