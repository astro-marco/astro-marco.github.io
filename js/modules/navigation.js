import { select, selectAll, on } from '../utils/dom.js';

/**
 * Configura la navigazione e il menu mobile
 */
export function setupNavigation() {
    const mobileMenuBtn = select('.mobile-menu-btn');
    const navLinks = select('.nav-links');
    
    // Toggle del menu mobile
    if (mobileMenuBtn) {
        on(mobileMenuBtn, 'click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // Toggle visibilità dei link nella navigazione
            if (navLinks.classList.contains('active')) {
                applyMobileNavStyles(navLinks);
            } else {
                resetMobileNavStyles(navLinks);
            }
        });
    }
    
    setupSmoothScrolling();
    setupScrollSpy();
}

/**
 * Applica gli stili per il menu mobile aperto
 * @param {Element} navLinks - Elemento contenitore dei link di navigazione
 */
function applyMobileNavStyles(navLinks) {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.width = '100%';
    navLinks.style.backgroundColor = 'var(--white)';
    navLinks.style.padding = '20px';
    navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
}

/**
 * Ripristina gli stili originali per il menu mobile
 * @param {Element} navLinks - Elemento contenitore dei link di navigazione
 */
function resetMobileNavStyles(navLinks) {
    navLinks.style.display = '';
}

/**
 * Configura lo scrolling fluido per i link interni
 */
function setupSmoothScrolling() {
    const anchorLinks = selectAll('a[href^="#"]');
    const navLinks = select('.nav-links');
    const mobileMenuBtn = select('.mobile-menu-btn');
    
    anchorLinks.forEach(anchor => {
        on(anchor, 'click', (e) => {
            e.preventDefault();
            
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = select(targetId);
            if (targetElement) {
                // Chiude il menu mobile se aperto
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    resetMobileNavStyles(navLinks);
                }
                
                // Scroll all'elemento target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Aggiorna URL senza causare scroll
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Configura la funzionalità di scroll spy per evidenziare la sezione attiva
 */
function setupScrollSpy() {
    const sections = selectAll('section[id]');
    const navItems = selectAll('.nav-links a');
    
    // Event listener per lo scroll
    on(window, 'scroll', () => {
        const scrollPosition = window.scrollY + 100; // Aggiunge offset per la navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });
}
