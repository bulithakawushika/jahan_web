// Settings Page UI
function createSettingsPage() {
    return {
        id: "settingsPage",
        rows: [
            // Toolbar
            {
                view: "toolbar",
                height: 60,
                elements: [
                    {
                        view: "button",
                        value: "← Back to Profile",
                        width: 150,
                        click: showProfilePage
                    },
                    {
                        view: "label",
                        label: "Settings"
                    },
                    {},
                    {
                        view: "button",
                        value: "Logout",
                        width: 100,
                        click: handleLogout
                    }
                ]
            },
            // Loading area
            {
                id: "settingsContentArea",
                rows: [
                    {
                        view: "template",
                        template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading settings...</div>",
                        borderless: true
                    }
                ]
            }
        ]
    };
}

// Load Settings Data
async function loadSettingsData() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.PROFILE, 'GET');

    if (result.success && result.user) {
        displaySettingsContent(result.user);
    } else {
        webix.message({
            type: "error",
            text: "Failed to load settings"
        });
        showProfilePage();
    }
}

// Display Settings Content - FIXED VERSION
function displaySettingsContent(user) {
    console.log('Displaying settings for user:', user);

    const contentArea = $$("settingsContentArea");

    if (!contentArea) {
        console.error('settingsContentArea not found');
        return;
    }

    // Remove loading view
    const children = contentArea.getChildViews();
    children.forEach(child => {
        contentArea.removeView(child);
    });

    // Add scrollable content
    contentArea.addView({
        view: "scrollview",
        scroll: "y",
        body: {
            rows: [
                { height: 20 },
                // Page Title
                {
                    view: "template",
                    template: "<div style='text-align:center; font-size:38px; font-weight:bold; color:#2c3e50;'>Settings</div>",
                    height: 60,
                    borderless: true
                },
                { height: 30 },
                // ALL SETTINGS IN ONE COLUMN
                {
                    rows: [
                        // 1. Account Details
                        createAccountDetailsSection(user),
                        { height: 40 },
                        // 2. Privacy & Security
                        createPrivacySecuritySection(user),
                        { height: 40 },
                        // 3. Accessibility
                        createAccessibilitySection(),
                        { height: 40 },
                        // 4. Notifications
                        createNotificationsSection(),
                        { height: 50 }
                    ]
                }
            ]
        }
    });

    console.log('Settings content displayed');
}

// 1. Account Details Section
function createAccountDetailsSection(user) {
    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #3498db;'>📋 Account Details</div>",
                height: 50,
                borderless: true
            },
            {
                view: "form",
                id: "accountDetailsForm",
                css: "settings_form",
                elements: [
                    {
                        cols: [
                            {
                                view: "text",
                                name: "first_name",
                                label: "First Name",
                                value: user.first_name,
                                labelWidth: 150
                            },
                            { width: 20 },
                            {
                                view: "text",
                                name: "last_name",
                                label: "Last Name",
                                value: user.last_name,
                                labelWidth: 150
                            }
                        ]
                    },
                    {
                        view: "text",
                        name: "username",
                        label: "Username",
                        value: user.username,
                        labelWidth: 150
                    },
                    {
                        view: "text",
                        name: "email",
                        label: "Email",
                        value: user.email,
                        labelWidth: 150
                    },
                    {
                        view: "text",
                        name: "job_role",
                        label: "Job Role",
                        value: user.job_role,
                        labelWidth: 150
                    },
                    {
                        view: "datepicker",
                        name: "birthday",
                        label: "Birthday",
                        value: user.birthday,
                        labelWidth: 150,
                        format: "%Y-%m-%d",
                        stringResult: true
                    },
                    {
                        view: "textarea",
                        name: "address",
                        label: "Address",
                        value: user.address,
                        labelWidth: 150,
                        height: 100
                    },
                    { height: 20 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Save Changes",
                                css: "webix_primary",
                                width: 150,
                                click: handleSaveAccountDetails
                            },
                            { width: 15 },
                            {
                                view: "button",
                                value: "Cancel",
                                width: 120,
                                click: function () {
                                    $$("accountDetailsForm").setValues(user);
                                    webix.message("Changes discarded");
                                }
                            },
                            {}
                        ]
                    }
                ]
            }
        ]
    };
}

