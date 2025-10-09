// Home Page UI (Blank for now)
function createHomePage() {
    return {
        id: "homePage",
        rows: [
            {
                view: "toolbar",
                elements: [
                    {
                        view: "label",
                        label: "Home Page"
                    },
                    {},
                    {
                        view: "button",
                        value: "Logout",
                        width: 100,
                        click: handleLogout
                    }
                ]
            },
            {
                view: "template",
                template: "<div style='text-align:center; padding-top:100px; font-size:24px;'>Welcome to Home Page<br><br>User search functionality will be here</div>",
                borderless: true
            }
        ]
    };
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
    }
}