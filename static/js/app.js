// Main Application
let currentPage = null;
let mainApp = null;

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
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createLoginPage()]
    });

    currentPage = "login";
}

// Show Register Page
function showRegisterPage() {
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createRegisterPage()]
    });

    currentPage = "register";
}

// Show Home Page
function showHomePage() {
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createHomePage()]
    });

    currentPage = "home";
}