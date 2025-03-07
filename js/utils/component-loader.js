/**
 * Versione semplificata del component loader per migliorare le prestazioni
 */
const componentCache = new Map();

/**
 * Carica un componente HTML in modo semplice e veloce
 * @param {string} componentPath - Percorso del file componente
 * @param {string|Element} targetSelector - Selettore o elemento dove inserire il componente
 * @returns {Promise<Element|null>} Promise che si risolve con l'elemento target o null
 */
export async function loadComponent(componentPath, targetSelector) {
    try {
        const targetElement = typeof targetSelector === 'string' 
            ? document.querySelector(targetSelector) 
            : targetSelector;
            
        if (!targetElement) return null;
        
        // Usa la cache se disponibile
        let html;
        if (componentCache.has(componentPath)) {
            html = componentCache.get(componentPath);
        } else {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            html = await response.text();
            componentCache.set(componentPath, html);
        }
        
        // Inserisci il componente
        targetElement.innerHTML = html;
        
        // Esegui eventuali script nel componente
        executeScripts(targetElement);
        
        return targetElement;
    } catch (error) {
        console.error('Error loading component:', error);
        return null;
    }
}

/**
 * Esegue gli script all'interno di un elemento
 */
function executeScripts(element) {
    const scripts = element.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        newScript.textContent = oldScript.textContent;
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Carica componenti multipli
 */
export async function loadComponents(configs) {
    const promises = configs.map(config => 
        loadComponent(config.path, config.target)
    );
    return Promise.all(promises);
}

/**
 * Carica un componente in modo sincrono (per contenuti critici)
 * È preferibile usarlo nel <head> per contenuti essenziali
 */
export function includeComponentSync(componentPath, targetId) {
    document.write(`
        <div id="${targetId}">
            <script>
                (function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', '${componentPath}', false);
                    xhr.send();
                    if (xhr.status === 200) {
                        document.getElementById('${targetId}').innerHTML = xhr.responseText;
                    }
                })();
            </script>
        </div>
    `);
}
