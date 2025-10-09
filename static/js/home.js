// Home Page UI
function createHomePage() {
    return {
        id: "homePage",
        rows: [
            // Toolbar
            {
                view: "toolbar",
                height: 60,
                elements: [
                    {
                        view: "label",
                        label: "Home"
                    },
                    {},
                    {
                        view: "button",
                        value: "Profile",
                        width: 100,
                        click: function () {
                            webix.message("Profile page - Coming soon!");
                        }
                    },
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
            // Main content area
            {
                id: "homeContent",
                rows: [
                    createSearchView()
                ]
            }
        ]
    };
}

// Initial Search View (before search)
function createSearchView() {
    return {
        id: "searchView",
        rows: [
            { height: 100 },
            {
                cols: [
                    {},
                    {
                        width: 700,
                        rows: [
                            {
                                view: "template",
                                template: "<div style='text-align:center; font-size:42px; font-weight:bold; color:#2c3e50; margin-bottom:15px;'>Who Are You Looking For Today?</div>",
                                height: 80,
                                borderless: true
                            },
                            {
                                view: "template",
                                template: "<div style='text-align:center; font-size:18px; color:#7f8c8d; margin-bottom:30px;'>Type a name or job role to discover team members across our organization</div>",
                                height: 50,
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
                                                if (code === 13) { // Enter key
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
            {}
        ]
    };
}

// Results View (after search)
function createResultsView(results, query = '') {
    return {
        rows: [
            {
                height: 130,
                rows: [
                    {
                        view: "template",
                        template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#2c3e50; padding-top:20px;'>Meet the people who fit your search</div>",
                        height: 60,
                        borderless: true
                    },
                    {
                        cols: [
                            { width: 50 },
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
                            { width: 50 }
                        ]
                    },
                    { height: 20 }  // Margin between search and results
                ]
            },
            {
                view: "scrollview",
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
                cols.push({ gravity: 1 });  // Empty space if odd number
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

    return {
        view: "template",
        css: "user_card",
        template: `
            <div style="display: flex; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); height: 160px; margin: 10px;">
                <div style="flex-shrink: 0; margin-right: 20px;">
                    <img src="${profilePhoto}" style="width: 120px; height: 120px; border-radius: 10px; object-fit: cover; border: 3px solid #3498db;" />
                </div>
                <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                    <div style="font-size: 22px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${user.first_name} ${user.last_name}
                    </div>
                    <div style="font-size: 15px; color: #3498db; margin-bottom: 6px;">
                        <strong>Job:</strong> ${user.job_role || 'Not specified'}
                    </div>
                    <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <strong>Email:</strong> ${user.email}
                    </div>
                    <div style="font-size: 13px; color: #7f8c8d; margin-bottom: 4px;">
                        <strong>Age:</strong> ${calculateAge(user.birthday)}
                    </div>
                    <div style="font-size: 13px; color: #7f8c8d; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        <strong>Address:</strong> ${user.address || 'Not specified'}
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
    // Get search value
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
        // Get home content area
        const homeContent = $$("homeContent");

        if (homeContent) {
            // Remove all existing views from homeContent
            while (homeContent.getChildViews().length > 0) {
                homeContent.removeView(homeContent.getChildViews()[0]);
            }

            // Add new results view
            homeContent.addView(createResultsView(result.results, query));
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