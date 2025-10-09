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
                                template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#34495e;'>Welcome Back</div>",
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
                                        name: "password",
                                        label: "Password",
                                        placeholder: "Enter your password",
                                        labelWidth: 120,
                                        required: true
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
                                        template: "<div style='text-align:center; margin-top:15px;'>Don't have an account? <a href='#' onclick='showRegisterPage()' style='color:#3498db; font-weight:bold;'>Register here</a></div>",
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

// Handle Login
async function handleLogin() {
    const form = $$("loginForm");

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

        // Redirect to home page
        showHomePage();
    } else {
        webix.message({
            type: "error",
            text: result.message || "Login failed"
        });
    }
}