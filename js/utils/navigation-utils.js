import { selectAll } from './dom.js';

/**
 * Evidenzia l'elemento di navigazione corrente in base alla pagina attuale
 */
export function highlightCurrentNavItem() {
    const currentPath = window.location.pathname;
    const navItems = selectAll('.nav-links a');
    
    navItems.forEach(item => {
        // Rimuove active da tutti gli elementi
        item.classList.remove('active');
        
        const itemHref = item.getAttribute('href');
        
        // Verifica se href corrisponde al percorso corrente
        if ((itemHref === currentPath) || 
            (itemHref === '/download.html' && currentPath === '/download.html') ||
            (currentPath === '/' && itemHref.startsWith('/#'))) {
            item.classList.add('active');
        }
    });
}
