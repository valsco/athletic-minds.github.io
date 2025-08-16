// Athletic Minds - Google Calendar Booking Integration

// Google Calendar API configuration
const CALENDAR_CONFIG = {
    apiKey: 'YOUR_GOOGLE_CALENDAR_API_KEY', // Replace with actual API key
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with actual client ID
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events'
};

let isGapiLoaded = false;
let isGisLoaded = false;
let tokenClient;

// Initialize Google Calendar integration
function initializeGoogleCalendar() {
    // Load Google APIs
    loadGoogleAPIs();
}

function loadGoogleAPIs() {
    // Load Google API Platform Library
    if (typeof gapi === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = initializeGapi;
        document.head.appendChild(script);
    } else {
        initializeGapi();
    }
    
    // Load Google Identity Services
    if (typeof google === 'undefined' || !google.accounts) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = initializeGis;
        document.head.appendChild(script);
    } else {
        initializeGis();
    }
}

async function initializeGapi() {
    await gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: CALENDAR_CONFIG.apiKey,
            discoveryDocs: [CALENDAR_CONFIG.discoveryDoc],
        });
        isGapiLoaded = true;
        console.log('Google API initialized');
    });
}

function initializeGis() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CALENDAR_CONFIG.clientId,
        scope: CALENDAR_CONFIG.scope,
        callback: (response) => {
            if (response.error) {
                console.error('Token client error:', response.error);
                return;
            }
            console.log('Google Identity Services initialized');
        },
    });
    isGisLoaded = true;
}

// Main booking function called from tutor cards
function handleBookingSession(tutorId) {
    const tutor = tutorsData.find(t => t.id === tutorId);
    if (!tutor) {
        showErrorMessage('Tutor not found');
        return;
    }
    
    // For now, show a modal with booking information
    showBookingModal(tutor);
    
    // Uncomment these lines when Google Calendar is properly configured:
    // if (!isGapiLoaded || !isGisLoaded) {
    //     initializeGoogleCalendar();
    //     setTimeout(() => handleBookingSession(tutorId), 1000);
    //     return;
    // }
    // 
    // startBookingProcess(tutor);
}

