// ==========================================
// ACCESSIBILITY MANAGER
// ==========================================

const AccessibilityManager = {
    // Speech synthesis instance
    synthesis: window.speechSynthesis,
    isScreenReaderEnabled: false,
    currentUtterance: null,

    // Apply Keyboard Navigation
    applyKeyboardNavigation: function (enabled) {
        console.log('Keyboard navigation:', enabled);
        if (enabled) {
            document.body.setAttribute('data-keyboard-nav', 'true');
            // Add keyboard navigation styles
            const style = document.getElementById('keyboard-nav-style') || document.createElement('style');
            style.id = 'keyboard-nav-style';
            style.innerHTML = `
                *:focus {
                    outline: 2px solid #3498db !important;
                    outline-offset: 2px !important;
                }
            `;
            if (!document.getElementById('keyboard-nav-style')) {
                document.head.appendChild(style);
            }
        } else {
            document.body.removeAttribute('data-keyboard-nav');
            const style = document.getElementById('keyboard-nav-style');
            if (style) style.remove();
        }
    },

    // Apply Screen Reader
    applyScreenReader: function (enabled) {
        console.log('Screen reader:', enabled);
        this.isScreenReaderEnabled = enabled;
        document.body.setAttribute('data-screen-reader', enabled ? 'true' : 'false');

        if (enabled) {
            // Add ARIA labels and announcements
            document.body.setAttribute('role', 'application');
            this.speak('Screen reader enabled. You will now hear announcements for search results and important updates.');
        } else {
            document.body.removeAttribute('role');
            // Cancel any ongoing speech
            if (this.synthesis.speaking) {
                this.synthesis.cancel();
            }
            this.speak('Screen reader disabled.');
        }
    },

    // NEW: Apply High Contrast Mode
    applyHighContrast: function (enabled) {
        console.log('High contrast mode:', enabled);

        if (enabled) {
            document.body.classList.add('high-contrast-mode');

            // Create or update high contrast stylesheet
            let style = document.getElementById('high-contrast-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'high-contrast-style';
                document.head.appendChild(style);
            }

            style.innerHTML = `
                .high-contrast-mode {
                    background-color: #000000 !important;
                    color: #FFFFFF !important;
                }
                
                .high-contrast-mode * {
                    background-color: #000000 !important;
                    color: #FFFFFF !important;
                    border-color: #FFFFFF !important;
                }
                
                .high-contrast-mode .webix_view,
                .high-contrast-mode .webix_layout_line,
                .high-contrast-mode .webix_layout_toolbar,
                .high-contrast-mode .webix_toolbar,
                .high-contrast-mode .webix_form {
                    background-color: #000000 !important;
                }
                
                .high-contrast-mode input,
                .high-contrast-mode textarea,
                .high-contrast-mode select,
                .high-contrast-mode .webix_inp_static {
                    background-color: #000000 !important;
                    color: #FFFFFF !important;
                    border: 2px solid #FFFFFF !important;
                }
                
                .high-contrast-mode button,
                .high-contrast-mode .webix_button,
                .high-contrast-mode .webix_el_button button {
                    background-color: #000000 !important;
                    color: #FFFF00 !important;
                    border: 2px solid #FFFF00 !important;
                }
                
                .high-contrast-mode button:hover,
                .high-contrast-mode .webix_button:hover {
                    background-color: #FFFF00 !important;
                    color: #000000 !important;
                }
                
                .high-contrast-mode a,
                .high-contrast-mode .webix_link {
                    color: #00FFFF !important;
                }
                
                .high-contrast-mode a:hover,
                .high-contrast-mode .webix_link:hover {
                    color: #FFFF00 !important;
                }
                
                .high-contrast-mode *:focus {
                    outline: 3px solid #00FF00 !important;
                    outline-offset: 2px !important;
                }
                
                .high-contrast-mode .webix_primary,
                .high-contrast-mode .webix_primary button {
                    background-color: #FFA500 !important;
                    color: #000000 !important;
                    border: 2px solid #FFFFFF !important;
                }
                
                .high-contrast-mode .webix_el_label,
                .high-contrast-mode .webix_inp_label {
                    color: #CCCCCC !important;
                }
                
                .high-contrast-mode .user_card {
                    background-color: #000000 !important;
                    border: 2px solid #FFFFFF !important;
                }
                
                .high-contrast-mode img {
                    border: 2px solid #FFFFFF !important;
                    opacity: 0.9;
                }
                
                .high-contrast-mode .webix_template {
                    background-color: transparent !important;
                }
            `;

            if (this.isScreenReaderEnabled) {
                this.speak('High contrast mode enabled');
            }
        } else {
            document.body.classList.remove('high-contrast-mode');
            const style = document.getElementById('high-contrast-style');
            if (style) {
                style.remove();
            }

            if (this.isScreenReaderEnabled) {
                this.speak('High contrast mode disabled');
            }
        }
    },

    // Apply Font Size
    applyFontSize: function (size) {
        console.log('Font size:', size);
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${size}`);

        // Create or update font size stylesheet
        let style = document.getElementById('font-size-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'font-size-style';
            document.head.appendChild(style);
        }

        const fontSizes = {
            small: '12px',
            medium: '14px',
            large: '18px'
        };

        style.innerHTML = `
            body.font-${size} {
                font-size: ${fontSizes[size]} !important;
            }
            body.font-${size} .webix_view {
                font-size: ${fontSizes[size]} !important;
            }
        `;

        if (this.isScreenReaderEnabled) {
            this.speak(`Font size changed to ${size}`);
        }
    },

    // Apply Theme
    applyTheme: function (theme) {
        console.log('Theme:', theme);
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-standard');
        document.body.classList.add(`theme-${theme}`);

        // Create or update theme stylesheet
        let style = document.getElementById('theme-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'theme-style';
            document.head.appendChild(style);
        }

        if (theme === 'light') {
            style.innerHTML = `
                body.theme-light {
                    background-color: #f8f9fa !important;
                }
                body.theme-light .webix_view {
                    background-color: #ffffff !important;
                    color: #212529 !important;
                }
            `;
        } else if (theme === 'dark') {
            style.innerHTML = `
                body.theme-dark {
                    background-color: #1a1a1a !important;
                }
                body.theme-dark .webix_view {
                    background-color: #2d2d2d !important;
                    color: #e0e0e0 !important;
                }
                body.theme-dark input,
                body.theme-dark textarea {
                    background-color: #3a3a3a !important;
                    color: #e0e0e0 !important;
                    border-color: #555 !important;
                }
            `;
        } else {
            style.innerHTML = '';
        }

        if (this.isScreenReaderEnabled) {
            this.speak(`Theme changed to ${theme}`);
        }
    },

    // Apply Brightness Level
    applyBrightness: function (level) {
        console.log('Brightness level:', level);
        document.body.classList.remove('brightness-low', 'brightness-normal', 'brightness-high', 'brightness-highest');
        document.body.classList.add(`brightness-${level}`);

        // Create or update brightness stylesheet
        let style = document.getElementById('brightness-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'brightness-style';
            document.head.appendChild(style);
        }

        const brightnessLevels = {
            low: '0.7',
            normal: '1.0',
            high: '1.2',
            highest: '1.5'
        };

        style.innerHTML = `
            body.brightness-${level} {
                filter: brightness(${brightnessLevels[level]});
            }
        `;

        if (this.isScreenReaderEnabled) {
            this.speak(`Brightness level changed to ${level}`);
        }
    },

    // Text-to-Speech function
    speak: function (text, priority = 'normal') {
        if (!this.isScreenReaderEnabled) return;

        // Cancel current speech if priority is high
        if (priority === 'high' && this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;  // Normal speed
        utterance.pitch = 1.0; // Normal pitch
        utterance.volume = 1.0; // Full volume
        utterance.lang = 'en-US';

        // Error handling
        utterance.onerror = function (event) {
            console.error('Speech synthesis error:', event);
        };

        this.currentUtterance = utterance;
        this.synthesis.speak(utterance);
    },

    // Read search results for screen reader
    readSearchResults: function (results) {
        if (!this.isScreenReaderEnabled) return;

        const count = results.length;

        if (count === 0) {
            this.speak('No results found. Please try a different search term.', 'high');
            return;
        }

        // Announce count
        const countMessage = `Found ${count} result${count !== 1 ? 's' : ''}`;
        this.speak(countMessage, 'high');

        // Wait a bit, then read first few results
        setTimeout(() => {
            if (!this.isScreenReaderEnabled) return;

            const maxResults = Math.min(3, count);
            let message = `Reading first ${maxResults} result${maxResults !== 1 ? 's' : ''}: `;

            for (let i = 0; i < maxResults; i++) {
                const user = results[i];
                const name = `${user.first_name} ${user.last_name}`;
                const job = user.job_role || 'Position not specified';
                const dept = user.department || 'Department not specified';

                message += `Result ${i + 1}: ${name}, ${job}, ${dept}. `;
            }

            if (count > maxResults) {
                message += `And ${count - maxResults} more result${count - maxResults !== 1 ? 's' : ''}.`;
            }

            this.speak(message);
        }, 1500);
    },

    // Read single user details
    readUserDetails: function (user) {
        if (!this.isScreenReaderEnabled) return;

        let message = `User details for ${user.first_name} ${user.last_name}. `;

        if (user.job_role) {
            message += `Position: ${user.job_role}. `;
        }

        if (user.department) {
            message += `Department: ${user.department}. `;
        }

        if (user.email) {
            message += `Email: ${user.email}. `;
        }

        if (user.phone_number) {
            message += `Phone: ${user.phone_number}. `;
        }

        this.speak(message);
    },

    // Announce page navigation
    announcePageChange: function (pageName) {
        if (!this.isScreenReaderEnabled) return;

        const pageMessages = {
            'home': 'Home page. Search for people.',
            'profile': 'Profile page. View and edit your profile.',
            'settings': 'Settings page. Manage your preferences.',
            'notifications': 'Notifications page. View your notifications.'
        };

        const message = pageMessages[pageName] || `${pageName} page`;
        this.speak(message, 'high');
    },

    // Announce for ARIA
    announce: function (message) {
        if (!this.isScreenReaderEnabled) return;

        // Create or get announcement div for screen readers
        let announcer = document.getElementById('aria-announcer');
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'aria-announcer';
            announcer.setAttribute('role', 'status');
            announcer.setAttribute('aria-live', 'polite');
            announcer.setAttribute('aria-atomic', 'true');
            announcer.style.position = 'absolute';
            announcer.style.left = '-10000px';
            announcer.style.width = '1px';
            announcer.style.height = '1px';
            announcer.style.overflow = 'hidden';
            document.body.appendChild(announcer);
        }

        // Clear and announce
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);

        // Also use speech synthesis
        this.speak(message);
    },

    // Stop all speech
    stopSpeaking: function () {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
    }
};

// Initialize accessibility settings on page load
(function () {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        // Apply all saved accessibility settings
        if (user.keyboard_navigation !== undefined) {
            AccessibilityManager.applyKeyboardNavigation(user.keyboard_navigation);
        }
        if (user.screen_reader !== undefined) {
            AccessibilityManager.applyScreenReader(user.screen_reader);
        }
        if (user.high_contrast !== undefined) {
            AccessibilityManager.applyHighContrast(user.high_contrast);
        }
        if (user.font_size) {
            AccessibilityManager.applyFontSize(user.font_size);
        }
        if (user.theme) {
            AccessibilityManager.applyTheme(user.theme);
        }
        if (user.brightness_level) {
            AccessibilityManager.applyBrightness(user.brightness_level);
        }
    }
})();