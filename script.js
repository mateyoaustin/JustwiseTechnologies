/**
 * 3D Technology Background
 * GPU-accelerated 3D geometric animation with depth
 * Respects prefers-reduced-motion and adapts to viewport
 */
class AnimatedBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.particles = [];
        this.nodes = [];
        this.animationId = null;
        this.time = 0;
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, z: 0 };
        
        // Check if user prefers reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createNodes();
        
        if (!this.prefersReducedMotion) {
            this.animate();
            this.setupMouseInteraction();
        } else {
            // Static high-quality background for accessibility
            this.renderStatic();
        }

        // Handle resize with debounce for performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 150);
        }, { passive: true });

        // Handle visibility change to pause when tab not active
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else if (!this.prefersReducedMotion) {
                this.resume();
            }
        });
    }

    setupMouseInteraction() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }, { passive: true });
    }

    setupCanvas() {
        // Set canvas to viewport size with device pixel ratio for crisp rendering
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Set display size
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    createNodes() {
        const nodeCount = window.innerWidth < 768 ? 40 : 80;
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                z: Math.random() * 1000 - 500,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                connections: []
            });
        }
    }

    project3D(x, y, z) {
        // Simple 3D projection
        const perspective = 800;
        const scale = perspective / (perspective + z);
        return {
            x: x * scale + window.innerWidth / 2 * (1 - scale),
            y: y * scale + window.innerHeight / 2 * (1 - scale),
            scale: scale
        };
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, '#0D1B2A');
        gradient.addColorStop(0.5, '#192A56');
        gradient.addColorStop(1, '#0D1B2A');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Update nodes
        this.nodes.forEach((node, i) => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            node.z += node.vz;

            // Wrap around screen edges with depth
            if (node.x < -100) node.x = window.innerWidth + 100;
            if (node.x > window.innerWidth + 100) node.x = -100;
            if (node.y < -100) node.y = window.innerHeight + 100;
            if (node.y > window.innerHeight + 100) node.y = -100;
            if (node.z < -500) node.z = 500;
            if (node.z > 500) node.z = -500;

            // Mouse interaction in 3D space
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
                const force = (200 - distance) / 200 * 0.5;
                node.vx += dx * force * 0.01;
                node.vy += dy * force * 0.01;
            }

            // Damping
            node.vx *= 0.99;
            node.vy *= 0.99;
        });

        // Draw connections between close nodes
        this.drawConnections();

        // Draw nodes
        this.drawNodes();

        // Draw floating geometric shapes
        this.drawGeometricShapes();
    }

    drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const dz = this.nodes[i].z - this.nodes[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    const avgZ = (this.nodes[i].z + this.nodes[j].z) / 2;
                    const proj1 = this.project3D(this.nodes[i].x, this.nodes[i].y, this.nodes[i].z);
                    const proj2 = this.project3D(this.nodes[j].x, this.nodes[j].y, this.nodes[j].z);

                    this.ctx.strokeStyle = `rgba(0, 191, 255, ${opacity})`;
                    this.ctx.lineWidth = 1 * Math.max(proj1.scale, proj2.scale);
                    this.ctx.beginPath();
                    this.ctx.moveTo(proj1.x, proj1.y);
                    this.ctx.lineTo(proj2.x, proj2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawNodes() {
        this.nodes.forEach(node => {
            const proj = this.project3D(node.x, node.y, node.z);
            
            if (proj.scale > 0) {
                const size = node.size * proj.scale * 2;
                const alpha = Math.max(0.3, proj.scale);

                // Draw node with glow
                const gradient = this.ctx.createRadialGradient(
                    proj.x, proj.y, 0,
                    proj.x, proj.y, size * 3
                );
                gradient.addColorStop(0, `rgba(255, 193, 7, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(255, 193, 7, ${alpha * 0.3})`);
                gradient.addColorStop(1, 'rgba(255, 193, 7, 0)');

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(proj.x, proj.y, size * 3, 0, Math.PI * 2);
                this.ctx.fill();

                // Draw core
                this.ctx.fillStyle = `rgba(255, 193, 7, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
    }

    drawGeometricShapes() {
        const shapeCount = 3;
        
        for (let i = 0; i < shapeCount; i++) {
            const x = window.innerWidth * (0.2 + i * 0.3);
            const y = window.innerHeight * 0.5 + Math.sin(this.time * 0.5 + i) * 100;
            const z = Math.sin(this.time * 0.3 + i * 2) * 300;
            const proj = this.project3D(x, y, z);
            
            const size = 40 * proj.scale;
            const rotation = this.time + i * Math.PI / 3;

            this.ctx.save();
            this.ctx.translate(proj.x, proj.y);
            this.ctx.rotate(rotation);

            // Draw hexagon
            this.ctx.strokeStyle = `rgba(0, 191, 255, ${0.3 * proj.scale})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI / 3) * j;
                const hx = Math.cos(angle) * size;
                const hy = Math.sin(angle) * size;
                if (j === 0) this.ctx.moveTo(hx, hy);
                else this.ctx.lineTo(hx, hy);
            }
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    renderStatic() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, '#0D1B2A');
        gradient.addColorStop(0.5, '#192A56');
        gradient.addColorStop(1, '#0D1B2A');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    handleResize() {
        this.setupCanvas();
        
        // Recreate nodes for new screen size
        this.createNodes();

        if (this.prefersReducedMotion) {
            this.renderStatic();
        }
    }

    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId && !this.prefersReducedMotion) {
            this.animate();
        }
    }

    destroy() {
        this.pause();
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize animated background
document.addEventListener('DOMContentLoaded', () => {
    new AnimatedBackground();
});

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
        let hoverTimeout;
        const HOVER_DELAY = 150; // ms delay before showing dropdown
        const HOVER_EXIT_DELAY = 300; // ms delay before hiding dropdown
        
        this.dropdownToggles.forEach(toggle => {
            const dropdown = toggle.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            const menuItems = menu?.querySelectorAll('.dropdown-item');
            
            // Click handler for mobile/toggle
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isCurrentlyOpen = dropdown.classList.contains('show');
                
                // Close all dropdowns first
                this.closeAllDropdowns();
                
                // If this dropdown wasn't open, open it
                if (!isCurrentlyOpen) {
                    this.openDropdown(dropdown);
                }
            });
            
            // Desktop hover behavior with delay
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.openDropdown(dropdown);
                }, HOVER_DELAY);
            });
            
            dropdown.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.closeDropdown(dropdown);
                }, HOVER_EXIT_DELAY);
            });
            
            // Keyboard navigation for dropdown items
            menuItems?.forEach((item, index) => {
                item.addEventListener('keydown', (e) => {
                    this.handleDropdownKeyboard(e, menuItems, index, dropdown);
                });
            });
            
            // Focus management
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.openDropdown(dropdown);
                    // Focus first item
                    setTimeout(() => {
                        menuItems?.[0]?.focus();
                    }, 50);
                }
            });
        });
    }
    
    openDropdown(dropdown) {
        // Close all other dropdowns with animation first
        const otherDropdowns = Array.from(this.dropdowns).filter(d => d !== dropdown && d.classList.contains('show'));
        
        if (otherDropdowns.length > 0) {
            // Add closing animation
            otherDropdowns.forEach(d => {
                d.classList.add('closing');
            });
            
            // Wait for closing animation before opening new one
            setTimeout(() => {
                otherDropdowns.forEach(d => {
                    this.closeDropdown(d);
                    d.classList.remove('closing');
                });
                
                // Now open the new dropdown
                this.showDropdown(dropdown);
            }, 200);
        } else {
            // No other dropdowns open, show immediately
            this.showDropdown(dropdown);
        }
    }
    
    showDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.add('show');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'false');
        }
    }
    
    closeDropdown(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        dropdown.classList.remove('show');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }
    }
    
    closeAllDropdowns() {
        this.dropdowns.forEach(d => this.closeDropdown(d));
    }
    
    handleDropdownKeyboard(e, items, currentIndex, dropdown) {
        let handled = false;
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
                handled = true;
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                items[prevIndex]?.focus();
                handled = true;
                break;
                
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                handled = true;
                break;
                
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                handled = true;
                break;
                
            case 'Escape':
                e.preventDefault();
                this.closeDropdown(dropdown);
                dropdown.querySelector('.dropdown-toggle')?.focus();
                handled = true;
                break;
                
            case 'Tab':
                // Allow natural tab behavior but close dropdown
                if (!e.shiftKey && currentIndex === items.length - 1) {
                    this.closeDropdown(dropdown);
                } else if (e.shiftKey && currentIndex === 0) {
                    this.closeDropdown(dropdown);
                }
                break;
        }
        
        return handled;
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
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
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
                this.closeAllDropdowns();
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
