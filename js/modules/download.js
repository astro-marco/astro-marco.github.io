import { select } from '../utils/dom.js';

/**
 * Configura i pulsanti di download per mostrare l'OS corretto
 */
export function setupDownloadButtons() {
    // Trova il pulsante principale nella home page
    const mainDownloadBtn = document.getElementById('main-download-btn');
    
    if (mainDownloadBtn) {
        const osInfo = detectOperatingSystem();
        
        // Aggiorna testo e href del pulsante
        mainDownloadBtn.textContent = `Get IgeA for ${osInfo.os}`;
        mainDownloadBtn.href = osInfo.downloadLink;
    }
}

/**
 * Rileva il sistema operativo dell'utente
 */
function detectOperatingSystem() {
    const userAgent = window.navigator.userAgent;
    let os = 'your device'; // Testo predefinito
    let downloadLink = '/download.html'; // Link predefinito
    
    if (/(Mac|iPhone|iPod|iPad)/i.test(userAgent) && !/(iPhone|iPod|iPad)/i.test(userAgent)) {
        os = 'macOS';
        downloadLink = '/downloads/IgeA-1.0.2-mac.dmg';
    } else if (/Windows/i.test(userAgent)) {
        os = 'Windows';
        downloadLink = '/downloads/IgeA-1.0.2-windows.exe';
    } else if (/Android/i.test(userAgent)) {
        os = 'Android';
        downloadLink = 'https://play.google.com/store/apps/details?id=com.igea.app';
    } else if (/Linux/i.test(userAgent)) {
        os = 'Linux';
        downloadLink = '/downloads/IgeA-1.0.2-linux.AppImage';
    } else if (/(iPhone|iPad|iPod)/i.test(userAgent)) {
        os = 'iOS';
        downloadLink = 'https://apps.apple.com/app/igea/id123456789';
    }
    
    return { os, downloadLink };
}

/**
 * Aggiorna il pulsante di download con le informazioni sull'OS
 * @param {Element} button - Pulsante di download
 * @param {Object} osInfo - Informazioni sull'OS
 */
function updateDownloadButton(button, osInfo) {
    const { os, downloadLink } = osInfo;
    
    // Aggiorna testo pulsante
    button.textContent = `Get IgeA for ${os}`;
    
    // Configurazione in base alla pagina corrente
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '/index.html') {
        button.href = downloadLink;
    }
    // Per la pagina download, scroll all'OS specifico
    else if (currentPath === '/download.html') {
        scrollToOSSection(os);
    }
}

/**
 * Trova e scorre alla sezione OS specifica nella pagina di download
 * @param {string} os - Sistema operativo rilevato
 */
function scrollToOSSection(os) {
    // Trova il card per l'OS rilevato
    const osCard = findOSCard(os);
    if (osCard) {
        // Scroll alla card appropriata
        osCard.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Trova l'elemento della card per l'OS specificato
 * @param {string} os - Sistema operativo da trovare
 * @returns {Element|null} Elemento trovato o null
 */
function findOSCard(os) {
    // Cerca gli elementi che contengono il testo dell'OS
    const elements = document.querySelectorAll('.platform-name');
    for (const element of elements) {
        if (element.textContent.trim() === os) {
            return element.closest('.platform-row');
        }
    }
    return null;
}
