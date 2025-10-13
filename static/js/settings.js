// ==========================================
// MAIN SETTINGS PAGE - WITH TAB NAVIGATION
// File: static/settings.js
// ==========================================

// Create Desktop Settings Page (with Navbar and Tabs)
function createDesktopSettingsPage() {
    return {
        id: "settingsPage",
        rows: [
            createNavigationBar('settings'),
            {
                id: "settingsContentArea",
                gravity: 1,
                rows: [
                    { height: 20 },
                    {
                        cols: [
                            { width: 40 },
                            {
                                view: "tabview",
                                id: "settingsTabView",
                                animate: true,
                                tabbar: {
                                    optionWidth: 200,
                                    height: 50
                                },
                                cells: [
                                    {
                                        header: "📋 Account Details",
                                        body: {
                                            id: "accountDetailsTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading account details...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "🔒 Privacy & Security",
                                        body: {
                                            id: "privacySecurityTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading privacy settings...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "♿ Accessibility",
                                        body: {
                                            id: "accessibilityTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading accessibility settings...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "🔔 Notifications",
                                        body: {
                                            id: "notificationsTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:100px;'><div class='loading-spinner'></div><br><br>Loading notification settings...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            { width: 40 }
                        ]
                    },
                    { height: 20 }
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Settings Page (with Sidebar and Tabs)
function createMobileSettingsPage() {
    return {
        id: "settingsPage",
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
                    {
                        id: "settingsContentArea",
                        gravity: 1,
                        rows: [
                            { height: 10 },
                            {
                                view: "template",
                                template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#2c3e50;'>Settings</div>",
                                height: 50,
                                borderless: true
                            },
                            { height: 10 },
                            {
                                view: "tabview",
                                id: "settingsTabView",
                                animate: false,
                                tabbar: {
                                    height: 45
                                },
                                cells: [
                                    {
                                        header: "📋 Account",
                                        body: {
                                            id: "accountDetailsTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:50px;'><div class='loading-spinner'></div><br><br>Loading...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "🔒 Privacy",
                                        body: {
                                            id: "privacySecurityTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:50px;'><div class='loading-spinner'></div><br><br>Loading...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "♿ Access",
                                        body: {
                                            id: "accessibilityTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:50px;'><div class='loading-spinner'></div><br><br>Loading...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        header: "🔔 Notify",
                                        body: {
                                            id: "notificationsTab",
                                            rows: [
                                                {
                                                    view: "template",
                                                    template: "<div style='text-align:center; padding:50px;'><div class='loading-spinner'></div><br><br>Loading...</div>",
                                                    borderless: true
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Responsive Settings Page
function createSettingsPage() {
    console.log('Creating settings page...');
    const screenWidth = window.innerWidth;
    if (screenWidth > 1024) {
        return createDesktopSettingsPage();
    } else {
        return createMobileSettingsPage();
    }
}

// ==========================================
// LOAD SETTINGS DATA
// ==========================================

async function loadSettingsData() {
    console.log('Loading settings data...');

    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.PROFILE, 'GET');

        if (result.success && result.user) {
            console.log('User data loaded:', result.user);

            // Load all tab contents
            loadAccountDetailsTab(result.user);
            loadPrivacySecurityTab(result.user);
            loadAccessibilityTab(result.user);
            loadNotificationsTab(result.user);
        } else {
            console.error('Failed to load user data:', result);
            webix.message({
                type: "error",
                text: "Failed to load settings"
            });
            showProfilePage();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        webix.message({
            type: "error",
            text: "Error loading settings"
        });
    }
}

// ==========================================
// LOAD EACH TAB CONTENT
// ==========================================

function loadAccountDetailsTab(user) {
    console.log('Loading account details tab...');
    const tab = $$("accountDetailsTab");
    if (!tab) {
        console.error('accountDetailsTab not found');
        return;
    }

    const children = tab.getChildViews();
    children.forEach(child => tab.removeView(child));

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    // Check if function exists
    if (typeof createAccountDetailsContent === 'function') {
        tab.addView({
            view: "scrollview",
            scroll: "y",
            body: createAccountDetailsContent(user, isMobile)
        });
        console.log('Account details tab loaded');
    } else {
        console.error('createAccountDetailsContent function not found');
        tab.addView({
            view: "template",
            template: "<div style='padding:50px; text-align:center; color:red;'>Error: Account details module not loaded</div>",
            borderless: true
        });
    }
}

function loadPrivacySecurityTab(user) {
    console.log('Loading privacy security tab...');
    const tab = $$("privacySecurityTab");
    if (!tab) {
        console.error('privacySecurityTab not found');
        return;
    }

    const children = tab.getChildViews();
    children.forEach(child => tab.removeView(child));

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    // Check if function exists
    if (typeof createPrivacySecurityContent === 'function') {
        tab.addView({
            view: "scrollview",
            scroll: "y",
            body: createPrivacySecurityContent(user, isMobile)
        });
        console.log('Privacy security tab loaded');
    } else {
        console.error('createPrivacySecurityContent function not found');
        tab.addView({
            view: "template",
            template: "<div style='padding:50px; text-align:center; color:red;'>Error: Privacy module not loaded</div>",
            borderless: true
        });
    }
}

function loadAccessibilityTab(user) {
    console.log('Loading accessibility tab...');
    const tab = $$("accessibilityTab");
    if (!tab) {
        console.error('accessibilityTab not found');
        return;
    }

    const children = tab.getChildViews();
    children.forEach(child => tab.removeView(child));

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    // Check if function exists
    if (typeof createAccessibilityContent === 'function') {
        tab.addView({
            view: "scrollview",
            scroll: "y",
            body: createAccessibilityContent(user, isMobile)
        });
        console.log('Accessibility tab loaded');
    } else {
        console.error('createAccessibilityContent function not found');
        tab.addView({
            view: "template",
            template: "<div style='padding:50px; text-align:center; color:red;'>Error: Accessibility module not loaded</div>",
            borderless: true
        });
    }
}

function loadNotificationsTab(user) {
    console.log('Loading notifications tab...');
    const tab = $$("notificationsTab");
    if (!tab) {
        console.error('notificationsTab not found');
        return;
    }

    const children = tab.getChildViews();
    children.forEach(child => tab.removeView(child));

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    // Check if function exists
    if (typeof createNotificationsContent === 'function') {
        tab.addView({
            view: "scrollview",
            scroll: "y",
            body: createNotificationsContent(user, isMobile)
        });
        console.log('Notifications tab loaded');
    } else {
        console.error('createNotificationsContent function not found');
        tab.addView({
            view: "template",
            template: "<div style='padding:50px; text-align:center; color:red;'>Error: Notifications module not loaded</div>",
            borderless: true
        });
    }
}