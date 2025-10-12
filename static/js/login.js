// Toggle password visibility
function toggleLoginPasswordVisibility() {
    const input = $$("loginPassword");
    if (!input) return;

    const node = input.getInputNode();

    if (node.type === "password") {
        node.type = "text";
        input.config.icon = "wxi-eye-slash";
    } else {
        node.type = "password";
        input.config.icon = "wxi-eye";
    }
    input.refresh();
}

// Create Login Form Component
function createLoginFormUI() {
    return {
        rows: [
            {
                // Flex-like centering using Webix layout
                gravity: 1,
                cols: [
                    {

                        rows: [
                            {
                                rows: [
                                    {
                                        view: "template",
                                        template: `
                                            <div style="
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                height: 100vh;
                                            "></div>
                                         `,
                                        borderless: true,
                                        height: 95,
                                    },
                                    {
                                        view: "template",
                                        template: "<div style='text-align:left; font-size:32px; font-weight:bold; color:#2c3e50;'>Welcome to Jahan.ai</div>",
                                        height: 50,
                                        borderless: true
                                    },
                                    {
                                        view: "template",
                                        template: "<div style='text-align:left; font-size:20px; color:#7f8c8d; margin-top:5px;'>Sign in to continue</div>",
                                        height: 35,
                                        borderless: true
                                    },
                                    { height: 20 },
                                    {
                                        view: "form",
                                        id: "loginForm",
                                        width: 400,
                                        height: 300,
                                        elements: [
                                            {
                                                view: "text",
                                                name: "username",
                                                label: "Username",
                                                placeholder: "Enter your username",
                                                labelPosition: "top",
                                                required: true
                                            },
                                            { height: 15 },
                                            {
                                                view: "text",
                                                type: "password",
                                                id: "loginPassword",
                                                name: "password",
                                                label: "Password",
                                                placeholder: "Enter your password",
                                                labelPosition: "top",
                                                required: true,
                                                icon: "wxi-eye",
                                                on: {
                                                    onIconClick: function () {
                                                        toggleLoginPasswordVisibility();
                                                    }
                                                }
                                            },
                                            { height: 25 },
                                            {
                                                view: "button",
                                                value: "Login",
                                                css: "webix_primary",
                                                height: 45,
                                                click: handleLogin
                                            },
                                            { height: 20 },
                                            {
                                                view: "template",
                                                template: "<div style='text-align:center; font-size:14px; color:#7f8c8d;'>Don't have an account? <a href='#' onclick='showRegisterPage(); return false;' style='color:#3498db; font-weight:600; text-decoration:none;'>Register here</a></div>",
                                                height: 30,
                                                borderless: true
                                            }
                                        ],
                                        rules: {
                                            username: webix.rules.isNotEmpty,
                                            password: webix.rules.isNotEmpty
                                        }
                                    }
                                ]
                            },
                            {}, // bottom space (for vertical centering)
                        ]
                    },
                    {width:130} // right space
                ]
            }
        ]
    };
}

// Create Desktop Login Page (Split Screen)
function createDesktopLoginPage() {
    return {
        id: "loginPage",
        cols: [
            // Left side - Image Only
            {
                width: 740,
                rows: [
                    {
                        view: "template",
                        template: `
                                <div style="
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                ">
                                    <div style="
                                        width: 530px;
                                        height: 585px;
                                        background: url('/static/images/login_image.png');
                                        background-size: cover;
                                        background-position: center;
                                        background-repeat: no-repeat;
                                    "></div>
                                </div>
                        `,
                        borderless: true,
                        height: 700
                    }
                ]
            },
            // Right side - Login Form
            {
                gravity: 1,
                rows: [
                    {
                        cols: [
                            {},
                            createLoginFormUI(),
                            {}
                        ]
                    }
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Login Page (Centered)
function createMobileLoginPage() {
    return {
        id: "loginPage",
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: 20 },
                    createLoginFormUI(),
                    { width: 20 }
                ]
            },
            { height: 20 }
        ]
    };
}

// Create Responsive Login Page
function createLoginPage() {
    const screenWidth = window.innerWidth;

    // Desktop view (> 768px)
    if (screenWidth > 768) {
        return createDesktopLoginPage();
    } else {
        // Mobile/Tablet view (<= 768px)
        return createMobileLoginPage();
    }
}

// Handle Login
async function handleLogin() {
    const form = $$("loginForm");

    if (!form) {
        webix.message({
            type: "error",
            text: "Form not found"
        });
        return;
    }

    if (!form.validate()) {
        webix.message({
            type: "error",
            text: "Please enter both username and password"
        });
        return;
    }

    const values = form.getValues();

    webix.message({
        type: "info",
        text: "Logging in..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', values);

    if (result.success) {
        webix.message({
            type: "success",
            text: result.message
        });

        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Load user settings immediately
        loadUserSettings();

        // Check for unread notifications
        checkUnreadNotifications();

        // Redirect to home page
        showHomePage();
    } else {
        webix.message({
            type: "error",
            text: result.message || "Login failed"
        });
    }
}

// Handle window resize for responsiveness
window.addEventListener('resize', function () {
    const currentPage = $$("loginPage");
    if (currentPage && currentPage.isVisible()) {
        // Recreate page with appropriate layout for new screen size
        if (mainApp) {
            mainApp.destructor();
        }
        showLoginPage();
    }
});