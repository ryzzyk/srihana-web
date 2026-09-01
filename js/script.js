/* ============================================================
   Srihana Law Chambers — Main JavaScript
   ============================================================ */

'use strict';

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

    // —————————————————————
    // 1. AOS Initialization
    // —————————————————————
    AOS.init({
        once: true,
        offset: 60,
        duration: 800,
        easing: 'ease-out-cubic',
        disable: 'mobile'
    });


    // —————————————————————
    // 2. Header Scroll Effect
    // —————————————————————
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });


    // —————————————————————
    // 3. Mobile Navigation Toggle
    // —————————————————————
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // —————————————————————
    // 4. Active Nav Link Highlight
    // —————————————————————
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = '';
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);


    // —————————————————————
    // 5. Counter Animation
    // —————————————————————
    const statNumbers = document.querySelectorAll('.stat-card__number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const isPercent = counter.closest('.stat-card').querySelector('.stat-card__percent') !== null;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(eased * target);

                if (isPercent) {
                    counter.textContent = current;
                } else {
                    counter.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });

        countersAnimated = true;
    }

    // Trigger counter animation when hero stats come into view
    const heroStats = document.querySelector('.hero__stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }


    // —————————————————————
    // 6. Testimonial Carousel
    // —————————————————————
    const track = document.getElementById('testimonialTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonials__dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    const totalSlides = cards.length;

    function showSlide(index) {
        // Wrap around
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;

        // Show only the current card
        cards.forEach((card, i) => {
            card.style.display = i === currentIndex ? 'block' : 'none';
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Initialize: show first slide
    showSlide(0);

    // Event listeners
    prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(parseInt(dot.getAttribute('data-index')));
        });
    });

    // Auto-rotate every 5 seconds
    let autoplayInterval = setInterval(() => showSlide(currentIndex + 1), 5000);

    // Pause on hover
    const sliderContainer = document.querySelector('.testimonials__slider');
    sliderContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    sliderContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
        if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });


    // —————————————————————
    // 7. Contact Form Handling
    // —————————————————————
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            let isValid = true;
            const inputs = this.querySelectorAll('[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#e74c3c';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                // Show error feedback
                const existingError = this.querySelector('.form__error');
                if (!existingError) {
                    const errorMsg = document.createElement('p');
                    errorMsg.className = 'form__error';
                    errorMsg.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: -12px; margin-bottom: 16px;';
                    errorMsg.textContent = 'Please fill in all required fields.';
                    this.insertBefore(errorMsg, this.querySelector('.btn'));
                }
                return;
            }

            // Remove error if exists
            const errorMsg = this.querySelector('.form__error');
            if (errorMsg) errorMsg.remove();

            // Simulate sending
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Success state
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
                submitBtn.style.background = '#27ae60';
                submitBtn.style.borderColor = '#27ae60';

                // Reset form
                contactForm.reset();

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.style.borderColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });

        // Reset input border on focus
        contactForm.querySelectorAll('.form__input').forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '';
            });
        });
    }


    // —————————————————————
    // 8. Back to Top Button
    // —————————————————————
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // —————————————————————
    // 9. Smooth Scroll for Anchor Links
    // —————————————————————
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});
