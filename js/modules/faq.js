import { select, selectAll, on } from '../utils/dom.js';

/**
 * Configura la funzionalità FAQ
 */
export function setupFAQ() {
    setupAccordion();
    setupCategoryFilters();
}

/**
 * Configura il comportamento accordion per le FAQ
 */
function setupAccordion() {
    const faqItems = selectAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = select('.faq-question', item);
        const content = select('.faq-content', item);
        
        if (question && content) {
            // Imposta stato iniziale
            content.style.maxHeight = '0px';
            question.setAttribute('aria-expanded', 'false');
            
            on(question, 'click', () => {
                // Verifica se l'elemento corrente è espanso
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // Chiude tutti gli elementi
                collapseAllFaqItems(faqItems);
                
                // Espande l'elemento corrente se non era espanso prima
                if (!isExpanded) {
                    expandFaqItem(item, question, content);
                }
            });
        }
    });
}

/**
 * Chiude tutti gli elementi FAQ
 * @param {NodeList} faqItems - Lista di elementi FAQ
 */
function collapseAllFaqItems(faqItems) {
    faqItems.forEach(otherItem => {
        const otherQuestion = select('.faq-question', otherItem);
        const otherContent = select('.faq-content', otherItem);
        
        if (otherQuestion && otherContent) {
            otherItem.classList.remove('expanded');
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherContent.style.maxHeight = '0px';
            otherContent.style.paddingBottom = '0px';
        }
    });
}

/**
 * Espande un elemento FAQ
 * @param {Element} item - Elemento FAQ
 * @param {Element} question - Elemento della domanda
 * @param {Element} content - Elemento del contenuto
 */
function expandFaqItem(item, question, content) {
    item.classList.add('expanded');
    question.setAttribute('aria-expanded', 'true');
    
    // Calcolo preciso dell'altezza necessaria
    content.style.display = 'block';
    const height = content.scrollHeight;
    content.style.maxHeight = height + 'px';
    content.style.paddingBottom = '24px';
    
    // Aggiustamento dopo la transizione per evitare troncamenti
    setTimeout(() => {
        if (question.getAttribute('aria-expanded') === 'true') {
            // Ricalcolo dell'altezza una volta che il padding è applicato
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    }, 400); // Stesso tempo della transizione CSS
}

/**
 * Configura i filtri di categoria per le FAQ
 */
function setupCategoryFilters() {
    const faqCategoryBtns = selectAll('.faq-category-btn');
    const allFaqItems = selectAll('.faq-item');
    const faqGrid = select('.faq-grid');

    if (faqCategoryBtns.length > 0) {
        // Inizializza visibilità iniziale delle FAQ
        initializeFaqItems(allFaqItems);

        // Aggiungi event listener ai pulsanti di categoria
        faqCategoryBtns.forEach(btn => {
            on(btn, 'click', () => {
                const category = btn.dataset.category;
                
                // Gestisce la transizione tra categorie
                handleCategoryTransition(category, faqCategoryBtns, btn, allFaqItems, faqGrid);
            });
        });
    }
}

/**
 * Inizializza gli elementi FAQ con le proprietà CSS necessarie
 * @param {NodeList} allFaqItems - Tutti gli elementi FAQ
 */
function initializeFaqItems(allFaqItems) {
    allFaqItems.forEach(item => {
        item.style.opacity = '1';
        item.style.position = 'relative';
        item.style.transition = 'opacity 0.3s ease-in-out';
    });
}

/**
 * Gestisce la transizione tra categorie delle FAQ
 * @param {string} category - Categoria selezionata
 * @param {NodeList} faqCategoryBtns - Pulsanti delle categorie
 * @param {Element} activeBtn - Pulsante attivo
 * @param {NodeList} allFaqItems - Tutti gli elementi FAQ 
 * @param {Element} faqGrid - Container delle FAQ
 */
function handleCategoryTransition(category, faqCategoryBtns, activeBtn, allFaqItems, faqGrid) {
    // 1. Blocca l'altezza attuale per una transizione fluida
    const currentHeight = faqGrid.offsetHeight;
    faqGrid.style.height = `${currentHeight}px`;
    
    // 2. Aggiorna l'attivazione del pulsante
    faqCategoryBtns.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    
    // 3. Fase 1: Fade out - elementi da nascondere
    fadeOutNonMatchingItems(category, allFaqItems)
        .then(() => {
            // 4. Fase 2: Aggiorna visibilità degli elementi
            updateItemsVisibility(category, allFaqItems);
            
            // 5. Fase 3: Aggiorna altezza del container
            updateContainerHeight(faqGrid);
        });
}

/**
 * Nasconde con fade out gli elementi che non corrispondono alla categoria
 * @param {string} category - Categoria selezionata
 * @param {NodeList} allFaqItems - Tutti gli elementi FAQ
 * @returns {Promise} Promise che si risolve al termine del fade out
 */
function fadeOutNonMatchingItems(category, allFaqItems) {
    const fadeOutPromises = [];
    
    allFaqItems.forEach(item => {
        resetFaqItem(item);
        
        const shouldBeVisible = category === 'all' || item.dataset.category === category;
        
        // Nasconde gli elementi che non dovrebbero essere visibili
        if (!shouldBeVisible) {
            const fadeOutPromise = new Promise(resolve => {
                item.style.opacity = '0';
                setTimeout(resolve, 150);
            });
            fadeOutPromises.push(fadeOutPromise);
        }
    });
    
    return Promise.all(fadeOutPromises);
}

/**
 * Ripristina uno stato FAQ al suo stato chiuso
 * @param {Element} item - Elemento FAQ
 */
function resetFaqItem(item) {
    const question = select('.faq-question', item);
    const content = select('.faq-content', item);
    
    if (question && content) {
        item.classList.remove('expanded');
        question.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        content.style.paddingBottom = '0px';
        
        // Assicura che le proprietà siano applicate immediatamente
        content.style.transition = 'none';
        void content.offsetWidth; // Forza un reflow
        content.style.transition = '';
    }
}

/**
 * Aggiorna la visibilità degli elementi FAQ in base alla categoria selezionata
 * @param {string} category - Categoria selezionata
 * @param {NodeList} allFaqItems - Tutti gli elementi FAQ
 */
function updateItemsVisibility(category, allFaqItems) {
    allFaqItems.forEach(item => {
        const shouldBeVisible = category === 'all' || item.dataset.category === category;
        
        if (shouldBeVisible) {
            item.style.display = 'flex';
            item.style.position = 'relative';
            item.style.zIndex = '1';
            // Transizione asincrona per dare tempo al browser
            setTimeout(() => {
                item.style.opacity = '1';
            }, 10);
        } else {
            item.style.display = 'none';
            item.style.position = 'absolute';
            item.style.zIndex = '-1';
        }
    });
}

/**
 * Aggiorna l'altezza del container FAQ per adattarsi al contenuto filtrato
 * @param {Element} faqGrid - Container delle FAQ
 */
function updateContainerHeight(faqGrid) {
    setTimeout(() => {
        // Rilascia l'altezza con una transizione fluida
        faqGrid.style.transition = 'height 0.3s ease-in-out';
        faqGrid.style.height = '';
        
        // Rimuove la transizione dopo il completamento
        setTimeout(() => {
            faqGrid.style.transition = '';
        }, 350);
    }, 50);
}
