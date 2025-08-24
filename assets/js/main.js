// Athletic Minds - Main JavaScript

// Global variables
let currentPage = 'home';
let tutorsData = [];
let testimonialsData = [];
let servicesData = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Load dynamic content
    loadTutors();
    loadTestimonials();
    loadServices();
    
    // Initialize components
    initializeNavigation();
    initializeMobileMenu();
    initializeAnimations();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Athletic Minds website initialized successfully');
}

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('page-transition-exit');
    });
    
    // Show selected page with animation
    setTimeout(() => {
        pages.forEach(page => page.classList.remove('page-transition-exit'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active', 'page-transition-enter-active');
            currentPage = pageId;
        }
    }, 150);
    
    // Update active nav link
    updateActiveNavLink(pageId);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Trigger page-specific animations
    setTimeout(() => {
        triggerPageAnimations(pageId);
    }, 300);
}

function updateActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(pageId)) {
            link.classList.add('active');
        }
    });
}

function initializeNavigation() {
    // Add click handlers to navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const onclick = link.getAttribute('onclick');
            if (onclick) {
                // Extract page name from onclick attribute
                const match = onclick.match(/showPage\('(.+)'\)/);
                if (match) {
                    showPage(match[1]);
                }
            }
        });
    });
}

// Mobile menu functions
function initializeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenu?.classList.remove('active');
    navLinks?.classList.remove('active');
}

// // Dynamic content loading functions
// async function loadTutors() {
//     try {
//         // For now, use static data. Replace with actual fetch when data/tutors.json is available
//         tutorsData = [
//             {
//                 id: 'Couch',
//                 name: 'Matthew Couture',
//                 subjects: ['Mathematics', 'Physics', 'Chemistry', "Biology"],
//                 bio: 'Former Division III skier with BS in Applied Mathematics & Physics. Specializes in STEM subjects for student athletes.',
//                 image: 'assets/images/tutors/cooch.jpg',
//                 // emoji: '👨‍🏫',
//                 focus: "50% 20%",
//                 calendarId: 'mcooucher@athleticmindstutoring.com'
//             },
//             // {
//             //     id: 'prof-williams',
//             //     name: 'Prof. Sarah Williams',
//             //     subjects: ['English', 'Literature', 'Writing'],
//             //     bio: 'Former college volleyball player, now English Professor. Expert in helping athletes develop strong writing and communication skills.',
//             //     image: 'assets/images/tutors/prof-sarah-williams.jpg',
//             //     emoji: '👩‍🏫',
//             //     calendarId: 'prof.williams@athleticminds.com'
//             // },
//             // {
//             //     id: 'dr-rodriguez',
//             //     name: 'Dr. James Rodriguez',
//             //     subjects: ['Biology', 'Chemistry', 'Pre-Med'],
//             //     bio: 'Former soccer player turned physician. Guides pre-med student athletes through challenging science coursework.',
//             //     image: 'assets/images/tutors/dr-james-rodriguez.jpg',
//             //     emoji: '👨‍🏫',
//             //     calendarId: 'dr.rodriguez@athleticminds.com'
//             // },
//             // {
//             //     id: 'ms-foster',
//             //     name: 'Ms. Emily Foster',
//             //     subjects: ['History', 'Social Studies', 'Psychology'],
//             //     bio: 'Former swimming champion with Master\'s in Psychology. Specializes in helping athletes understand human behavior and historical contexts.',
//             //     image: 'assets/images/tutors/ms-emily-foster.jpg',
//             //     emoji: '👩‍🏫',
//             //     calendarId: 'ms.foster@athleticminds.com'
//             // }
//         ];
        
//         displayTutors();
        
//         // Uncomment this when you have the JSON file:
//         // const response = await fetch('data/tutors.json');
//         // tutorsData = await response.json();
//         // displayTutors();
        
//     } catch (error) {
//         console.error('Error loading tutors:', error);
//         displayTutorsError();
//     }
// }


// // export async function loadTutors() {
// //   try {
// //     const res = await fetch('/data/tutors.json');   // leading slash = public root
// //     if (!res.ok) throw new Error(`HTTP ${res.status}`);

// //     tutorsData = await res.json();
// //     displayTutors();                                // your render helper
// //   } catch (err) {
// //     console.error('Error loading tutors:', err);
// //     displayTutorsError();                           // graceful fallback
// //   }
// // }


