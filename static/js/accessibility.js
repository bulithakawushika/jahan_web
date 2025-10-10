// Accessibility Manager
const AccessibilityManager = {
    // Initialize accessibility on page load
    init: function () {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            this.applyFontSize(user.font_size || 'medium');
            this.applyTheme(user.theme || 'standard');
            this.applyContrast(user.contrast_level || 'normal');
            this.applyKeyboardNavigation(user.keyboard_navigation !== false); // Default true
            this.applyScreenReader(user.screen_reader || false);
        } else {
            // Default settings for non-logged in users
            this.applyKeyboardNavigation(true);
        }
    },

    // Font Size Management
    applyFontSize: function (size) {
        const root = document.documentElement;

        // Remove existing font size classes
        root.classList.remove('font-small', 'font-medium', 'font-large');

        // Add new font size class
        root.classList.add('font-' + size);

        console.log('Applied font size:', size);
    },

    // Theme Management
    applyTheme: function (theme) {
        const root = document.documentElement;

        // Remove existing theme classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-standard');

        // Add new theme class
        root.classList.add('theme-' + theme);

        console.log('Applied theme:', theme);
    },

    // Contrast Management
    applyContrast: function (level) {
        const root = document.documentElement;

        // Remove existing contrast classes
        root.classList.remove('contrast-low', 'contrast-normal', 'contrast-high', 'contrast-highest');

        // Add new contrast class
        root.classList.add('contrast-' + level);

        console.log('Applied contrast:', level);
    },

    // Keyboard Navigation
    applyKeyboardNavigation: function (enabled) {
        if (enabled) {
            // Enable Webix keyboard navigation
            webix.env.keyboard = true;

            // Add visible focus indicators
            document.documentElement.classList.add('keyboard-navigation-enabled');

            console.log('Keyboard navigation enabled');
        } else {
            webix.env.keyboard = false;
            document.documentElement.classList.remove('keyboard-navigation-enabled');
            console.log('Keyboard navigation disabled');
        }
    },

    // Screen Reader Support
    applyScreenReader: function (enabled) {
        if (enabled) {
            document.documentElement.classList.add('screen-reader-enabled');

            // Enable ARIA announcements
            this.enableAriaAnnouncements();

            console.log('Screen reader enabled');
        } else {
            document.documentElement.classList.remove('screen-reader-enabled');
            console.log('Screen reader disabled');
        }
    },

    // Enable ARIA Live Announcements
    enableAriaAnnouncements: function () {
        // Create aria-live region if it doesn't exist
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }
    },

    // Announce to Screen Reader
    announce: function (message) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user || !user.screen_reader) return;

        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;

            // Also use speech synthesis if available
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;
                window.speechSynthesis.speak(utterance);
            }
        }
    },

    // Read search results for screen reader
    readSearchResults: function (results) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.screen_reader && results.length > 0) {
            let message = `Found ${results.length} result${results.length > 1 ? 's' : ''}. `;

            results.forEach((result, index) => {
                message += `Result ${index + 1}: ${result.first_name} ${result.last_name}, ${result.job_role || 'No job role'}. `;
            });

            this.announce(message);
        }
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        AccessibilityManager.init();
    });
} else {
    AccessibilityManager.init();
}