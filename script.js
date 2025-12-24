// Parallax Effect for Feature Images
class ParallaxImages {
    constructor() {
        this.images = document.querySelectorAll('.feature-image img');
        this.init();
    }

    init() {
        if (this.images.length === 0) return;
        
        window.addEventListener('scroll', () => this.updateParallax(), { passive: true });
    }

    updateParallax() {
        this.images.forEach(img => {
            const rect = img.getBoundingClientRect();
            const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const offset = (scrollPercent - 0.5) * 20;
            img.style.transform = `translateY(${offset}px)`;
        });
    }
}

// Typewriter effect for hero heading (if present)
document.addEventListener('DOMContentLoaded', function () {
    const el = document.getElementById('typewriter-heading');
    if (!el) return;
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            setTimeout(type, 40);
        }
    }
    type();
});
// Scroll progress bar logic
window.addEventListener('scroll', function () {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = scrolled + '%';
});
// Advanced Justwise Technologies Homepage Enhancement
class JustwiseNav {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        this.focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        this.handleFocusTrap = this.handleFocusTrap.bind(this);
        this.init();
    }

    init() {
        this.setupHamburger();
        this.setupDropdowns();
        this.setupOutsideClick();
        this.setupKeyboardNavigation();
        this.setupActiveLinks();
    }

    setupHamburger() {
        this.hamburger?.addEventListener('click', (e) => {
            this.toggleMobileMenu();
            this.createParticles(e);
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

        if (isActive) {
            this.trapFocus();
        } else {
            this.releaseFocus();
        }
    }

    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        this.releaseFocus();
    }

    setupDropdowns() {
        this.dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = toggle.closest('.dropdown');
                const isCurrentlyOpen = dropdown.classList.contains('show');
                
                // Close all dropdowns first
                this.dropdowns.forEach(d => {
                    d.classList.remove('show');
                    d.querySelector('.dropdown-toggle')?.classList.remove('active');
                });
                
                // If this dropdown wasn't open, open it
                if (!isCurrentlyOpen) {
                    dropdown.classList.add('show');
                    toggle.classList.add('active');
                }
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
            // Close dropdowns only if clicking outside dropdown area
            if (!e.target.closest('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('show');
                    dropdown.querySelector('.dropdown-toggle')?.classList.remove('active');
                });
            }

            // Close mobile menu if clicking outside navbar
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

    setupActiveLinks() {
        const links = document.querySelectorAll('.nav-link, .nav-links-right .btn');
        links.forEach(link => {
            link.addEventListener('click', () => {
                links.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            });
        });
    }

    trapFocus() {
        const focusables = this.navLinks?.querySelectorAll(this.focusableSelector);
        if (!focusables || focusables.length === 0) return;

        this.focusables = Array.from(focusables);
        this.firstFocusable = this.focusables[0];
        this.lastFocusable = this.focusables[this.focusables.length - 1];

        document.addEventListener('keydown', this.handleFocusTrap);
        this.firstFocusable.focus();
    }

    releaseFocus() {
        document.removeEventListener('keydown', this.handleFocusTrap);
        this.firstFocusable = null;
        this.lastFocusable = null;
        if (this.hamburger) {
            this.hamburger.focus();
        }
    }

    handleFocusTrap(e) {
        if (e.key !== 'Tab' || !this.firstFocusable || !this.lastFocusable) return;

        if (e.shiftKey) {
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else {
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
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
                    
                    // Stagger child animations
                    const children = entry.target.querySelectorAll('.feature-text, .feature-image');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('in-view');
                        }, index * 150);
                    });
                    
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.sections.forEach(section => {
            section.classList.add('fade-in-section');
            
            // Add animation classes to children
            const textElements = section.querySelectorAll('.feature-text');
            const imageElements = section.querySelectorAll('.feature-image');
            
            textElements.forEach(el => el.classList.add('slide-in-left'));
            imageElements.forEach(el => el.classList.add('slide-in-right'));
            
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



// Back to Top with Progress
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        this.progressCircle = document.querySelector('.progress-ring__circle');
        this.radius = this.progressCircle?.r.baseVal.value || 22;
        this.circumference = 2 * Math.PI * this.radius;
        this.init();
    }

    init() {
        if (!this.button || !this.progressCircle) return;

        this.progressCircle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.progressCircle.style.strokeDashoffset = this.circumference;

        window.addEventListener('scroll', () => this.updateProgress());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    updateProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollTop > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }

        const offset = this.circumference - (scrollPercent / 100) * this.circumference;
        this.progressCircle.style.strokeDashoffset = offset;
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Toast Notification System
class ToastManager {
    constructor() {
        this.container = document.querySelector('.toast-container');
    }

    show(message, type = 'info', duration = 4000) {
        if (!this.container) return;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type]} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(toast);

        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.remove(toast));

        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }

        return toast;
    }

    remove(toast) {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }
}

// Initialize all modules

const toastManager = new ToastManager();

document.addEventListener('DOMContentLoaded', () => {

    new JustwiseNav();

    new ScrollAnimationManager();

    new SmoothScroller();

    new ParallaxEffect();

    new ButtonEffects();

    new BackToTop();

    new ParallaxImages();

    setupCapabilityTabs();

    // Add ripple effect to buttons
    setupRippleEffect();

    // Initialize image slider
    setupImageSlider();

    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('loaded');
        }
    });
});

// Capability tab switching for Tasker section
function setupCapabilityTabs() {
    const cards = document.querySelectorAll('.capability-card');
    cards.forEach(card => {
        const tabs = card.querySelectorAll('.capability-tab');
        const panels = card.querySelectorAll('.capability-panel');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('aria-controls');

                // toggle tab state
                tabs.forEach(t => {
                    const isActive = t === tab;
                    t.classList.toggle('is-active', isActive);
                    t.setAttribute('aria-selected', isActive);
                    t.setAttribute('tabindex', isActive ? '0' : '-1');
                });

                // toggle panels
                panels.forEach(panel => {
                    const shouldShow = panel.id === targetId;
                    if (shouldShow) {
                        panel.removeAttribute('hidden');
                        panel.classList.add('is-active');
                    } else {
                        panel.setAttribute('hidden', 'hidden');
                        panel.classList.remove('is-active');
                    }
                });
            });
        });
    });
}

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

            // Clean up after animation
            setTimeout(() => ripple.remove(), 650);
        });
    });
}
// Image Slider for Device Sales & Repairs
function setupImageSlider() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-image');
        const prevBtn = slider.querySelector('.slider-nav.prev');
        const nextBtn = slider.querySelector('.slider-nav.next');
        const dots = slider.querySelectorAll('.dot');
        let currentIndex = 0;
        let autoSlideInterval;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle('active', i === index);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            const next = (currentIndex + 1) % images.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentIndex - 1 + images.length) % images.length;
            showSlide(prev);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });

        // Pause on hover
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);

        // Start auto-slide
        startAutoSlide();
    });
}