// 2. Privacy & Security Section
function createPrivacySecuritySection(user) {
    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #e74c3c;'>🔒 Privacy & Security</div>",
                height: 50,
                borderless: true
            },
            {
                view: "form",
                id: "passwordForm",
                css: "settings_form",
                elements: [
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:10px;'>Change Password</div>",
                        height: 40,
                        borderless: true
                    },
                    {
                        view: "text",
                        type: "password",
                        id: "currentPassword",
                        name: "current_password",
                        label: "Current Password",
                        placeholder: "Enter current password",
                        labelWidth: 170
                    },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Verify Password",
                                width: 150,
                                click: handleVerifyPassword
                            },
                            {}
                        ]
                    },
                    { height: 15 },
                    {
                        view: "text",
                        type: "password",
                        id: "newPassword",
                        name: "new_password",
                        label: "New Password",
                        placeholder: "Enter new password",
                        labelWidth: 170,
                        disabled: true
                    },
                    {
                        view: "text",
                        type: "password",
                        id: "confirmPassword",
                        name: "confirm_password",
                        label: "Confirm Password",
                        placeholder: "Re-enter new password",
                        labelWidth: 170,
                        disabled: true
                    },
                    { height: 15 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                id: "changePasswordBtn",
                                value: "Change Password",
                                css: "webix_primary",
                                width: 180,
                                disabled: true,
                                click: handleChangePassword
                            },
                            {}
                        ]
                    },
                    { height: 30 },
                    // Profile Visibility
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:10px;'>Profile Visibility</div>",
                        height: 40,
                        borderless: true
                    },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                id: "publicBtn",
                                value: "🌐 Public",
                                width: 150,
                                css: user.profile_visibility === 'public' ? "webix_primary" : "",
                                click: function () {
                                    handlePrivacyChange('public');
                                }
                            },
                            { width: 30 },
                            {
                                view: "button",
                                id: "privateBtn",
                                value: "🔒 Private",
                                width: 150,
                                css: user.profile_visibility === 'private' ? "webix_danger" : "",
                                click: function () {
                                    handlePrivacyChange('private');
                                }
                            },
                            {}
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Step Indicator for Contrast Levels
function createStepIndicator(selectedLevel) {
    const levels = [
        { value: 'low', label: 'Low' },
        { value: 'normal', label: 'Normal' },
        { value: 'high', label: 'High' },
        { value: 'highest', label: 'Highest' }
    ];

    const selectedIndex = levels.findIndex(l => l.value === selectedLevel);

    let html = '<div style="padding: 20px 40px;">';

    // Container for the line and circles
    html += '<div style="position: relative; height: 60px;">';

    // Background line
    html += '<div style="position: absolute; top: 20px; left: 0; right: 0; height: 4px; background: #e0e0e0; border-radius: 2px;"></div>';

    // Active line (progress)
    const progressPercent = selectedIndex > 0 ? (selectedIndex / (levels.length - 1)) * 100 : 0;
    html += `<div style="position: absolute; top: 20px; left: 0; width: ${progressPercent}%; height: 4px; background: #3498db; border-radius: 2px; transition: width 0.3s ease;"></div>`;

    // Circles and labels container
    html += '<div style="position: relative; display: flex; justify-content: space-between;">';

    levels.forEach((level, index) => {
        const isActive = index <= selectedIndex;
        const isSelected = level.value === selectedLevel;

        html += '<div style="display: flex; flex-direction: column; align-items: center; flex: 1;">';

        // Circle
        html += `<div class="step-circle" data-level="${level.value}" style="
            width: ${isSelected ? '24px' : '20px'};
            height: ${isSelected ? '24px' : '20px'};
            border-radius: 50%;
            background: ${isActive ? '#3498db' : '#ffffff'};
            border: ${isSelected ? '4px' : '3px'} solid ${isActive ? '#2980b9' : '#bdc3c7'};
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
            ${isSelected ? 'box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.2);' : ''}
        "></div>`;

        // Label
        html += `<div style="
            margin-top: 12px;
            font-size: 13px;
            font-weight: ${isSelected ? '700' : '500'};
            color: ${isSelected ? '#2c3e50' : '#7f8c8d'};
            text-align: center;
            transition: all 0.3s ease;
        ">${level.label}</div>`;

        html += '</div>';
    });

    html += '</div>'; // Close circles container
    html += '</div>'; // Close relative container
    html += '</div>'; // Close padding container

    return html;
}

// 3. Accessibility Section - REAL-TIME UPDATES
function createAccessibilitySection() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #9b59b6;'>♿ Accessibility Settings</div>",
                height: 50,
                borderless: true
            },
            {
                view: "form",
                id: "accessibilitySettingsForm",
                css: "settings_form",
                elements: [
                    // Keyboard Navigation
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:5px;'>⌨️ Keyboard Navigation</div>",
                        height: 35,
                        borderless: true
                    },
                    {
                        view: "template",
                        template: "<div style='font-size:14px; color:#7f8c8d; margin-bottom:10px;'>Use arrow keys to navigate between form fields and Enter to click buttons.</div>",
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

                    // Screen Reader
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:5px;'>🔊 Screen Reader Compatibility</div>",
                        height: 35,
                        borderless: true
                    },
                    {
                        view: "template",
                        template: "<div style='font-size:14px; color:#7f8c8d; margin-bottom:10px;'>Enable audio announcements for search results and important updates.</div>",
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

                    // Font Size
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:15px;'>📏 Font Size</div>",
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

                    // Theme
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:15px;'>🎨 Theme</div>",
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

                    // Contrast Level - Step Indicator
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:20px;'>🔆 Contrast Level</div>",
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
                                    // Update visual
                                    this.setHTML(createStepIndicator(level));
                                }
                            }
                        }
                    },
                    { height: 20 },
                ]
            }
        ]
    };
}

