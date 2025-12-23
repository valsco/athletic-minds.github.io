// Athletic Minds - Contact Form Handler

// // Initialize contact form when DOM is ready
// document.addEventListener('DOMContentLoaded', function() {
//     initializeContactForm();
// });



function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
        
        // Add real-time validation
        addFormValidation();
        
        // Add form field enhancements
        addFormEnhancements();
        
        console.log('Contact form initialized');
    }
}

function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    const validation = validateContactForm(data);
    if (!validation.isValid) {
        showValidationErrors(validation.errors);
        return;
    }
    
    // Show loading state
    const submitButton = e.target.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Add loading spinner
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    submitButton.appendChild(spinner);
    
    // Process the form submission
    processContactForm(data)
        .then(response => {
            showSuccessMessage();
            e.target.reset();
        })
        .catch(error => {
            showErrorMessage(error.message);
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            const spinnerEl = submitButton.querySelector('.loading-spinner');
            if (spinnerEl) {
                spinnerEl.remove();
            }
        });
}

function validateContactForm(data) {
    const errors = [];
    
    // Required field validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Please enter your full name' });
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Please provide more details about your needs (at least 10 characters)' });
    }
    
    // Optional field validation
    if (data.sport && data.sport.trim().length > 50) {
        errors.push({ field: 'sport', message: 'Sport/activity name is too long' });
    }
    
    if (data.grade && data.grade.trim().length > 30) {
        errors.push({ field: 'grade', message: 'Grade level entry is too long' });
    }
    
    if (data.subjects && data.subjects.trim().length > 100) {
        errors.push({ field: 'subjects', message: 'Subjects list is too long' });
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showValidationErrors(errors) {
    // Clear previous errors
    clearValidationErrors();
    
    errors.forEach(error => {
        const field = document.getElementById(error.field);
        if (field) {
            field.classList.add('form-error');
            field.addEventListener('input', clearFieldError, { once: true });
            
            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error-message';
            errorDiv.textContent = error.message;
            field.parentNode.appendChild(errorDiv);
        }
    });
    
    // Scroll to first error
    const firstError = document.querySelector('.form-error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
    }
}

function clearValidationErrors() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.form-error');
    errorFields.forEach(field => {
        field.classList.remove('form-error');
    });
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.field-error-message');
    errorMessages.forEach(message => message.remove());
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('form-error');
    field.classList.add('form-success');
    
    const errorMessage = field.parentNode.querySelector('.field-error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    setTimeout(() => {
        field.classList.remove('form-success');
    }, 2000);
}

async function processContactForm(data) {
    // Simulate form processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would:
    // 1. Send data to your server
    // 2. Save to database
    // 3. Send confirmation email to user
    // 4. Send notification email to Athletic Minds team
    // 5. Integrate with CRM system
    // 6. Send auto-responder email
    
    console.log('Contact form submission:', data);
    
    // For now, we'll simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true, message: 'Form submitted successfully' };
    } else {
        throw new Error('Network error. Please try again.');
    }
}

function showSuccessMessage() {
    const successModal = createModal({
        title: 'Message Sent Successfully!',
        content: `
            <div class="success-content">
                <div class="success-icon">🎉</div>
                <p>Thank you for contacting Athletic Minds! We've received your message and will respond within 4 hours.</p>
                
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>We'll review your specific needs</li>
                        <li>Match you with the right tutor</li>
                        <li>Send you a detailed proposal</li>
                        <li>Schedule an initial consultation</li>
                    </ul>
                </div>
                
            </div>
        `,
        actions: [
            { text: 'Close', action: 'close', class: 'btn-primary' }
        ]
    });
    
    showModal(successModal);
}

function showErrorMessage(message) {
    const errorModal = createModal({
        title: 'Submission Error',
        content: `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <p>We're sorry, but there was an error sending your message:</p>
                <p class="error-details">${message}</p>
                
                <div class="alternative-contact">
                    <h4>Alternative Ways to Reach Us</h4>
                    <p>📞 Phone: <a href="tel:5551236463">(555) 123-MIND</a></p>
                    <p>📧 Email: <a href="mailto:info@athleticmindstutoring.com">info@athleticmindstutoring.com</a></p>
                </div>
            </div>
        `,
        actions: [
            { text: 'Try Again', action: 'retry', class: 'btn-primary' },
            { text: 'Close', action: 'close', class: 'btn-secondary' }
        ]
    });
    
    showModal(errorModal);
}

function createModal({ title, content, actions }) {
    const modalId = 'contact-modal-' + Date.now();
    
    const actionsHTML = actions.map(action => 
        `<button class="${action.class}" data-action="${action.action}">${action.text}</button>`
    ).join('');
    
    return {
        id: modalId,
        html: `
            <div id="${modalId}" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" data-action="close">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                        <div class="modal-actions">
                            ${actionsHTML}
                        </div>
                    </div>
                </div>
            </div>
        `
    };
}