// function displayTutors() {
//     const container = document.getElementById('tutors-container');
//     if (!container) return;
    
//     container.innerHTML = '';
    
//     tutorsData.forEach((tutor, index) => {
//         const tutorCard = createTutorCard(tutor, index);
//         container.appendChild(tutorCard);
//     });
// }

// function createTutorCard(tutor, index) {
//     const card = document.createElement('div');
//     card.className = `tutor-card hover-lift animate-fade-in animate-delay-${(index % 4) + 1}`;
    
//     card.innerHTML = `
//         <div class="tutor-image">
//             <img src="${tutor.image}" alt="${tutor.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='${tutor.emoji}';">
//         </div>
//         <div class="tutor-info">
//             <div class="tutor-name">${tutor.name}</div>
//             <div class="tutor-subjects">${tutor.subjects.join(' • ')}</div>
//             <p>${tutor.bio}</p>
//             <button class="book-button button-ripple" onclick="bookSession('${tutor.id}')">Book Session</button>
//         </div>
//     `;
    
//     return card;
// }



async function loadTutors() {
    try {
        const response = await fetch('data/tutors.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        tutorsData = data.tutors; // Access the tutors array from the JSON structure
        displayTutors();
    } catch (error) {
        console.error('Error loading tutors:', error);
    }
}

function displayTutors() {
    const container = document.getElementById('tutors-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    tutorsData.forEach((tutor, index) => {
        const tutorCard = createTutorCard(tutor, index);
        container.appendChild(tutorCard);
    });
}

