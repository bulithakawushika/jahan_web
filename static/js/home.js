// Create Desktop Home Page (with Toolbar)
function createDesktopHomePage() {
    return {
        id: "homePage",
        rows: [
            createNavigationBar('home'),
            {
                id: "homeContent",
                gravity: 1,
                rows: [
                    createSearchView()
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Home Page (with Sidebar)
function createMobileHomePage() {
    return {
        id: "homePage",
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
                    { id: "home", value: "Home", icon: "mdi mdi-home"},
                    { id: "notifications", value: "Notifications", icon: "mdi mdi-comment"},
                    { id: "profile", value: "Profile", icon: "wxi-user" },
                    { id: "settings", value: "Settings", icon: "mdi mdi-cogs"},
                    { id: "logout", value: "Logout", icon: "wxi-angle-double-right"},
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
                        id: "homeContent",
                        gravity: 1,
                        rows: [
                            createSearchView()
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Responsive Home Page
function createHomePage() {
    const screenWidth = window.innerWidth;

    // Desktop view (> 1024px) - Show Toolbar
    if (screenWidth > 1024) {
        return createDesktopHomePage();
    } else {
        // Mobile/Tablet view (<= 1024px) - Show Sidebar
        return createMobileHomePage();
    }
}

// Handle Sidebar Navigation
function handleSidebarNavigation(id) {
    switch (id) {
        case 'home':
            showHomePage();
            break;
        case 'notifications':
            showNotificationsPage();
            break;
        case 'profile':
            showProfilePage();
            break;
        case 'settings':
            showSettingsPage();
            break;
        case 'logout':
            handleLogout();
            break;
    }
}

// Reusable Navigation Bar (Desktop Only)
function createNavigationBar(activePage) {
    return {
        view: "toolbar",
        height: 45,
        css: "main_toolbar",
        elements: [
            {},
            {
                view: "button",
                id: "HomeBadge",
                value: "Home",
                width: 140,
                css: activePage === 'home' ? "webix_primary nav_button" : "nav_button",
                click: function () {
                    showHomePage();
                }
            },
            { width: 5 },
            {
                view: "button",
                id: "notificationBadge",
                value: "Notifications",
                width: 140,
                badge: 0,
                css: activePage === 'notifications' ? "webix_primary nav_button" : "nav_button",
                click: function () {
                    showNotificationsPage();
                }
            },
            { width: 5 },
            {
                view: "button",
                id: "profileBtn",
                value: "Profile",
                width: 140,
                css: activePage === 'profile' ? "webix_primary nav_button" : "nav_button",
                click: function () {
                    showProfilePage();
                }
            },
            { width: 5 },
            {
                view: "button",
                id: "settingsBtn",
                value: "Settings",
                width: 140,
                css: activePage === 'settings' ? "webix_primary nav_button" : "nav_button",
                click: function () {
                    showSettingsPage();
                }
            },
            { width: 5 },
            {
                view: "button",
                id: "logoutBtn",
                value: "Logout",
                width: 140,
                css: "nav_button",
                click: function () {
                    handleLogout();
                }
            },
            {}
        ]
    };
}

// Initial Search View (before search)
function createSearchView() {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    const searchWidth = isMobile ? screenWidth - 40 : 700;

    return {
        id: "searchView",
        gravity: 1,
        rows: [
            { height: isMobile ? 50 : 100 },
            {
                cols: [
                    {},
                    {
                        width: searchWidth,
                        rows: [
                            {
                                view: "template",
                                template: `<div style='text-align:center; font-size:${isMobile ? '28px' : '42px'}; font-weight:bold; color:#2c3e50; margin-bottom:15px;'>Who Are You Looking For Today?</div>`,
                                height: isMobile ? 70 : 80,
                                borderless: true
                            },
                            {
                                view: "template",
                                template: `<div style='text-align:center; font-size:${isMobile ? '14px' : '18px'}; color:#7f8c8d; margin-bottom:30px;'>Type a name or job role to discover team members across our organization</div>`,
                                height: isMobile ? 40 : 50,
                                borderless: true
                            },
                            {
                                cols: [
                                    {
                                        view: "text",
                                        id: "searchInput",
                                        placeholder: "Enter name or job role...",
                                        on: {
                                            onKeyPress: function (code, e) {
                                                if (code === 13) {
                                                    performSearch();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        view: "button",
                                        value: "Search",
                                        width: 120,
                                        css: "webix_primary",
                                        click: performSearch
                                    }
                                ]
                            }
                        ]
                    },
                    {}
                ]
            },
            { gravity: 1 }
        ]
    };
}

// Results View (after search)
function createResultsView(results, query = '') {
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    return {
        gravity: 1,
        rows: [
            {
                height: 130,
                rows: [
                    {
                        view: "template",
                        template: `<div style='text-align:center; font-size:${isMobile ? '20px' : '28px'}; font-weight:bold; color:#2c3e50; padding-top:20px;'>Meet the people who fit your search</div>`,
                        height: 60,
                        borderless: true
                    },
                    {
                        cols: [
                            { width: isMobile ? 20 : 50 },
                            {
                                view: "text",
                                id: "topSearchInput",
                                value: query,
                                placeholder: "Enter name or job role...",
                                on: {
                                    onKeyPress: function (code, e) {
                                        if (code === 13) {
                                            performSearch();
                                        }
                                    }
                                }
                            },
                            {
                                view: "button",
                                value: "Search",
                                width: 120,
                                css: "webix_primary",
                                click: performSearch
                            },
                            { width: isMobile ? 20 : 50 }
                        ]
                    },
                    { height: 20 }
                ]
            },
            {
                view: "scrollview",
                gravity: 1,
                scroll: "y",
                body: {
                    rows: results.length > 0 ?
                        createUserGrid(results) :
                        [{
                            view: "template",
                            template: "<div style='text-align:center; padding:50px; font-size:20px; color:#95a5a6;'>No results found. Try a different search term.</div>",
                            borderless: true
                        }]
                }
            }
        ]
    };
}

// Calculate Age from Birthday
function calculateAge(birthday) {
    if (!birthday) return 'Not specified';

    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age + ' years old';
}

// Create User Grid (2 columns for desktop, 1 for mobile)
function createUserGrid(results) {
    const rows = [];
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
        // Mobile: One card per row
        results.forEach(user => {
            rows.push(createUserCard(user));
        });
    } else {
        // Desktop: Two cards per row
        for (let i = 0; i < results.length; i += 2) {
            const cols = [{ width: 20 }];

            // First card
            cols.push({
                gravity: 1,
                rows: [createUserCardContent(results[i])]
            });

            cols.push({ width: 20 });

            // Second card (if exists)
            if (i + 1 < results.length) {
                cols.push({
                    gravity: 1,
                    rows: [createUserCardContent(results[i + 1])]
                });
            } else {
                cols.push({ gravity: 1 });
            }

            cols.push({ width: 20 });

            rows.push({
                cols: cols,
                height: 200
            });
        }
    }

    return rows;
}

// Create User Card Content (without wrapper)
function createUserCardContent(user) {
    const profilePhoto = user.profile_photo ?
        `${API_CONFIG.BASE_URL}${user.profile_photo}` :
        'https://via.placeholder.com/150/cccccc/666666?text=No+Photo';

    // Helper function to display field or "Hidden" message
    const displayField = (value, label) => {
        if (value === undefined || value === null || value === '') {
            return `<div style="font-size: 13px; color: #bdc3c7; margin-bottom: 6px;">
                        <strong>${label}:</strong> <em>Hidden by user</em>
                    </div>`;
        }
        return `<div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                    <strong>${label}:</strong> ${value}
                </div>`;
    };

    // Calculate age only if birthday data is available
    let ageDisplay = 'Hidden by user';
    if (user.birthday || (user.birth_year && user.birth_month && user.birth_day)) {
        ageDisplay = calculateAge(user.birthday);
    }

    return {
        view: "template",
        css: "user_card",
        template: `
            <div style="display: flex; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: auto; margin: 10px;">
    <!-- Profile Photo -->
    <div style="flex-shrink: 0; margin-right: 20px;">
        <img src="${profilePhoto}" style="width: 120px; height: 120px; border-radius: 10px; object-fit: cover; border: 3px solid #3498db;" />
    </div>

    <!-- Info Section -->
    <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
        <!-- Name -->
        <div style="font-size: 22px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${user.first_name} ${user.last_name}
        </div>
        <div style="font-size: 15px; color: #3498db; margin-bottom: 8px;">
                    <strong>Job:</strong> ${user.job_role || 'Not specified'}
        </div>

        <!-- Two Columns -->
        <div style="display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap;">
            
            <!-- Left Column -->
            <div style="flex: 1; min-width: 250px;">
                
                <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                    <strong>Department:</strong> ${user.department || 'Not specified'}
                </div>
                ${user.email !== undefined ?
                `<div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                        <strong>Email:</strong> ${user.email}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7; margin-bottom: 6px;">
                        <strong>Email:</strong> <em>Hidden by user</em>
                    </div>`
            }
                ${user.phone_number !== undefined ?
                `<div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                        <strong>Phone Number:</strong> ${user.phone_number}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7; margin-bottom: 6px;">
                        <strong>Phone Number:</strong> <em>Hidden by user</em>
                    </div>`
            }
                ${user.address !== undefined && user.address !== null && user.address !== '' ?
                `<div style="font-size: 13px; color: #7f8c8d;">
                        <strong>Address:</strong> ${user.address}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7;">
                        <strong>Address:</strong> <em>Hidden by user</em>
                    </div>`
            }
            </div>

            <!-- Right Column -->
            <div style="flex: 1; min-width: 200px;">
                ${ageDisplay !== 'Hidden by user' ?
                `<div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                        <strong>Age:</strong> ${ageDisplay}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7; margin-bottom: 6px;">
                        <strong>Age:</strong> <em>Hidden by user</em>
                    </div>`
            }
                ${user.gender !== undefined && user.gender !== null && user.gender !== '' ?
                `<div style="font-size: 13px; color: #7f8c8d; margin-bottom: 6px;">
                        <strong>Gender:</strong> ${user.gender}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7; margin-bottom: 6px;">
                        <strong>Gender:</strong> <em>Hidden by user</em>
                    </div>`
            }
                ${user.marital_status !== undefined && user.marital_status !== null && user.marital_status !== '' ?
                `<div style="font-size: 13px; color: #7f8c8d;">
                        <strong>Marital Status:</strong> ${user.marital_status}
                    </div>` :
                `<div style="font-size: 13px; color: #bdc3c7;">
                        <strong>Marital Status:</strong> <em>Hidden by user</em>
                    </div>`
            }
            </div>
        </div>
    </div>
</div>

        `,
        borderless: true
    };
}

// Create User Card (with mobile wrapper)
function createUserCard(user) {
    return {
        height: 200,
        cols: [
            { width: 20 },
            createUserCardContent(user),
            { width: 20 }
        ]
    };
}

// Perform Search Function
async function performSearch() {
    let query = '';
    const searchInput = $$("searchInput");
    const topSearchInput = $$("topSearchInput");

    if (searchInput) {
        query = searchInput.getValue().trim();
    } else if (topSearchInput) {
        query = topSearchInput.getValue().trim();
    }

    if (!query) {
        webix.message({
            type: "error",
            text: "Please enter a search term"
        });
        return;
    }

    webix.message({
        type: "info",
        text: "Searching..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.SEARCH + `?query=${encodeURIComponent(query)}`, 'GET');

    if (result.success) {
        const homeContent = $$("homeContent");

        if (homeContent) {
            while (homeContent.getChildViews().length > 0) {
                homeContent.removeView(homeContent.getChildViews()[0]);
            }

            homeContent.addView(createResultsView(result.results, query));
        }

        if (typeof AccessibilityManager !== 'undefined') {
            AccessibilityManager.readSearchResults(result.results);
        }

        webix.message({
            type: "success",
            text: `Found ${result.results.length} result(s)`
        });
    } else {
        webix.message({
            type: "error",
            text: "Search failed. Please try again."
        });
    }
}

// Update Notification Badge on Sidebar (Mobile/Tablet)
function updateSidebarNotificationBadge(count) {
    const sidebar = $$("mainSidebar");
    if (sidebar) {
        const item = sidebar.getItem("notifications");
        if (item) {
            item.badge = count;
            sidebar.updateItem("notifications", item);
        }
    }
}

// Handle Logout
async function handleLogout() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.LOGOUT, 'POST');

    if (result.success) {
        localStorage.removeItem('currentUser');
        webix.message({
            type: "success",
            text: "Logged out successfully"
        });
        showLoginPage();
    } else {
        localStorage.removeItem('currentUser');
        showLoginPage();
    }
}

// Toggle Sidebar Function
function toggleSidebar() {
    const sidebar = $$("mainSidebar");
    if (!sidebar) return;

    if (sidebar.config.hidden) {
        sidebar.show();
        // Add click listener to hide sidebar when clicking outside
        setTimeout(() => {
            attachOutsideClickListener();
        }, 100);
    } else {
        sidebar.hide();
        removeOutsideClickListener();
    }
}

// Attach click listener to detect clicks outside sidebar
function attachOutsideClickListener() {
    const mainContentArea = $$("mainContentArea");
    if (!mainContentArea) return;

    const contentNode = mainContentArea.getNode();
    if (contentNode) {
        contentNode.addEventListener('click', handleOutsideClick);
    }
}

// Remove outside click listener
function removeOutsideClickListener() {
    const mainContentArea = $$("mainContentArea");
    if (!mainContentArea) return;

    const contentNode = mainContentArea.getNode();
    if (contentNode) {
        contentNode.removeEventListener('click', handleOutsideClick);
    }
}

// Handle clicks outside sidebar
function handleOutsideClick(e) {
    const sidebar = $$("mainSidebar");
    if (!sidebar || sidebar.config.hidden) return;

    const sidebarNode = sidebar.getNode();
    const menuBtn = $$("menuToggleBtn");
    const menuBtnNode = menuBtn ? menuBtn.getNode() : null;

    // Check if click is outside sidebar and not on menu button
    if (sidebarNode && !sidebarNode.contains(e.target) &&
        menuBtnNode && !menuBtnNode.contains(e.target)) {
        sidebar.hide();
        removeOutsideClickListener();
    }
}

// Handle window resize for responsiveness
window.addEventListener('resize', function () {
    const currentPage = $$("homePage");
    if (currentPage && currentPage.isVisible()) {
        // Clean up event listeners before destroying
        removeOutsideClickListener();

        if (mainApp) {
            mainApp.destructor();
        }
        showHomePage();
    }
});