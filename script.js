/**
 * Kamand Shayegan - Portfolio
 * JavaScript for interactivity and animations
 */

/** Successful data migrations: single source of truth (flag, name, tool). Grouped by country: US, UK, Finland, Sweden, then others. */
const MIGRATIONS_DATA = [
    // United States
    { flag: '🇺🇸', name: 'Equine Innovations', tool: 'Acesoft' },
    { flag: '🇺🇸', name: 'Tharp', tool: 'Cornerstone' },
    { flag: '🇺🇸', name: 'Whitehills Clinic', tool: 'Avimark SQL' },
    // United Kingdom
    { flag: '🇬🇧', name: 'Hatchmoor', tool: 'Assisi' },
    { flag: '🇬🇧', name: 'Orchard Vets', tool: 'Assisi' },
    { flag: '🇬🇧', name: 'Dafne Vets', tool: 'Assisi' },
    { flag: '🇬🇧', name: 'Newton Clarke', tool: 'Ezvetpro' },
    // Finland
    { flag: '🇫🇮', name: 'Katse', tool: 'Kliniq' },
    { flag: '🇫🇮', name: 'Kasarmivet', tool: 'Kliniq' },
    { flag: '🇫🇮', name: 'KeskiSavon', tool: 'Kliniq' },
    // Sweden
    { flag: '🇸🇪', name: 'Magleberg', tool: 'Dolittle' },
    { flag: '🇸🇪', name: 'Veterinärgruppen i Tygelsjö', tool: 'Dolittle' },
    // Portugal
    { flag: '🇵🇹', name: 'Das Conchas', tool: 'V-Quadrat' },
    { flag: '🇵🇹', name: 'Bicuda', tool: 'OrangestCsv' },
    // Austria
    { flag: '🇦🇹', name: 'Dr. Krebitz-Gressl', tool: 'VQuadrat' },
    // Slovakia
    { flag: '🇸🇰', name: 'Hardwood', tool: 'Docut' },
    // Hungary
    { flag: '🇭🇺', name: 'Alsonemedi', tool: 'Doki' },
];

document.addEventListener('DOMContentLoaded', () => {
    renderMigrationCards();
    initNavbar();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initTypingEffect();
    initMigrationCardAnimations();
    initMigrationCountryCount();
});

/**
 * Build migration cards from MIGRATIONS_DATA and inject into the deck
 */
function renderMigrationCards() {
    const deck = document.getElementById('migrations-deck');
    if (!deck) return;

    deck.innerHTML = MIGRATIONS_DATA.map(({ flag, name, tool }) => `
        <div class="migration-card">
            <div class="migration-flag">${escapeHtml(flag)}</div>
            <div class="migration-info">
                <span class="migration-name-line"><h4>${escapeHtml(name)}</h4> <span class="migration-tool">${escapeHtml(tool)}</span></span>
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Set migration card title to "Successful data migrations over X countries"
 */
function initMigrationCountryCount() {
    const deck = document.querySelector('.scroll-card-migrations .scroll-card-deck');
    const countEl = document.getElementById('migration-country-count');
    if (!deck || !countEl) return;

    const flags = deck.querySelectorAll('.migration-flag');
    const uniqueCountries = new Set(Array.from(flags).map(el => el.textContent.trim()));
    countEl.textContent = '+' + uniqueCountries.size;
}

/**
 * Navbar scroll behavior
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when past hero
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay);
                
                // Optionally unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger to X
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Typing effect for hero section (optional enhancement)
 */
function initTypingEffect() {
    const codeContent = document.querySelector('.code-content code');
    if (!codeContent) return;

    // Store original content
    const originalHTML = codeContent.innerHTML;
    const textContent = codeContent.textContent;
    
    // Only run typing effect once on first view
    let hasPlayed = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasPlayed) {
                hasPlayed = true;
                // Restore full content immediately for accessibility
                codeContent.innerHTML = originalHTML;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(codeContent);
}

/**
 * Staggered animation for migration cards (only for cards NOT inside the scroll deck)
 */
function initMigrationCardAnimations() {
    const migrationCards = document.querySelectorAll('.migration-card');
    const deck = document.querySelector('.scroll-card-deck');
    const cardsToAnimate = deck
        ? Array.from(migrationCards).filter(card => !deck.contains(card))
        : Array.from(migrationCards);

    if (cardsToAnimate.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const cardIndex = cardsToAnimate.indexOf(entry.target);
                const delay = cardIndex * 50;
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    cardsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(card);
    });
}

/**
 * Active navigation link highlighting
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
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
    });
}

/**
 * Parallax effect for hero background
 */
function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrolled < heroHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

/**
 * Counter animation for stats
 */
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/\d/g, '');
                
                animateCounter(target, numericValue, suffix);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 30; // Complete in ~30 frames
    const duration = 1000; // 1 second
    const stepTime = duration / 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initActiveNavHighlight();
    initParallax();
    initCounters();
});

/**
 * Console Easter Egg
 */
console.log(`
%c🐕 Welcome to Kamand's Portfolio!
%c
Looking for a Data Migration Specialist?
Let's connect: w.kshayegan@gmail.com

Built with ❤️ and lots of ☕
`, 
'font-size: 20px; font-weight: bold; color: #00d9a5;',
'font-size: 12px; color: #a0a0b0;'
);
