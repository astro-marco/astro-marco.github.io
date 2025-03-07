// Importa il nuovo component loader
import { componentLoader } from './utils/async-component-loader.js';

/**
 * Funzione di inizializzazione ottimizzata per performance
 */
async function initApp() {
  // Avvia subito funzionalità critiche indipendenti dal DOM
  initCriticalFeatures();
  
  // Carica componenti dinamici non critici
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadNonCriticalComponents(), { timeout: 1000 });
  } else {
    setTimeout(() => loadNonCriticalComponents(), 500);
  }
  
  // Carica moduli funzionali necessari
  // Divisi in base alla priorità
  try {
    const [navigationModule] = await Promise.all([
      import(/* webpackChunkName: "navigation" */ './modules/navigation.js')
    ]);
    navigationModule.setupNavigation();
  } catch (err) {
    console.warn('Failed to load critical modules:', err);
  }
}

/**
 * Carica moduli critici che devono funzionare immediatamente
 */
function initCriticalFeatures() {
  // Rileva OS per il pulsante di download
  import('./modules/download.js')
    .then(module => module.setupDownloadButtons())
    .catch(err => console.warn('Download module failed:', err));
}

/**
 * Carica componenti e script non critici in modo lazy
 */
function loadNonCriticalComponents() {
  // Impostazione osservatori per elementi che entrano nella viewport
  setupIntersectionObservers();
  
  // Precarica componenti che potrebbero essere necessari presto
  // ma non sono immediatamente visibili
  componentLoader.preload('/components/modals.html');
  
  // Moduli non critici che possono essere caricati dopo
  Promise.all([
    import('./modules/animations.js').then(m => m.setupAnimations()),
    loadFaqWhenVisible()
  ]).catch(err => console.warn('Failed to load non-critical modules:', err));
}

/**
 * Carica FAQ solo quando la sezione FAQ è visibile
 */
function loadFaqWhenVisible() {
  const faqSection = document.getElementById('faq');
  
  if (!faqSection) return Promise.resolve();
  
  return new Promise(resolve => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        import('./modules/faq.js')
          .then(module => {
            module.setupFAQ();
            resolve(module);
          })
          .catch(err => {
            console.warn('FAQ module failed:', err);
            resolve(null);
          });
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    
    observer.observe(faqSection);
  });
}

/**
 * Configura osservatori per elementi nella viewport
 */
function setupIntersectionObservers() {
  // Imposta lazy loading per immagini sotto la fold
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imgObserver.unobserve(img);
          }
        }
      });
    }, { rootMargin: '200px' });
    
    // Osserva tutte le immagini con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imgObserver.observe(img);
    });
  }
}

// Avvia l'applicazione al caricamento del DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
