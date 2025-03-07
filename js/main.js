// Import modules with error handling
import { loadComponent } from './utils/component-loader.js';

/**
 * Funzione di inizializzazione dei moduli JS in modo efficiente
 */
async function initApp() {
    // 1. Carica i componenti principali (se non sono già stati caricati in modo sincrono)
    const headerElement = document.querySelector('#header-container');
    const footerElement = document.querySelector('#footer-container');
    
    if (headerElement && !headerElement.innerHTML) {
        await loadComponent('/components/header.html', headerElement);
    }
    
    if (footerElement && !footerElement.innerHTML) {
        await loadComponent('/components/footer.html', footerElement);
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
