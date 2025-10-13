// ==========================================
// NOTIFICATIONS TAB
// File: static/settings_notification.js
// ==========================================

function createNotificationsContent(user, isMobile = false) {
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
                                id: "notificationSettingsForm",
                                css: "settings_form",
                                elements: [
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:5px;'>Public Notifications</div>`,
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '13px' : '14px'}; color:#7f8c8d; margin-bottom:15px; line-height:1.6;'>If you don't want to send notifications to others about your personal details changes (like address changes), you can disable it. Company notifications (job role changes) will always be sent.</div>`,
                                        height: isMobile ? 80 : 60,
                                        borderless: true
                                    },
                                    {
                                        view: "checkbox",
                                        id: "sendPublicNotifications",
                                        labelRight: "Send public notifications when I update my address",
                                        value: user.send_public_notifications
                                    },
                                    { height: 30 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>Notification Preferences</div>`,
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
                                                width: isMobile ? undefined : 220,
                                                click: handleSaveNotificationSettings
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
// EVENT HANDLERS - NOTIFICATIONS
// ==========================================

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