// Helper: Convert contrast level to slider value
function getContrastValue(level) {
    const map = {
        'low': 0,
        'normal': 1,
        'high': 2,
        'highest': 3
    };
    return map[level] || 1;
}

// Helper: Convert slider value to contrast level
function getContrastLevel(value) {
    const map = {
        0: 'low',
        1: 'normal',
        2: 'high',
        3: 'highest'
    };
    return map[value] || 'normal';
}

// Helper: Get contrast label
function getContrastLabel(value) {
    const map = {
        0: 'Low Contrast',
        1: 'Normal Contrast',
        2: 'High Contrast',
        3: 'Highest Contrast'
    };
    return map[value] || 'Normal Contrast';
}

// Handler: Real-time Accessibility Change
async function handleAccessibilityChange(setting, value) {
    console.log('Accessibility change:', setting, value);

    // Apply immediately
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
            // Update label
            const label = $$("contrastLevelLabel");
            if (label) {
                label.setHTML(`<div style='text-align:center; font-size:16px; color:#7f8c8d;'>${getContrastLabel(getContrastValue(value))}</div>`);
            }
            break;
    }

    // Save to backend
    const data = {};
    data[setting] = value;

    const result = await apiCall(API_CONFIG.ENDPOINTS.ACCESSIBILITY_SETTINGS, 'POST', data);

    if (result.success) {
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(result.user));
    } else {
        webix.message({
            type: "error",
            text: "Failed to save setting"
        });
    }
}

// Handler: Contrast Change with Step Indicator Update
function handleContrastChange(level) {
    console.log('Contrast level changed to:', level);

    // Update visual indicator
    const indicator = $$("contrastStepIndicator");
    if (indicator) {
        indicator.setHTML(createStepIndicator(level));
    }

    // Apply and save
    handleAccessibilityChange('contrast_level', level);
}

// Handler: Save Accessibility Settings
async function handleSaveAccessibilitySettings() {
    const keyboardNav = $$("keyboardNavigation").getValue();
    const screenReader = $$("screenReader").getValue();
    const fontSize = $$("fontSize").getValue();
    const theme = $$("theme").getValue();
    const contrastLevel = $$("contrastLevel").getValue();

    webix.message({
        type: "info",
        text: "Saving accessibility settings..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.ACCESSIBILITY_SETTINGS, 'POST', {
        keyboard_navigation: keyboardNav,
        screen_reader: screenReader,
        font_size: fontSize,
        theme: theme,
        contrast_level: contrastLevel
    });

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Apply settings immediately
        AccessibilityManager.applyFontSize(fontSize);
        AccessibilityManager.applyTheme(theme);
        AccessibilityManager.applyContrast(contrastLevel);
        AccessibilityManager.applyKeyboardNavigation(keyboardNav);
        AccessibilityManager.applyScreenReader(screenReader);

        webix.message({
            type: "success",
            text: "Accessibility settings saved and applied!"
        });
    } else {
        webix.message({
            type: "error",
            text: result.message || "Failed to save accessibility settings"
        });
    }
}

// 4. Notifications Section - WITH SETTINGS
function createNotificationsSection() {
    const user = JSON.parse(localStorage.getItem('currentUser'));

    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #f39c12;'>🔔 Notification Settings</div>",
                height: 50,
                borderless: true
            },
            {
                view: "form",
                id: "notificationSettingsForm",
                css: "settings_form",
                elements: [
                    // Send Public Notifications Toggle
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:5px;'>Public Notifications</div>",
                        height: 30,
                        borderless: true
                    },
                    {
                        view: "template",
                        template: "<div style='font-size:14px; color:#7f8c8d; margin-bottom:15px; line-height:1.6;'>If you don't want to send notifications to others about your personal details changes (like address changes), you can disable it. Company notifications (job role changes) will always be sent.</div>",
                        height: 60,
                        borderless: true
                    },
                    {
                        view: "checkbox",
                        id: "sendPublicNotifications",
                        labelRight: "Send public notifications when I update my address",
                        value: user.send_public_notifications
                    },
                    { height: 30 },
                    // Notification Preferences
                    {
                        view: "template",
                        template: "<div style='font-size:18px; font-weight:600; color:#34495e; margin-bottom:15px;'>Notification Preferences</div>",
                        height: 40,
                        borderless: true
                    },
                    {
                        view: "radio",
                        id: "notificationPreference",
                        vertical: true,
                        value: user.notification_preference,
                        options: [
                            { id: "all", value: "All Notifications - Receive both company and public updates" },
                            { id: "company", value: "Company Only - Only receive job role change notifications" },
                            { id: "none", value: "None - Don't receive any notifications" }
                        ]
                    },
                    { height: 20 },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Save Notification Settings",
                                css: "webix_primary",
                                width: 220,
                                click: handleSaveNotificationSettings
                            },
                            {}
                        ]
                    }
                ]
            }
        ]
    };
}