function showModal(modal) {
    document.body.insertAdjacentHTML('beforeend', modal.html);
    const modalElement = document.getElementById(modal.id);
    
    // Add event listeners
    modalElement.addEventListener('click', handleModalAction);
    
    // Show modal with animation
    setTimeout(() => modalElement.classList.add('show'), 10);
    
    // Close modal when clicking outside
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeModal(modal.id);
        }
    });
}

function handleModalAction(e) {
    const action = e.target.getAttribute('data-action');
    const modalId = e.target.closest('.modal-overlay').id;
    
    switch (action) {
        case 'close':
            closeModal(modalId);
            break;
        case 'retry':
            closeModal(modalId);
            // Scroll back to form
            document.getElementById('contact-form').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            break;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hiding');
        setTimeout(() => modal.remove(), 300);
    }
}

function addFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Real-time validation for email field
    const emailField = form.querySelector('#email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmailField);
        emailField.addEventListener('input', debounceValidation(validateEmailField, 500));
    }
    
    // Real-time validation for required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateRequiredField);
    });
    
    // Character count for message field
    const messageField = form.querySelector('#message');
    if (messageField) {
        addCharacterCounter(messageField);
    }
}

function validateEmailField(e) {
    const field = e.target;
    const email = field.value.trim();
    
    if (email && !isValidEmail(email)) {
        field.classList.add('form-error');
        showFieldError(field, 'Please enter a valid email address');
    } else if (email) {
        field.classList.remove('form-error');
        field.classList.add('form-success');
        removeFieldError(field);
    }
}

function validateRequiredField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (!value) {
        field.classList.add('form-error');
        showFieldError(field, 'This field is required');
    } else {
        field.classList.remove('form-error');
        field.classList.add('form-success');
        removeFieldError(field);
    }
}

function showFieldError(field, message) {
    removeFieldError(field); // Remove existing error
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error-message');
    if (existingError) {
        existingError.remove();
    }
}

function addCharacterCounter(field) {
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0 / ${maxLength} characters`;
    field.parentNode.appendChild(counter);
    
    field.addEventListener('input', () => {
        const length = field.value.length;
        counter.textContent = `${length} / ${maxLength} characters`;
        
        if (length > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
        
        if (length > maxLength) {
            counter.classList.add('error');
            field.value = field.value.substring(0, maxLength);
        } else {
            counter.classList.remove('error');
        }
    });
}

function addFormEnhancements() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Add form progress indicator
    addProgressIndicator(form);
    
    // Add smart field suggestions
    addFieldSuggestions();
    
    // Add form auto-save
    addAutoSave(form);
    
    // Add keyboard shortcuts
    addKeyboardShortcuts(form);
}

function addProgressIndicator(form) {
//     const fields = form.querySelectorAll('input[required], textarea[required]');
//     const progressContainer = document.createElement('div');
//     progressContainer.className = 'form-progress';
//     progressContainer.innerHTML = `
//         <div class="progress-bar">
//             <div class="progress-fill"></div>
//         </div>
//         <span class="progress-text">0% Complete</span>
//     `;
    
//     form.insertBefore(progressContainer, form.firstChild);
    
//     const progressFill = progressContainer.querySelector('.progress-fill');
//     const progressText = progressContainer.querySelector('.progress-text');
    
//     function updateProgress() {
//         const filledFields = Array.from(fields).filter(field => 
//             field.value.trim().length > 0
//         ).length;
        
//         const percentage = Math.round((filledFields / fields.length) * 100);
//         progressFill.style.width = percentage + '%';
//         progressText.textContent = percentage + '% Complete';
        
//         if (percentage === 100) {
//             progressContainer.classList.add('complete');
//         } else {
//             progressContainer.classList.remove('complete');
//         }
//     }
    
//     fields.forEach(field => {
//         field.addEventListener('input', updateProgress);
//         field.addEventListener('blur', updateProgress);
//     });
}

function addFieldSuggestions() {
    // Add sport suggestions
    const sportField = document.getElementById('sport');
    if (sportField) {
        const commonSports = [
            'Basketball', 'Football', 'Soccer', 'Ski Racing', 'Lacrosse', 
            'Tennis', 'Swimming', 'Track & Field', 'Cross Country', 
            'Volleyball', 'Golf', 'Wrestling', 'Gymnastics', 'Hockey'
        ];
        addDatalist(sportField, 'sports-list', commonSports);
    }
    
    // Add grade level suggestions
    const gradeField = document.getElementById('grade');
    if (gradeField) {
        const gradeLevels = [
            '9th Grade', '10th Grade', '11th Grade', '12th Grade',
            'College Freshman', 'College Sophomore', 'College Junior', 'College Senior',
            'Graduate Student', 'Adult Learner'
        ];
        addDatalist(gradeField, 'grades-list', gradeLevels);
    }
    
    // Add subject suggestions
    const subjectsField = document.getElementById('subjects');
    if (subjectsField) {
        const commonSubjects = [
            'Mathematics', 'Algebra', 'Calculus', 'Statistics', 
            'Biology', 'Chemistry', 'Physics', 'Environmental Science',
            'English', 'Literature', 'Writing', 'History', 'Psychology',
            'Foreign Languages', 'Computer Science', 'SAT Prep', 'ACT Prep'
        ];
        addDatalist(subjectsField, 'subjects-list', commonSubjects);
    }
}

