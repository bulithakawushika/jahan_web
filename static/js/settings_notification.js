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
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:5px;'>Control Public Notifications</div>`,
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '13px' : '14px'}; color:#7f8c8d; margin-bottom:15px; line-height:1.6;'>If you prefer not to notify others about changes to your personal details, you can disable this option. However, company-related notifications, such as job role updates, will always be sent automatically</div>`,
                                        height: isMobile ? 60 : 25,
                                        borderless: true
                                    },
                                    {
                                        view: "checkbox",
                                        id: "sendPublicNotifications",
                                        labelRight: "Send public notifications when I update my persoanl data",
                                        value: user.send_public_notifications
                                    },
                                    { height: 20 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:15px;'>Notification Preferences</div>`,
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        view: "radio",
                                        id: "notificationPreference",
                                        vertical: true,
                                        value: user.notification_preference,
                                        options: [
                                            { id: "all", value: "<b>All Notifications</b> - Receive Notifications for Both Company-related Updates and Public Activity of Employees" },
                                            { id: "company", value: "<b>Company Only</b> - Only Receive Company-related Updates" },
                                            { id: "none", value: "<b>None</b> - Mute Notifications" }
                                        ]
                                    },
                                    { height: 20 },
                                    {
                                        view: "template",
                                        template: `<div style='font-size:${isMobile ? '16px' : '18px'}; font-weight:600; color:#34495e; margin-bottom:5px;'>Email Notifications</div>`,
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        cols: [
                                            {
                                                view: "template",
                                                template: `
                                                    <div style="
                                                        display: flex;
                                                        align-items: center;
                                                        height: 100%;
                                                        font-size: 14px;
                                                        color: #7f8c8d;
                                                    ">
                                                        Control Email Notifications
                                                    </div>
                                                `,
                                                borderless: true,
                                                width: 200,
                                                gravity: 2
                                            },

                                            { width: 10 },
                                            {
                                                view: "switch",
                                                id: "emailNotificationSwitch",
                                                onLabel: "Enabled",
                                                offLabel: "Disabled",
                                                padding:0,
                                                value: 0,
                                                gravity: 1,
                                                css: "align_switch"
                                            },
                                            {}
                                        ]
                                    },
                                    {
                                        cols: [
                                            {},
                                            {
                                                view: "button",
                                                value: "Save Changes",
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