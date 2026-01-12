// ===== FORM STATE MANAGEMENT =====
let currentStep = 1;
const totalSteps = 7;
const formData = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    captureUTMParameters();
    updateProgress();
    setupEventListeners();
});

// ===== UTM PARAMETER CAPTURE =====
function captureUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    // Capture UTM parameters
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const fbclid = urlParams.get('fbclid');

    // Store in hidden fields
    if (utmSource) document.getElementById('utm_source').value = utmSource;
    if (utmMedium) document.getElementById('utm_medium').value = utmMedium;
    if (utmCampaign) document.getElementById('utm_campaign').value = utmCampaign;
    if (fbclid) document.getElementById('fbclid').value = fbclid;

    // Store in formData
    formData.utm_source = utmSource || '';
    formData.utm_medium = utmMedium || '';
    formData.utm_campaign = utmCampaign || '';
    formData.fbclid = fbclid || '';
}

// ===== NAVIGATION FUNCTIONS =====
function nextStep() {
    if (currentStep < totalSteps + 1) {
        // Hide current slide
        const currentSlide = document.querySelector(`[data-step="${currentStep}"]`);
        currentSlide.classList.remove('active');

        // Show next slide
        currentStep++;
        const nextSlide = document.querySelector(`[data-step="${currentStep}"]`);
        nextSlide.classList.add('active');

        updateProgress();
        // Only scroll to top on first step and final booking page
        if (currentStep === 1 || currentStep === 8) {
            scrollToTop();
        }
        trackStepView(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        // Hide current slide
        const currentSlide = document.querySelector(`[data-step="${currentStep}"]`);
        currentSlide.classList.remove('active');

        // Show previous slide
        currentStep--;
        const prevSlide = document.querySelector(`[data-step="${currentStep}"]`);
        prevSlide.classList.add('active');

        updateProgress();
        // Don't scroll when going back through questions
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');

    // Calculate progress percentage - start at 0, complete at 100
    const progress = Math.round(((currentStep - 1) / totalSteps) * 100);
    progressBar.style.width = `${progress}%`;
    progressPercent.textContent = progress;
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDATION FUNCTIONS =====
function validateAndNext(step) {
    let isValid = false;
    let errorMessage = '';

    switch(step) {
        case 1:
            // Validate hair loss type (at least one checkbox)
            const hairLossChecked = document.querySelectorAll('input[name="hairLossType"]:checked');
            if (hairLossChecked.length > 0) {
                isValid = true;
                formData.hairLossType = Array.from(hairLossChecked).map(cb => cb.value);
            } else {
                errorMessage = 'Please select at least one option to continue';
            }
            break;

        case 2:
            // Validate SMP understanding
            const smpUnderstanding = document.querySelector('input[name="understandSMP"]:checked');
            if (smpUnderstanding) {
                isValid = true;
                formData.understandSMP = smpUnderstanding.value;
            } else {
                errorMessage = 'Please select an option to continue';
            }
            break;

        case 3:
            // Validate severity rating
            const severity = document.querySelector('input[name="severity"]:checked');
            if (severity) {
                isValid = true;
                formData.severity = severity.value;
            } else {
                errorMessage = 'Please rate your hair loss severity';
            }
            break;

        case 4:
            // Validate scalp conditions
            const scalpConditions = document.querySelector('input[name="scalpConditions"]:checked');
            if (scalpConditions) {
                isValid = true;
                formData.scalpConditions = scalpConditions.value;
            } else {
                errorMessage = 'Please select an option';
            }
            break;

        case 5:
            // Validate timeline
            const timeline = document.querySelector('input[name="timeline"]:checked');
            if (timeline) {
                isValid = true;
                formData.timeline = timeline.value;
            } else {
                errorMessage = 'Please select your preferred timeline';
            }
            break;

        case 6:
            // Validate zip code
            const zipCode = document.getElementById('zipCode');
            const zipRegex = /^[0-9]{5}$/;
            if (!zipCode.value.trim()) {
                errorMessage = 'Please enter your zip code';
                zipCode.classList.add('error');
            } else if (!zipRegex.test(zipCode.value.trim())) {
                errorMessage = 'Please enter a valid 5-digit zip code';
                zipCode.classList.add('error');
            } else {
                isValid = true;
                formData.zipCode = zipCode.value.trim();
                zipCode.classList.remove('error');
            }
            break;
    }

    if (isValid) {
        hideError(step);
        nextStep();
    } else {
        showError(step, errorMessage);
    }
}

function showError(step, message) {
    const errorElement = document.getElementById(`error-${step}`);
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(step) {
    const errorElement = document.getElementById(`error-${step}`);
    errorElement.classList.remove('show');
}

// ===== CONTACT FORM VALIDATION =====
function validateContactForm() {
    let isValid = true;
    const errors = [];

    // First Name
    const firstName = document.getElementById('firstName');
    if (!firstName.value.trim()) {
        firstName.classList.add('error');
        errors.push('First name is required');
        isValid = false;
    } else {
        firstName.classList.remove('error');
    }

    // Last Name
    const lastName = document.getElementById('lastName');
    if (!lastName.value.trim()) {
        lastName.classList.add('error');
        errors.push('Last name is required');
        isValid = false;
    } else {
        lastName.classList.remove('error');
    }

    // Phone Validation (US format)
    const phone = document.getElementById('phone');
    const phoneRegex = /^[\(]?[0-9]{3}[\)]?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/;
    if (!phone.value.trim()) {
        phone.classList.add('error');
        errors.push('Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add('error');
        errors.push('Please enter a valid US phone number');
        isValid = false;
    } else {
        phone.classList.remove('error');
    }

    // Email Validation
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        email.classList.add('error');
        errors.push('Email is required');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        errors.push('Please enter a valid email address');
        isValid = false;
    } else {
        email.classList.remove('error');
    }

    // SMS Consent (required)
    const smsConsent = document.getElementById('smsConsent');
    if (!smsConsent.checked) {
        errors.push('You must consent to receive SMS notifications');
        isValid = false;
    }
    formData.smsConsent = smsConsent.checked;

    if (!isValid) {
        showError(7, errors.join('. '));
    } else {
        hideError(7);
    }

    return isValid;
}

// ===== PHONE NUMBER FORMATTING =====
function formatPhoneNumber(value) {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');

    // Format as (XXX) XXX-XXXX
    if (numbers.length <= 3) {
        return numbers;
    } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
    // Phone number auto-formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        const formatted = formatPhoneNumber(e.target.value);
        e.target.value = formatted;
    });

    // Form submission
    const form = document.getElementById('qualificationForm');
    form.addEventListener('submit', handleFormSubmit);

    // Radio button click handlers - clear errors and AUTO-ADVANCE
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const questionCard = this.closest('.question-card');
            const step = parseInt(questionCard.dataset.step);
            hideError(step);

            // Auto-advance for multiple choice questions (steps 2, 3, 4, 5)
            if ([2, 3, 4, 5].includes(step)) {
                // Add a slight delay for better UX
                setTimeout(() => {
                    validateAndNext(step);
                }, 400);
            }
        });
    });

    // Checkbox handlers - auto-advance when at least one is checked
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="hairLossType"]');
    let checkboxTimeout;
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const step = parseInt(this.closest('.question-card').dataset.step);
            hideError(step);

            // Clear previous timeout
            clearTimeout(checkboxTimeout);

            // Check if at least one checkbox is selected
            const anyChecked = document.querySelectorAll('input[name="hairLossType"]:checked').length > 0;

            if (anyChecked) {
                // Auto-advance after a delay (gives user time to select multiple)
                checkboxTimeout = setTimeout(() => {
                    validateAndNext(step);
                }, 800);
            }
        });
    });

    // Zip code input - numbers only
    const zipInput = document.getElementById('zipCode');
    zipInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
        hideError(6);
    });

    // Real-time validation for contact form
    document.getElementById('firstName').addEventListener('input', () => hideError(7));
    document.getElementById('lastName').addEventListener('input', () => hideError(7));
    document.getElementById('phone').addEventListener('input', () => hideError(7));
    document.getElementById('email').addEventListener('input', () => hideError(7));
}