// Handler: Save Notification Settings
async function handleSaveNotificationSettings() {
    const sendPublic = $$("sendPublicNotifications").getValue();
    const preference = $$("notificationPreference").getValue();

    webix.message({
        type: "info",
        text: "Saving notification settings..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.NOTIFICATION_SETTINGS, 'POST', {
        send_public_notifications: sendPublic,
        notification_preference: preference
    });

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        webix.message({
            type: "success",
            text: "Notification settings saved successfully!"
        });
    } else {
        webix.message({
            type: "error",
            text: result.message || "Failed to save notification settings"
        });
    }
}

// Handler: Save Account Details
async function handleSaveAccountDetails() {
    const form = $$("accountDetailsForm");
    const values = form.getValues();

    webix.message({
        type: "info",
        text: "Saving changes..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_ACCOUNT, 'PUT', values);

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        webix.message({
            type: "success",
            text: "Account details updated successfully!"
        });
    } else {
        webix.message({
            type: "error",
            text: result.message || "Failed to update account"
        });
    }
}

// Handler: Verify Current Password
async function handleVerifyPassword() {
    const currentPassword = $$("currentPassword").getValue();

    if (!currentPassword) {
        webix.message({
            type: "error",
            text: "Please enter your current password"
        });
        return;
    }

    const result = await apiCall(API_CONFIG.ENDPOINTS.VERIFY_PASSWORD, 'POST', {
        current_password: currentPassword
    });

    if (result.success) {
        webix.message({
            type: "success",
            text: "Password verified! You can now change it."
        });

        // Enable new password fields
        $$("newPassword").enable();
        $$("confirmPassword").enable();
        $$("changePasswordBtn").enable();
    } else {
        webix.message({
            type: "error",
            text: result.message || "Incorrect password"
        });
    }
}

// Handler: Change Password
async function handleChangePassword() {
    const form = $$("passwordForm");
    const values = form.getValues();

    if (!values.new_password || !values.confirm_password) {
        webix.message({
            type: "error",
            text: "Please fill in all password fields"
        });
        return;
    }

    if (values.new_password !== values.confirm_password) {
        webix.message({
            type: "error",
            text: "New passwords do not match!"
        });
        return;
    }

    const result = await apiCall(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, 'POST', values);

    if (result.success) {
        webix.message({
            type: "success",
            text: "Password changed successfully!"
        });

        // Reset form
        form.clear();
        $$("newPassword").disable();
        $$("confirmPassword").disable();
        $$("changePasswordBtn").disable();
    } else {
        webix.message({
            type: "error",
            text: result.message || "Failed to change password"
        });
    }
}

// Handler: Privacy Change
function handlePrivacyChange(visibility) {
    if (visibility === 'private') {
        // Show confirmation dialog
        webix.confirm({
            title: "Change Privacy Setting",
            text: "Do you want to make your account private?<br><br>If you set your account to private, your profile will be hidden from search results and your data will not be visible to others.",
            ok: "Yes, Make Private",
            cancel: "No, Keep Public",
            callback: function (result) {
                if (result) {
                    updatePrivacySetting('private');
                }
            }
        });
    } else {
        updatePrivacySetting('public');
    }
}

// Update Privacy Setting
async function updatePrivacySetting(visibility) {
    const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_PRIVACY, 'POST', {
        profile_visibility: visibility
    });

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Update button styles
        if (visibility === 'public') {
            $$("publicBtn").define("css", "webix_primary");
            $$("privateBtn").define("css", "");
        } else {
            $$("publicBtn").define("css", "");
            $$("privateBtn").define("css", "webix_danger");
        }
        $$("publicBtn").refresh();
        $$("privateBtn").refresh();

        webix.message({
            type: "success",
            text: `Privacy set to ${visibility}`
        });
    } else {
        webix.message({
            type: "error",
            text: "Failed to update privacy setting"
        });
    }
}