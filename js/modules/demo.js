import { select, on } from '../utils/dom.js';

/**
 * Configura la funzionalità demo
 */
export function setupDemo() {
    const demoLink = select('a[href="#demo"]');
    const demoSection = select('#demo');
    
    if (demoLink && !demoSection) {
        on(demoLink, 'click', (e) => {
            e.preventDefault();
            alert('Interactive demo coming soon! Please check back later.');
        });
    }
}
