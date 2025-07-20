// Popup functionality for CodeBuddy

console.log('Popup script loaded!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded in popup.js');
    // Selalu tampilkan popup setiap kali halaman dimuat
    // Create popup elements
    createPopup();
    
    // Show popup with minimal delay for better UX
    setTimeout(function() {
        console.log('Showing popup now');
        const popupOverlay = document.querySelector('.popup-overlay');
        console.log('Popup overlay element:', popupOverlay);
        popupOverlay.classList.add('active');
    }, 500);
});

function createPopup() {
    // Create popup overlay
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    // Create popup container
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-container';
    
    // Create popup header
    const popupHeader = document.createElement('div');
    popupHeader.className = 'popup-header';
    
    const popupTitle = document.createElement('h3');
    popupTitle.textContent = 'Selamat Datang di CodeBuddy!';
    
    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    const popupMessage = document.createElement('p');
    popupMessage.innerHTML = 'Jika Anda menemukan bug atau error saat menggunakan platform ini, Anda dapat melaporkannya melalui <a href="https://www.instagram.com/michael.mandey.79" target="_blank">Instagram kami</a>. Kami akan segera memperbaikinya!';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'popup-close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Tutup popup');
    
    // Create action buttons
    const popupButtons = document.createElement('div');
    popupButtons.className = 'popup-buttons';
    
    const okButton = document.createElement('button');
    okButton.className = 'btn btn-primary';
    okButton.textContent = 'Mengerti';
    
    // Add event listeners to close popup
    closeButton.addEventListener('click', closePopup);
    okButton.addEventListener('click', closePopup);
    
    // Assemble popup structure
    popupHeader.appendChild(popupTitle);
    popupContent.appendChild(popupMessage);
    popupButtons.appendChild(okButton);
    
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(popupHeader);
    popupContainer.appendChild(popupContent);
    popupContainer.appendChild(popupButtons);
    
    popupOverlay.appendChild(popupContainer);
    
    // Add popup to body
    document.body.appendChild(popupOverlay);
}

function closePopup() {
    const popupOverlay = document.querySelector('.popup-overlay');
    
    // Add fade-out effect
    popupOverlay.classList.remove('active');
    
    // Remove from DOM after animation completes
    setTimeout(function() {
        if (popupOverlay && popupOverlay.parentNode) {
            popupOverlay.parentNode.removeChild(popupOverlay);
        }
    }, 300);
}