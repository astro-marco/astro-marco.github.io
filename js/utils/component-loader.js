/**
 * ComponentLoader - Gestore centralizzato per il caricamento dei componenti UI
 */
class ComponentLoader {
  constructor() {
    this.cache = new Map(); // Cache dei componenti già caricati
    this.pendingLoads = new Map(); // Promise di caricamenti in corso
    this.loadedComponents = new Set(); // Componenti già inseriti nel DOM
  }

  /**
   * Carica un componente in modo asincrono
   * @param {string} path - Percorso del componente HTML
   * @param {string|Element} targetSelector - Selettore o elemento DOM dove inserire il componente
   * @param {Object} options - Opzioni di configurazione
   * @returns {Promise<Element>} - Promise che si risolve con l'elemento target
   */
  async load(path, targetSelector, options = {}) {
    const {
      cache = true, // Usa la cache?
      mode = 'replace', // replace | append | prepend
      runScripts = true, // Esegui gli script nel componente?
      beforeInsert = null, // Callback prima dell'inserimento
      afterInsert = null, // Callback dopo l'inserimento
      errorFallback = null // HTML da mostrare in caso di errore
    } = options;

    try {
      // Ottieni l'elemento target
      const targetElement = typeof targetSelector === 'string'
        ? document.querySelector(targetSelector)
        : targetSelector;

      if (!targetElement) {
        throw new Error(`Target element not found: ${targetSelector}`);
      }

      // Carica il contenuto HTML
      const html = await this._fetchComponent(path, cache);
      
      // Prepara e inserisci il contenuto
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;
      
      // Esegui callback prima dell'inserimento
      if (beforeInsert && typeof beforeInsert === 'function') {
        await beforeInsert(tempContainer, targetElement);
      }
      
      // Inserisci il contenuto in base alla modalità
      if (mode === 'replace') {
        targetElement.innerHTML = '';
        while (tempContainer.firstChild) {
          targetElement.appendChild(tempContainer.firstChild);
        }
      } else if (mode === 'append') {
        while (tempContainer.firstChild) {
          targetElement.appendChild(tempContainer.firstChild);
        }
      } else if (mode === 'prepend') {
        while (tempContainer.lastChild) {
          targetElement.prepend(tempContainer.lastChild);
        }
      }
      
      // Esegui gli script se richiesto
      if (runScripts) {
        this._executeScripts(targetElement);
      }
      
      // Esegui callback dopo l'inserimento
      if (afterInsert && typeof afterInsert === 'function') {
        await afterInsert(targetElement);
      }
      
      // Segna come caricato
      this.loadedComponents.add(path);
      
      return targetElement;
    } catch (error) {
      console.error(`Failed to load component ${path}:`, error);
      
      if (errorFallback) {
        const targetElement = typeof targetSelector === 'string'
          ? document.querySelector(targetSelector)
          : targetSelector;
          
        if (targetElement) {
          if (typeof errorFallback === 'function') {
            targetElement.innerHTML = errorFallback(path, error);
          } else {
            targetElement.innerHTML = errorFallback;
          }
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Carica un componente in modo sincrono (solo per componenti critici)
   * @param {string} path - Percorso del componente HTML
   * @param {string} targetId - ID dell'elemento DOM dove inserire il componente
   * @returns {void}
   */
  loadSync(path, targetId) {
    // Questa è una versione per retrocompatibilità che genera codice da inserire direttamente nell'HTML
    return `
      <div id="${targetId}">
        <script>
          (function() {
            console.warn('Synchronous component loading is deprecated. Use ComponentLoader.load() instead.');
            try {
              var xhr = new XMLHttpRequest();
              xhr.open('GET', '${path}', false);
              xhr.send();
              if (xhr.status === 200) {
                document.getElementById('${targetId}').innerHTML = xhr.responseText;
                
                // Esegui gli script
                var scripts = document.getElementById('${targetId}').getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {
                  eval(scripts[i].textContent);
                }
              } else {
                throw new Error('Failed to load component: ' + xhr.status);
              }
            } catch (error) {
              console.error('Error loading component ${path}:', error);
              document.getElementById('${targetId}').innerHTML = 
                '<div class="component-error">Failed to load component. <button onclick="window.location.reload()">Retry</button></div>';
            }
          })();
        </script>
      </div>
    `;
  }
  
  /**
   * Precarica un componente senza inserirlo nel DOM
   * @param {string} path - Percorso del componente
   * @returns {Promise<string>} - Promise con l'HTML del componente
   */
  preload(path) {
    return this._fetchComponent(path, true);
  }
  
  /**
   * Recupera un componente HTML con cache
   * @private
   */
  async _fetchComponent(path, useCache = true) {
    // Se c'è già una richiesta pendente per questo componente, ritorna quella
    if (this.pendingLoads.has(path)) {
      return this.pendingLoads.get(path);
    }
    
    // Se il componente è in cache e useCache è true, usa la cache
    if (useCache && this.cache.has(path)) {
      return this.cache.get(path);
    }
    
    // Altrimenti, carica il componente
    try {
      const loadPromise = fetch(path)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
          }
          return response.text();
        })
        .then(html => {
          // Memorizza in cache
          if (useCache) {
            this.cache.set(path, html);
          }
          
          // Rimuovi da pendingLoads
          this.pendingLoads.delete(path);
          
          return html;
        })
        .catch(error => {
          this.pendingLoads.delete(path);
          throw error;
        });
      
      // Registra la promise pendente
      this.pendingLoads.set(path, loadPromise);
      
      return loadPromise;
    } catch (error) {
      this.pendingLoads.delete(path);
      throw error;
    }
  }
  
  /**
   * Esegue gli script contenuti in un elemento
   * @private
   */
  _executeScripts(element) {
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
   * Cancella la cache dei componenti
   */
  clearCache() {
    this.cache.clear();
  }
  
  /**
   * Verifica se un componente è stato caricato
   */
  isLoaded(path) {
    return this.loadedComponents.has(path);
  }
  
  /**
   * Aggiorna un componente già caricato
   */
  async reload(path, targetSelector) {
    // Rimuovi dalla cache per forzare un ricaricamento
    this.cache.delete(path);
    // Carica nuovamente il componente
    return this.load(path, targetSelector, { cache: false });
  }
}

// Esporta un'istanza singleton
export const componentLoader = new ComponentLoader();

// Funzione di utilità per compatibilità
export function loadComponent(path, targetSelector, options) {
  return componentLoader.load(path, targetSelector, options);
}