// ===== FORM SUBMISSION HANDLER =====
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate contact form
    if (!validateContactForm()) {
        return;
    }

    // Collect contact information
    formData.firstName = document.getElementById('firstName').value.trim();
    formData.lastName = document.getElementById('lastName').value.trim();
    formData.phone = document.getElementById('phone').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.smsConsent = document.getElementById('smsConsent').checked;

    // Add timestamp
    formData.timestamp = new Date().toISOString();
    formData.leadScore = calculateLeadScore(formData);

    // Show loading state
    const submitButton = document.querySelector('.btn-submit');
    submitButton.classList.add('loading');
    submitButton.innerHTML = 'Submitting...';

    // Submit form data
    try {
        await submitFormData(formData);

        // Track conversion (Meta Pixel)
        trackEvent('form_submitted', formData);
        trackConversion();

        // Log to console (for development)
        console.log('Form submitted successfully:', formData);

        // Success - redirect to thank you page with calendar
        window.location.href = '/thank-you';

    } catch (error) {
        // Error handling
        showError(7, 'There was an error submitting your form. Please try again.');
        console.error('Submission error:', error);
    } finally {
        // Remove loading state
        submitButton.classList.remove('loading');
        submitButton.innerHTML = 'Get My Free Consultation <span class="arrow">→</span>';
    }
}

