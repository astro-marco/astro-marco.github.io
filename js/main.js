document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Toggle visibility of nav links
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'var(--white)';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            } else {
                navLinks.style.display = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    navLinks.style.display = '';
                }
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight active navigation section based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a');
    
    function highlightNavItem() {
        const scrollPosition = window.scrollY + 100; // Add offset for navbar
        
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
    }
    
    // Add scroll event for nav highlighting
    window.addEventListener('scroll', highlightNavItem);
    
    // FAQ accordion functionality - migliorato per risolvere il bug dell'esplosione simultanea
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-content');
        
        if (question && content) {
            // Set initial state
            content.style.maxHeight = '0px';
            question.setAttribute('aria-expanded', 'false');
            
            question.addEventListener('click', () => {
                // Check if current item is expanded
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                // First collapse all items
                faqItems.forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherContent = otherItem.querySelector('.faq-content');
                    
                    if (otherQuestion && otherContent) {
                        otherItem.classList.remove('expanded');
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherContent.style.maxHeight = '0px';
                        otherContent.style.paddingBottom = '0px';
                    }
                });
                
                // Then expand current item if it wasn't expanded before
                if (!isExpanded) {
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
                            // Ricalcolo l'altezza una volta che il padding è applicato
                            content.style.maxHeight = content.scrollHeight + 'px';
                        }
                    }, 400); // Stesso tempo della transizione CSS
                }
            });
        }
    });
    
    // FAQ category filtering - completamente riscritto per eliminare il glitch visivo
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const allFaqItems = document.querySelectorAll('.faq-item');
    const faqGrid = document.querySelector('.faq-grid');

    if (faqCategoryBtns.length > 0) {
        // Funzione per ripristinare completamente una FAQ al suo stato chiuso
        const resetFaqItem = (item) => {
            const question = item.querySelector('.faq-question');
            const content = item.querySelector('.faq-content');
            
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
        };

        // Inizializza visibilità iniziale delle FAQ
        allFaqItems.forEach(item => {
            item.style.opacity = '1';
            item.style.position = 'relative';
            item.style.transition = 'opacity 0.3s ease-in-out';
        });

        faqCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // 1. Prepariamo la transizione bloccando l'altezza attuale
                const currentHeight = faqGrid.offsetHeight;
                faqGrid.style.height = `${currentHeight}px`;
                
                // 2. Aggiorniamo l'attivazione del pulsante
                faqCategoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 3. Fase 1: Fade out - rendiamo invisibili tutte le FAQ
                const fadeOutPromises = [];
                
                allFaqItems.forEach(item => {
                    resetFaqItem(item);
                    
                    const shouldBeVisible = category === 'all' || item.dataset.category === category;
                    
                    // Manteniamo in DOM tutti gli elementi ma con opacità 0 quelli da nascondere
                    if (!shouldBeVisible) {
                        const fadeOutPromise = new Promise(resolve => {
                            item.style.opacity = '0';
                            setTimeout(resolve, 150); // Metà del tempo di transizione per un effetto più veloce
                        });
                        fadeOutPromises.push(fadeOutPromise);
                    }
                });
                
                // 4. Attendiamo il completamento del fade out prima di procedere
                Promise.all(fadeOutPromises)
                    .then(() => {
                        // 5. Fase 2: Nascondiamo fisicamente gli elementi non necessari e riportiamo a 1 l'opacità degli altri
                        allFaqItems.forEach(item => {
                            const shouldBeVisible = category === 'all' || item.dataset.category === category;
                            
                            if (shouldBeVisible) {
                                item.style.display = 'flex';
                                item.style.position = 'relative';
                                item.style.zIndex = '1';
                                // Riportiamo l'opacità a 1 dopo averli mostrati
                                // Facciamo una transizione asincrona per dare tempo al browser di processare il display change
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                }, 10);
                            } else {
                                // Nascondiamo fisicamente gli elementi non necessari
                                item.style.display = 'none';
                                item.style.position = 'absolute';
                                item.style.zIndex = '-1';
                            }
                        });
                        
                        // 6. Calcoliamo la nuova altezza precisa con una transizione fluida
                        setTimeout(() => {
                            // Rilasciamo l'altezza con una transizione fluida
                            faqGrid.style.transition = 'height 0.3s ease-in-out';
                            faqGrid.style.height = '';
                            
                            // Rimuoviamo la transizione dopo il completamento
                            setTimeout(() => {
                                faqGrid.style.transition = '';
                            }, 350);
                        }, 50); // Un piccolo ritardo per dare il tempo al browser di processare le modifiche DOM
                    });
            });
        });
    }
    
    // Add animation on scroll for elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .use-case, .security-feature');
    
    const animateOnScroll = function() {
        elementsToAnimate.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If element is in viewport
            if (elementPosition < windowHeight * 0.85) {
                element.classList.add('visible');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Add animation classes to CSS elements
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
    
    // Helper for dark/light mode toggle if needed
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setupThemeToggle() {
        // Check if theme toggle exists
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Set initial state
            if (localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
                document.body.classList.add('dark-mode');
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else {
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            }
            
            // Add event listener
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                
                // Update localStorage
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('theme', 'dark');
                    themeToggle.setAttribute('aria-label', 'Switch to light mode');
                } else {
                    localStorage.setItem('theme', 'light');
                    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                }
            });
        }
    }
    
    // Initialize theme toggle if exists
    setupThemeToggle();
    
    // Demo functionality (if demo section exists)
    const demoLink = document.querySelector('a[href="#demo"]');
    const demoSection = document.querySelector('#demo');
    
    if (demoLink && !demoSection) {
        demoLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Interactive demo coming soon! Please check back later.');
        });
    }
});
