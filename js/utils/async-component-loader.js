/**
 * Component Loader ottimizzato per le performance
 */
class AsyncComponentLoader {
  constructor() {
    this.cache = new Map();
    this.loadPromises = new Map();
    this.priorityQueue = [];
    this.lowPriorityQueue = [];
    this.intersectionObserver = null;
    this.isIdle = false;
    
    // Inizializzazione
    this.setupIntersectionObserver();
    this.setupIdleCallback();
  }
  
  /**
   * Configura l'observer per il lazy loading
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const path = target.dataset.componentPath;
            
            if (path) {
              // Carica il componente quando visibile
              this.load(path, target)
                .then(() => {
                  // Smetti di osservare una volta caricato
                  this.intersectionObserver.unobserve(target);
                  delete target.dataset.componentPath;
                })
                .catch(err => console.error(`Failed to lazy load component: ${path}`, err));
            }
          }
        });
      }, {
        rootMargin: '200px', // Precarica quando l'elemento è a 200px dalla viewport
        threshold: 0
      });
    }
  }
  
  /**
   * Configura callback per tempo di inattività
   */
  setupIdleCallback() {
    if ('requestIdleCallback' in window) {
      const processLowPriorityQueue = (deadline) => {
        while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.lowPriorityQueue.length > 0) {
          const { path, targetEl, options } = this.lowPriorityQueue.shift();
          this.fetch(path).catch(err => console.warn(`Failed to preload: ${path}`, err));
        }
        
        if (this.lowPriorityQueue.length > 0) {
          requestIdleCallback(processLowPriorityQueue, { timeout: 2000 });
        }
      };
      
      // Inizia a processare la coda quando il browser è inattivo
      requestIdleCallback(processLowPriorityQueue, { timeout: 2000 });
    }
  }
  
  /**
   * Carica un componente in modo asincrono
   */
  async load(path, targetEl, options = {}) {
    try {
      const html = await this.fetch(path);
      
      if (!targetEl) {
        if (typeof options.selector === 'string') {
          targetEl = document.querySelector(options.selector);
        }
        
        if (!targetEl) {
          throw new Error(`Target element not found for ${path}`);
        }
      }
      
      const fragment = document.createRange().createContextualFragment(html);
      
      // Gestisci le immagini prima dell'inserimento per evitare CLS
      this.prepareImages(fragment);
      
      // Gestisci inserimento
      if (options.mode === 'append') {
        targetEl.appendChild(fragment);
      } else if (options.mode === 'prepend') {
        targetEl.prepend(fragment);
      } else {
        // Default: replace
        targetEl.innerHTML = '';
        targetEl.appendChild(fragment);
      }
      
      // Esegui script dopo l'inserimento
      if (options.runScripts !== false) {
        this.executeScripts(targetEl);
      }
      
      // Callback post-inserimento
      if (typeof options.afterInsert === 'function') {
        options.afterInsert(targetEl);
      }
      
      return targetEl;
    } catch (error) {
      console.error(`Error loading component ${path}:`, error);
      
      // Fallback in caso di errore
      if (targetEl && options.errorTemplate) {
        targetEl.innerHTML = typeof options.errorTemplate === 'function' 
          ? options.errorTemplate(path, error) 
          : options.errorTemplate;
      } else if (targetEl && path.includes('footer.html')) {
        // Fallback specifico per il footer
        console.warn('Using basic footer fallback');
        targetEl.innerHTML = `
          <footer>
            <div class="footer-container">
              <div class="footer-bottom">
                <p>&copy; 2025 IgeA</p>
              </div>
            </div>
          </footer>
        `;
      }
      
      throw error;
    }
  }
  
  /**
   * Prepara le immagini per evitare layout shift
   */
  prepareImages(fragment) {
    const images = fragment.querySelectorAll('img:not([width]):not([height])');
    images.forEach(img => {
      // Imposta dimensioni predefinite per evitare CLS
      if (!img.width && !img.height) {
        img.style.aspectRatio = '16/9';
        img.style.width = '100%';
        img.style.height = 'auto';
      }
      
      // Imposta lazy loading se non in viewport
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Aggiungi decoding async
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }
  
  /**
   * Carica un componente da osservare per lazy loading
   */
  lazyLoad(path, targetEl) {
    if (!this.intersectionObserver || !targetEl) return;
    
    // Imposta un placeholder e osserva l'elemento
    targetEl.dataset.componentPath = path;
    this.intersectionObserver.observe(targetEl);
    
    // Aggiungi un placeholder visuale
    targetEl.innerHTML = `
      <div class="component-placeholder" style="min-height:100px;background:#f5f5f5;border-radius:6px;display:flex;align-items:center;justify-content:center">
        <div style="width:20px;height:20px;border-radius:50%;border:2px solid #ccc;border-top-color:#3498db;animation:spin 1s linear infinite"></div>
      </div>
      <style>@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}</style>
    `;
    
    return targetEl;
  }
  
  /**
   * Carica componenti con priorità
   */
  prioritize(path) {
    this.priorityQueue.push(path);
    
    // Precarica immediatamente componenti prioritari
    setTimeout(() => {
      this.fetch(path).catch(err => console.warn(`Failed to preload priority component: ${path}`));
    }, 0);
  }
  
  /**
   * Carica componenti a bassa priorità quando il browser è inattivo
   */
  preload(path) {
    this.lowPriorityQueue.push({ path });
  }
  
  /**
   * Recupera un componente (con gestione cache)
   */
  async fetch(path) {
    // Correggi il percorso se necessario
    if (path.startsWith('/') && !path.startsWith('//')) {
      // Mantieni il percorso assoluto dalla root del sito
      path = path;
    }

    console.log(`Tentativo di fetch per: ${path}`);
    
    // Usa la cache se disponibile
    if (this.cache.has(path)) {
      console.log(`Utilizzando versione cached per: ${path}`);
      return this.cache.get(path);
    }
    
    // Riutilizza promise esistente se già in caricamento
    if (this.loadPromises.has(path)) {
      console.log(`Riutilizzo richiesta esistente per: ${path}`);
      return this.loadPromises.get(path);
    }
    
    // Inizia un nuovo caricamento
    console.log(`Avvio nuovo fetch per: ${path}`);
    const loadPromise = fetch(path, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Accept': 'text/html'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load ${path}: ${response.status}`);
      }
      console.log(`Risposta ricevuta per: ${path} (${response.status})`);
      return response.text();
    })
    .then(html => {
      // Salva nella cache
      console.log(`HTML ricevuto per ${path}, lunghezza: ${html.length} caratteri`);
      this.cache.set(path, html);
      this.loadPromises.delete(path);
      return html;
    })
    .catch(error => {
      console.error(`Errore durante il fetch di ${path}:`, error);
      this.loadPromises.delete(path);
      throw error;
    });
    
    // Memorizza la promise per riuso
    this.loadPromises.set(path, loadPromise);
    return loadPromise;
  }
  
  /**
   * Esegui gli script in un componente
   */
  executeScripts(container) {
    // Usa DocumentFragment per evitare reflow multipli
    const fragment = document.createDocumentFragment();
    const scripts = container.querySelectorAll('script');
    
    scripts.forEach(oldScript => {
      const newScript = document.createElement('script');
      
      // Copia attributi
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copia contenuto
      newScript.textContent = oldScript.textContent;
      fragment.appendChild(newScript);
      
      // Rimuovi vecchio script
      if (oldScript.parentNode) {
        oldScript.parentNode.removeChild(oldScript);
      }
    });
    
    // Aggiungi tutti gli script con un solo reflow
    container.appendChild(fragment);
  }
}

// Esporta un'istanza singleton
export const componentLoader = new AsyncComponentLoader();

// Inizializza componenti critici
document.addEventListener('DOMContentLoaded', () => {
  // Priorità ai componenti visibili
  componentLoader.prioritize('/components/header.html');
  componentLoader.prioritize('/components/footer.html');
  
  // Altri componenti con priorità inferiore
  componentLoader.preload('/components/sidebar.html');
  componentLoader.preload('/components/modals.html');
});
