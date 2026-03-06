// Entrance animation handling
document.addEventListener('DOMContentLoaded', function() {
    // Hide entrance screen after animation
    setTimeout(function() {
        const entranceScreen = document.getElementById('entranceScreen');
        if (entranceScreen) {
            entranceScreen.style.display = 'none';
        }
    }, 4300);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Show immediate visual feedback, then allow normal form submit.
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            const formStatus = document.getElementById('formStatus');
            const submitButton = contactForm.querySelector('button[type="submit"]');

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Lahetetaan...';
            }

            if (formStatus) {
                formStatus.textContent = 'Lahetetaan viestia...';
                formStatus.style.color = '#4a5568';
            }
        });
    }

    // Add scroll animation to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Add active class to current nav item
const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentLocation) {
        link.classList.add('active');
    }
});