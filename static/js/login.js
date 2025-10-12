// Toggle password visibility
function toggleLoginPasswordVisibility() {
    const form = $("loginForm");
    if (!form) return;

    const passwordField = form.elements["password"];
    if (!passwordField) return;

    const node = passwordField.getInputNode();

    if (node.type === "password") {
        node.type = "text";
        passwordField.config.icon = "wxi-eye-slash";
    } else {
        node.type = "password";
        passwordField.config.icon = "wxi-eye";
    }
    passwordField.refresh();
}

// Create Login Form Component
function createLoginFormUI() {
    return {
        rows: [
            {
                view: "template",
                template: "<div style='font-size:32px; font-weight:bold'>Welcome to Jahan.ai</div>",
                height: 50,
                borderless: true
            },
            {
                view: "template",
                template: "<div style='font-size:18px; color:#7f8c8d; margin-top:5px;'>Sign in to continue</div>",
                height: 40,
                borderless: true
            },

            {
                view: "form",
                id: "loginForm",
                maxWidth: 450,
                padding: 5,
                elements: [
                    {
                        view: "text",
                        name: "username",
                        label: "Username",
                        placeholder: "Enter your username",
                        labelPosition: "top",
                        required: true,
                        height: 80
                    },
                    {
                        view: "search",
                        type: "password",
                        name: "password",
                        label: "Password",
                        placeholder: "Enter your password",
                        labelPosition: "top",
                        required: true,
                        icon: "wxi-eye",
                        on: {
                            onSearchIconClick: function (e) {
                                const input = this.getInputNode();
                                webix.html.removeCss(e.target, "wxi-eye-slash");
                                webix.html.removeCss(e.target, "wxi-eye");
                                if (input.type == "text") {
                                    webix.html.addCss(e.target, "wxi-eye");
                                    input.type = "password";
                                } else {
                                    webix.html.addCss(e.target, "wxi-eye-slash");
                                    input.type = "text";
                                }
                            }
                        },
                        height: 80
                    },

                    {
                        view: "button",
                        value: "Login",
                        css: "webix_primary",
                        height: 45,
                        click: handleLogin 
                    },
                    {
                        view: "template",
                        template: "<div style='font-size:16px; color:#7f8c8d;'>Don't have an account? <a href='#' onclick='showRegisterPage(); return false;' style='color:#3498db; font-weight:600; text-decoration:none;'>Register here</a></div>",
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
    };
}

// Create Desktop Login Page (50:50 Split - Image and Form)
function createDesktopLoginPage() {
    return {
        id: "loginPage",
        type: "clean",
        css: "login_page_container",
        cols: [
            // Left side - Image (50%)
            {
                gravity: 1,
                rows: [
                    {
                        view: "template",
                        template: `
                            <div style="
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100%;
                                width: 100%;
                            ">
                                <img src="/static/images/login_image.png" 
                                     style="max-width: 80%; max-height: 80%; object-fit: contain;" 
                                     alt="Login Image" />
                            </div>
                        `,
                        borderless: true
                    }
                ]
            },
            // Right side - Login Form (50%)
            {
                gravity: 1,
                rows: [
                    { gravity: 0.7 },
                    {
                        cols: [
                            {
                                gravity: 1,
                                rows: [createLoginFormUI()]
                            },
                            { gravity: 0.1 }
                        ]
                    },
                    { gravity: 1 }
                ]
            }
        ]
    };
}

// Create Mobile/Tablet Login Page (Centered, No Image)
function createMobileLoginPage() {
    return {
        id: "loginPage",
        type: "clean",
        css: "login_page_container",
        height: window.innerHeight, 
        rows: [
            {
                view: "template",
                template: `
                         <div class="wave-container">
                        <svg viewBox="0 0 1440 150" preserveAspectRatio="none" class="wave-svg flipped">
                            <path d="M0,50 C360,150 1080,0 1440,100 L1440,150 L0,150 Z" fill="#3296d8ff"></path>
                        </svg>
                    </div>
                    <style>
                        .wave-container {
                            width: 100%;
                            overflow: hidden;
                            line-height: 0;
                        }
                        .wave-svg {
                            display: block;
                            width: 100%;
                            height: 200px;
                        }
                        .wave-svg.flipped {
                            transform: scaleY(-1);
                        }
                    </style>
                        `,
                borderless: true
            },          
            {
                cols: [
                    { gravity: 0.1 },
                        {
                        maxWidth: 700,
                        rows: [
                            createLoginFormUI()
                        ]},
                    { gravity: 0.2 }
                    ] 
            },
            {
                view: "template",
                template: `
        <div style="position: relative; height: 100%; width: 100%;">
            <!-- Other content here -->

            <div class="wave-bottom-container">
                <svg viewBox="0 0 1440 150" preserveAspectRatio="none" class="wave-bottom-svg">
                    <path d="M0,50 C360,150 1080,0 1440,100 L1440,150 L0,150 Z" fill="#3296d8ff"></path>
                </svg>
            </div>

            <style>
                .wave-bottom-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    overflow: hidden;
                    line-height: 0;
                }
                .wave-bottom-svg {
                    display: block;
                    width: 100%;
                    height: 200px;
                }
            </style>
        </div>
    `,
                borderless: true,
            }

        ]
    };
}

// Create Responsive Login Page
function createLoginPage() {
    const screenWidth = window.innerWidth;

    // Desktop view (> 1024px) - Show 50:50 split
    if (screenWidth > 1024) {
        return createDesktopLoginPage();
    } else {
        // Mobile/Tablet view (<= 1024px) - Centered form only
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