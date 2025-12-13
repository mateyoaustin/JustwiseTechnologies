// Advanced Justwise Technologies Homepage Enhancement
class JustwiseNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.init();
    }

    init() {
        this.setupHamburger();
        this.setupDropdowns();
        this.setupOutsideClick();
        this.setupKeyboardNavigation();
    }

    setupHamburger() {
        this.hamburger?.addEventListener('click', () => {
            this.toggleMobileMenu();
            this.createParticles(event);
        });
        
        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
    }

    toggleMobileMenu() {
        const isActive = this.navLinks.classList.toggle('active');
        this.hamburger.setAttribute('aria-expanded', isActive);
        this.hamburger.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
    }

    setupDropdowns() {
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                this.toggleDropdown(dropdown);
            });
        });
    }

    toggleDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const isShowing = dropdown.classList.toggle('show');
        toggle.classList.toggle('active', isShowing);

        // Close other dropdowns
        this.dropdowns.forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('show');
                d.querySelector('.dropdown-toggle')?.classList.remove('active');
            }
        });
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            // Close dropdowns
            if (!e.target.closest('.dropdown')) {
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                    dropdown.querySelector('.dropdown-toggle')?.classList.remove('active');
                });
            }

            // Close mobile menu
            if (!e.target.closest('.navbar')) {
                this.closeMobileMenu();
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                    dropdown.querySelector('.dropdown-toggle')?.classList.remove('active');
                });
            }
        });
    }

    createParticles(event) {
        const x = event.clientX;
        const y = event.clientY;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const angle = (Math.PI * 2 * i) / 6;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            particle.style.width = '8px';
            particle.style.height = '8px';
            particle.style.borderRadius = '50%';
            particle.style.background = 'linear-gradient(135deg, #404EED, #5865F2)';
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }
}

// Scroll Animation Manager
class ScrollAnimationManager {
    constructor() {
        this.sections = document.querySelectorAll('.feature-section');
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => {
            section.classList.add('fade-in-section');
            this.observer.observe(section);
        });
    }
}

// Smooth Scroll Handler
class SmoothScroller {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    this.smoothScroll(document.querySelector(href));
                }
            });
        });
    }

    smoothScroll(target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Theme Manager with LocalStorage
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('justwise-theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        document.addEventListener('themechange', (e) => {
            this.setTheme(e.detail.theme);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('justwise-theme', theme);
    }

    setTheme(theme) {
        this.theme = theme;
        this.applyTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// Performance Observer for lazy loading
class LazyLoadManager {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// Analytics and Performance Tracking
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                this.logPerformanceMetrics();
            });
        }
    }

    logPerformanceMetrics() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        // Track only in production
        if (process.env.NODE_ENV === 'production') {
            console.log(`Page load time: ${pageLoadTime}ms`);
        }
    }
}

// Parallax Scroll Effect
class ParallaxEffect {
    constructor() {
        this.init();
    }

    init() {
        const heroSection = document.querySelector('.hero');
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (heroSection) {
                heroSection.style.backgroundPosition = `0 ${scrollY * 0.5}px`;
            }
        });
    }
}

// Button Interaction Effects
class ButtonEffects {
    constructor() {
        this.init();
    }

    init() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createGlowEffect(btn);
            });
        });
    }

    createGlowEffect(element) {
        const clone = element.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.opacity = '0.3';
        clone.style.pointerEvents = 'none';
        element.parentElement.appendChild(clone);
        
        setTimeout(() => clone.remove(), 300);
    }
}

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    new JustwiseNav();
    new ScrollAnimationManager();
    new SmoothScroller();
    new ThemeManager();
    new LazyLoadManager();
    new PerformanceMonitor();
    new ParallaxEffect();
    new ButtonEffects();

    // Add ripple effect to buttons
    setupRippleEffect();

    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('loaded');
        }
    });
});

// Ripple Effect for Buttons
function setupRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .nav-link');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Remove existing ripples
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            this.appendChild(ripple);
        });
    });
}