function addDatalist(field, listId, options) {
    const datalist = document.createElement('datalist');
    datalist.id = listId;
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        datalist.appendChild(optionElement);
    });
    
    field.setAttribute('list', listId);
    field.parentNode.appendChild(datalist);
}

function addAutoSave(form) {
    const STORAGE_KEY = 'athletic-minds-contact-form';
    
    // Load saved data on page load
    loadSavedFormData(form);
    
    // Save form data on input
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('input', debounce(() => saveFormData(form), 1000));
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', () => {
        setTimeout(() => clearSavedFormData(), 3000);
    });
}

function saveFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem('athletic-minds-contact-form', JSON.stringify(data));
    
    // Show auto-save indicator
    showAutoSaveIndicator();
}

function loadSavedFormData(form) {
    try {
        const savedData = localStorage.getItem('athletic-minds-contact-form');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.entries(data).forEach(([key, value]) => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && value) {
                    field.value = value;
                }
            });
            
            // Show restore indicator
            showRestoreIndicator();
        }
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

function clearSavedFormData() {
    localStorage.removeItem('athletic-minds-contact-form');
}

function showAutoSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator';
    indicator.textContent = 'Draft saved ✓';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        indicator.classList.add('hide');
        setTimeout(() => indicator.remove(), 300);
    }, 2000);
}

function showRestoreIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'restore-indicator';
    indicator.innerHTML = `
        <span>Previous draft restored</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    const form = document.getElementById('contact-form');
    form.insertBefore(indicator, form.firstChild);
}

function addKeyboardShortcuts(form) {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (form.contains(activeElement)) {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to clear form
        if (e.key === 'Escape' && form.contains(document.activeElement)) {
            if (confirm('Clear all form data?')) {
                form.reset();
                clearSavedFormData();
            }
        }
    });
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

function debounceValidation(func, wait) {
    return debounce(func, wait);
}

// Add contact form styles
function addContactFormStyles() {
    const styles = `
        <style>
            .form-progress {
                margin-bottom: 2rem;
                padding: 1rem;
                background: var(--light-gray);
                border-radius: 8px;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--accent-orange), var(--primary-blue));
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 0.9rem;
                color: var(--primary-blue);
                font-weight: 600;
            }
            
            // .form-progress.complete .progress-text {
            //     color: #27ae60;
            // }
            
            .field-error-message {
                color: #e74c3c;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            }
            
            .character-counter {
                font-size: 0.8rem;
                color: var(--dark-gray);
                text-align: right;
                margin-top: 0.25rem;
            }
            
            .character-counter.warning {
                color: var(--accent-orange);
            }
            
            .character-counter.error {
                color: #e74c3c;
                font-weight: bold;
            }
            
            .auto-save-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary-blue);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.8rem;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .auto-save-indicator.show {
                opacity: 1;
                transform: translateY(0);
            }
            
            .auto-save-indicator.hide {
                opacity: 0;
                transform: translateY(20px);
            }
            
            .restore-indicator {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .restore-indicator button {
                background: none;
                border: none;
                color: #155724;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                margin-left: 1rem;
            }
            
            .success-content, .error-content {
                text-align: center;
                padding: 1rem;
            }
            
            .success-icon, .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                display: block;
            }
            
            .next-steps, .alternative-contact {
                margin: 1.5rem 0;
                text-align: left;
            }
            
            .next-steps h4, .alternative-contact h4 {
                color: var(--primary-blue);
                margin-bottom: 1rem;
            }
            
            .next-steps ul {
                margin-left: 1rem;
            }
            
            .next-steps li {
                margin-bottom: 0.5rem;
            }
            
            .immediate-help, .alternative-contact {
                background: var(--light-gray);
                padding: 1rem;
                border-radius: 8px;
                margin-top: 1rem;
            }
            
            .error-details {
                background: #f8d7da;
                color: #721c24;
                padding: 0.75rem;
                border-radius: 4px;
                margin: 1rem 0;
                font-family: monospace;
                font-size: 0.9rem;
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--light-gray);
            }
            
            @media (max-width: 768px) {
                .modal-actions {
                    flex-direction: column;
                }
                
                .auto-save-indicator {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                    text-align: center;
                }
                
                .restore-indicator {
                    flex-direction: column;
                    text-align: center;
                }
                
                .restore-indicator button {
                    margin-left: 0;
                    margin-top: 0.5rem;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Initialize styles when script loads
addContactFormStyles();
    

window.initContactForm = initializeContactForm;