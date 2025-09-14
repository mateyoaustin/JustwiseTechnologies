document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
            }
        }, 500);
    });

    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');

    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }

    // --- STICKY NAVIGATION ---
    const navbar = document.querySelector('.sticky-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE DROPDOWN MENU ---
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && !dropdownToggle.contains(e.target)) {
                dropdownMenu.classList.remove('open');
            }
        });
        dropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => dropdownMenu.classList.remove('open'));
        });
    }

    // --- CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverables = document.querySelectorAll('a, button, .service-card, .stat-card, input, select, textarea');

    window.addEventListener('mousemove', (e) => {
        const { clientX: x, clientY: y } = e;
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        cursorOutline.style.left = `${x}px`;
        cursorOutline.style.top = `${y}px`;
    });

    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });

    // --- DYNAMIC TYPING EFFECT ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const words = ["Smart Business.", "Automation.", "Growth.", "Innovation."];
        let wordIndex = 0, charIndex = 0, isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            const typeSpeed = isDeleting ? 75 : 150;

            typingElement.textContent = isDeleting 
                ? currentWord.substring(0, charIndex--)
                : currentWord.substring(0, charIndex++);

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            setTimeout(type, typeSpeed);
        };
        type();
    }

    // --- HERO PARTICLES.JS BACKGROUND ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS('hero-particles', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 140, line_opacity: 1 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // --- DYNAMIC & REALISTIC STATS CALCULATION ---
    const updateStats = () => {
        const startDate = new Date('2023-01-01');
        const today = new Date();

        const monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
        const monthFraction = today.getDate() / 30; // Approximation of progress through the current month
        const effectiveMonths = monthsPassed + monthFraction;

        // Base numbers + monthly growth
        const devicesRepaired = Math.floor(20 + effectiveMonths * 10);
        const projectsCompleted = Math.floor(10 + effectiveMonths * 4);
        const supportCases = Math.floor(30 + effectiveMonths * 15);
        
        const totalWork = devicesRepaired + projectsCompleted + supportCases;
        // Client satisfaction rate between 85% and 95%
        const satisfactionRate = 0.85 + Math.random() * 0.10;
        const happyClients = Math.floor(totalWork * satisfactionRate);

        document.getElementById('clients-stat').dataset.target = happyClients;
        document.getElementById('devices-stat').dataset.target = devicesRepaired;
        document.getElementById('projects-stat').dataset.target = projectsCompleted;
        document.getElementById('support-stat').dataset.target = supportCases;
    };
    
    updateStats();

    // --- ANIMATE ON SCROLL (INTERSECTION OBSERVER) ---
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

    // --- STATS COUNTER ANIMATION ---
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                if (target === 0) return; // Don't animate if target is 0
                
                let current = 0;
                const increment = target / 100;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number').forEach(counter => statsObserver.observe(counter));

    // --- TESTIMONIALS SLIDER ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    const showSlide = (n) => {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === n) slide.classList.add('active');
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    };

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        setInterval(nextSlide, 7000); // Auto-slide every 7 seconds
        showSlide(currentSlide);
    }

    // --- CONTACT FORM HANDLING ---
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    if (form && formStatus) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;
            formStatus.style.display = 'block';
            formStatus.className = 'form-status';

            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1500));

            formStatus.textContent = 'Message sent! We will be in touch soon.';
            formStatus.classList.add('success');
            form.reset();

            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;

            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }

    // --- BACK TO TOP BUTTON ---
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // --- FOOTER YEAR ---
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