// ===== API SUBMISSION FUNCTION =====
async function submitFormData(data) {
    // Replace this URL with your actual form submission endpoint
    // Options:
    // - Formspree: https://formspree.io/f/YOUR_FORM_ID
    // - Google Forms webhook
    // - Custom backend API
    // - Zapier webhook: https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/
    // - Make.com webhook

    // Webhook endpoints
    const ZAPIER_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/6604274/uwjn5fz/';
    const MAKE_WEBHOOK = 'https://hook.us1.make.com/ad55zgp1dbrt52smupscfvgadqncojve';

    // Submit to both webhooks in parallel
    const zapierRequest = fetch(ZAPIER_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const makeRequest = fetch(MAKE_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Wait for both requests to complete
    return Promise.all([zapierRequest, makeRequest])
        .then(() => {
            return { success: true };
        })
        .catch(error => {
            console.error('Webhook submission error:', error);
            throw error;
        });
}

// ===== LEAD SCORING FUNCTION =====
function calculateLeadScore(data) {
    let score = 0;

    // Severity scoring (higher severity = higher score)
    const severityValue = parseInt(data.severity) || 0;
    score += severityValue * 2; // 0-20 points

    // Timeline scoring
    if (data.timeline === 'asap') score += 30;
    else if (data.timeline === '1-month') score += 25;
    else if (data.timeline === '1-3-months') score += 15;
    else score += 5;

    // Understanding scoring
    if (data.understandSMP === 'yes-understood') score += 20;
    else score += 10;

    // Scalp condition scoring (no conditions = better candidate)
    if (data.scalpConditions === 'no') score += 15;
    else if (data.scalpConditions === 'yes-mild') score += 10;
    else if (data.scalpConditions === 'not-sure') score += 8;
    else score += 5;

    // SMS consent bonus
    if (data.smsConsent) score += 5;

    return Math.min(score, 100); // Cap at 100
}

// ===== FAQ ACCORDION =====
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const wasActive = faqItem.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// ===== ANALYTICS TRACKING =====
function trackEvent(eventName, eventData) {
    // Add your analytics tracking here (Google Analytics, Facebook Pixel, etc.)
    console.log('Event:', eventName, eventData);

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

function trackStepView(step) {
    trackEvent('form_step_viewed', {
        step: step,
        step_name: `Question ${step} of ${totalSteps}`
    });
}

function trackConversion() {
    // Meta Pixel Conversion Event
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'SMP Qualification Form',
            content_category: 'Lead Generation',
            value: formData.leadScore || 0,
            currency: 'USD'
        });
    }

    // Google Analytics Conversion
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your conversion ID
            'value': formData.leadScore || 0,
            'currency': 'USD'
        });
    }

    console.log('Conversion tracked - Lead Score:', formData.leadScore);
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function(e) {
    // Enter key to advance (except on text inputs and textareas)
    if (e.key === 'Enter' &&
        e.target.tagName !== 'TEXTAREA' &&
        e.target.type !== 'text' &&
        e.target.type !== 'email' &&
        e.target.type !== 'tel') {

        const currentSlide = document.querySelector(`[data-step="${currentStep}"]`);
        const continueButton = currentSlide.querySelector('.btn-next');
        if (continueButton && currentStep !== 7) {
            e.preventDefault();
            continueButton.click();
        }
    }
});

// ===== AUTO-SAVE TO LOCAL STORAGE (Optional) =====
function saveProgress() {
    localStorage.setItem('scalpCarolinasFormData', JSON.stringify(formData));
}

function loadProgress() {
    const savedData = localStorage.getItem('scalpCarolinasFormData');
    if (savedData) {
        return JSON.parse(savedData);
    }
    return null;
}

function clearProgress() {
    localStorage.removeItem('scalpCarolinasFormData');
}

// ===== LEAD QUALITY ASSESSMENT =====
function assessLeadQuality(score) {
    if (score >= 70) {
        return 'hot'; // Contact within 24 hours
    } else if (score >= 50) {
        return 'warm'; // Contact within 2-3 days
    } else {
        return 'cold'; // Contact within a week
    }
}

// ===== EXPORT FUNCTIONS FOR INLINE USE =====
window.nextStep = nextStep;
window.prevStep = prevStep;
window.validateAndNext = validateAndNext;
window.toggleFAQ = toggleFAQ;
