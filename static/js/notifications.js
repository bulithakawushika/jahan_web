// Global variable to store unread count
let unreadNotificationCount = 0;

// Create Desktop Notifications Page (with Toolbar)
function createDesktopNotificationsPage() {
    return {
        id: "notificationsPage",
        rows: [
            createNavigationBar('notifications'), // Use shared navigation bar
            {
                id: "notificationsContentArea",
                gravity: 1,
                rows: [
                    {
                        view: "template",
                        template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading notifications...</div>",
                        borderless: true
                    }
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Notifications Page (with Sidebar)
function createMobileNotificationsPage() {
    return {
        id: "notificationsPage",
        width: window.innerWidth,
        cols: [
            // Sidebar Navigation
            {
                view: "sidebar",
                id: "mainSidebar",
                width: 250,
                css: "mobile_sidebar",
                hidden: true,
                data: [
                    { id: "home", value: "Home", icon: "mdi mdi-home" },
                    { id: "notifications", value: "Notifications", icon: "mdi mdi-comment" },
                    { id: "profile", value: "Profile", icon: "wxi-user" },
                    { id: "settings", value: "Settings", icon: "mdi mdi-cogs" },
                    { id: "logout", value: "Logout", icon: "wxi-angle-double-right" },
                ],
                on: {
                    onAfterSelect: function (id) {
                        handleSidebarNavigation(id);
                        // Hide sidebar after selection on mobile
                        const sidebar = $$("mainSidebar");
                        if (sidebar) {
                            sidebar.hide();
                            removeOutsideClickListener();
                        }
                    }
                }
            },
            // Main Content Area
            {
                id: "mainContentArea",
                gravity: 1,
                rows: [
                    // Top Bar with Menu Toggle
                    {
                        view: "toolbar",
                        height: 40,
                        css: "mobile_toolbar",
                        elements: [
                            {
                                view: "button",
                                id: "menuToggleBtn",
                                type: "icon",
                                css: "mobile_menu_button",
                                icon: "wxi-dots",
                                width: 50,
                                click: function () {
                                    toggleSidebar();
                                }
                            },
                            {}
                        ]
                    },
                    // Content Area
                    {
                        id: "notificationsContentArea",
                        gravity: 1,
                        rows: [
                            {
                                view: "template",
                                template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading notifications...</div>",
                                borderless: true
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Responsive Notifications Page
function createNotificationsPage() {
    const screenWidth = window.innerWidth;

    // Desktop view (> 1024px) - Show Toolbar
    if (screenWidth > 1024) {
        return createDesktopNotificationsPage();
    } else {
        // Mobile/Tablet view (<= 1024px) - Show Sidebar
        return createMobileNotificationsPage();
    }
}

// Load Notifications
async function loadNotifications() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.NOTIFICATIONS, 'GET');

    if (result.success) {
        unreadNotificationCount = result.unread_count;
        displayNotifications(result.notifications, result.unread_count);
        updateNotificationBadge(result.unread_count);
        updateSidebarNotificationBadge(result.unread_count); // Update sidebar badge too
    } else {
        webix.message({
            type: "error",
            text: "Failed to load notifications"
        });
    }
}

// Display Notifications
function displayNotifications(notifications, unreadCount) {
    const contentArea = $$("notificationsContentArea");
    if (!contentArea) return;

    // Remove loading
    const children = contentArea.getChildViews();
    children.forEach(child => {
        contentArea.removeView(child);
    });

    // Add content
    contentArea.addView({
        view: "scrollview",
        scroll: "y",
        body: {
            rows: [
                { height: 20 },
                // Title with unread count
                {
                    view: "template",
                    template: `
                        <div style="
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 38px !important;
                            font-weight: bold;
                            color: #2c3e50;
                            height: 100%;
                        ">
                            <span style="font-size: 38px !important;">Notifications</span>

                            ${unreadCount > 0 ? `
                                <span style="
                                    background: #e74c3c;
                                    color: white;
                                    border-radius: 50%;
                                    padding: 5px 12px;
                                    font-size: 20px;
                                    margin-left: 15px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    min-width: 35px;
                                    height: 35px;
                                ">
                                    ${unreadCount}
                                </span>
                            ` : ''}
                        </div>
                    `,
                    height: 70,
                    borderless: true
                },
                { height: 30 },
                // Notifications list
                {
                    rows: notifications.length > 0 ?
                        createNotificationsList(notifications) :
                        [{
                            view: "template",
                            template: "<div style='text-align:center; padding:100px; font-size:20px !important; color:#95a5a6;'>📭<br><br>No notifications yet</div>",
                            borderless: true
                        }]
                }
            ]
        }
    });
}

// Create Notifications List
function createNotificationsList(notifications) {
    const rows = [];

    // Separate by type
    const companyNotifications = notifications.filter(n => n.type === 'company');
    const publicNotifications = notifications.filter(n => n.type === 'public');

    // Company Notifications Section
    if (companyNotifications.length > 0) {
        rows.push({
            view: "template",
            template: "<div style='font-size:24px !important; font-weight:700; color:#2c3e50; padding:0 40px; border-left:5px solid #3498db; margin-bottom:20px;'>🏛️ Company Notifications</div>",
            height: 50,
            borderless: true
        });

        companyNotifications.forEach(notification => {
            rows.push(createNotificationCard(notification));
            rows.push({ height: 15 });
        });

        rows.push({ height: 30 });
    }

    // Public Notifications Section
    if (publicNotifications.length > 0) {
        rows.push({
            view: "template",
            template: "<div style='font-size:24px !important; font-weight:700; color:#2c3e50; padding:0 40px; border-left:5px solid #27ae60; margin-bottom:20px;'>🌐 Public Notifications</div>",
            height: 50,
            borderless: true
        });

        publicNotifications.forEach(notification => {
            rows.push(createNotificationCard(notification));
            rows.push({ height: 15 });
        });
    }

    rows.push({ height: 50 });

    return rows;
}

// Create Notification Card
function createNotificationCard(notification) {
    const isRead = notification.is_read;
    const bgColor = isRead ? '#f8f9fa' : '#ffffff';
    const borderColor = isRead ? '#dee2e6' : notification.type === 'company' ? '#3498db' : '#27ae60';
    const icon = notification.type === 'company' ? '💼' : '🏠';

    const date = new Date(notification.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return {
        cols: [
            { width: 40 },
            {
                view: "template",
                template: `
                    <div style="background:${bgColor}; border-left:4px solid ${borderColor}; border-radius:8px; padding:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1); ${!isRead ? 'border:2px solid ' + borderColor + ';' : ''}">
                        <div style="display:flex; justify-content:space-between; align-items:start;">
                            <div style="flex:1;">
                                <div style="display:flex; align-items:center; font-size:20px; font-weight:700; color:#2c3e50; margin-bottom:8px;">
                                    <span style="font-size: 20px !important;">${icon} ${notification.title}</span>
                                    ${!isRead ? `<span style="
                                        background:#e74c3c;
                                        color:white;
                                        font-size:11px;
                                        padding:3px 8px;
                                        border-radius:12px;
                                        margin-left:10px;
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        height:20px;
                                    ">NEW</span>` : ''}
                                </div>
                                <div style="font-size:16px; color:#555; margin-bottom:12px; line-height:1.6;">
                                    ${notification.message}
                                </div>
                                <div style="font-size:14px !important; color:#95a5a6;">
                                    <strong>From:</strong> ${notification.sender_name} • <strong>Date:</strong> ${formattedDate}
                                </div>
                            </div>
                            ${!isRead ? `
                            <div style="margin-left:20px;">
                                <button onclick="markAsRead(${notification.id})" style="background:#27ae60; color:white; border:none; padding:10px 20px; border-radius:6px; cursor:pointer; font-weight:600; font-size:14px;">
                                    ✓ Mark as Read
                                </button>
                            </div>
                            ` : `
                            <div style="margin-left:20px; color:#27ae60; font-size:30px;">
                                ✓
                            </div>
                            `}
                        </div>
                    </div>
                `,
                borderless: true,
                height: 140
            },
            { width: 40 }
        ]
    };
}

// Mark Notification as Read
async function markAsRead(statusId) {
    console.log('Marking notification as read:', statusId);

    const url = `${API_CONFIG.BASE_URL}/api/users/notifications/${statusId}/read/`;
    console.log('URL:', url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        });

        const result = await response.json();
        console.log('Result:', result);

        if (result.success) {
            webix.message({
                type: "success",
                text: "Notification marked as read"
            });

            unreadNotificationCount = result.unread_count;
            updateNotificationBadge(result.unread_count);
            updateSidebarNotificationBadge(result.unread_count);

            // Reload notifications
            loadNotifications();
        } else {
            webix.message({
                type: "error",
                text: result.message || "Failed to mark notification as read"
            });
        }
    } catch (error) {
        console.error('Error:', error);
        webix.message({
            type: "error",
            text: "Network error"
        });
    }
}

// Update Notification Badge in Home Page Toolbar
function updateNotificationBadge(count) {
    const badge = $$("notificationBadge");
    if (badge) {
        if (count > 0) {
            badge.define("badge", count);
        } else {
            badge.define("badge", null);
        }
        badge.refresh();
    }
}

// Check for unread notifications (call on login)
async function checkUnreadNotifications() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.NOTIFICATIONS, 'GET');

    if (result.success && result.unread_count > 0) {
        unreadNotificationCount = result.unread_count;

        webix.message({
            type: "info",
            text: `You have ${result.unread_count} unread notification${result.unread_count > 1 ? 's' : ''}`,
            expire: 5000
        });

        updateNotificationBadge(result.unread_count);
        updateSidebarNotificationBadge(result.unread_count);
    }
}