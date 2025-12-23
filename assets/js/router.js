// Router for Athletic Minds - Single Page Application Navigation

class Router {
    constructor() {
        this.routes = {
            '/': 'pages/home.html',
            '/tutors': 'pages/tutors.html',
            '/services': 'pages/services.html',
            '/about': 'pages/about.html',
            '/contact': 'pages/contact.html'
        };
        
        this.mainContent = document.getElementById('main-content');
        this.init();
    }

    init() {
        // Handle initial page load
        window.addEventListener('DOMContentLoaded', () => {
            this.loadPage(window.location.pathname);
        });

        // Handle back/forward navigation
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.pathname, false);
        });

        // Handle link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a.nav-link, a.cta-button, a[href^="/"]');
            if (link && link.getAttribute('href').startsWith('/')) {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigateTo(path);
            }
        });
    }

    async navigateTo(path) {
        window.history.pushState({}, '', path);
        await this.loadPage(path);
    }

    async loadPage(path, updateHistory = true) {
        // Default to home if path not found
        if (!this.routes[path]) {
            path = '/';
        }

        try {
            // Show loading state
            this.mainContent.innerHTML = '<div class="content-loader"><div class="loading-spinner"></div>Loading...</div>';
            
            // close mobile menu after navigation
            window.UI?.closeMobileMenu();

            // enhance behavior for newly injected DOM
            window.UI?.enhanceNewContent(this.mainContent);

            // Fetch page content
            const response = await fetch(this.routes[path]);
            if (!response.ok) {
                throw new Error(`Failed to load page: ${response.status}`);
            }

            const content = await response.text();
            
            // Update main content
            this.mainContent.innerHTML = content;

            // Update navigation active state
            this.updateNavigation(path);

            // Initialize page-specific functionality
            this.initializePage(path);

            // Update page title
            this.updatePageTitle(path);

        } catch (error) {
            console.error('Error loading page:', error);
            this.mainContent.innerHTML = `
                <section style="padding: 80px 0; text-align: center;">
                    <div class="container">
                        <h2>Page Not Found</h2>
                        <p>Sorry, the requested page could not be loaded.</p>
                        <a href="/" class="cta-button">Return Home</a>
                    </div>
                </section>
            `;
        }
    }

    updateNavigation(path) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    }

    updatePageTitle(path) {
        const titles = {
            '/': 'Athletic Minds - Expert Tutoring for Student Athletes',
            '/tutors': 'Meet Our Tutors - Athletic Minds',
            '/services': 'Our Services - Athletic Minds',
            '/about': 'About Us - Athletic Minds',
            '/contact': 'Contact Us - Athletic Minds'
        };
        document.title = titles[path] || titles['/'];
    }

    initializePage(path) {
        // Initialize page-specific functionality
        switch(path) {
            case '/':
                this.initHomePage();
                break;
            case '/tutors':
                this.initTutorsPage();
                break;
            case '/services':
                this.initServicesPage();
                break;
            case '/contact':
                this.initContactPage();
                break;
        }

        // Initialize animations for all pages
        this.initAnimations();
    }

    initHomePage() {
        // Load features and testimonials
        this.loadFeatures();
        this.loadTestimonials();
    }

    initTutorsPage() {
        // Load tutors and initialize card functionality
        this.loadTutors();
    }

    initServicesPage() {
        // Load detailed services
        this.loadDetailedServices();
    }

    initContactPage() {
        // Initialize contact form
        if (window.initContactForm) {
            window.initContactForm();
        }
    }

    initAnimations() {
        // Initialize reveal animations
        if (window.initRevealAnimations) {
            window.initRevealAnimations();
        }
    }

    // Data loading methods
    async loadFeatures() {
        try {
            const response = await fetch('data/services.json');
            const data = await response.json();
            const container = document.getElementById('features-container');
            
            if (container && data.features) {
                container.innerHTML = data.features.map(feature => `
                    <div class="feature-card hover-lift animate-fade-in">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading features:', error);
        }
    }

    async loadTestimonials() {
        try {
            const response = await fetch('data/testimonials.json');
            const data = await response.json();
            const container = document.getElementById('testimonials-container');
            
            if (container && data.testimonials) {
                container.innerHTML = data.testimonials.map(testimonial => `
                    <div class="testimonial animate-fade-in">
                        <div class="testimonial-content">${testimonial.content}</div>
                        <div class="testimonial-author">- ${testimonial.author}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    async loadTutors() {
        try {
            const response = await fetch('data/tutors.json');
            const data = await response.json();
            const container = document.getElementById('tutors-container');
            
            if (container && data.tutors) {
                container.innerHTML = data.tutors.map((tutor, index) => `
                    <div class="tutor-card-container hover-lift animate-fade-in animate-delay-${(index % 4) + 1}" data-tutor-id="${tutor.id}">
                        <div class="tutor-card">
                            <div class="card-front">
                                <div class="tutor-image">
                                    ${tutor.image ? `<img src="${tutor.image}" alt="${tutor.name}">` : `<span class="tutor-emoji">${tutor.emoji}</span>`}
                                </div>
                                <div class="tutor-info">
                                    <h3 class="tutor-name">${tutor.name}</h3>
                                    <p class="tutor-title">${tutor.title}</p>
                                    <p class="tutor-subjects">${tutor.subjects.join(', ')}</p>
                                    <p class="tutor-bio-preview">${tutor.bio.substring(0, 100)}...</p>
                                    <button class="view-details-button hover-lift button-ripple">View Details</button>
                                    <button class="book-button hover-lift button-ripple">Book Session</button>
                                </div>
                            </div>
                            <div class="card-back">
                                <div class="back-header">
                                    <button class="back-button">← Back</button>
                                    <h3>${tutor.name}</h3>
                                </div>
                                <div class="detailed-info">
                                    <div class="info-section">
                                        <h4>About</h4>
                                        <p>${tutor.bio}</p>
                                    </div>
                                    <div class="subjects-grid">
                                        <div class="info-section">
                                            <h4>Subjects</h4>
                                            <div class="subjects-tags">
                                                ${tutor.subjects.map(subject => `<span class="subject-tag">${subject}</span>`).join('')}
                                            </div>
                                        </div>
                                        <div class="info-section">
                                            <h4>Specialties</h4>
                                            <div class="specialties-tags">
                                                ${tutor.specialties ? tutor.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('') : ''}
                                            </div>
                                        </div>
                                    </div>
                                    ${tutor.education ? `
                                        <div class="info-section education-list">
                                            <h4>Education</h4>
                                            <ul>
                                                ${tutor.education.map(edu => `<li>${edu}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                    ${tutor.rates ? `
                                        <div class="info-section">
                                            <h4>Rates</h4>
                                            <div class="rates-grid">
                                                ${Object.entries(tutor.rates).map(([type, price]) => `
                                                    <div class="rate-item">
                                                        <span class="rate-type">${type}</span>
                                                        <span class="rate-price">$${price}/hr</span>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${tutor.availability ? `
                                        <div class="info-section">
                                            <h4>Availability</h4>
                                            <div class="availability-details">
                                                <div class="availability-item"><strong>Days:</strong> ${tutor.availability.days}</div>
                                                <div class="availability-item"><strong>Times:</strong> ${tutor.availability.times}</div>
                                                <div class="availability-badges">
                                                    ${tutor.availability.online ? '<span class="badge online">Online Available</span>' : ''}
                                                    ${tutor.availability.travel ? '<span class="badge travel">Travel Available</span>' : ''}
                                                </div>
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${tutor.testimonials ? `
                                        <div class="info-section">
                                            <h4>Student Testimonials</h4>
                                            <div class="testimonials">
                                                ${tutor.testimonials.map(testimonial => `
                                                    <blockquote class="testimonial">
                                                        <div class="quote-content">${testimonial.content}</div>
                                                        <cite>${testimonial.author}</cite>
                                                    </blockquote>
                                                `).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${tutor.contact ? `
                                        <div class="info-section">
                                            <h4>Contact Information</h4>
                                            <div class="contact-info">
                                                <p><strong>Email:</strong> ${tutor.contact.email}</p>
                                                ${tutor.contact.phone ? `<p><strong>Phone:</strong> ${tutor.contact.phone}</p>` : ''}
                                                <p><em>Response time: ${tutor.contact.responseTime || '24 hours'}</em></p>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="back-actions">
                                    <button class="book-button-large hover-lift button-ripple">Book a Session</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Initialize tutor card functionality
                this.initTutorCards();
            }
        } catch (error) {
            console.error('Error loading tutors:', error);
        }
    }

    // initTutorCards() {
    //     const cards = document.querySelectorAll('.tutor-card-container');
    //     const overlay = document.getElementById('card-overlay');

    //     cards.forEach(cardContainer => {
    //         const card = cardContainer.querySelector('.tutor-card');
    //         const viewDetailsBtn = cardContainer.querySelector('.view-details-button');
    //         const backBtn = cardContainer.querySelector('.back-button');
    //         const bookBtns = cardContainer.querySelectorAll('.book-button, .book-button-large');

    //         // View details functionality
    //         viewDetailsBtn.addEventListener('click', (e) => {
    //             e.stopPropagation();
    //             card.classList.add('flipped');
                
    //             // Add delay before expanding
    //             setTimeout(() => {
    //                 cardContainer.classList.add('expanded');
    //                 overlay.classList.add('active');
    //                 document.body.classList.add('modal-open');
    //             }, 400);
    //         });

    //         // Flip on tap/click anywhere on the tile
    //         card.addEventListener('click', function (e) {
    //             const card = e.target.closest('.tutor-card');
    //             if (!card) return;

    //             // Let real navigation/actions work without flipping
    //             if (e.target.closest('a, [data-no-flip], .book-button')) return;

    //             card.classList.toggle('flipped');
    //         }, { passive: true });

            

    //         // Back button functionality
    //         backBtn.addEventListener('click', (e) => {
    //             e.stopPropagation();
    //             cardContainer.classList.remove('expanded');
    //             overlay.classList.remove('active');
    //             document.body.classList.remove('modal-open');
                
    //             // Add delay before flipping back
    //             setTimeout(() => {
    //                 card.classList.remove('flipped');
    //             }, 300);
    //         });

    //         // Book button functionality
    //         bookBtns.forEach(btn => {
    //             btn.addEventListener('click', (e) => {
    //                 e.stopPropagation();
    //                 const tutorId = cardContainer.dataset.tutorId;
    //                 // Handle booking functionality
    //                 if (window.handleBooking) {
    //                     window.handleBooking(tutorId);
    //                 } else {
    //                     // Fallback - navigate to contact page
    //                     this.navigateTo('/contact');
    //                 }
    //             });
    //         });


    //     });

    //     // Close expanded card when clicking overlay
    //     overlay.addEventListener('click', () => {
    //         const expandedCard = document.querySelector('.tutor-card-container.expanded');
    //         if (expandedCard) {
    //             expandedCard.classList.remove('expanded');
    //             overlay.classList.remove('active');
    //             document.body.classList.remove('modal-open');
                
    //             setTimeout(() => {
    //                 expandedCard.querySelector('.tutor-card').classList.remove('flipped');
    //             }, 300);
    //         }
    //     });

    //     // Close expanded card on escape key
    //     document.addEventListener('keydown', (e) => {
    //         if (e.key === 'Escape') {
    //             const expandedCard = document.querySelector('.tutor-card-container.expanded');
    //             if (expandedCard) {
    //                 expandedCard.classList.remove('expanded');
    //                 overlay.classList.remove('active');
    //                 document.body.classList.remove('modal-open');
                    
    //                 setTimeout(() => {
    //                     expandedCard.querySelector('.tutor-card').classList.remove('flipped');
    //                 }, 300);
    //             }
    //         }
    //     });
    // }


    initTutorCards() {
    const cards = document.querySelectorAll('.tutor-card-container');
    const overlay = document.getElementById('card-overlay');

    cards.forEach(cardContainer => {
        const card = cardContainer.querySelector('.tutor-card');
        const viewDetailsBtn = cardContainer.querySelector('.view-details-button');
        const backBtn = cardContainer.querySelector('.back-button');
        const bookBtns = cardContainer.querySelectorAll('.book-button, .book-button-large');

        // Single click handler for the entire card
        cardContainer.addEventListener('click', (e) => {
            // Prevent action if clicking on interactive elements
            if (e.target.closest('.book-button, .book-button-large, .back-button, a, [data-no-flip]')) {
                return;
            }

            e.stopPropagation();

            // If card is not flipped, flip it first
            if (!card.classList.contains('flipped')) {
                card.classList.add('flipped');
                
                // Add delay before expanding to modal
                setTimeout(() => {
                    cardContainer.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.classList.add('modal-open');
                }, 400);
            } else {
                // If already flipped and not expanded, expand to modal
                if (!cardContainer.classList.contains('expanded')) {
                    cardContainer.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.classList.add('modal-open');
                }
            }
        });

        // Remove the separate view details button event listener since 
        // clicking anywhere now handles this functionality

        // Back button functionality
        backBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cardContainer.classList.remove('expanded');
            overlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            // Add delay before flipping back
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 300);
        });

        // Book button functionality
        bookBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tutorId = cardContainer.dataset.tutorId;
                // Handle booking functionality
                if (window.handleBooking) {
                    window.handleBooking(tutorId);
                } else {
                    // Fallback - navigate to contact page
                    this.navigateTo('/contact');
                }
            });
        });
    });

    // Close expanded card when clicking overlay
    overlay.addEventListener('click', () => {
        const expandedCard = document.querySelector('.tutor-card-container.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
            overlay.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            setTimeout(() => {
                expandedCard.querySelector('.tutor-card').classList.remove('flipped');
            }, 300);
        }
    });

    // Close expanded card on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const expandedCard = document.querySelector('.tutor-card-container.expanded');
            if (expandedCard) {
                expandedCard.classList.remove('expanded');
                overlay.classList.remove('active');
                document.body.classList.remove('modal-open');
                
                setTimeout(() => {
                    expandedCard.querySelector('.tutor-card').classList.remove('flipped');
                }, 300);
            }
        }
    });
}
   async loadDetailedServices() {
    try {
        const res = await fetch('data/services.json', { cache: 'no-store' });
        const data = await res.json();
        const container = document.getElementById('detailed-services-container');
        if (!container) return;

        const items = Array.isArray(data.detailed_services) ? data.detailed_services : [];

        container.innerHTML = items.map(svc => {
        // choose the best list to show as bullets
        const list =
            (svc.features && svc.features.length ? svc.features :
            (svc.benefits && svc.benefits.length ? svc.benefits : [])).slice(0, 6);

        return `
            <article class="service-card" id="${svc.id || ''}">
            <h3>${svc.title || ''}</h3>
            <p>${svc.description || ''}</p>
            ${list.length ? `
                <ul>
                ${list.map(li => `<li>${li}</li>`).join('')}
                </ul>` : ''
            }
            </article>
        `;
        }).join('');
    } catch (e) {
        console.error('Failed to load services:', e);
    }
}
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.router = new Router();
});