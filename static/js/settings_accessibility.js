// ==========================================
// ACCESSIBILITY TAB
// ==========================================

function createAccessibilityContent(user, isMobile = false) {
    const padding = isMobile ? 20 : 40;

    return {
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: padding },
                    {
                        rows: [
                            {
                                view: "form",
                                id: "accessibilitySettingsForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:5px;'>⌨️ Keyboard Navigation</div>`,
                                        height: 35,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '13px' : '14px'}; color:#7f8c8d; margin-bottom:10px;'>Use arrow keys to navigate between form fields and Enter to click buttons.</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "checkbox",
                                        id: "keyboardNavigation",
                                        labelRight: "Enable keyboard navigation",
                                        value: user.keyboard_navigation !== false,
                                        on: {
                                            onChange: function (newVal) {
                                                handleAccessibilityChange('keyboard_navigation', newVal);
                                            }
                                        }
                                    },
                                    { height: 30 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:5px;'>🔊 Screen Reader Compatibility</div>`,
                                        height: 35,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '13px' : '14px'}; color:#7f8c8d; margin-bottom:10px;'>Enable audio announcements for search results and important updates.</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "checkbox",
                                        id: "screenReader",
                                        labelRight: "Enable screen reader support",
                                        value: user.screen_reader || false,
                                        on: {
                                            onChange: function (newVal) {
                                                handleAccessibilityChange('screen_reader', newVal);
                                            }
                                        }
                                    },
                                    { height: 30 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>📏 Font Size</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "segmented",
                                        id: "fontSize",
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
                                    { height: 30 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>🎨 Theme</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "segmented",
                                        id: "theme",
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
                                    { height: 30 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:20px;'>🔆 Contrast Level</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        id: "contrastStepIndicator",
                                        template: function () {
                                            return createStepIndicator(user.contrast_level || 'normal');
                                        }(),
                                        height: 100,
                                        borderless: true,
                                        onClick: {
                                            "step-circle": function (e, id) {
                                                const level = e.target.getAttribute('data-level');
                                                if (level) {
                                                    handleContrastChange(level);
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
// STEP INDICATOR FOR CONTRAST LEVELS
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
        case 'font_size':
            AccessibilityManager.applyFontSize(value);
            break;
        case 'theme':
            AccessibilityManager.applyTheme(value);
            break;
        case 'contrast_level':
            AccessibilityManager.applyContrast(value);
            break;
    }

    const data = {};
    data[setting] = value;

    const result = await apiCall(API_CONFIG.ENDPOINTS.ACCESSIBILITY_SETTINGS, 'POST', data);

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
    } else {
        webix.message({
            type: "error",
            text: "Failed to save setting"
        });
    }
}

function handleContrastChange(level) {
    console.log('Contrast level changed to:', level);

    const indicator = $("contrastStepIndicator");
    if (indicator) {
        indicator.setHTML(createStepIndicator(level));
    }

    handleAccessibilityChange('contrast_level', level);
}