// Athletic Minds - Animation Controller

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAllAnimations();
});

function initializeAllAnimations() {
    // Initialize scroll-triggered animations
    initializeScrollAnimations();
    
    // Initialize hover animations
    initializeHoverAnimations();
    
    // Initialize loading animations
    initializeLoadingAnimations();
    
    // Initialize page transition animations
    initializePageTransitions();
    
    // Initialize typewriter effects
    initializeTypewriterEffects();
    
    // Initialize parallax effects
    initializeParallaxEffects();
    
    console.log('Animation system initialized');
}

// Scroll-triggered animations
function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerScrollAnimation(entry.target);
        observer.unobserve(entry.target); // ✅ only once
      }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

      document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));

    // // Observe all elements with animation classes
    // const animatedElements = document.querySelectorAll(
    //     '.animate-fade-in, .animate-fade-in-left, .animate-fade-in-right, .reveal'
    // );
    
    // animatedElements.forEach(el => {
    //     // Add initial state for reveal animations
    //     if (!el.classList.contains('animate-fade-in')) {
    //         el.classList.add('reveal');
    //     }
    //     scrollObserver.observe(el);
    // });
}

function triggerScrollAnimation(element) {
    // Add revealed class for custom reveal animations
    element.classList.add('revealed');
    
    // Handle staggered animations for grid items
    if (element.parentElement && element.parentElement.classList.contains('features-grid')) {
        const siblings = Array.from(element.parentElement.children);
        const index = siblings.indexOf(element);
        element.style.animationDelay = (index * 100) + 'ms';
    }
    
    // Handle testimonial rotation
    if (element.classList.contains('testimonial')) {
        setTimeout(() => {
            element.classList.add('animate-pulse');
        }, 1000);
    }
}

// Hover animations
function initializeHoverAnimations() {
    // Add enhanced hover effects to cards
    const cards = document.querySelectorAll(
        '.feature-card, .tutor-card, .service-card, .testimonial'
    );
    
    cards.forEach(card => {
        addCardHoverEffects(card);
    });
    
    // Add button hover effects
    const buttons = document.querySelectorAll(
        '.cta-button, .book-button, .submit-button'
    );
    
    buttons.forEach(button => {
        addButtonHoverEffects(button);
    });
    
    // Add navigation hover effects
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        addNavLinkHoverEffects(link);
    });
}

function addCardHoverEffects(card) {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Add glow effect for featured cards
        if (card.classList.contains('feature-card')) {
            card.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    });
    
    // Add click animation
    card.addEventListener('click', () => {
        card.classList.add('animate-pulse');
        setTimeout(() => {
            card.classList.remove('animate-pulse');
        }, 600);
    });
}

function addButtonHoverEffects(button) {
    // Add ripple effect
    button.addEventListener('click', (e) => {
        createRippleEffect(e, button);
    });
    
    // Add hover lift effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 10px 20px rgba(255, 107, 53, 0.3)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
    });
}

function addNavLinkHoverEffects(link) {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
        link.style.transition = 'all 0.3s ease';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Loading animations
function initializeLoadingAnimations() {
    // Show loading animation for dynamic content
    const containers = document.querySelectorAll(
        '#tutors-container, #testimonials-container, #features-container'
    );
    
    containers.forEach(container => {
        if (!container.children.length) {
            showLoadingAnimation(container);
        }
    });
    
    // Hide loading animations when content loads
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const container = mutation.target;
                hideLoadingAnimation(container);
            }
        });
    });
    
    containers.forEach(container => {
        observer.observe(container, { childList: true });
    });
}

