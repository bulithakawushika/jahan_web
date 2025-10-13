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
    const isMobile = screenWidth <= 1024;

    // Add profile content with responsive layout
    contentArea.addView({
        view: "scrollview",
        scroll: "y",
        body: {
            rows: [
                { height: 20 },
                // Main Profile Layout
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
                },
                { height: 20 }
            ]
        }
    });

    console.log('Profile displayed successfully!');
}

// Desktop Profile Layout - 3 equal columns in Row 1
function createDesktopProfileLayout(user) {
    const privacyColor = user.profile_visibility === 'public' ? '#27ae60' : '#e67e22';

    return [
        // ROW 1: Profile Details, Work Details, Profile Picture (3 equal columns)
        {
            height: 280,
            cols: [
                // Column 1 - Profile Details
                {
                    gravity: 1,
                    rows: [
                        {
                            view: "template",
                            template: `
                                <div style="background: white; border-radius: 12px; padding: 25px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 85%;">
                                    <div style="font-size: 22px; font-weight: 700; color: #2c3e50; margin-bottom: 20px; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                                        Profile Details
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 130px; font-size: 13px; color: #7f8c8d; font-weight: 600;">First Name:</div>
                                        <div style="flex: 1; font-size: 16px; color: #2c3e50; font-weight: 500;">${user.first_name || 'Not specified'}</div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 130px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Last Name:</div>
                                        <div style="flex: 1; font-size: 16px; color: #2c3e50; font-weight: 500;">${user.last_name || 'Not specified'}</div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 130px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Username:</div>
                                        <div style="flex: 1; font-size: 16px; color: #2c3e50; font-weight: 500;">@${user.username}</div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center;">
                                        <div style="width: 130px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Privacy Status:</div>
                                        <div style="flex: 1; font-size: 16px; color: ${privacyColor}; font-weight: 600; text-transform: capitalize;">
                                            ${user.profile_visibility || 'Public'}
                                        </div>
                                    </div>
                                </div>
                            `,
                            borderless: true
                        }
                    ]
                },
                { width: 20 },

                // Column 2 - Work Details
                {
                    gravity: 1,
                    rows: [
                        {
                            view: "template",
                            template: `
                                <div style="background: white; border-radius: 12px; padding: 25px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 85%;">
                                    <div style="font-size: 22px; font-weight: 700; color: #2c3e50; margin-bottom: 20px; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                                        Work Details
                                    </div>
                                    
                                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                                        <div style="width: 100px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Job Role:</div>
                                        <div style="flex: 1; font-size: 16px; color: #2c3e50; font-weight: 500;">${user.job_role || 'Not specified'}</div>
                                    </div>
                                    
                                    <div style="display: flex; align-items: center;">
                                        <div style="width: 100px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Department:</div>
                                        <div style="flex: 1; font-size: 16px; color: #2c3e50; font-weight: 500;">${user.department || 'Not specified'}</div>
                                    </div>
                                </div>
                            `,
                            borderless: true
                        }
                    ]
                },
                { width: 20 },

                // Column 3 - Profile Picture (no white background)
                {
                    gravity: 1,
                    rows: [
                        {
                            view: "template",
                            template: `
                                <div style="height: 83%; display: flex; align-items: center; justify-content: center;">
                                    <img src="${getProfilePhotoURL(user.profile_photo)}" 
                                         style="width: 220px; height: 220px; border-radius: 50%; object-fit: cover; border: 5px solid #3498db; box-shadow: 0 8px 20px rgba(0,0,0,0.15);" 
                                         onerror="this.src='https://via.placeholder.com/220/3498db/ffffff?text=No+Photo'" />
                                </div>
                            `,
                            borderless: true
                        }
                    ]
                }
            ]
        },
        // ROW 2: Personal Details (single column with 2 internal columns)
        {
            height: 210,
            rows: [
                {
                    view: "template",
                    template: buildPersonalDetailsHTML(user),
                    borderless: true
                }
            ]
        },
        { height: 30 },

        // ROW 3: Edit Button
        {
            height: 50,
            cols: [
                {},
                {
                    view: "button",
                    value: "Edit Profile",
                    css: "webix_primary",
                    width: 200,
                    height: 50,
                    click: showSettingsPage
                },
                {}
            ]
        }
    ];
}

