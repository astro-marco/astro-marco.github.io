// Import modules with error handling
let setupNavigation, setupFAQ, setupDownloadButtons, setupAnimations, setupThemeToggle, setupDemo, highlightCurrentNavItem;

// Helper function to safely import modules
async function safeImport() {
    try {
        const navigationModule = await import('./modules/navigation.js');
        setupNavigation = navigationModule.setupNavigation;
        
        const faqModule = await import('./modules/faq.js');
        setupFAQ = faqModule.setupFAQ;
        
        const downloadModule = await import('./modules/download.js');
        setupDownloadButtons = downloadModule.setupDownloadButtons;
        
        const animationsModule = await import('./modules/animations.js');
        setupAnimations = animationsModule.setupAnimations;
        
        const themeModule = await import('./modules/theme.js');
        setupThemeToggle = themeModule.setupThemeToggle;
        
        const demoModule = await import('./modules/demo.js');
        setupDemo = demoModule.setupDemo;
        
        const navUtilsModule = await import('./utils/navigation-utils.js');
        highlightCurrentNavItem = navUtilsModule.highlightCurrentNavItem;
        
        // Initialize all modules once loaded
        initModules();
    } catch (error) {
        console.error('Error loading modules:', error);
        // Basic functionality can still work even if modules fail to load
    }
}

function initModules() {
    if (setupNavigation) setupNavigation();
    if (setupFAQ) setupFAQ();
    if (setupDownloadButtons) setupDownloadButtons();
    if (setupAnimations) setupAnimations();
    if (setupThemeToggle) setupThemeToggle();
    if (setupDemo) setupDemo();
    if (highlightCurrentNavItem) highlightCurrentNavItem();
}

// Quando il DOM è caricato, carica i moduli in modo sicuro
document.addEventListener('DOMContentLoaded', safeImport);