function createTutorCard(tutor, index) {
    const card = document.createElement('div');
    card.className = `tutor-card-container hover-lift animate-fade-in animate-delay-${(index % 4) + 1}`;
    
    card.innerHTML = `
        <div class="tutor-card" id="card-${tutor.id}">
            <div class="card-front">
                <div class="tutor-image">
                    <img src="${tutor.image}" alt="${tutor.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\"tutor-emoji\\">${tutor.emoji}</span>';">
                </div>
                <div class="tutor-info">
                    <div class="tutor-name">${tutor.name}</div>
                    <div class="tutor-title">${tutor.title || ''}</div>
                    <div class="tutor-subjects">${tutor.subjects.join(' • ')}</div>
                    <p class="tutor-bio-preview">${tutor.bio.substring(0, 100)}${tutor.bio.length > 100 ? '...' : ''}</p>
                    <button class="view-details-button button-ripple" onclick="flipCard('${tutor.id}')">
                        View Details
                    </button>
                    <button class="book-button button-ripple" onclick="bookSession('${tutor.id}')">
                        Book Session
                    </button>
                </div>
            </div>
            
            <div class="card-back">
                <div class="back-header">
                    <button class="back-button" onclick="flipCard('${tutor.id}', true)">
                        ← Back
                    </button>
                    <h3>${tutor.name}</h3>
                </div>
                
                <div class="detailed-info">
                    <div class="info-section">
                        <h4>Experience & Education</h4>
                        <p><strong>Experience:</strong> ${tutor.experience}</p>
                        <div class="education-list">
                            <strong>Education:</strong>
                            <ul>
                                ${tutor.education.map(edu => `<li>${edu}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Athletic Background</h4>
                        <p>${tutor.athletic_background}</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>Specialties</h4>
                        <div class="specialties-tags">
                            ${tutor.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>Rates & Availability</h4>
                        <div class="rates-grid">
                            <div class="rate-item">
                                <span class="rate-type">Individual:</span>
                                <span class="rate-price">$${tutor.rates.individual}/hr</span>
                            </div>
                            <div class="rate-item">
                                <span class="rate-type">Group:</span>
                                <span class="rate-price">$${tutor.rates.group}/hr</span>
                            </div>
                            <div class="rate-item">
                                <span class="rate-type">Travel:</span>
                                <span class="rate-price">$${tutor.rates.travel}/hr</span>
                            </div>
                        </div>
                        <div class="availability-info">
                            <p><strong>Timezone:</strong> ${tutor.availability.timezone}</p>
                            <p><strong>Hours:</strong> ${tutor.availability.preferred_hours}</p>
                            <div class="availability-badges">
                                ${tutor.availability.online_sessions ? '<span class="badge online">Online Sessions</span>' : ''}
                                ${tutor.availability.travel_available ? '<span class="badge travel">Travel Available</span>' : ''}
                            </div>
                        </div>
                    </div>
                    
                    ${tutor.testimonials && tutor.testimonials.length > 0 ? `
                    <div class="info-section">
                        <h4>Student Testimonials</h4>
                        <div class="testimonials">
                            ${tutor.testimonials.map(testimonial => `
                                <blockquote>
                                    "${testimonial.quote}"
                                    <cite>- ${testimonial.student}</cite>
                                </blockquote>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="back-actions">
                    <button class="book-button-large button-ripple" onclick="bookSession('${tutor.id}')">
                        Book Session with ${tutor.name.split(' ')[0]}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Card flip functionality
function flipCard(tutorId, flipBack = false) {
    const card = document.getElementById(`card-${tutorId}`);
    if (!card) return;
    
    if (flipBack) {
        card.classList.remove('flipped');
    } else {
        card.classList.add('flipped');
    }
}

// Existing book session function (assuming it exists elsewhere)
function bookSession(tutorId) {
    // Your existing booking logic here
    console.log(`Booking session with tutor: ${tutorId}`);
    // You can implement your booking modal or redirect logic here
}

async function loadTestimonials() {
    try {
        // Static data for now
        testimonialsData = [
            {
                content: "Athletic Minds made it possible for me to maintain my 4.0 GPA while training for nationals. Their tutor traveled with our team and helped me stay on top of my calculus coursework even during the most intense training periods.",
                author: "Sarah M., Division I Swimmer",
                image: "assets/images/testimonials/sarah-swimmer.jpg"
            },
            {
                content: "The partnership between Athletic Minds and our school has been invaluable. Their tutors understand our students' unique needs and maintain excellent communication with our academic staff.",
                author: "Dr. Johnson, Academic Advisor",
                image: "assets/images/testimonials/dr-johnson.jpg"
            },
            {
                content: "I never thought I could balance pre-med requirements with competitive tennis. Athletic Minds proved me wrong. Their flexible scheduling and travel tutoring kept me on track for medical school.",
                author: "Marcus R., Tennis Player",
                image: "assets/images/testimonials/marcus-tennis.jpg"
            }
        ];
        
        displayTestimonials();
        
    } catch (error) {
        console.error('Error loading testimonials:', error);
    }
}

function displayTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    testimonialsData.forEach((testimonial, index) => {
        const testimonialCard = createTestimonialCard(testimonial, index);
        container.appendChild(testimonialCard);
    });
}

function createTestimonialCard(testimonial, index) {
    const card = document.createElement('div');
    card.className = `testimonial animate-fade-in animate-delay-${index + 1}`;
    
    card.innerHTML = `
        <div class="testimonial-content">${testimonial.content}</div>
        <div class="testimonial-author">${testimonial.author}</div>
    `;
    
    return card;
}

async function loadServices() {
    try {
        // Static data for now
        servicesData = {
            features: [
                {
                    icon: '🚐💨',
                    title: 'Travel Tutoring',
                    description: 'Our tutors accompany your team to training camps, competitions, and away games, ensuring continuous learning.'
                },
                {
                    icon: '📅',
                    title: 'Flexible Scheduling',
                    description: 'Training at 5 AM? Practice until 10 PM? We adapt our tutoring schedule to fit your athletic commitments.'
                },
                {
                    icon: '🏫',
                    title: 'School Partnership',
                    description: 'Trusted relationships with schools allow our tutors to proctor exams and serve as official academic liaisons.'
                },
                {
                    icon: '🎯',
                    title: 'Specialized Focus',
                    description: 'We understand the unique challenges student athletes face and tailor our approach accordingly.'
                },
                // {
                //     icon: '📚',
                //     title: 'All Subjects',
                //     description: 'From math and science to literature and foreign languages, we cover all academic areas.'
                // },
                // {
                //     icon: '🤝',
                //     title: 'Group & Individual',
                //     description: 'Whether you need one-on-one attention or group study sessions, we\'ve got you covered.'
                // }
            ],
            detailedServices: [
                {
                    title: 'Travel Tutoring',
                    description: 'Our tutors accompany your team on training camps, tournaments, and competitions. We set up mobile learning environments wherever you are, ensuring your education never takes a back seat to your sport.',
                    features: [
                        'On-site tutoring at training facilities',
                        'Hotel room study sessions',
                        'Transportation coordination',
                        'Equipment and materials provided'
                    ]
                },
                {
                    title: 'Exam Proctoring',
                    description: 'Through our trusted partnerships with schools, our certified tutors can proctor official exams while you\'re away for competitions, ensuring you never miss important assessments.',
                    features: [
                        'Official school exam administration',
                        'Secure testing environment',
                        'Direct communication with schools',
                        'Immediate score reporting'
                    ]
                },
                {
                    title: 'Flexible Scheduling',
                    description: 'Your training schedule is demanding and unpredictable. Our tutoring sessions adapt to your availability, whether that\'s early morning, late evening, or weekend sessions.',
                    features: [
                        '24/7 scheduling availability',
                        'Multi-time zone coordination',
                        'Same-day rescheduling'
                    ]
                },
                {
                    title: 'Academic Liaison',
                    description: 'We serve as the bridge between you and your school\'s academic staff, ensuring seamless communication about your progress, assignments, and any accommodations needed.',
                    features: [
                        'Teacher communication',
                        'Assignment coordination',
                        'Progress reporting',
                        'Accommodation requests'
                    ]
                },
                {
                    title: 'Group Study Programs',
                    description: 'Perfect for teams traveling together. We organize group study sessions that build both academic knowledge and team camaraderie while maximizing learning efficiency.',
                    features: [
                        'Team-based learning',
                        'Peer collaboration sessions',
                        'Group project coordination',
                        'Team building through academics'
                    ]
                },
                {
                    title: 'College Prep',
                    description: 'Specialized programs for student athletes preparing for college admissions, including SAT/ACT prep, college essay writing, and scholarship application assistance.',
                    features: [
                        'SAT/ACT test preparation',
                        'College essay guidance',
                        'Scholarship applications',
                        'Athletic recruitment support'
                    ]
                }
            ]
        };
        
        displayFeatures();
        displayDetailedServices();
        
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

function displayFeatures() {
    const container = document.getElementById('features-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    servicesData.features.forEach((feature, index) => {
        const featureCard = createFeatureCard(feature, index);
        container.appendChild(featureCard);
    });
}

function createFeatureCard(feature, index) {
    const card = document.createElement('div');
    card.className = `feature-card hover-lift animate-fade-in animate-delay-${(index % 3) + 1}`;
    
    card.innerHTML = `
        <div class="feature-icon">${feature.icon}</div>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
    `;
    
    return card;
}

function displayDetailedServices() {
    const container = document.getElementById('detailed-services-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    servicesData.detailedServices.forEach((service, index) => {
        const serviceCard = createServiceCard(service, index);
        container.appendChild(serviceCard);
    });
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = `service-card hover-lift animate-fade-in animate-delay-${(index % 2) + 1}`;
    
    const featuresList = service.features.map(feature => `<li>${feature}</li>`).join('');
    
    card.innerHTML = `
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <ul>${featuresList}</ul>
    `;
    
    return card;
}

// Animation functions
function initializeAnimations() {
    // Initialize scroll reveal
    initializeScrollReveal();
    
    // Add hover effects to interactive elements
    addHoverEffects();
}

function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Re-trigger fade-in animations for dynamic content
                if (entry.target.classList.contains('animate-fade-in')) {
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.animate-fade-in, .reveal');
    animateElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

function addHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.feature-card, .tutor-card, .service-card, .testimonial');
    cards.forEach(card => {
        card.classList.add('hover-lift');
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .book-button, .submit-button');
    buttons.forEach(button => {
        button.classList.add('button-ripple');
    });
}

function triggerPageAnimations(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;
    
    // Reset and trigger animations for the current page
    const animateElements = page.querySelectorAll('.animate-fade-in');
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Event listeners
function setupEventListeners() {
    // Smooth scrolling for anchor links
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
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Handle scroll events
    window.addEventListener('scroll', handleScroll);
}

function handleResize() {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

function handleScroll() {
    // Add scroll-based effects here if needed
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
}

// Error handling functions
function displayTutorsError() {
    const container = document.getElementById('tutors-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
            <p>Unable to load tutor information. Please refresh the page or contact us directly.</p>
            <button onclick="loadTutors()" class="cta-button" style="margin-top: 1rem;">Try Again</button>
        </div>
    `;
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.showPage = showPage;
window.bookSession = function(tutorId) {
    // This will be handled by booking.js
    if (window.handleBookingSession) {
        window.handleBookingSession(tutorId);
    }
};