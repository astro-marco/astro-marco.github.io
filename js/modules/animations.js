import { selectAll, on } from '../utils/dom.js';

/**
 * Configura le animazioni per gli elementi della pagina
 */
export function setupAnimations() {
    const elementsToAnimate = selectAll('.feature-card, .use-case, .security-feature');
    
    // Aggiunge la classe per l'animazione
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Esegue la funzione una volta al caricamento
    animateOnScroll(elementsToAnimate);
    
    // Aggiunge l'event listener allo scroll
    on(window, 'scroll', () => animateOnScroll(elementsToAnimate));
}

/**
 * Attiva l'animazione per gli elementi in viewport
 * @param {NodeList} elementsToAnimate - Elementi da animare
 */
function animateOnScroll(elementsToAnimate) {
    elementsToAnimate.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Se l'elemento è nel viewport
        if (elementPosition < windowHeight * 0.85) {
            element.classList.add('visible');
        }
    });
}
