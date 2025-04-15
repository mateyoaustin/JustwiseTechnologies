document.getElementById('currentYear').textContent = new Date().getFullYear();

const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = 1;
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.service-card, .product-card').forEach((el) => observer.observe(el));

const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownLinks = document.querySelectorAll('.dropdown-menu a');

dropdownToggle.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
});

dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
        dropdownMenu.classList.remove('open');
    });
});

document.addEventListener('click', (event) => {
    if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('open');
    }
});

const form = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

// Ensure form and formStatus exist before adding the event listener
if (form && formStatus) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        formStatus.textContent = 'Please wait...';
        formStatus.classList.remove('success', 'error');

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
            });

            if (response.ok) {
                formStatus.textContent = 'Thank you for your submission!';
                formStatus.classList.add('success');
                form.reset();
            } else {
                const errorText = await response.text();
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was an error submitting your form. Please try again.';
            formStatus.classList.add('error');
        }
    });
}