function showBookingModal(tutor) {
    // Create modal HTML
    const modalHTML = `
        <div id="booking-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Book a Session with ${tutor.name}</h3>
                    <button class="modal-close" onclick="closeBookingModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="tutor-info-summary">
                        <p><strong>Subjects:</strong> ${tutor.subjects.join(', ')}</p>
                        <p><strong>Specialization:</strong> ${tutor.bio}</p>
                    </div>
                    
                    <div class="booking-form">
                        <h4>Session Details</h4>
                        <form id="session-booking-form">
                            <div class="form-group">
                                <label for="session-type">Session Type</label>
                                <select id="session-type" name="sessionType" required>
                                    <option value="">Select session type</option>
                                    <option value="individual">Individual Session (1-on-1)</option>
                                    <option value="group">Group Session (2-5 students)</option>
                                    <option value="team">Team Session (6+ students)</option>
                                    <option value="travel">Travel Tutoring</option>
                                    <option value="exam-prep">Exam Preparation</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="subject-focus">Subject Focus</label>
                                <select id="subject-focus" name="subjectFocus" required>
                                    <option value="">Select subject</option>
                                    ${tutor.subjects.map(subject => 
                                        `<option value="${subject.toLowerCase()}">${subject}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="session-duration">Session Duration</label>
                                <select id="session-duration" name="duration" required>
                                    <option value="">Select duration</option>
                                    <option value="60">1 Hour</option>
                                    <option value="90">1.5 Hours</option>
                                    <option value="120">2 Hours</option>
                                    <option value="custom">Custom Duration</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="preferred-date">Preferred Date</label>
                                <input type="date" id="preferred-date" name="preferredDate" 
                                       min="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="preferred-time">Preferred Time</label>
                                <select id="preferred-time" name="preferredTime" required>
                                    <option value="">Select time</option>
                                    <option value="06:00">6:00 AM</option>
                                    <option value="07:00">7:00 AM</option>
                                    <option value="08:00">8:00 AM</option>
                                    <option value="09:00">9:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">1:00 PM</option>
                                    <option value="14:00">2:00 PM</option>
                                    <option value="15:00">3:00 PM</option>
                                    <option value="16:00">4:00 PM</option>
                                    <option value="17:00">5:00 PM</option>
                                    <option value="18:00">6:00 PM</option>
                                    <option value="19:00">7:00 PM</option>
                                    <option value="20:00">8:00 PM</option>
                                    <option value="21:00">9:00 PM</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="student-info">Student Information</label>
                                <input type="text" id="student-name" name="studentName" 
                                       placeholder="Student Name" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="student-email">Student Email</label>
                                <input type="email" id="student-email" name="studentEmail" 
                                       placeholder="student@email.com" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="student-phone">Phone Number</label>
                                <input type="tel" id="student-phone" name="studentPhone" 
                                       placeholder="(555) 123-4567">
                            </div>
                            
                            <div class="form-group">
                                <label for="session-location">Session Location</label>
                                <select id="session-location" name="location" required>
                                    <option value="">Select location</option>
                                    <option value="online">Online (Video Call)</option>
                                    <option value="student-home">Student's Home</option>
                                    <option value="library">Local Library</option>
                                    <option value="school">School Campus</option>
                                    <option value="training-facility">Training Facility</option>
                                    <option value="travel">Travel Location (specify below)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="special-requests">Special Requests or Notes</label>
                                <textarea id="special-requests" name="specialRequests" rows="3"
                                         placeholder="Any specific topics, learning challenges, or accommodation needs..."></textarea>
                            </div>
                            
                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="closeBookingModal()">
                                    Cancel
                                </button>
                                <button type="submit" class="btn-primary">
                                    Request Booking
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="booking-info">
                        <h4>Next Steps</h4>
                        <ol>
                            <li>Submit your booking request</li>
                            <li>We'll check ${tutor.name}'s availability</li>
                            <li>You'll receive confirmation within 4 hours</li>
                            <li>Calendar invitations will be sent to all participants</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener for form submission
    const form = document.getElementById('session-booking-form');
    form.addEventListener('submit', handleBookingSubmission);
    
    // Show modal with animation
    const modal = document.getElementById('booking-modal');
    setTimeout(() => modal.classList.add('show'), 10);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBookingModal();
        }
    });
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.add('hiding');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData);
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate booking process
    setTimeout(() => {
        processBookingRequest(bookingData);
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function processBookingRequest(bookingData) {
    console.log('Booking request:', bookingData);
    
    // In a real implementation, this would:
    // 1. Send data to your server
    // 2. Check tutor availability via Google Calendar API
    // 3. Create calendar events
    // 4. Send confirmation emails
    
    // For now, show success message
    showBookingSuccess(bookingData);
}

function showBookingSuccess(bookingData) {
    const modal = document.getElementById('booking-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="booking-success">
            <div class="success-icon">✅</div>
            <h3>Booking Request Submitted!</h3>
            <p>Thank you for your booking request. We've received the following information:</p>
            
            <div class="booking-summary">
                <p><strong>Session Type:</strong> ${bookingData.sessionType}</p>
                <p><strong>Subject:</strong> ${bookingData.subjectFocus}</p>
                <p><strong>Date & Time:</strong> ${bookingData.preferredDate} at ${bookingData.preferredTime}</p>
                <p><strong>Duration:</strong> ${bookingData.duration} minutes</p>
                <p><strong>Student:</strong> ${bookingData.studentName}</p>
                <p><strong>Location:</strong> ${bookingData.location}</p>
            </div>
            
            <div class="next-steps">
                <h4>What happens next?</h4>
                <ul>
                    <li>We'll verify availability within 4 hours</li>
                    <li>You'll receive email confirmation</li>
                    <li>Calendar invitations will be sent</li>
                    <li>Pre-session materials will be provided</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p>Questions? Contact us at:</p>
                <p>📧 <a href="mailto:bookings@athleticminds.com">bookings@athleticminds.com</a></p>
                <p>📞 <a href="tel:5551236463">(555) 123-MIND</a></p>
            </div>
            
            <button class="btn-primary" onclick="closeBookingModal()">
                Close
            </button>
        </div>
    `;
}

// Google Calendar API functions (for future implementation)
async function startBookingProcess(tutor) {
    try {
        // Request authorization
        await requestAuthorization();
        
        // Get tutor's calendar availability
        const availability = await getTutorAvailability(tutor.calendarId);
        
        // Show available time slots
        showAvailableSlots(tutor, availability);
        
    } catch (error) {
        console.error('Booking process error:', error);
        showErrorMessage('Unable to access calendar. Please try again or contact us directly.');
    }
}

function requestAuthorization() {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (response) => {
            if (response.error !== undefined) {
                reject(response);
                return;
            }
            resolve(response);
        };
        
        tokenClient.requestAccessToken({prompt: 'consent'});
    });
}

async function getTutorAvailability(calendarId, startDate, endDate) {
    try {
        const request = {
            'calendarId': calendarId,
            'timeMin': startDate || new Date().toISOString(),
            'timeMax': endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 100,
            'orderBy': 'startTime'
        };
        
        const response = await gapi.client.calendar.events.list(request);
        return response.result.items || [];
        
    } catch (error) {
        console.error('Error fetching calendar:', error);
        throw error;
    }
}

async function createCalendarEvent(eventDetails) {
    try {
        const event = {
            'summary': `Tutoring Session - ${eventDetails.subject}`,
            'description': `Athletic Minds tutoring session\nStudent: ${eventDetails.studentName}\nSubject: ${eventDetails.subject}\nType: ${eventDetails.sessionType}`,
            'start': {
                'dateTime': eventDetails.startDateTime,
                'timeZone': 'America/New_York'
            },
            'end': {
                'dateTime': eventDetails.endDateTime,
                'timeZone': 'America/New_York'
            },
            'attendees': [
                {'email': eventDetails.tutorEmail},
                {'email': eventDetails.studentEmail}
            ]
        };
        
        const request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });
        
        const response = await request;
        return response.result;
        
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
}

// Utility functions
function showErrorMessage(message) {
    const errorModal = `
        <div class="modal-overlay" id="error-modal">
            <div class="modal-content error-modal">
                <div class="modal-header">
                    <h3>Booking Error</h3>
                    <button class="modal-close" onclick="closeErrorModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                    <div class="error-actions">
                        <button class="btn-secondary" onclick="closeErrorModal()">Close</button>
                        <button class="btn-primary" onclick="showPage('contact')">Contact Us</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorModal);
    setTimeout(() => document.getElementById('error-modal').classList.add('show'), 10);
}

function closeErrorModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.classList.add('hiding');
        setTimeout(() => modal.remove(), 300);
    }
}

