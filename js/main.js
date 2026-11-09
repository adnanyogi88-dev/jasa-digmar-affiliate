/**
 * DIGMAR - Main JavaScript
 * Digital Marketing & Affiliate Agency Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initPortfolioFilter();
    initTestimonialSlider();
    initCounterAnimation();
    initBackToTop();
});

/* ============================================ */
/* NAVBAR SCROLL EFFECT                          */
/* ============================================ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const scrollThreshold = 80;

    function updateNavbar() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Initial check
    updateNavbar();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* ============================================ */
/* MOBILE HAMBURGER MENU                         */
/* ============================================ */

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!menuBtn || !mobileMenu) return;

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;

        if (isOpen) {
            mobileMenu.classList.remove('mobile-menu-hidden');
            mobileMenu.classList.add('mobile-menu-visible');
            menuBtn.querySelector('.hamburger-lines').classList.add('hamburger-active');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('mobile-menu-hidden');
            mobileMenu.classList.remove('mobile-menu-visible');
            menuBtn.querySelector('.hamburger-lines').classList.remove('hamburger-active');
            document.body.style.overflow = '';
        }
    }

    function closeMenu() {
        if (isOpen) {
            isOpen = false;
            mobileMenu.classList.add('mobile-menu-hidden');
            mobileMenu.classList.remove('mobile-menu-visible');
            menuBtn.querySelector('.hamburger-lines').classList.remove('hamburger-active');
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            closeMenu();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}

/* ============================================ */
/* SMOOTH SCROLLING                              */
/* ============================================ */

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const navbarHeight = 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active nav link
            updateActiveNavLink(targetId);
        });
    });

    // Update active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 120;
                    if (window.scrollY >= sectionTop) {
                        current = '#' + section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === current) {
                        link.classList.add('active');
                    }
                });

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

/* ============================================ */
/* SCROLL-TRIGGERED ANIMATIONS                   */
/* ============================================ */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/* ============================================ */
/* TESTIMONIAL CAROUSEL / SLIDER                 */
/* ============================================ */

function initTestimonialSlider() {
    const slidesContainer = document.querySelector('.testimonial-slides');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!slidesContainer || !slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoplayTimer = null;
    let isTransitioning = false;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        if (isTransitioning || index === currentSlide) return;
        isTransitioning = true;

        currentSlide = index;
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Reset autoplay
        resetAutoplay();

        setTimeout(() => {
            isTransitioning = false;
        }, 700);
    }

    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        goToSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(prev);
    }

    // Button event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Autoplay
    function startAutoplay() {
        autoplayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    startAutoplay();

    // Pause autoplay on hover
    const sliderEl = document.querySelector('.testimonial-slider');
    if (sliderEl) {
        sliderEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        sliderEl.addEventListener('mouseleave', startAutoplay);
    }

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Only respond if testimonial section is in view
        const section = document.getElementById('testimoni');
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
}

/* ============================================ */
/* COUNTER ANIMATION                             */
/* ============================================ */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');

    if (!counters.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.floor(easedProgress * target);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* ============================================ */
/* BACK TO TOP BUTTON                            */
/* ============================================ */

function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const showThreshold = 500;

    function toggleButton() {
        if (window.scrollY > showThreshold) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }

    // Initial check
    toggleButton();

    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                toggleButton();
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================ */
/* PORTFOLIO FILTER & INTERACTIVITY             */
/* ============================================ */

function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item');

    if (!filterBtns.length || !portfolioCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active state on buttons
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary-600', 'text-white', 'shadow-md');
                b.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
            });
            btn.classList.add('active', 'bg-primary-600', 'text-white', 'shadow-md');
            btn.classList.remove('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');

            // Filter cards with smooth fade
            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || (category && category.includes(filterValue))) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.95)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

