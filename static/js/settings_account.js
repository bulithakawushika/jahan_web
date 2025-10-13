// ==========================================
// ACCOUNT DETAILS TAB - RESTRUCTURED LAYOUT
// File: static/settings_account.js
// ==========================================

// Add CSS for consistent styling
if (!document.getElementById('settings-label-font-style')) {
    const style = document.createElement('style');
    style.id = 'settings-label-font-style';
    style.innerHTML = `
        .settings_form .webix_inp_label {
            font-size: 14px !important;
        }
        .webix_list_item {
            background-color: white !important;
        }
        .webix_list {
            background-color: white !important;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #2c3e50;
            padding: 10px 0;
            border-bottom: 2px solid #3498db;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
}

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

// Update photo display with filename and green tick
function updateSettingsPhotoDisplay(filename) {
    const display = $$("settingsPhotoDisplay");
    if (display) {
        display.setHTML(`
            <div style="display: flex; align-items: center; padding: 5px;">
                <span style="color: #27ae60; font-size: 20px; margin-right: 8px;">✓</span>
                <span style="color: #2c3e50; font-size: 14px;">${filename}</span>
            </div>
        `);
    }
}

function createAccountDetailsContent(user, isMobile = false) {
    const labelWidth = isMobile ? 120 : 150;
    const padding = isMobile ? 20 : 40;

    // Get current profile photo filename if exists
    let currentPhotoName = "No file selected";
    if (user.profile_photo) {
        const photoPath = user.profile_photo.split('/');
        currentPhotoName = photoPath[photoPath.length - 1];
    }

    return {
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: padding },
                    {
                        view: "form",
                        id: "accountDetailsForm",
                        css: "settings_form",
                        elements: [
                            // ROW 1: Profile Details (Left) and Work Details (Right)
                            isMobile ?
                                {
                                    rows: [
                                        // Profile Details Section (Mobile)
                                        {
                                            template: "<div class='section-title'>Profile Details</div>",
                                            height: 50,
                                            borderless: true
                                        },
                                        {
                                            view: "text",
                                            name: "first_name",
                                            label: "First Name",
                                            value: user.first_name,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            name: "last_name",
                                            label: "Last Name",
                                            value: user.last_name,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            name: "username",
                                            label: "Username",
                                            value: user.username,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        },
                                        {
                                            cols: [
                                                {
                                                    view: "uploader",
                                                    id: "settingsProfilePhotoUploader",
                                                    name: "profile_photo",
                                                    label: "Profile Photo",
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    value: "Choose File",
                                                    width: 280,
                                                    accept: "image/*",
                                                    multiple: false,
                                                    autosend: false,
                                                    on: {
                                                        onBeforeFileAdd: function (file) {
                                                            updateSettingsPhotoDisplay(file.name);
                                                            return true;
                                                        }
                                                    }
                                                },
                                                {
                                                    view: "template",
                                                    id: "settingsPhotoDisplay",
                                                    template: user.profile_photo ?
                                                        `<div style="display: flex; align-items: center; padding: 5px;">
                                                        <span style="color: #27ae60; font-size: 20px; margin-right: 8px;">✓</span>
                                                        <span style="color: #2c3e50; font-size: 14px;">${currentPhotoName}</span>
                                                    </div>` : "",
                                                    borderless: true
                                                }
                                            ]
                                        },
                                        { height: 20 },
                                        // Work Details Section (Mobile)
                                        {
                                            template: "<div class='section-title'>Work Details</div>",
                                            height: 50,
                                            borderless: true
                                        },
                                        {
                                            view: "text",
                                            name: "job_role",
                                            label: "Job Role",
                                            value: user.job_role,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil"
                                        },
                                        {
                                            view: "text",
                                            name: "department",
                                            label: "Department",
                                            value: user.department,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil"
                                        },
                                        { height: 20 }
                                    ]
                                } :
                                {
                                    cols: [
                                        // Left Column: Profile Details
                                        {
                                            rows: [
                                                {
                                                    template: "<div class='section-title'>Profile Details</div>",
                                                    height: 60,
                                                    borderless: true
                                                },
                                                {
                                                    view: "text",
                                                    name: "first_name",
                                                    label: "First Name",
                                                    value: user.first_name,
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    icon: "wxi-pencil",
                                                    required: true
                                                },
                                                { height: 10 },
                                                {
                                                    view: "text",
                                                    name: "last_name",
                                                    label: "Last Name",
                                                    value: user.last_name,
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    icon: "wxi-pencil",
                                                    required: true
                                                },
                                                { height: 10 },
                                                {
                                                    view: "text",
                                                    name: "username",
                                                    label: "Username",
                                                    value: user.username,
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    icon: "wxi-pencil",
                                                    required: true
                                                },
                                                {}
                                            ]
                                        },
                                        { width: 30 },
                                        // Right Column: Work Details
                                        {
                                            rows: [
                                                {
                                                    template: "<div class='section-title'>Work Details</div>",
                                                    height: 60,
                                                    borderless: true
                                                },
                                                {
                                                    view: "text",
                                                    name: "job_role",
                                                    label: "Job Role",
                                                    value: user.job_role,
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    icon: "wxi-pencil"
                                                },
                                                { height: 10 },
                                                {
                                                    view: "text",
                                                    name: "department",
                                                    label: "Department",
                                                    value: user.department,
                                                    labelWidth: labelWidth,
                                                    height: 49,
                                                    icon: "wxi-pencil"
                                                },
                                                {}
                                            ]
                                        }
                                    ]
                                },
                            { height: 10 },
                            {
                                cols: [
                                    {
                                        view: "uploader",
                                        id: "settingsProfilePhotoUploader",
                                        name: "profile_photo",
                                        label: "Profile Photo",
                                        labelWidth: labelWidth,
                                        height: 40,
                                        value: "Choose File",
                                        width: 350,
                                        accept: "image/*",
                                        multiple: false,
                                        autosend: false,
                                        on: {
                                            onBeforeFileAdd: function (file) {
                                                updateSettingsPhotoDisplay(file.name);
                                                return true;
                                            }
                                        }
                                    },
                                    { width: 20 },
                                    {
                                        view: "template",
                                        id: "settingsPhotoDisplay",
                                        template: user.profile_photo ?
                                            `<div style="display: flex; align-items: center; padding: 5px;">
                                                                    <span style="color: #27ae60; font-size: 20px; margin-right: 8px;">✓</span>
                                                                    <span style="color: #2c3e50; font-size: 14px;">${currentPhotoName}</span>
                                                                </div>` : "",
                                        borderless: true
                                    }
                                ]
                            },
                            { height: 20 },

                            // ROW 2: Personal Details
                            {
                                template: "<div class='section-title'>Personal Details</div>",
                                height: 50,
                                borderless: true
                            },

                            // Email and Phone Number
                            isMobile ?
                                {
                                    rows: [
                                        {
                                            view: "text",
                                            name: "email",
                                            label: "Email",
                                            value: user.email,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        },
                                        {
                                            view: "text",
                                            name: "phone_number",
                                            label: "Phone Number",
                                            value: user.phone_number,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        }
                                    ]
                                } :
                                {
                                    cols: [
                                        {
                                            view: "text",
                                            name: "email",
                                            label: "Email",
                                            value: user.email,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        },
                                        { width: 20 },
                                        {
                                            view: "text",
                                            name: "phone_number",
                                            label: "Phone Number",
                                            value: user.phone_number,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            icon: "wxi-pencil",
                                            required: true
                                        }
                                    ]
                                },

                            // Gender and Marital Status
                            isMobile ?
                                {
                                    rows: [
                                        {
                                            view: "richselect",
                                            name: "gender",
                                            label: "Gender",
                                            value: user.gender,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: [
                                                { id: "male", value: "Male" },
                                                { id: "female", value: "Female" },
                                                { id: "not_preferred", value: "Prefer not to say" }
                                            ]
                                        },
                                        {
                                            view: "richselect",
                                            name: "marital_status",
                                            label: "Marital Status",
                                            value: user.marital_status,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: [
                                                { id: "single", value: "Single" },
                                                { id: "married", value: "Married" },
                                                { id: "divorced", value: "Divorced" },
                                                { id: "separated", value: "Separated" }
                                            ]
                                        }
                                    ]
                                } :
                                {
                                    cols: [
                                        {
                                            view: "richselect",
                                            name: "gender",
                                            label: "Gender",
                                            value: user.gender,
                                            labelWidth: labelWidth,
                                            height: 49,
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
                                            value: user.marital_status,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: [
                                                { id: "single", value: "Single" },
                                                { id: "married", value: "Married" },
                                                { id: "divorced", value: "Divorced" },
                                                { id: "separated", value: "Separated" }
                                            ]
                                        }
                                    ]
                                },

                            // Date of Birth
                            { height: 10 },
                            {
                                view: "template",
                                template: "<div style='font-size:14px; color:#2c3e50; font-weight:bold; margin-top: 10px;'>Date of Birth</div>",
                                height: 30,
                                borderless: true
                            },
                            isMobile ?
                                {
                                    rows: [
                                        {
                                            view: "richselect",
                                            name: "birth_year",
                                            label: "Year",
                                            value: user.birth_year,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: getYearOptions()
                                        },
                                        {
                                            view: "richselect",
                                            name: "birth_month",
                                            label: "Month",
                                            value: user.birth_month,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: getMonthOptions()
                                        },
                                        {
                                            view: "richselect",
                                            name: "birth_day",
                                            label: "Day",
                                            value: user.birth_day,
                                            labelWidth: labelWidth,
                                            height: 49,
                                            options: getDayOptions()
                                        }
                                    ]
                                } :
                                { height: 5 },
                            {
                                cols: [
                                    { gravity: 0.1 },
                                    {
                                        view: "richselect",
                                        name: "birth_year",
                                        label: "Year",
                                        value: user.birth_year,
                                        labelWidth: 60,
                                        height: 49,
                                        options: getYearOptions()
                                    },
                                    { width: 20 },
                                    {
                                        view: "richselect",
                                        name: "birth_month",
                                        label: "Month",
                                        value: user.birth_month,
                                        labelWidth: 60,
                                        height: 49,
                                        options: getMonthOptions()
                                    },
                                    { width: 20 },
                                    {
                                        view: "richselect",
                                        name: "birth_day",
                                        label: "Day",
                                        value: user.birth_day,
                                        labelWidth: 60,
                                        height: 49,
                                        options: getDayOptions()
                                    }
                                ]
                            },

                            { height: 10 },

                            // Address
                            {
                                view: "text",
                                name: "address",
                                label: "Address",
                                value: user.address,
                                labelWidth: labelWidth,
                                height: 49,
                                icon: "wxi-pencil"
                            },

                            { height: 20 },

                            // ROW 3: Action Buttons
                            isMobile ?
                                {
                                    rows: [
                                        {
                                            view: "button",
                                            value: "Save Changes",
                                            css: "webix_primary",
                                            height: 45,
                                            click: handleSaveAccountDetails
                                        },
                                        { height: 10 },
                                        {
                                            view: "button",
                                            value: "Cancel",
                                            height: 45,
                                            click: function () {
                                                loadSettingsData();
                                                webix.message("Changes discarded");
                                            }
                                        }
                                    ]
                                } :
                                {
                                    cols: [
                                        {},
                                        {
                                            view: "button",
                                            value: "Save Changes",
                                            css: "webix_primary",
                                            width: 150,
                                            height: 45,
                                            click: handleSaveAccountDetails
                                        },
                                        { width: 15 },
                                        {
                                            view: "button",
                                            value: "Cancel",
                                            width: 120,
                                            height: 45,
                                            click: function () {
                                                loadSettingsData();
                                                webix.message("Changes discarded");
                                            }
                                        },
                                        {}
                                    ]
                                }
                        ]
                    },
                    { width: padding }
                ]
            },
            { height: 50 }
        ]
    };
}

// ==========================================
// EVENT HANDLERS - ACCOUNT DETAILS
// ==========================================

async function handleSaveAccountDetails() {
    const form = $$("accountDetailsForm");
    const values = form.getValues();

    // Validate required fields
    const requiredFields = [
        { name: 'first_name', label: 'First Name' },
        { name: 'last_name', label: 'Last Name' },
        { name: 'username', label: 'Username' },
        { name: 'email', label: 'Email' },
        { name: 'phone_number', label: 'Phone Number' }
    ];

    const emptyFields = [];
    for (let field of requiredFields) {
        if (!values[field.name] || values[field.name].trim() === '') {
            emptyFields.push(field.label);
        }
    }

    if (emptyFields.length > 0) {
        webix.message({
            type: "error",
            text: `Please fill in the following required fields: ${emptyFields.join(', ')}`,
            expire: 5000
        });
        return;
    }

    webix.message({
        type: "info",
        text: "Saving changes..."
    });

    // Check if there's a new profile photo
    const uploader = $$("settingsProfilePhotoUploader");
    const files = uploader ? uploader.files.data.pull : {};

    if (Object.keys(files).length > 0) {
        // File upload case - use FormData
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

        const result = await apiCallWithFile(API_CONFIG.ENDPOINTS.UPDATE_ACCOUNT, formData);
        handleSaveResponse(result);
    } else {
        // No file - use regular JSON
        const cleanedValues = {};
        for (let key in values) {
            if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                cleanedValues[key] = values[key];
            }
        }

        const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_ACCOUNT, 'PUT', cleanedValues);
        handleSaveResponse(result);
    }
}

function handleSaveResponse(result) {
    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        loadUserSettings();
        webix.message({
            type: "success",
            text: "Account details updated successfully!"
        });

        // Clear the uploader
        const uploader = $$("settingsProfilePhotoUploader");
        if (uploader) {
            uploader.files.clearAll();
        }

        // Reload the settings data to show updated values
        loadSettingsData();
    } else {
        let errorMessage = result.message || "Failed to update account";

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
        }

        webix.message({
            type: "error",
            text: errorMessage,
            expire: 5000
        });
    }
}