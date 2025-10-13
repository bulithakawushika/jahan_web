// Create Desktop Profile Page (with Toolbar)
function createDesktopProfilePage() {
    return {
        id: "profilePage",
        rows: [
            createNavigationBar('profile'), // Use shared navigation bar
            {
                id: "profileContentArea",
                gravity: 1,
                rows: [
                    {
                        view: "template",
                        template: `
                            <div style='text-align:center; padding:150px 50px;'>
                                <div class='loading-spinner'></div>
                                <div style='font-size:20px; color:#7f8c8d; margin-top:30px; font-weight:500;'>Loading profile...</div>
                            </div>
                        `,
                        borderless: true
                    }
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Profile Page (with Sidebar)
function createMobileProfilePage() {
    return {
        id: "profilePage",
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
                        id: "profileContentArea",
                        gravity: 1,
                        rows: [
                            {
                                view: "template",
                                template: `
                                    <div style='text-align:center; padding:150px 50px;'>
                                        <div class='loading-spinner'></div>
                                        <div style='font-size:20px; color:#7f8c8d; margin-top:30px; font-weight:500;'>Loading profile...</div>
                                    </div>
                                `,
                                borderless: true
                            }
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Responsive Profile Page
function createProfilePage() {
    const screenWidth = window.innerWidth;

    // Desktop view (> 1024px) - Show Toolbar
    if (screenWidth > 1024) {
        return createDesktopProfilePage();
    } else {
        // Mobile/Tablet view (<= 1024px) - Show Sidebar
        return createMobileProfilePage();
    }
}

// Fetch Profile Data from Database
async function fetchProfileFromDatabase() {
    console.log('Fetching profile from database...');

    try {
        const result = await apiCall(API_CONFIG.ENDPOINTS.PROFILE, 'GET');

        console.log('API Response:', result);

        if (result.success && result.user) {
            console.log('Profile data received:', result.user);

            // Update localStorage with fresh data
            localStorage.setItem('currentUser', JSON.stringify(result.user));

            // Display the profile
            displayProfileContent(result.user);

            webix.message({
                type: "success",
                text: "Profile loaded successfully"
            });
        } else {
            console.error('API returned error:', result);
            showProfileError('Failed to load profile data');
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        showProfileError('Network error while loading profile');
    }
}

// Display Profile Content
function displayProfileContent(user) {
    console.log('=== DISPLAYING CONTENT ===');
    console.log('User object:', user);

    const contentArea = $$("profileContentArea");

    if (!contentArea) {
        console.error('ERROR: profileContentArea not found!');
        return;
    }

    console.log('Removing existing views...');

    // Remove all child views
    const children = contentArea.getChildViews();
    children.forEach(child => {
        contentArea.removeView(child);
    });

    console.log('Adding new profile view...');

    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;

    // Add profile content with responsive layout
    contentArea.addView({
        view: "scrollview",
        scroll: "y",
        body: {
            rows: [
                { height: 15 },
                // Title
                {
                    view: "template",
                    template: `<div style='text-align:center; font-size:${isMobile ? '28px' : '38px'}; font-weight:bold; color:#2c3e50;'>Profile</div>`,
                    height: 50,
                    borderless: true
                },
                { height: 25 },
                // Profile Content
                {
                    cols: [
                        { width: isMobile ? 20 : 40 },
                        {
                            rows: isMobile ?
                                createMobileProfileLayout(user) :
                                createDesktopProfileLayout(user)
                        },
                        { width: isMobile ? 20 : 40 }
                    ]
                }
            ]
        }
    });

    console.log('Profile displayed successfully!');
}

// Desktop Profile Layout
function createDesktopProfileLayout(user) {
    return [
        {
            cols: [
                // Left - Profile Picture
                {
                    width: 260,
                    rows: [
                        {
                            view: "template",
                            template: `
                                <div style="text-align:center;">
                                    <img src="${getProfilePhotoURL(user.profile_photo)}" 
                                         style="width: 200px; height: 200px; border-radius: 50%; object-fit: cover; border: 4px solid #3498db; box-shadow: 0 6px 15px rgba(0,0,0,0.15);" 
                                         onerror="this.src='https://via.placeholder.com/200/3498db/ffffff?text=No+Photo'" />
                                </div>
                            `,
                            height: 220,
                            borderless: true
                        }
                    ]
                },
                { width: 30 },
                // Right - Details
                {
                    gravity: 1,
                    rows: [
                        {
                            view: "template",
                            template: buildProfileDetailsHTML(user),
                            borderless: true,
                            height: 500
                        }
                    ]
                }
            ]
        },
        { height: 40 },
        // Edit Button
        {
            view: "button",
            value: "Edit Profile",
            css: "webix_primary",
            height: 50,
            click: showSettingsPage
        },
        { height: 50 }
    ];
}

// Mobile Profile Layout
function createMobileProfileLayout(user) {
    return [
        // Profile Picture
        {
            view: "template",
            template: `
                <div style="text-align:center;">
                    <img src="${getProfilePhotoURL(user.profile_photo)}" 
                         style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #3498db; box-shadow: 0 6px 15px rgba(0,0,0,0.15);" 
                         onerror="this.src='https://via.placeholder.com/150/3498db/ffffff?text=No+Photo'" />
                </div>
            `,
            height: 170,
            borderless: true
        },
        { height: 20 },
        // Details
        {
            view: "template",
            template: buildProfileDetailsHTML(user, true),
            borderless: true,
            autoheight: true
        },
        { height: 30 },
        // Edit Button
        {
            view: "button",
            value: "Edit Profile",
            css: "webix_primary",
            height: 50,
            click: showSettingsPage
        },
        { height: 30 }
    ];
}

// Build Profile Details HTML - Inline Layout
function buildProfileDetailsHTML(user, isMobile = false) {
    const privacyColor = user.profile_visibility === 'public' ? '#27ae60' : '#e67e22';
    const birthday = formatBirthday(user.birthday);
    const padding = isMobile ? '25px 20px' : '35px 40px';
    const fontSize = isMobile ? '16px' : '18px';
    const labelWidth = isMobile ? '110px' : '140px';
    const labelSize = isMobile ? '12px' : '13px';

    return `
        <div style="background: white; border-radius: 12px; padding: ${padding}; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- First Name -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">First Name:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${user.first_name || 'Not specified'}</div>
            </div>
            
            <!-- Last Name -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Last Name:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${user.last_name || 'Not specified'}</div>
            </div>
            
            <!-- Username -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Username:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">@${user.username}</div>
            </div>
            
            <!-- Email -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Email:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500; word-break: break-word;">${user.email || 'Not specified'}</div>
            </div>
            
            <!-- Job Role -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Job Role:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${user.job_role || 'Not specified'}</div>
            </div>
            
            <!-- Birthday -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Birthday:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${birthday}</div>
            </div>
            
            <!-- Address -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Address:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500; line-height: 1.5;">${user.address || 'Not specified'}</div>
            </div>
            
            <!-- Privacy Status -->
            <div style="display: flex; align-items: center;">
                <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Privacy Status:</div>
                <div style="flex: 1; font-size: ${fontSize}; color: ${privacyColor}; font-weight: 600; text-transform: capitalize;">
                    ${user.profile_visibility || 'Public'}
                </div>
            </div>
        </div>
    `;
}

// Show Error Message
function showProfileError(message) {
    const contentArea = $$("profileContentArea");
    if (!contentArea) return;

    // Remove all child views
    const children = contentArea.getChildViews();
    children.forEach(child => {
        contentArea.removeView(child);
    });

    // Add error message
    contentArea.addView({
        view: "template",
        template: `
            <div style='text-align:center; padding:100px;'>
                <div style='font-size:50px; color:#e74c3c; margin-bottom:20px;'>⚠️</div>
                <div style='font-size:24px; color:#e74c3c; margin-bottom:20px;'>${message}</div>
                <button onclick='fetchProfileFromDatabase()' style='padding:10px 30px; font-size:16px; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer;'>Try Again</button>
            </div>
        `,
        borderless: true
    });

    webix.message({
        type: "error",
        text: message
    });
}

// Format Birthday
function formatBirthday(birthday) {
    if (!birthday) return 'Not specified';

    try {
        const date = new Date(birthday);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (e) {
        return 'Not specified';
    }
}