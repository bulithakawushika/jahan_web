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

// 3. Accessibility Section (Placeholder)
function createAccessibilitySection() {
    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #9b59b6;'>♿ Accessibility Settings</div>",
                height: 50,
                borderless: true
            },
            {
                view: "template",
                template: "<div style='padding:30px; background:white; border-radius:10px; color:#7f8c8d; font-size:16px; box-shadow:0 2px 5px rgba(0,0,0,0.1); margin:0 20px;'>Accessibility settings coming soon...</div>",
                height: 100,
                borderless: true
            }
        ]
    };
}

// 4. Notifications Section (Placeholder)
function createNotificationsSection() {
    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:28px; font-weight:700; color:#2c3e50; padding:0 30px; border-left:5px solid #f39c12;'>🔔 Notification Settings</div>",
                height: 50,
                borderless: true
            },
            {
                view: "template",
                template: "<div style='padding:30px; background:white; border-radius:10px; color:#7f8c8d; font-size:16px; box-shadow:0 2px 5px rgba(0,0,0,0.1); margin:0 20px;'>Notification settings coming soon...</div>",
                height: 100,
                borderless: true
            }
        ]
    };
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