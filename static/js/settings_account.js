// ==========================================
// ACCOUNT DETAILS TAB
// File: static/settings_account.js
// ==========================================

function createAccountDetailsContent(user, isMobile = false) {
    const labelWidth = isMobile ? 120 : 150;
    const padding = isMobile ? 20 : 40;

    return {
        rows: [
            { height: 20 },
            {
                cols: [
                    { width: padding },
                    {
                        rows: [
                            {
                                view: "form",
                                id: "accountDetailsForm",
                                css: "settings_form",
                                elements: [
                                    isMobile ?
                                        {
                                            rows: [
                                                {
                                                    view: "text",
                                                    name: "first_name",
                                                    label: "First Name",
                                                    value: user.first_name,
                                                    labelWidth: labelWidth
                                                },
                                                {
                                                    view: "text",
                                                    name: "last_name",
                                                    label: "Last Name",
                                                    value: user.last_name,
                                                    labelWidth: labelWidth
                                                }
                                            ]
                                        } :
                                        {
                                            cols: [
                                                {
                                                    view: "text",
                                                    name: "first_name",
                                                    label: "First Name",
                                                    value: user.first_name,
                                                    labelWidth: labelWidth
                                                },
                                                { width: 20 },
                                                {
                                                    view: "text",
                                                    name: "last_name",
                                                    label: "Last Name",
                                                    value: user.last_name,
                                                    labelWidth: labelWidth
                                                }
                                            ]
                                        },
                                    {
                                        view: "text",
                                        name: "username",
                                        label: "Username",
                                        value: user.username,
                                        labelWidth: labelWidth
                                    },
                                    {
                                        view: "text",
                                        name: "email",
                                        label: "Email",
                                        value: user.email,
                                        labelWidth: labelWidth
                                    },
                                    {
                                        view: "text",
                                        name: "job_role",
                                        label: "Job Role",
                                        value: user.job_role,
                                        labelWidth: labelWidth
                                    },
                                    {
                                        view: "datepicker",
                                        name: "birthday",
                                        label: "Birthday",
                                        value: user.birthday,
                                        labelWidth: labelWidth,
                                        format: "%Y-%m-%d",
                                        stringResult: true
                                    },
                                    {
                                        view: "textarea",
                                        name: "address",
                                        label: "Address",
                                        value: user.address,
                                        labelWidth: labelWidth,
                                        height: 100
                                    },
                                    { height: 20 },
                                    isMobile ?
                                        {
                                            rows: [
                                                {
                                                    view: "button",
                                                    value: "Save Changes",
                                                    css: "webix_primary",
                                                    click: handleSaveAccountDetails
                                                },
                                                { height: 10 },
                                                {
                                                    view: "button",
                                                    value: "Cancel",
                                                    click: function () {
                                                        $$("accountDetailsForm").setValues(user);
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
                                                    click: handleSaveAccountDetails
                                                },
                                                { width: 15 },
                                                {
                                                    view: "button",
                                                    value: "Cancel",
                                                    width: 120,
                                                    click: function () {
                                                        $$("accountDetailsForm").setValues(user);
                                                        webix.message("Changes discarded");
                                                    }
                                                },
                                                {}
                                            ]
                                        }
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

    webix.message({
        type: "info",
        text: "Saving changes..."
    });

    const result = await apiCall(API_CONFIG.ENDPOINTS.UPDATE_ACCOUNT, 'PUT', values);

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        webix.message({
            type: "success",
            text: "Account details updated successfully!"
        });
    } else {
        webix.message({
            type: "error",
            text: result.message || "Failed to update account"
        });
    }
}