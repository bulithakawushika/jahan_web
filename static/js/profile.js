// Profile Page UI - Initial Loading State
function createProfilePage() {
    return {
        id: "profilePage",
        rows: [
            // Toolbar
            {
                view: "toolbar",
                height: 60,
                elements: [
                    {
                        view: "button",
                        value: "← Back to Home",
                        width: 150,
                        click: showHomePage
                    },
                    {},
                    {
                        view: "button",
                        value: "Settings",
                        width: 100,
                        click: function () {
                            webix.message("Settings page - Coming soon!");
                        }
                    },
                    {
                        view: "button",
                        value: "Logout",
                        width: 100,
                        click: handleLogout
                    }
                ]
            },
            // Main content area with animated loading
            {
                id: "profileContentArea",
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

    // Add profile content
    contentArea.addView({
        view: "scrollview",
        scroll: "y",
        body: {
            rows: [
                { height: 15 },
                // Title - moved up
                {
                    view: "template",
                    template: "<div style='text-align:center; font-size:38px; font-weight:bold; color:#2c3e50;'>Profile</div>",
                    height: 50,
                    borderless: true
                },
                { height: 25 },
                // Profile Content
                {
                    cols: [
                        { width: 40 },
                        {
                            rows: [
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
                                        // Right - Details (no scrolling, inline layout)
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
                                // Edit Button - moved down more
                                {
                                    view: "button",
                                    value: "Edit Profile",
                                    css: "webix_primary",
                                    height: 50,
                                    click: showSettingsPage
                                },
                                { height: 50 }
                            ]
                        },
                        { width: 40 }
                    ]
                }
            ]
        }
    });

    console.log('Profile displayed successfully!');
}

// Build Profile Details HTML - Inline Layout
function buildProfileDetailsHTML(user) {
    const privacyColor = user.profile_visibility === 'public' ? '#27ae60' : '#e67e22';
    const birthday = formatBirthday(user.birthday);

    return `
        <div style="background: white; border-radius: 12px; padding: 35px 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <!-- First Name -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">First Name:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">${user.first_name || 'Not specified'}</div>
            </div>
            
            <!-- Last Name -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Last Name:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">${user.last_name || 'Not specified'}</div>
            </div>
            
            <!-- Username -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Username:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">@${user.username}</div>
            </div>
            
            <!-- Email -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Email:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">${user.email || 'Not specified'}</div>
            </div>
            
            <!-- Job Role -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Job Role:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">${user.job_role || 'Not specified'}</div>
            </div>
            
            <!-- Birthday -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Birthday:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500;">${birthday}</div>
            </div>
            
            <!-- Address -->
            <div style="display: flex; align-items: center; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #ecf0f1;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Address:</div>
                <div style="flex: 1; font-size: 18px; color: #2c3e50; font-weight: 500; line-height: 1.5;">${user.address || 'Not specified'}</div>
            </div>
            
            <!-- Privacy Status -->
            <div style="display: flex; align-items: center;">
                <div style="width: 140px; font-size: 13px; color: #7f8c8d; font-weight: 600;">Privacy Status:</div>
                <div style="flex: 1; font-size: 18px; color: ${privacyColor}; font-weight: 600; text-transform: capitalize;">
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