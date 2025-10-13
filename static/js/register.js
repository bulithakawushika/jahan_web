// Add CSS for consistent label font size

if (!document.getElementById('label-font-style')) {
    const style = document.createElement('style');
    style.id = 'label-font-style';
    style.innerHTML = `
        .label-font-size .webix_inp_label {
            font-size: 14px !important;
        }
    `;
    document.head.appendChild(style);
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

// This function is no longer needed as we're using the Webix native approach

// Generate year options (1925 - 2025)
function getYearOptions() {
    const years = [];
    for (let year = 2025; year >= 1925; year--) {
        years.push({ id: year, value: year.toString() });
    }
    return years;
}

// Generate month options
function getMonthOptions() {
    return [
        { id: 1, value: "January" },
        { id: 2, value: "February" },
        { id: 3, value: "March" },
        { id: 4, value: "April" },
        { id: 5, value: "May" },
        { id: 6, value: "June" },
        { id: 7, value: "July" },
        { id: 8, value: "August" },
        { id: 9, value: "September" },
        { id: 10, value: "October" },
        { id: 11, value: "November" },
        { id: 12, value: "December" }
    ];
}

// Generate day options (1-31)
function getDayOptions() {
    const days = [];
    for (let day = 1; day <= 31; day++) {
        days.push({ id: day, value: day.toString() });
    }
    return days;
}

// Register Page UI
function createRegisterPage() {
    const isMobile = window.innerWidth <= 768;
    const formWidth = isMobile ? window.innerWidth - 20 : Math.min(window.innerWidth * 0.8, 1200);
    const screenHeight = window.innerHeight;

    // Add CSS for richselect popup background
    if (!document.getElementById('richselect-popup-style')) {
        const style = document.createElement('style');
        style.id = 'richselect-popup-style';
        style.innerHTML = `
            .webix_list_item {
                background-color: white !important;
            }
            .webix_list {
                background-color: white !important;
            }
        `;
        document.head.appendChild(style);
    }

    return {
        id: "registerPage",
        rows: [
            {
                view: "template",
                template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#34495e; padding:20px;'>Create Account</div>",
                height: 80,
                borderless: true
            },

            {
                
                cols: [
                    { gravity: 0.8 },
                    {
                        width: formWidth,
                        rows: [
                            
                            {
                                view: "form",
                                id: "registerForm",
                                scroll: true,
                                height: screenHeight - (isMobile ? 80 : 120),
                                elements: [
                                    // Name fields
                                    {
                                        view: "text",
                                        name: "first_name",
                                        label: "First Name",
                                        placeholder: "Enter first name",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size"
                                    },
                                    {
                                        view: "text",
                                        name: "last_name",
                                        label: "Last Name",
                                        placeholder: "Enter last name",
                                        height: 49,
                                        labelWidth: 150,
                                        required: true,
                                        css: "label-font-size"
                                    },
                                    // Username and Email
                                    {
                                        view: "text",
                                        name: "username",
                                        label: "Username",
                                        placeholder: "Choose a username",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size"
                                    },
                                    {
                                        view: "text",
                                        name: "email",
                                        label: "Email",
                                        placeholder: "Enter your email",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size"
                                    },
                                    {
                                        view: "text",
                                        name: "phone_number",
                                        label: "Phone Number",
                                        placeholder: "Enter phone number",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size"
                                    },
                                    // Job Role and Department
                                    {
                                        view: "text",
                                        name: "job_role",
                                        label: "Job Role",
                                        placeholder: "Enter your job role",
                                        height: 49,
                                        labelWidth: 150,
                                        css: "label-font-size"
                                    },
                                    {
                                        view: "text",
                                        name: "department",
                                        label: "Department",
                                        placeholder: "Enter your department",
                                        height: 49,
                                        labelWidth: 150,
                                        css: "label-font-size"
                                    },
                                    // Gender and Marital Status
                                    {
                                        cols: [
                                            {
                                                view: "richselect",
                                                name: "gender",
                                                label: "Gender",
                                                placeholder: "Select gender",
                                                labelWidth: 150,
                                                height: 49,
                                                css: "label-font-size",
                                                options: [
                                                    { id: "male", value: "Male" },
                                                    { id: "female", value: "Female" },
                                                    { id: "not_preferred", value: "Prefer not to say" }
                                                ]
                                            },
                                            { width: 20 },
                                            {
                                                view: "richselect",
                                                name: "marital_status",
                                                label: "Marital Status",
                                                placeholder: "Select status",
                                                height: 49,
                                                labelWidth: 150,
                                                css: "label-font-size",
                                                options: [
                                                    { id: "single", value: "Single" },
                                                    { id: "married", value: "Married" },
                                                    { id: "divorced", value: "Divorced" },
                                                    { id: "separated", value: "Separated" }
                                                ]
                                            }
                                        ]
                                    },
                                    { height: 10 },
                                    // Birthday - Year, Month, Day
                                    {
                                        view: "template",
                                        template: "<div style='font-size:14px; color:#2c3e50;  font-weight:bold;'>Date of Birth</div>",
                                        height: 30,
                                        borderless: true
                                    },
                                    {
                                        cols: [
                                            { gravity: 0.1 },
                                            {
                                                view: "richselect",
                                                name: "birth_year",
                                                label: "Year",
                                                placeholder: "Year",
                                                height: 49,
                                                labelWidth: 60,
                                                css: "label-font-size",
                                                options: getYearOptions()
                                            },
                                            { width: 20 },
                                            {
                                                view: "richselect",
                                                name: "birth_month",
                                                label: "Month",
                                                placeholder: "Month",
                                                height: 49,
                                                labelWidth: 60,
                                                css: "label-font-size",
                                                options: getMonthOptions()
                                            },
                                            { width: 20 },
                                            {
                                                view: "richselect",
                                                name: "birth_day",
                                                label: "Day",
                                                placeholder: "Day",
                                                height: 49,
                                                labelWidth: 60,
                                                css: "label-font-size",
                                                options: getDayOptions()
                                            },
                                        ]
                                    },

                                    {height:10},
                                    // Address
                                    {
                                        view: "textarea",
                                        name: "address",
                                        label: "Address",
                                        placeholder: "Enter your address",
                                        labelWidth: 150,
                                        height: 49,
                                        height: 80,
                                        css: "label-font-size"
                                    },
                                    // Password fields
                                    {
                                        view: "search",
                                        type: "password",
                                        id: "registerPassword",
                                        name: "password",
                                        label: "Password",
                                        placeholder: "Create a password",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size",
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
                                        }
                                    },
                                    {
                                        view: "search",
                                        type: "password",
                                        id: "registerConfirmPassword",
                                        name: "re_password",
                                        label: "Confirm Password",
                                        placeholder: "Re-enter password",
                                        labelWidth: 150,
                                        height: 49,
                                        required: true,
                                        css: "label-font-size",
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
                                        }
                                    },
                                    { height: 20 },
                                    // Profile Photo
                                    {
                                        cols: [
                                            {
                                                view: "uploader",
                                                id: "profilePhotoUploader",
                                                name: "profile_photo",
                                                label: "Select Profile Photo",
                                                labelWidth: 150,
                                                height: 49,
                                                value: "Choose File",
                                                width: 350,
                                                css: "label-font-size",
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
                                    { height: 20 },
                                    // Buttons
                                    {
                                        cols: [
                                            {
                                                view: "button",
                                                value: "Register",
                                                css: "webix_primary",
                                                height: 45,
                                                click: handleRegister
                                            },
                                            { width: 10 },
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
                                    { height: 10 }
                                ],
                                rules: {
                                    first_name: webix.rules.isNotEmpty,
                                    last_name: webix.rules.isNotEmpty,
                                    username: webix.rules.isNotEmpty,
                                    email: webix.rules.isEmail,
                                    phone_number: webix.rules.isNotEmpty,
                                    department: webix.rules.isNotEmpty,
                                    password: webix.rules.isNotEmpty,
                                    re_password: webix.rules.isNotEmpty
                                }
                            }
                        ]
                    },
                    { gravity: 1 }
                ]
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

    // Show loading
    webix.message({
        type: "info",
        text: "Creating your account..."
    });

    // Handle file upload
    const uploader = $$("profilePhotoUploader");
    const files = uploader ? uploader.files.data.pull : {};

    if (Object.keys(files).length > 0) {
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

        localStorage.setItem('currentUser', JSON.stringify(result.user));
        loadUserSettings();

        setTimeout(() => {
            showHomePage();
        }, 1000);
    } else {
        let errorMessage = "Registration failed";

        if (result.errors) {
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