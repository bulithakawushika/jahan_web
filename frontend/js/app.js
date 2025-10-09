// Main Application
let currentPage = null;

// Initialize the application
webix.ready(function () {
    // Check if user is already logged in
    checkAuthentication();
});

// Check authentication status
async function checkAuthentication() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.CHECK_AUTH);

    if (result.authenticated) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        showHomePage();
    } else {
        localStorage.removeItem('currentUser');
        showLoginPage();
    }
}

// Show Login Page
function showLoginPage() {
    if (currentPage) {
        webix.ui(createLoginPage(), $$("app"));
    } else {
        webix.ui({
            container: "app",
            rows: [createLoginPage()]
        });
    }
    currentPage = "login";
}

// Show Register Page
function showRegisterPage() {
    webix.ui(createRegisterPage(), $$("app"));
    currentPage = "register";
}

// Show Home Page
function showHomePage() {
    webix.ui(createHomePage(), $$("app"));
    currentPage = "home";
}