// Main Application
let currentPage = null;
let mainApp = null;

// Initialize the application
webix.ready(function () {
    // Small delay to ensure all scripts are loaded
    setTimeout(function () {
        checkAuthentication();
    }, 100);
});

// Check authentication status
async function checkAuthentication() {
    const result = await apiCall(API_CONFIG.ENDPOINTS.CHECK_AUTH);

    if (result.authenticated) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Load user settings
        loadUserSettings();

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

    // Attach password toggle handler
    if (typeof attachPasswordToggle === 'function') {
        attachPasswordToggle();
    }
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

    // Check if createHomePage function exists
    if (typeof createHomePage !== 'function') {
        console.error('createHomePage is not defined');
        webix.message('Error loading home page');
        return;
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createHomePage()]
    });

    currentPage = "home";
}

// Show Profile Page
function showProfilePage() {
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createProfilePage()]
    });

    currentPage = "profile";

    // Fetch fresh profile data from database
    setTimeout(function () {
        fetchProfileFromDatabase();
    }, 100);
}

// Show Settings Page
function showSettingsPage() {
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createSettingsPage()]
    });

    currentPage = "settings";

    // Load settings data
    setTimeout(function () {
        loadSettingsData();
    }, 100);
}

// Show Notifications Page
function showNotificationsPage() {
    if (mainApp) {
        mainApp.destructor();
    }

    mainApp = webix.ui({
        container: "app",
        id: "mainApp",
        rows: [createNotificationsPage()]
    });

    currentPage = "notifications";

    // Load notifications
    setTimeout(function () {
        loadNotifications();
    }, 100);
}

// Load User Settings After Login
function loadUserSettings() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        console.log('Loading user settings:', user);

        // Apply all accessibility settings
        AccessibilityManager.applyFontSize(user.font_size || 'medium');
        AccessibilityManager.applyTheme(user.theme || 'standard');
        AccessibilityManager.applyBrightness(user.brightness_level || 'normal');
        AccessibilityManager.applyKeyboardNavigation(user.keyboard_navigation !== false);
        AccessibilityManager.applyScreenReader(user.screen_reader || false);
        AccessibilityManager.applyHighContrast(user.high_contrast || false);

        console.log('User settings loaded and applied');
    }
}