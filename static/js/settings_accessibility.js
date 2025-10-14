// ==========================================
// ACCESSIBILITY TAB
// ==========================================

function createAccessibilityContent(user, isMobile = false) {
    const padding = isMobile ? 20 : 40;
    const labelWidth = isMobile ? 180 : 200;

    return {
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: padding },
                    {
                        rows: [
                            // ==========================================
                            // FIRST ROW: INTERACTION & NAVIGATION
                            // ==========================================
                            {
                                view: "form",
                                id: "interactionNavigationForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '18px' : '20px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>Interaction & Navigation</div>`,
                                        height: 45,
                                        borderless: true
                                    },

                                    // Two columns for mobile/desktop responsiveness
                                    isMobile ? {
                                        rows: [
                                            // Keyboard Navigation (Mobile - Full Width)
                                            {
                                                rows: [
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:15px; font-weight:600; color:#34495e; margin-bottom:5px;'>⌨️ Keyboard Navigation</div>`,
                                                        height: 30,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:13px; color:#7f8c8d; margin-bottom:10px; line-height:1.5;'>Use arrow keys to navigate between form fields and Enter to click buttons.</div>`,
                                                        height: 50,
                                                        borderless: true
                                                    },
                                                    {
                                                        cols: [
                                                            {
                                                                view: "label",
                                                                label: "Status:",
                                                                width: 80
                                                            },
                                                            {
                                                                view: "switch",
                                                                id: "keyboardNavigationSwitch",
                                                                onLabel: "Enabled",
                                                                offLabel: "Disabled",
                                                                value: user.keyboard_navigation !== false ? 1 : 0,
                                                                on: {
                                                                    onChange: function (newVal) {
                                                                        handleAccessibilityChange('keyboard_navigation', newVal === 1);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            { height: 25 },

                                            // Screen Reader (Mobile - Full Width)
                                            {
                                                rows: [
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:15px; font-weight:600; color:#34495e; margin-bottom:5px;'>🔊 Screen Reader Compatibility</div>`,
                                                        height: 30,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:13px; color:#7f8c8d; margin-bottom:10px; line-height:1.5;'>Enable audio announcements for search results and important updates.</div>`,
                                                        height: 50,
                                                        borderless: true
                                                    },
                                                    {
                                                        cols: [
                                                            {
                                                                view: "label",
                                                                label: "Status:",
                                                                width: 80
                                                            },
                                                            {
                                                                view: "switch",
                                                                id: "screenReaderSwitch",
                                                                onLabel: "Enabled",
                                                                offLabel: "Disabled",
                                                                value: user.screen_reader || false ? 1 : 0,
                                                                on: {
                                                                    onChange: function (newVal) {
                                                                        handleAccessibilityChange('screen_reader', newVal === 1);
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    } : {
                                        // Desktop - Two Columns
                                        cols: [
                                            // LEFT COLUMN: Keyboard Navigation
                                            {
                                                rows: [
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:5px;'>⌨️ Keyboard Navigation</div>`,
                                                        height: 30,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:13px; color:#7f8c8d; margin-bottom:10px; line-height:1.5;'>Use arrow keys to navigate between form fields and Enter to click buttons.</div>`,
                                                        height: 50,
                                                        borderless: true
                                                    },
                                                    {
                                                        cols: [
                                                            {
                                                                view: "label",
                                                                label: "Status:",
                                                                width: 80
                                                            },
                                                            {
                                                                view: "switch",
                                                                id: "keyboardNavigationSwitch",
                                                                onLabel: "Enabled",
                                                                offLabel: "Disabled",
                                                                value: user.keyboard_navigation !== false ? 1 : 0,
                                                                width: 150,
                                                                on: {
                                                                    onChange: function (newVal) {
                                                                        handleAccessibilityChange('keyboard_navigation', newVal === 1);
                                                                    }
                                                                }
                                                            },
                                                            {}
                                                        ]
                                                    }
                                                ]
                                            },
                                            { width: 30 },

                                            // RIGHT COLUMN: Screen Reader
                                            {
                                                rows: [
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:5px;'>🔊 Screen Reader Compatibility</div>`,
                                                        height: 30,
                                                        borderless: true
                                                    },
                                                    {
                                                        view: "template",
                                                        template: `<div style='font-size:13px; color:#7f8c8d; margin-bottom:10px; line-height:1.5;'>Enable audio announcements for search results and important updates.</div>`,
                                                        height: 50,
                                                        borderless: true
                                                    },
                                                    {
                                                        cols: [
                                                            {
                                                                view: "label",
                                                                label: "Status:",
                                                                width: 80
                                                            },
                                                            {
                                                                view: "switch",
                                                                id: "screenReaderSwitch",
                                                                onLabel: "Enabled",
                                                                offLabel: "Disabled",
                                                                value: user.screen_reader || false ? 1 : 0,
                                                                width: 150,
                                                                on: {
                                                                    onChange: function (newVal) {
                                                                        handleAccessibilityChange('screen_reader', newVal === 1);
                                                                    }
                                                                }
                                                            },
                                                            {}
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },

                            { height: 30 },

                            // ==========================================
                            // SECOND ROW: DISPLAY SETTINGS
                            // ==========================================
                            {
                                view: "form",
                                id: "displaySettingsForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '18px' : '20px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>Display Settings</div>`,
                                        height: 45,
                                        borderless: true
                                    },

                                    // HIGH CONTRAST MODE
                                    {
                                        view: "template",
                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:5px;'>🖥️ High Contrast Mode</div>`,
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:13px; color:#7f8c8d; margin-bottom:10px; line-height:1.5;'>Increase visual distinction between text and background for better readability.</div>`,
                                        height: 25,
                                        borderless: true
                                    },
                                    {
                                        cols: [
                                            {
                                                view: "label",
                                                label: "Status:",
                                                width: labelWidth
                                            },
                                            {
                                                view: "switch",
                                                id: "highContrastSwitch",
                                                onLabel: "Enabled",
                                                offLabel: "Disabled",
                                                value: user.high_contrast || false ? 1 : 0,
                                                width: isMobile ? undefined : 150,
                                                on: {
                                                    onChange: function (newVal) {
                                                        handleAccessibilityChange('high_contrast', newVal === 1);
                                                    }
                                                }
                                            },
                                            {}
                                        ]
                                    },

                                    { height: 25 },

                                    // THEME
                                    {
                                        view: "template",
                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:15px;'>🎨 Theme</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "segmented",
                                        id: "themeSegmented",
                                        value: user.theme || 'standard',
                                        options: [
                                            { id: "light", value: "☀️ Light" },
                                            { id: "standard", value: "⚙️ Standard" },
                                            { id: "dark", value: "🌙 Dark" }
                                        ],
                                        on: {
                                            onChange: function (newVal) {
                                                handleAccessibilityChange('theme', newVal);
                                            }
                                        }
                                    },

                                    { height: 25 },

                                    // FONT SIZE
                                    {
                                        view: "template",
                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:15px;'>📏 Font Size</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "segmented",
                                        id: "fontSizeSegmented",
                                        value: user.font_size || 'medium',
                                        options: [
                                            { id: "small", value: "Small" },
                                            { id: "medium", value: "Medium" },
                                            { id: "large", value: "Large" }
                                        ],
                                        on: {
                                            onChange: function (newVal) {
                                                handleAccessibilityChange('font_size', newVal);
                                            }
                                        }
                                    },

                                    { height: 25 },

                                    // BRIGHTNESS LEVEL (formerly Contrast Level)
                                    {
                                        view: "template",
                                        template: `<div style='font-size:16px; font-weight:600; color:#34495e; margin-bottom:20px;'>🔆 Brightness Level</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        id: "brightnessStepIndicator",
                                        template: function () {
                                            return createStepIndicator(user.brightness_level || 'normal');
                                        }(),
                                        height: 100,
                                        borderless: true,
                                        onClick: {
                                            "step-circle": function (e, id) {
                                                const level = e.target.getAttribute('data-level');
                                                if (level) {
                                                    handleBrightnessChange(level);
                                                    this.setHTML(createStepIndicator(level));
                                                }
                                            }
                                        }
                                    },
                                    { height: 20 }
                                ]
                            }
                        ]
                    },
                    { width: padding }
                ]
            },
            { height: 50 }
        ]
    };
}

// ==========================================
// STEP INDICATOR FOR BRIGHTNESS LEVELS
// ==========================================

function createStepIndicator(selectedLevel) {
    const levels = [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'highest', label: 'Highest' }
    ];
    const selectedIndex = levels.findIndex(l => l.value === selectedLevel);
    const totalSteps = levels.length - 1;

    let html = '<div style="padding: 20px 60px;">';
    html += '<div style="position: relative;">';
    html += '<div style="position: relative; height: 24px; margin-bottom: 15px;">';
    html += '<div style="position: absolute; top: 10px; left: 12px; right: 12px; height: 4px; background: #e0e0e0; border-radius: 2px;"></div>';

    if (selectedIndex >= 0) {
        const activeWidth = (selectedIndex / totalSteps) * 100;
        html += `<div style="position: absolute; top: 10px; left: 12px; width: calc(${activeWidth}% * (100% - 24px) / 100); height: 4px; background: #3498db; border-radius: 2px; transition: width 0.3s ease;"></div>`;
    }

    html += '<div style="display: flex; justify-content: space-between; position: relative; z-index: 2;">';
    levels.forEach((level, index) => {
        const isActive = index <= selectedIndex;
        const isSelected = level.value === selectedLevel;
        html += `<div class="step-circle" data-level="${level.value}" style="
            width: ${isSelected ? '24px' : '20px'};
            height: ${isSelected ? '24px' : '20px'};
            border-radius: 50%;
            background: ${isActive ? '#3498db' : '#ffffff'};
            border: ${isSelected ? '4px' : '3px'} solid ${isActive ? '#2980b9' : '#bdc3c7'};
            cursor: pointer;
            transition: all 0.3s ease;
            ${isSelected ? 'box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);' : ''}
            ${isSelected ? 'margin: -2px;' : ''}
        "></div>`;
    });
    html += '</div></div>';

    html += '<div style="display: flex; justify-content: space-between;">';
    levels.forEach((level, index) => {
        const isSelected = level.value === selectedLevel;
        html += `<div style="flex: 1; text-align: center; font-size: 13px; font-weight: ${isSelected ? '700' : '500'}; color: ${isSelected ? '#2c3e50' : '#7f8c8d'}; transition: all 0.3s ease;">${level.label}</div>`;
    });
    html += '</div></div></div>';
    return html;
}

// ==========================================
// EVENT HANDLERS
// ==========================================

async function handleAccessibilityChange(setting, value) {
    console.log('Accessibility change:', setting, value);

    switch (setting) {
        case 'keyboard_navigation':
            AccessibilityManager.applyKeyboardNavigation(value);
            break;
        case 'screen_reader':
            AccessibilityManager.applyScreenReader(value);
            break;
        case 'high_contrast':
            AccessibilityManager.applyHighContrast(value);
            break;
        case 'font_size':
            AccessibilityManager.applyFontSize(value);
            break;
        case 'theme':
            AccessibilityManager.applyTheme(value);
            break;
        case 'brightness_level':
            AccessibilityManager.applyBrightness(value);
            break;
    }

    const data = {};
    data[setting] = value;

    const result = await apiCall(API_CONFIG.ENDPOINTS.ACCESSIBILITY_SETTINGS, 'POST', data);

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        webix.message({
            type: "success",
            text: `${setting.replace('_', ' ').charAt(0).toUpperCase() + setting.replace('_', ' ').slice(1)} updated successfully`
        });
    } else {
        webix.message({
            type: "error",
            text: "Failed to save setting"
        });
    }
}

function handleBrightnessChange(level) {
    console.log('Brightness level changed to:', level);

    const indicator = $$("brightnessStepIndicator");
    if (indicator) {
        indicator.setHTML(createStepIndicator(level));
    }

    handleAccessibilityChange('brightness_level', level);
}