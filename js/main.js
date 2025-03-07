// Import modules with error handling
import { componentLoader } from './utils/component-loader.js';

/**
 * Funzione di inizializzazione dei moduli JS in modo efficiente
 */
async function initApp() {
    // 1. Carica i componenti principali
    const headerElement = document.querySelector('#header-container');
    const footerElement = document.querySelector('#footer-container');
    
    try {
        if (headerElement && headerElement.innerHTML === '') {
            await componentLoader.load('/components/header.html', headerElement, {
                afterInsert: (el) => {
                    // Evidenzia l'elemento di navigazione corrente
                    const currentPath = window.location.pathname;
                    const navLinks = el.querySelectorAll('nav a');
                    navLinks.forEach(link => {
                        if (link.getAttribute('href') === currentPath || 
                           (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        if (footerElement) {
            await componentLoader.load('/components/footer.html', footerElement);
        }
    } catch (error) {
        console.error("Failed to load components:", error);
    }

    // 2. Carica i moduli di base in modo sincrono
    import('./modules/navigation.js')
        .then(module => module.setupNavigation())
        .catch(err => console.warn('Navigation module failed:', err));
    
    // 3. Carica i moduli di download immediatamente per il bottone OS
    import('./modules/download.js')
        .then(module => module.setupDownloadButtons())
        .catch(err => console.warn('Download module failed:', err));

    // 4. Carica i moduli meno critici quando il browser è inattivo
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => loadNonCriticalModules());
    } else {
        setTimeout(loadNonCriticalModules, 1000);
    }
}

/**
 * Carica moduli non critici
 */
function loadNonCriticalModules() {
    Promise.all([
        import('./modules/faq.js').then(m => m.setupFAQ && m.setupFAQ()),
        import('./modules/animations.js').then(m => m.setupAnimations && m.setupAnimations())
    ]).catch(err => console.warn('Some modules failed to load:', err));
}

// Avvia app quando il DOM è caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
