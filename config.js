// Configuration file for Scalp Carolinas Landing Page
// Update these values according to your setup

const CONFIG = {
    // Form Submission Endpoint
    // Replace with your actual form handling endpoint
    // Examples:
    // - Formspree: 'https://formspree.io/f/YOUR_FORM_ID'
    // - Custom API: 'https://api.scalpcarolinas.com/leads'
    // - Zapier: 'https://hooks.zapier.com/hooks/catch/xxxxx/xxxxx/'
    formEndpoint: 'YOUR_FORM_ENDPOINT_HERE',

    // Google Analytics (optional)
    // Add your GA4 measurement ID
    googleAnalyticsId: 'G-XXXXXXXXXX',

    // Email notifications
    notificationEmail: 'info@scalpcarolinas.com',

    // Lead Score Thresholds
    leadScoring: {
        hot: 70,      // 70+ points = hot lead (contact within 24 hours)
        warm: 50,     // 50-69 points = warm lead (contact within 2-3 days)
        cold: 0       // Below 50 = cold lead (contact within a week)
    },

    // Form Settings
    form: {
        autoAdvanceOnRadio: false,  // Auto-advance to next question on radio selection
        showProgressBar: true,
        enableKeyboardNavigation: true,
        phoneFormat: 'US',          // US phone format (XXX) XXX-XXXX
    },

    // Validation Rules
    validation: {
        minPhoneLength: 10,
        requireAllFields: true,
        emailDomainBlacklist: []    // Optional: block disposable email domains
    },

    // CRM Integration (optional)
    crm: {
        enabled: false,
        provider: 'none',           // 'hubspot', 'salesforce', 'none'
        apiKey: '',
    },

    // Redirects
    redirects: {
        afterSubmit: null,          // null = show thank you page, or URL to redirect
        websiteUrl: 'https://scalpcarolinas.com'
    },

    // A/B Testing (optional)
    testing: {
        enabled: false,
        variant: 'A'                // 'A' or 'B'
    }
};

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
