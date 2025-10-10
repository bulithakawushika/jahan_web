// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = $$(inputId);
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

// Update photo display with filename and green tick
function updatePhotoDisplay(filename) {
    const display = $$("photoDisplay");
    if (display) {
        display.setHTML(`
            <div style="display: flex; align-items: center; padding: 5px;">
                <span style="color: #27ae60; font-size: 20px; margin-right: 8px;">✓</span>
                <span style="color: #2c3e50; font-size: 14px;">${filename}</span>
            </div>
        `);
    }
}

// Register Page UI
function createRegisterPage() {
    return {
        id: "registerPage",
        rows: [
            {
                height: 50
            },
            {
                cols: [
                    { width: 20 },
                    {
                        width: 700,
                        rows: [
                            {
                                view: "template",
                                template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#34495e;'>Create Account</div>",
                                height: 50,
                                borderless: true
                            },
                            {
                                view: "form",
                                id: "registerForm",
                                scroll: true,
                                elements: [
                                    {
                                        cols: [
                                            {
                                                view: "text",
                                                name: "first_name",
                                                label: "First Name",
                                                placeholder: "Enter first name",
                                                labelWidth: 150,
                                                required: true,
                                                invalidMessage: "First name is required"
                                            },
                                            {
                                                view: "text",
                                                name: "last_name",
                                                label: "Last Name",
                                                placeholder: "Enter last name",
                                                labelWidth: 150,
                                                required: true,
                                                invalidMessage: "Last name is required"
                                            }
                                        ]
                                    },
                                    {
                                        view: "text",
                                        name: "username",
                                        label: "Username",
                                        placeholder: "Choose a username",
                                        labelWidth: 150,
                                        required: true,
                                        invalidMessage: "Username is required"
                                    },
                                    {
                                        view: "text",
                                        name: "email",
                                        label: "Email",
                                        placeholder: "Enter your email",
                                        labelWidth: 150,
                                        required: true,
                                        invalidMessage: "Valid email is required"
                                    },
                                    {
                                        view: "text",
                                        type: "password",
                                        id: "registerPassword",
                                        name: "password",
                                        label: "Password",
                                        placeholder: "Create a password",
                                        labelWidth: 150,
                                        required: true,
                                        invalidMessage: "Password is required",
                                        icon: "wxi-eye",
                                        on: {
                                            onAfterRender: function () {
                                                const iconNode = this.$view.querySelector('.webix_input_icon');
                                                if (iconNode) {
                                                    iconNode.onclick = function (e) {
                                                        e.stopPropagation();
                                                        togglePasswordVisibility("registerPassword");
                                                    };
                                                }
                                            }
                                        }
                                    },
                                    {
                                        view: "text",
                                        type: "password",
                                        id: "registerConfirmPassword",
                                        name: "re_password",
                                        label: "Confirm Password",
                                        placeholder: "Re-enter password",
                                        labelWidth: 150,
                                        required: true,
                                        invalidMessage: "Please confirm your password",
                                        icon: "wxi-eye",
                                        on: {
                                            onAfterRender: function () {
                                                const iconNode = this.$view.querySelector('.webix_input_icon');
                                                if (iconNode) {
                                                    iconNode.onclick = function (e) {
                                                        e.stopPropagation();
                                                        togglePasswordVisibility("registerConfirmPassword");
                                                    };
                                                }
                                            }
                                        }
                                    },
                                    {
                                        view: "datepicker",
                                        name: "birthday",
                                        label: "Birthday",
                                        placeholder: "Select date (Optional)",
                                        labelWidth: 150,
                                        format: "%Y-%m-%d",
                                        stringResult: true,
                                        editable: true
                                    },
                                    {
                                        view: "textarea",
                                        name: "address",
                                        label: "Address",
                                        placeholder: "Enter your address (Optional)",
                                        labelWidth: 150,
                                        height: 80
                                    },
                                    {
                                        view: "text",
                                        name: "job_role",
                                        label: "Job Role",
                                        placeholder: "Enter your job role (Optional)",
                                        labelWidth: 150
                                    },
                                    {
                                        cols: [
                                            {
                                                view: "uploader",
                                                id: "profilePhotoUploader",
                                                name: "profile_photo",
                                                label: "Select Profile Photo",
                                                labelWidth: 150,
                                                value: "Choose File",
                                                width: 350,
                                                accept: "image/*",
                                                multiple: false,
                                                autosend: false,
                                                on: {
                                                    onBeforeFileAdd: function (file) {
                                                        updatePhotoDisplay(file.name);
                                                        return true;
                                                    }
                                                }
                                            },
                                            {
                                                view: "template",
                                                id: "photoDisplay",
                                                template: "",
                                                borderless: true
                                            }
                                        ]
                                    },
                                    {
                                        margin: 15
                                    },
                                    {
                                        cols: [
                                            {
                                                view: "button",
                                                value: "Register",
                                                css: "webix_primary",
                                                height: 45,
                                                click: handleRegister
                                            },
                                            {
                                                width: 10
                                            },
                                            {
                                                view: "button",
                                                value: "Back to Login",
                                                height: 45,
                                                click: function () {
                                                    showLoginPage();
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        margin: 10
                                    }
                                ],
                                rules: {
                                    first_name: webix.rules.isNotEmpty,
                                    last_name: webix.rules.isNotEmpty,
                                    username: webix.rules.isNotEmpty,
                                    email: webix.rules.isEmail,
                                    password: webix.rules.isNotEmpty,
                                    re_password: webix.rules.isNotEmpty
                                }
                            }
                        ]
                    },
                    { width: 20 }
                ]
            },
            {
                height: 50
            }
        ]
    };
}

// Handle Registration
async function handleRegister() {
    const form = $$("registerForm");

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
            text: "Please fill in all required fields correctly"
        });
        return;
    }

    const values = form.getValues();

    // Check if passwords match
    if (values.password !== values.re_password) {
        webix.message({
            type: "error",
            text: "Passwords do not match!"
        });
        return;
    }

    // Format birthday to YYYY-MM-DD if it exists
    if (values.birthday) {
        // Check if birthday is a Date object
        if (values.birthday instanceof Date) {
            const year = values.birthday.getFullYear();
            const month = String(values.birthday.getMonth() + 1).padStart(2, '0');
            const day = String(values.birthday.getDate()).padStart(2, '0');
            values.birthday = `${year}-${month}-${day}`;
        } else if (typeof values.birthday === 'string' && !values.birthday.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // If it's a string but not in YYYY-MM-DD format
            const date = new Date(values.birthday);
            if (!isNaN(date.getTime())) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                values.birthday = `${year}-${month}-${day}`;
            }
        }
    }

    // Show loading
    webix.message({
        type: "info",
        text: "Creating your account..."
    });

    // Handle file upload
    const uploader = $$("profilePhotoUploader");
    const files = uploader ? uploader.files.data.pull : {};

    if (Object.keys(files).length > 0) {
        // If there's a profile photo, use FormData
        const formData = new FormData();

        // Add all form fields
        for (let key in values) {
            if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                formData.append(key, values[key]);
            }
        }

        // Add the file
        const fileId = Object.keys(files)[0];
        const file = files[fileId].file;
        formData.append('profile_photo', file);

        const result = await apiCallWithFile(API_CONFIG.ENDPOINTS.REGISTER, formData);
        handleRegistrationResponse(result);
    } else {
        // No file, use regular JSON
        // Remove empty optional fields
        const cleanedValues = {};
        for (let key in values) {
            if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                cleanedValues[key] = values[key];
            }
        }

        const result = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', cleanedValues);
        handleRegistrationResponse(result);
    }
}

function handleRegistrationResponse(result) {
    if (result.success) {
        webix.message({
            type: "success",
            text: "Registration successful! Redirecting to home..."
        });

        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(result.user));

        // Load default user settings
        loadUserSettings();

        // Redirect to home page after 1 second
        setTimeout(() => {
            showHomePage();
        }, 1000);
    } else {
        let errorMessage = "Registration failed";

        if (result.errors) {
            // Display specific field errors
            const errorList = [];
            for (let field in result.errors) {
                const fieldErrors = result.errors[field];
                if (Array.isArray(fieldErrors)) {
                    errorList.push(...fieldErrors);
                } else {
                    errorList.push(fieldErrors);
                }
            }
            errorMessage = errorList.join(", ");
        } else if (result.message) {
            errorMessage = result.message;
        }

        webix.message({
            type: "error",
            text: errorMessage,
            expire: 5000
        });
    }
}