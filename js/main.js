import { setupNavigation } from './modules/navigation.js';
import { setupFAQ } from './modules/faq.js';
import { setupDownloadButtons } from './modules/download.js';
import { setupAnimations } from './modules/animations.js';
import { setupThemeToggle } from './modules/theme.js';
import { setupDemo } from './modules/demo.js';
import { highlightCurrentNavItem } from './utils/navigation-utils.js';

// Quando il DOM è caricato, inizializza tutti i moduli
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupFAQ();
    setupDownloadButtons();
    setupAnimations();
    setupThemeToggle();
    setupDemo();
    highlightCurrentNavItem();
});
