// ==========================================
// PRIVACY & SECURITY TAB
// File: static/settings_privacy.js
// ==========================================

function createPrivacySecurityContent(user, isMobile = false) {
    const labelWidth = isMobile ? 140 : 170;
    const padding = isMobile ? 20 : 40;

    return {
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: padding },
                    {
                        rows: [
                            // ==========================
                            // CHANGE PASSWORD SECTION
                            // ==========================
                            {
                                view: "form",
                                id: "passwordForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '18px' : '20px'}; font-weight:600; color:#34495e; margin-bottom:10px;'>Change Password</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "search",
                                        type: "password",
                                        id: "currentPassword",
                                        height: 49,
                                        name: "current_password",
                                        label: "Current Password",
                                        placeholder: "Enter current password",
                                        labelWidth: labelWidth,
                                        icon: "wxi-eye",
                                        attributes: {
                                            autocomplete: "off"
                                        },
                                        on: {
                                            onSearchIconClick: function (e) {
                                                togglePasswordVisibility(this, e.target);
                                            }
                                        }
                                    },
                                    {
                                        cols: [
                                            {},
                                            {
                                                view: "button",
                                                value: "Verify Password",
                                                css: "webix_primary",
                                                width: isMobile ? undefined : 180,
                                                click: handleVerifyPassword
                                            },
                                            {}
                                        ]
                                    },
                                    {
                                        view: "search",
                                        type: "password",
                                        id: "newPassword",
                                        name: "new_password",
                                        label: "New Password",
                                        height: 49,
                                        placeholder: "Enter new password",
                                        labelWidth: labelWidth,
                                        icon: "wxi-eye",
                                        disabled: true,
                                        attributes: {
                                            autocomplete: "new-password"
                                        },
                                        on: {
                                            onSearchIconClick: function (e) {
                                                togglePasswordVisibility(this, e.target);
                                            }
                                        }
                                    },
                                    {
                                        view: "search",
                                        type: "password",
                                        id: "confirmPassword",
                                        name: "confirm_password",
                                        height: 49,
                                        label: "Confirm Password",
                                        placeholder: "Re-enter new password",
                                        labelWidth: labelWidth,
                                        icon: "wxi-eye",
                                        disabled: true,
                                        attributes: {
                                            autocomplete: "new-password"
                                        },
                                        on: {
                                            onSearchIconClick: function (e) {
                                                togglePasswordVisibility(this, e.target);
                                            }
                                        }
                                    },
                                    {
                                        cols: [
                                            {},
                                            {
                                                view: "button",
                                                id: "changePasswordBtn",
                                                value: "Change Password",
                                                css: "webix_primary",
                                                width: isMobile ? undefined : 180,
                                                disabled: true,
                                                click: handleChangePassword
                                            },
                                            {}
                                        ]
                                    }
                                ]
                            },

                            // ==========================
                            // PROFILE VISIBILITY SECTION
                            // ==========================
                            {
                                view: "form",
                                id: "privacyForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '18px' : '20px'}; font-weight:600; color:#34495e; margin-bottom:10px;'>Profile Visibility</div>`,
                                        height: 40,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '13px' : '14px'}; color:#7f8c8d; line-height:1.6;'>Control who can see your profile information in search results.</div>`,
                                        height: isMobile ? 60 : 40,
                                        borderless: true
                                    },
                                    isMobile
                                        ? {
                                            rows: [
                                                {
                                                    view: "button",
                                                    id: "publicBtn",
                                                    value: "🌐 Public",
                                                    css: user.profile_visibility === 'public' ? "webix_primary" : "",
                                                    click: function () {
                                                        handlePrivacyChange('public');
                                                    }
                                                },
                                                { height: 15 },
                                                {
                                                    view: "button",
                                                    id: "privateBtn",
                                                    value: "🔒 Private",
                                                    css: user.profile_visibility === 'private' ? "webix_danger" : "",
                                                    click: function () {
                                                        handlePrivacyChange('private');
                                                    }
                                                }
                                            ]
                                        }
                                        : {
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
                    },
                    { width: padding }
                ]
            },
            { height: 50 }
        ]
    };
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function togglePasswordVisibility(field, icon) {
    const input = field.getInputNode();
    webix.html.removeCss(icon, "wxi-eye-slash");
    webix.html.removeCss(icon, "wxi-eye");

    if (input.type === "text") {
        webix.html.addCss(icon, "wxi-eye");
        input.type = "password";
    } else {
        webix.html.addCss(icon, "wxi-eye-slash");
        input.type = "text";
    }
}

// ==========================================
// EVENT HANDLERS - PRIVACY & SECURITY
// ==========================================

async function handleVerifyPassword() {
    const currentPassword = $$("currentPassword").getValue();

    if (!currentPassword) {
        webix.message({ type: "error", text: "Please enter your current password" });
        return;
    }

    const result = await apiCall(API_CONFIG.ENDPOINTS.VERIFY_PASSWORD, "POST", {
        current_password: currentPassword
    });

    if (result.success) {
        webix.message({ type: "success", text: "Password verified! You can now change it." });
        $$("newPassword").enable();
        $$("confirmPassword").enable();
        $$("changePasswordBtn").enable();
    } else {
        webix.message({ type: "error", text: result.message || "Incorrect password" });
    }
}

async function handleChangePassword() {
    const form = $$("passwordForm");
    const values = form.getValues();

    if (!values.new_password || !values.confirm_password) {
        webix.message({ type: "error", text: "Please fill in all password fields" });
        return;
    }

    if (values.new_password !== values.confirm_password) {
        webix.message({ type: "error", text: "New passwords do not match!" });
        return;
    }

    const result = await apiCall(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, "POST", values);

    if (result.success) {
        webix.message({ type: "success", text: "Password changed successfully!" });
        form.clear();
        $$("newPassword").disable();
        $$("confirmPassword").disable();
        $$("changePasswordBtn").disable();
    } else {
        webix.message({ type: "error", text: result.message || "Failed to change password" });
    }
}

function handlePrivacyChange(visibility) {
    if (visibility === "private") {
        webix.confirm({
            title: "Change Privacy Setting",
            text: "Do you want to make your account private?<br><br>If you set your account to private, your profile will be hidden from search results and your data will not be visible to others.",
            ok: "Yes, Make Private",
            cancel: "No, Keep Public",
            callback: function (result) {
                if (result) updatePrivacySetting("private");
            }
        });
    } else {
        updatePrivacySetting("public");
    }
}

async function updatePrivacySetting(visibility) {
    const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_PRIVACY, "POST", {
        profile_visibility: visibility
    });

    if (result.success) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        if (visibility === "public") {
            $$("publicBtn").define("css", "webix_primary");
            $$("privateBtn").define("css", "");
        } else {
            $$("publicBtn").define("css", "");
            $$("privateBtn").define("css", "webix_danger");
        }
        $$("publicBtn").refresh();
        $$("privateBtn").refresh();

        webix.message({ type: "success", text: `Privacy set to ${visibility}` });
    } else {
        webix.message({ type: "error", text: "Failed to update privacy setting" });
    }
}