// Mobile Profile Layout
function createMobileProfileLayout(user) {
    const privacyColor = user.profile_visibility === 'public' ? '#27ae60' : '#e67e22';

    return [
        // Profile Picture
        {
            view: "template",
            template: `
                <div style="text-align:center; margin-bottom: 15px;">
                    <img src="${getProfilePhotoURL(user.profile_photo)}" 
                         style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid #3498db; box-shadow: 0 6px 15px rgba(0,0,0,0.15);" 
                         onerror="this.src='https://via.placeholder.com/150/3498db/ffffff?text=No+Photo'" />
                </div>
            `,
            autoheight: true,
            borderless: true
        },

        {height:20},

        // Profile Details
        {
            view: "template",
            template: `
                <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 15px;">
                    <div style="font-size: 20px; font-weight: 700; color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #3498db; padding-bottom: 8px;">
                        Profile Details
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">First Name:</div>
                        <div style="flex: 1; font-size: 14px; color: #2c3e50; font-weight: 500;">${user.first_name || 'Not specified'}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">Last Name:</div>
                        <div style="flex: 1; font-size: 14px; color: #2c3e50; font-weight: 500;">${user.last_name || 'Not specified'}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">Username:</div>
                        <div style="flex: 1; font-size: 14px; color: #2c3e50; font-weight: 500;">@${user.username}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">Privacy Status:</div>
                        <div style="flex: 1; font-size: 14px; color: ${privacyColor}; font-weight: 600; text-transform: capitalize;">
                            ${user.profile_visibility || 'Public'}
                        </div>
                    </div>
                </div>
            `,
            autoheight: true,
            borderless: true
        },

        { height: 20 },

        // Work Details
        {
            view: "template",
            template: `
                <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 15px;">
                    <div style="font-size: 20px; font-weight: 700; color: #2c3e50; margin-bottom: 15px; border-bottom: 3px solid #3498db; padding-bottom: 8px;">
                        Work Details
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">Job Role:</div>
                        <div style="flex: 1; font-size: 14px; color: #2c3e50; font-weight: 500;">${user.job_role || 'Not specified'}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="width: 110px; font-size: 12px; color: #7f8c8d; font-weight: 600;">Department:</div>
                        <div style="flex: 1; font-size: 14px; color: #2c3e50; font-weight: 500;">${user.department || 'Not specified'}</div>
                    </div>
                </div>
            `,
            autoheight: true,
            borderless: true
        },

        { height: 20 },

        // Personal Details
        {
            view: "template",
            template: buildPersonalDetailsHTML(user, true),
            autoheight: true,
            borderless: true
        },

        { height: 20 },

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

// Build Personal Details HTML - Single box with 2 columns inside
function buildPersonalDetailsHTML(user, isMobile = false) {
    const birthday = formatBirthday(user.birthday);
    const genderDisplay = formatGender(user.gender);
    const maritalStatusDisplay = formatMaritalStatus(user.marital_status);
    const fontSize = isMobile ? '14px' : '16px';
    const labelWidth = isMobile ? '110px' : '130px';
    const labelSize = isMobile ? '12px' : '13px';
    const titleSize = isMobile ? '20px' : '22px';
    const marginBottom = isMobile ? '15px' : '0';

    return `
        <div style="background: white; border-radius: 12px; padding: 25px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); height: 100%; margin-bottom: ${marginBottom};">
            <div style="font-size: ${titleSize}; font-weight: 700; color: #2c3e50; margin-bottom: 20px; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                Personal Details
            </div>
            
            <div style="display: ${isMobile ? 'block' : 'flex'}; gap: 30px;">
                <!-- Left Column -->
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Email:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500; word-break: break-word;">${user.email || 'Not specified'}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Phone Number:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${user.phone_number || 'Not specified'}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Address:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500; line-height: 1.5;">${user.address || 'Not specified'}</div>
                    </div>
                </div>
                
                <!-- Right Column -->
                <div style="flex: 1; ${isMobile ? 'margin-top: 15px;' : ''}">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Birthday:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${birthday}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Gender:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${genderDisplay}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="width: ${labelWidth}; font-size: ${labelSize}; color: #7f8c8d; font-weight: 600;">Marital Status:</div>
                        <div style="flex: 1; font-size: ${fontSize}; color: #2c3e50; font-weight: 500;">${maritalStatusDisplay}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Format Gender
function formatGender(gender) {
    if (!gender) return 'Not specified';

    const genderMap = {
        'male': 'Male',
        'female': 'Female',
        'not_preferred': 'Prefer not to say'
    };

    return genderMap[gender] || 'Not specified';
}

// Format Marital Status
function formatMaritalStatus(status) {
    if (!status) return 'Not specified';

    const statusMap = {
        'single': 'Single',
        'married': 'Married',
        'divorced': 'Divorced',
        'separated': 'Separated'
    };

    return statusMap[status] || 'Not specified';
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