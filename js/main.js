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
    
    // FAQ accordion functionality - improved version
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-content');
        
        if (question) {
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
                    }
                });
                
                // Then expand current item if it wasn't expanded before
                if (!isExpanded) {
                    item.classList.add('expanded');
                    question.setAttribute('aria-expanded', 'true');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });
    
    // FAQ category filtering
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    if (faqCategoryBtns.length > 0) {
        faqCategoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                faqCategoryBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                
                // Show/hide FAQ items based on category
                allFaqItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                        
                        // Collapse if expanded
                        if (item.classList.contains('expanded')) {
                            const question = item.querySelector('.faq-question');
                            const content = item.querySelector('.faq-content');
                            
                            item.classList.remove('expanded');
                            question.setAttribute('aria-expanded', 'false');
                            content.style.maxHeight = '0px';
                        }
                    }
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