function formatDateTime(date, time) {
    const datetime = new Date(`${date}T${time}:00`);
    return datetime.toISOString();
}

function generateTimeSlots(startHour = 6, endHour = 21) {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
        const time24 = hour.toString().padStart(2, '0') + ':00';
        const time12 = hour > 12 ? `${hour - 12}:00 PM` : 
                      hour === 12 ? '12:00 PM' : 
                      hour === 0 ? '12:00 AM' : `${hour}:00 AM`;
        slots.push({ value: time24, display: time12 });
    }
    return slots;
}

// Initialize booking system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up global booking handler
    window.handleBookingSession = handleBookingSession;
    
    // Add modal styles to document
    addBookingStyles();
    
    console.log('Booking system initialized');
});

function addBookingStyles() {
    const styles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            
            .modal-overlay.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay.hiding {
                opacity: 0;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                max-height: 90vh;
                width: 90%;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            
            .modal-overlay.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--light-gray);
            }
            
            .modal-header h3 {
                color: var(--primary-blue);
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--dark-gray);
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .tutor-info-summary {
                background: var(--light-gray);
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
            }
            
            .booking-form .form-group {
                margin-bottom: 1rem;
            }
            
            .booking-form label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--primary-blue);
            }
            
            .booking-form input,
            .booking-form select,
            .booking-form textarea {
                width: 100%;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }
            
            .booking-form input:focus,
            .booking-form select:focus,
            .booking-form textarea:focus {
                outline: none;
                border-color: var(--accent-orange);
            }
            
            .form-actions {
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--light-gray);
            }
            
            .btn-primary, .btn-secondary {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: var(--accent-orange);
                color: white;
            }
            
            .btn-primary:hover {
                background: #e55a2b;
                transform: translateY(-2px);
            }
            
            .btn-secondary {
                background: var(--light-gray);
                color: var(--dark-gray);
            }
            
            .btn-secondary:hover {
                background: #e9ecef;
            }
            
            .booking-info {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--light-gray);
            }
            
            .booking-info h4 {
                color: var(--primary-blue);
                margin-bottom: 1rem;
            }
            
            .booking-info ol {
                margin-left: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .booking-info li {
                margin-bottom: 0.5rem;
            }
            
            .emergency-contact {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 1rem;
                margin-top: 1rem;
            }
            
            .booking-success {
                text-align: center;
                padding: 2rem 1rem;
            }
            
            .success-icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            
            .booking-success h3 {
                color: var(--primary-blue);
                margin-bottom: 1rem;
            }
            
            .booking-summary {
                background: var(--light-gray);
                padding: 1.5rem;
                border-radius: 8px;
                margin: 1.5rem 0;
                text-align: left;
            }
            
            .booking-summary p {
                margin-bottom: 0.5rem;
            }
            
            .next-steps {
                margin: 2rem 0;
                text-align: left;
            }
            
            .next-steps h4 {
                color: var(--primary-blue);
                margin-bottom: 1rem;
            }
            
            .next-steps ul {
                margin-left: 1rem;
            }
            
            .next-steps li {
                margin-bottom: 0.5rem;
            }
            
            .contact-info {
                background: var(--light-gray);
                padding: 1rem;
                border-radius: 8px;
                margin: 1.5rem 0;
            }
            
            .error-modal .modal-content {
                max-width: 400px;
            }
            
            .error-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 1.5rem;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .form-actions {
                    flex-direction: column;
                }
                
                .error-actions {
                    flex-direction: column;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}
                            