function showLoadingAnimation(container) {
    const loader = document.createElement('div');
    loader.className = 'content-loader';
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Loading content<span class="loading-dots"></span></p>
    `;
    container.appendChild(loader);
}

function hideLoadingAnimation(container) {
    const loader = container.querySelector('.content-loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 300);
    }
}

// Page transition animations
function initializePageTransitions() {
    // Override the showPage function to add animations
    const originalShowPage = window.showPage;
    
    window.showPage = function(pageId) {
        const currentPage = document.querySelector('.page.active');
        const targetPage = document.getElementById(pageId);
        
        if (currentPage && targetPage && currentPage !== targetPage) {
            // Animate out current page
            currentPage.classList.add('page-transition-exit-active');
            
            setTimeout(() => {
                // Call original function
                originalShowPage(pageId);
                
                // Animate in new page
                targetPage.classList.add('page-transition-enter');
                setTimeout(() => {
                    targetPage.classList.add('page-transition-enter-active');
                    targetPage.classList.remove('page-transition-enter');
                }, 10);
                
                // Clean up exit animation
                currentPage.classList.remove('page-transition-exit-active');
                
                // Trigger page-specific animations
                triggerPageSpecificAnimations(pageId);
                
            }, 150);
        } else {
            originalShowPage(pageId);
            triggerPageSpecificAnimations(pageId);
        }
    };
}

function triggerPageSpecificAnimations(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    // Reset and animate elements on the new page
  const animateElements = page.querySelectorAll(
    '.animate-fade-in:not(.reveal), .animate-fade-in-left:not(.reveal), .animate-fade-in-right:not(.reveal)'
  );

    animateElements.forEach((element, index) => {
        if (element.dataset.animatedOnce === 'true') return; // ✅ prevent re-runs
          element.dataset.animatedOnce = 'true';
        // Reset element state
        element.style.opacity = '0';
        element.style.transform = getInitialTransform(element);
        
        // Animate element in with staggered delay
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0) translateX(0)';
        }, index * 100 + 200);
    });
    
    // Special animations for specific pages
    switch (pageId) {
        case 'home':
            animateHomePage();
            break;
        case 'tutors':
            animateTutorsPage();
            break;
        case 'services':
            animateServicesPage();
            break;
        case 'about':
            animateAboutPage();
            break;
        case 'contact':
            animateContactPage();
            break;
    }
}

function getInitialTransform(element) {
    if (element.classList.contains('animate-fade-in-left')) {
        return 'translateX(-30px)';
    } else if (element.classList.contains('animate-fade-in-right')) {
        return 'translateX(30px)';
    } else {
        return 'translateY(30px)';
    }
}

function animateHomePage() {
    // Animate hero content
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroElements = hero.querySelectorAll('h1, p, .cta-button');
        heroElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        });
    }
}

function animateTutorsPage() {
    // Animate tutor cards with wave effect
    const tutorCards = document.querySelectorAll('.tutor-card');
    tutorCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animate-bounce');
            setTimeout(() => {
                card.classList.remove('animate-bounce');
            }, 1000);
        }, index * 150);
    });
}

function animateServicesPage() {
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    // If this card uses scroll reveal, let the observer handle it
    if (card.classList.contains('reveal') || card.classList.contains('revealed')) return;

    // Also avoid re-adding classes repeatedly
    if (card.dataset.animatedOnce === 'true') return;

    const dir = index % 2 === 0 ? 'left' : 'right';
    const cls = `animate-fade-in-${dir}`;
    if (!card.classList.contains(cls)) {
      card.classList.add(cls);
    }
  });
}

function animateAboutPage() {
    // Animate text paragraphs with typewriter effect
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        const paragraphs = aboutContent.querySelectorAll('p');
        paragraphs.forEach((paragraph, index) => {
            setTimeout(() => {
                paragraph.classList.add('animate-fade-in');
            }, index * 300);
        });
    }
}

function animateContactPage() {
    // Animate contact form with slide-in effect
    const contactForm = document.querySelector('.contact-form');
    const contactInfo = document.querySelector('.contact-info');
    
    if (contactForm) {
        contactForm.classList.add('animate-fade-in-left');
    }
    
    if (contactInfo) {
        contactInfo.classList.add('animate-fade-in-right');
    }
}

// Typewriter effects
function initializeTypewriterEffects() {
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(element => {
        createTypewriterEffect(element);
    });
}

function createTypewriterEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--accent-orange)';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i > text.length) {
            clearInterval(timer);
            // Start blinking cursor
            setInterval(() => {
                element.style.borderRightColor = 
                    element.style.borderRightColor === 'transparent' 
                        ? 'var(--accent-orange)' 
                        : 'transparent';
            }, 750);
        }
    }, 50);
}

// Parallax effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrollTop * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Advanced animation utilities
function animateCounter(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function animateProgress(element, targetWidth, duration = 1000) {
    element.style.width = '0%';
    element.style.transition = `width ${duration}ms ease-out`;
    
    setTimeout(() => {
        element.style.width = targetWidth + '%';
    }, 100);
}

function createFloatingAnimation(element) {
    const duration = 3000 + Math.random() * 2000; // 3-5 seconds
    const amplitude = 10 + Math.random() * 10; // 10-20px
    
    element.style.animation = `
        floating ${duration}ms ease-in-out infinite alternate
    `;
    
    // Create keyframes dynamically
    const keyframes = `
        @keyframes floating {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-${amplitude}px); }
        }
    `;
    
    if (!document.querySelector('#floating-keyframes')) {
        const style = document.createElement('style');
        style.id = 'floating-keyframes';
        style.textContent = keyframes;
        document.head.appendChild(style);
    }
}

// Intersection Observer utilities
function createVisibilityObserver(callback, options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
}

// Animation performance optimization
function optimizeAnimations() {
    // Reduce animations on low-performance devices
    if (navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        document.documentElement.style.setProperty('--animation-delay', '0.05s');
    }
    
    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', () => {
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            if (document.hidden) {
                el.style.animationPlayState = 'paused';
            } else {
                el.style.animationPlayState = 'running';
            }
        });
    });
}

// Custom animation sequences
function createSequentialAnimation(elements, animationType = 'fadeIn', delay = 200) {
    elements.forEach((element, index) => {
        setTimeout(() => {
            switch (animationType) {
                case 'fadeIn':
                    element.classList.add('animate-fade-in');
                    break;
                case 'slideUp':
                    element.style.transform = 'translateY(30px)';
                    element.style.opacity = '0';
                    element.style.transition = 'all 0.6s ease';
                    setTimeout(() => {
                        element.style.transform = 'translateY(0)';
                        element.style.opacity = '1';
                    }, 50);
                    break;
                case 'scale':
                    element.style.transform = 'scale(0)';
                    element.style.transition = 'transform 0.5s ease';
                    setTimeout(() => {
                        element.style.transform = 'scale(1)';
                    }, 50);
                    break;
            }
        }, index * delay);
    });
}

// Scroll-based animations
function initializeScrollBasedAnimations() {
    const scrollElements = document.querySelectorAll('[data-scroll-animation]');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.scrollAnimation;
                triggerScrollBasedAnimation(entry.target, animationType);
                scrollObserver.unobserve(entry.target);
            }
        });
    });
    
    scrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
}

function triggerScrollBasedAnimation(element, animationType) {
    switch (animationType) {
        case 'countUp':
            const endValue = parseInt(element.dataset.countTo) || 100;
            animateCounter(element, 0, endValue, 2000);
            break;
        case 'progressBar':
            const targetWidth = parseInt(element.dataset.progress) || 100;
            animateProgress(element, targetWidth);
            break;
        case 'typewriter':
            createTypewriterEffect(element);
            break;
        case 'floating':
            createFloatingAnimation(element);
            break;
    }
}

// Mobile-specific animations
function initializeMobileAnimations() {
    if (window.innerWidth <= 768) {
        // Reduce complex animations on mobile
        document.documentElement.classList.add('mobile-animations');
        
        // Simplify hover effects on touch devices
        if ('ontouchstart' in window) {
            const cards = document.querySelectorAll('.hover-lift');
            cards.forEach(card => {
                card.addEventListener('touchstart', () => {
                    card.style.transform = 'scale(0.98)';
                });
                
                card.addEventListener('touchend', () => {
                    card.style.transform = 'scale(1)';
                });
            });
        }
    }
}

// Animation event listeners
function setupAnimationEventListeners() {
    // Listen for animation end events
    document.addEventListener('animationend', (e) => {
        const element = e.target;
        
        // Clean up one-time animations
        if (element.classList.contains('animate-bounce')) {
            element.classList.remove('animate-bounce');
        }
        
        if (element.classList.contains('animate-shake')) {
            element.classList.remove('animate-shake');
        }
    });
    
    // Listen for transition end events
    document.addEventListener('transitionend', (e) => {
        const element = e.target;
        
        // Clean up temporary classes
        if (element.classList.contains('form-success')) {
            setTimeout(() => {
                element.classList.remove('form-success');
            }, 2000);
        }
    });
}

// Performance monitoring
function monitorAnimationPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            if (fps < 30) {
                // Reduce animation complexity if FPS is low
                document.documentElement.classList.add('low-performance');
                console.warn('Low FPS detected, reducing animation complexity');
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    requestAnimationFrame(measureFPS);
}

// Initialize all animation systems
function initializeAnimationSystems() {
    optimizeAnimations();
    initializeMobileAnimations();
    initializeScrollBasedAnimations();
    setupAnimationEventListeners();
    
    // Start performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        monitorAnimationPerformance();
    }
}

// Export animation utilities for use in other modules
window.AnimationUtils = {
    animateCounter,
    animateProgress,
    createSequentialAnimation,
    createTypewriterEffect,
    createFloatingAnimation,
    createVisibilityObserver
};

// Add animation styles
function addAnimationStyles() {
    const styles = `
        <style>
            /* Loading animations */
            .content-loader {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                grid-column: 1 / -1;
            }
            
            .content-loader.fade-out {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            /* Mobile animation optimizations */
            .mobile-animations * {
                animation-duration: 0.2s !important;
                transition-duration: 0.2s !important;
            }
            
            /* Low performance optimizations */
            .low-performance * {
                animation: none !important;
                transition: none !important;
            }
            
            /* Enhanced hover states */
            .hover-enhanced {
                position: relative;
                overflow: hidden;
            }
            
            .hover-enhanced::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .hover-enhanced:hover::before {
                left: 100%;
            }
            .animate-fade-in,
            .animate-fade-in-left,
            .animate-fade-in-right {
            animation: none !important; /* stop CSS keyframes */
            }
            
            /* Scroll reveal animations */
            .reveal {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease, transform 0.8s ease;
            }
            
            .reveal.revealed {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Custom keyframes for floating animation */
            @keyframes floating {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
                100% { transform: translateY(0px); }
            }
            
            .floating {
                animation: floating 3s ease-in-out infinite;
            }
            
            /* Glitch effect for error states */
            .glitch {
                animation: glitch 0.3s;
            }
            
            @keyframes glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
            }
            
            /* Attention-seeking animations */
            .attention-pulse {
                animation: attention-pulse 2s infinite;
            }
            
            @keyframes attention-pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 107, 53, 0.3); }
                100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 53, 0); }
            }
            
            /* Stagger animation delays */
            .stagger-1 { animation-delay: 0.1s; }
            .stagger-2 { animation-delay: 0.2s; }
            .stagger-3 { animation-delay: 0.3s; }
            .stagger-4 { animation-delay: 0.4s; }
            .stagger-5 { animation-delay: 0.5s; }
            .stagger-6 { animation-delay: 0.6s; }
            
            /* Page transition effects */
            .page-slide-in {
                animation: pageSlideIn 0.5s ease forwards;
            }
            
            .page-slide-out {
                animation: pageSlideOut 0.3s ease forwards;
            }
            
            @keyframes pageSlideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes pageSlideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-20px);
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addAnimationStyles();
    initializeAnimationSystems();
});