// Toggle password visibility - SIMPLIFIED VERSION
function togglePasswordVisibility(inputId) {
    const input = $$(inputId);
    if (!input) {
        console.log('Input not found:', inputId);
        return;
    }

    const inputNode = input.getInputNode();
    const iconNode = input.$view.querySelector('.webix_input_icon');

    console.log('Current type:', inputNode.type);

    if (inputNode.type === "password") {
        inputNode.type = "text";
        if (iconNode) {
            iconNode.className = iconNode.className.replace('wxi-eye', 'wxi-eye-slash');
        }
        console.log('Changed to text');
    } else {
        inputNode.type = "password";
        if (iconNode) {
            iconNode.className = iconNode.className.replace('wxi-eye-slash', 'wxi-eye');
        }
        console.log('Changed to password');
    }
}

// Login Page UI
function createLoginPage() {
    return {
        id: "loginPage",
        rows: [
            {
                height: 60
            },
            {
                cols: [
                    {},
                    {
                        width: 450,
                        rows: [
                            {
                                view: "template",
                                template: "<div style='text-align: center; font-size: 25px; font-weight: bold; color:#424242;'>Welcome to Jahan.ai</div > ",
                                height: 60,
                                borderless: true
                            },
                            {
                                view: "form",
                                id: "loginForm",
                                elements: [
                                    {
                                        view: "text",
                                        name: "username",
                                        label: "Username",
                                        placeholder: "Enter your username",
                                        labelWidth: 120,
                                        required: true
                                    },
                                    {
                                        view: "text",
                                        type: "password",
                                        id: "loginPassword",
                                        name: "password",
                                        label: "Password",
                                        placeholder: "Enter your password",
                                        labelWidth: 120,
                                        required: true,
                                        icon: "wxi-eye"
                                    },
                                    {
                                        margin: 10
                                    },
                                    {
                                        view: "button",
                                        value: "Login",
                                        css: "webix_primary",
                                        height: 45,
                                        click: handleLogin
                                    },
                                    {
                                        margin: 5
                                    },
                                    {
                                        view: "template",
                                        template: "<div style='text-align:center; margin-top:15px;'>Don't have an account? <a href='javascript:void(0);' onclick='showRegisterPage()' style='color:#3498db; font-weight:bold; text-decoration:none;'>Register here</a></div>",
                                        height: 40,
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
                    {}
                ]
            },
            {}
        ]
    };
}

// Attach icon click handler after page is created
function attachPasswordToggle() {
    setTimeout(function () {
        const loginPasswordInput = $$("loginPassword");
        if (loginPasswordInput) {
            const iconNode = loginPasswordInput.$view.querySelector('.webix_input_icon');
            if (iconNode) {
                iconNode.style.cursor = 'pointer';
                iconNode.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePasswordVisibility("loginPassword");
                });
            }
        }
    }, 100);
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
            text: "Please fill in all required fields"
        });
        return;
    }

    const values = form.getValues();

    // Show loading
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