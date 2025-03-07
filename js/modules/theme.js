import { select, on } from '../utils/dom.js';

/**
 * Configura il toggle tema chiaro/scuro
 */
export function setupThemeToggle() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const themeToggle = select('.theme-toggle');
    
    if (themeToggle) {
        // Imposta stato iniziale
        initializeTheme(themeToggle, prefersDarkScheme);
        
        // Aggiunge event listener
        on(themeToggle, 'click', () => toggleTheme(themeToggle));
    }
}

/**
 * Inizializza il tema in base alle preferenze utente
 * @param {Element} themeToggle - Elemento toggle del tema
 * @param {MediaQueryList} prefersDarkScheme - Media query per preferenze tema scuro
 */
function initializeTheme(themeToggle, prefersDarkScheme) {
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

/**
 * Cambia il tema tra chiaro e scuro
 * @param {Element} themeToggle - Elemento toggle del tema
 */
function toggleTheme(themeToggle) {
    document.body.classList.toggle('dark-mode');
    
    // Aggiorna localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}
