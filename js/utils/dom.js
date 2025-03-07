/**
 * Seleziona un elemento dal DOM
 * @param {string} selector - Selettore CSS
 * @param {Element} [parent=document] - Elemento parent da cui partire per la selezione
 * @returns {Element|null} Elemento selezionato o null
 */
export const select = (selector, parent = document) => {
    return parent.querySelector(selector);
};

/**
 * Seleziona tutti gli elementi che corrispondono a un selettore
 * @param {string} selector - Selettore CSS
 * @param {Element} [parent=document] - Elemento parent da cui partire per la selezione
 * @returns {NodeList} Lista di elementi selezionati
 */
export const selectAll = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
};

/**
 * Aggiunge un event listener a un elemento
 * @param {Element} element - Elemento a cui aggiungere l'evento
 * @param {string} event - Nome dell'evento
 * @param {Function} callback - Funzione da eseguire all'evento
 */
export const on = (element, event, callback) => {
    if (element) {
        element.addEventListener(event, callback);
    }
};

/**
 * Crea un elemento DOM con attributi e children opzionali
 * @param {string} tag - Tag dell'elemento
 * @param {Object} [attributes={}] - Attributi dell'elemento
 * @param {Array|Element|string} [children] - Children dell'elemento
 * @returns {Element} Elemento creato
 */
export const createElement = (tag, attributes = {}, children) => {
    const element = document.createElement(tag);
    
    // Imposta gli attributi
    Object.keys(attributes).forEach(key => {
        if (key === 'classList' && Array.isArray(attributes[key])) {
            element.classList.add(...attributes[key]);
        } else if (key === 'textContent') {
            element.textContent = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    // Aggiunge i children
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            });
        } else if (typeof children === 'string') {
            element.appendChild(document.createTextNode(children));
        } else if (children instanceof Element) {
            element.appendChild(children);
        }
    }
    
    return element;
};
