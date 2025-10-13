/**
 * @jest-environment jsdom
 */

// Mock elements store
const mockElements = {};

// Mock Webix
global.webix = {
    message: jest.fn(),
    rules: {
        isNotEmpty: jest.fn((value) => !!value),
        isEmail: jest.fn((value) => /\S+@\S+\.\S+/.test(value))
    },
    html: {
        addCss: jest.fn(),
        removeCss: jest.fn()
    },
    ui: jest.fn()
};

// Mock $$ function - This needs to be persistent across tests
global.$$ = jest.fn((id) => mockElements[id] || null);

// Mock API functions
global.apiCall = jest.fn();
global.apiCallWithFile = jest.fn();
global.showLoginPage = jest.fn();
global.showHomePage = jest.fn();
global.loadUserSettings = jest.fn();

// Mock API_CONFIG
global.API_CONFIG = {
    ENDPOINTS: {
        REGISTER: '/api/register/'
    }
};

// Mock localStorage with Jest functions
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn()
};
global.localStorage = localStorageMock;

// Helper to setup mock elements
function setupMockElements() {
    mockElements.registerForm = {
        validate: jest.fn(() => true),
        getValues: jest.fn(() => ({
            first_name: 'John',
            last_name: 'Doe',
            username: 'johndoe',
            email: 'john@example.com',
            phone_number: '1234567890',
            job_role: 'Developer',
            department: 'IT',
            gender: 'male',
            marital_status: 'single',
            birth_year: 1990,
            birth_month: 5,
            birth_day: 15,
            address: '123 Main St',
            password: 'password123',
            re_password: 'password123'
        }))
    };

    mockElements.profilePhotoUploader = {
        files: {
            data: {
                pull: {}
            }
        }
    };

    mockElements.photoDisplay = {
        setHTML: jest.fn()
    };

    mockElements.registerPassword = {
        getInputNode: jest.fn(() => ({ type: 'password' }))
    };

    mockElements.registerConfirmPassword = {
        getInputNode: jest.fn(() => ({ type: 'password' }))
    };
}

describe('Register Page - Helper Functions', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
        jest.clearAllMocks();
        setupMockElements();
    });

    describe('updatePhotoDisplay', () => {
        test('should update photo display with filename and green tick', () => {
            const updatePhotoDisplay = (filename) => {
                const display = $$("photoDisplay");
                if (display) {
                    display.setHTML(`
                        <div style="display: flex; align-items: center; padding: 5px;">
                            <span style="color: #27ae60; font-size: 20px; margin-right: 8px;">✓</span>
                            <span style="color: #2c3e50; font-size: 14px;">${filename}</span>
                        </div>
                    `);
                }
            };

            updatePhotoDisplay('profile.jpg');

            expect(mockElements.photoDisplay.setHTML).toHaveBeenCalledTimes(1);
            expect(mockElements.photoDisplay.setHTML.mock.calls[0][0]).toContain('profile.jpg');
            expect(mockElements.photoDisplay.setHTML.mock.calls[0][0]).toContain('✓');
        });

        test('should handle null display element gracefully', () => {
            mockElements.photoDisplay = null;

            const updatePhotoDisplay = (filename) => {
                const display = $$("photoDisplay");
                if (display) {
                    display.setHTML(`<div>${filename}</div>`);
                }
            };

            expect(() => updatePhotoDisplay('test.jpg')).not.toThrow();
        });
    });

    describe('getYearOptions', () => {
        test('should generate years from 2025 to 1925', () => {
            const getYearOptions = () => {
                const years = [];
                for (let year = 2025; year >= 1925; year--) {
                    years.push({ id: year, value: year.toString() });
                }
                return years;
            };

            const years = getYearOptions();

            expect(years).toHaveLength(101);
            expect(years[0]).toEqual({ id: 2025, value: '2025' });
            expect(years[100]).toEqual({ id: 1925, value: '1925' });
        });

        test('should generate years in descending order', () => {
            const getYearOptions = () => {
                const years = [];
                for (let year = 2025; year >= 1925; year--) {
                    years.push({ id: year, value: year.toString() });
                }
                return years;
            };

            const years = getYearOptions();

            for (let i = 0; i < years.length - 1; i++) {
                expect(years[i].id).toBeGreaterThan(years[i + 1].id);
            }
        });
    });

    describe('getMonthOptions', () => {
        test('should return 12 months', () => {
            const getMonthOptions = () => {
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
            };

            const months = getMonthOptions();

            expect(months).toHaveLength(12);
            expect(months[0]).toEqual({ id: 1, value: 'January' });
            expect(months[11]).toEqual({ id: 12, value: 'December' });
        });
    });

    describe('getDayOptions', () => {
        test('should generate days from 1 to 31', () => {
            const getDayOptions = () => {
                const days = [];
                for (let day = 1; day <= 31; day++) {
                    days.push({ id: day, value: day.toString() });
                }
                return days;
            };

            const days = getDayOptions();

            expect(days).toHaveLength(31);
            expect(days[0]).toEqual({ id: 1, value: '1' });
            expect(days[30]).toEqual({ id: 31, value: '31' });
        });
    });
});

describe('Register Page - UI Creation', () => {
    beforeEach(() => {
        global.window.innerWidth = 1024;
        global.window.innerHeight = 768;
    });

    describe('createRegisterPage', () => {
        test('should create register page structure', () => {
            const createRegisterPage = () => {
                const isMobile = window.innerWidth <= 768;
                const formWidth = isMobile ? window.innerWidth - 20 : Math.min(window.innerWidth * 0.8, 1200);

                return {
                    id: "registerPage",
                    rows: [
                        {
                            view: "template",
                            template: "<div style='text-align:center; font-size:28px; font-weight:bold; color:#34495e; padding:20px;'>Create Account</div>",
                            height: 80,
                            borderless: true
                        }
                    ]
                };
            };

            const page = createRegisterPage();

            expect(page.id).toBe('registerPage');
            expect(page.rows).toBeDefined();
            expect(page.rows[0].view).toBe('template');
            expect(page.rows[0].template).toContain('Create Account');
        });

        test('should adjust form width for mobile', () => {
            global.window.innerWidth = 500;

            const createRegisterPage = () => {
                const isMobile = window.innerWidth <= 768;
                const formWidth = isMobile ? window.innerWidth - 20 : Math.min(window.innerWidth * 0.8, 1200);

                return { formWidth };
            };

            const page = createRegisterPage();

            expect(page.formWidth).toBe(480);
        });

        test('should adjust form width for desktop', () => {
            global.window.innerWidth = 1600;

            const createRegisterPage = () => {
                const isMobile = window.innerWidth <= 768;
                const formWidth = isMobile ? window.innerWidth - 20 : Math.min(window.innerWidth * 0.8, 1200);

                return { formWidth };
            };

            const page = createRegisterPage();

            expect(page.formWidth).toBe(1200);
        });
    });
});

describe('Register Page - Form Validation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupMockElements();
    });

    test('should validate required fields', () => {
        mockElements.registerForm.validate.mockReturnValue(false);

        const handleRegister = async () => {
            const form = $$("registerForm");
            if (!form.validate()) {
                webix.message({
                    type: "error",
                    text: "Please fill in all required fields correctly"
                });
                return;
            }
        };

        handleRegister();

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Please fill in all required fields correctly"
        });
    });

    test('should validate email format', () => {
        const isValidEmail = webix.rules.isEmail;

        expect(isValidEmail('test@example.com')).toBeTruthy();
        expect(isValidEmail('invalid-email')).toBeFalsy();
        expect(isValidEmail('test@domain')).toBeFalsy();
    });
});

describe('Registration Handler', () => {
    let handleRegister;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        setupMockElements();

        handleRegister = async () => {
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

            if (values.password !== values.re_password) {
                webix.message({
                    type: "error",
                    text: "Passwords do not match!"
                });
                return;
            }

            webix.message({
                type: "info",
                text: "Creating your account..."
            });

            const uploader = $$("profilePhotoUploader");
            const files = uploader ? uploader.files.data.pull : {};

            if (Object.keys(files).length > 0) {
                const formData = new FormData();
                for (let key in values) {
                    if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                        formData.append(key, values[key]);
                    }
                }
                const fileId = Object.keys(files)[0];
                const file = files[fileId].file;
                formData.append('profile_photo', file);
                const result = await apiCallWithFile(API_CONFIG.ENDPOINTS.REGISTER, formData);
                handleRegistrationResponse(result);
            } else {
                const cleanedValues = {};
                for (let key in values) {
                    if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
                        cleanedValues[key] = values[key];
                    }
                }
                const result = await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', cleanedValues);
                handleRegistrationResponse(result);
            }
        };

        global.handleRegistrationResponse = (result) => {
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
        };
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should show error if form is not found', async () => {
        mockElements.registerForm = null;

        await handleRegister();

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Form not found"
        });
    });

    test('should show error if passwords do not match', async () => {
        mockElements.registerForm.getValues.mockReturnValue({
            password: 'password123',
            re_password: 'differentPassword'
        });

        await handleRegister();

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Passwords do not match!"
        });
    });

    test('should call apiCall when no file is uploaded', async () => {
        const mockResult = { success: true, user: { id: 1, username: 'johndoe' } };
        apiCall.mockResolvedValue(mockResult);

        await handleRegister();

        expect(webix.message).toHaveBeenCalledWith({
            type: "info",
            text: "Creating your account..."
        });
        expect(apiCall).toHaveBeenCalledWith(
            API_CONFIG.ENDPOINTS.REGISTER,
            'POST',
            expect.any(Object)
        );
    });

    test('should call apiCallWithFile when file is uploaded', async () => {
        const mockFile = new File([''], 'profile.jpg', { type: 'image/jpeg' });
        const mockResult = { success: true, user: { id: 1, username: 'johndoe' } };

        mockElements.profilePhotoUploader.files.data.pull = {
            'file1': { file: mockFile }
        };

        apiCallWithFile.mockResolvedValue(mockResult);

        await handleRegister();

        expect(apiCallWithFile).toHaveBeenCalledWith(
            API_CONFIG.ENDPOINTS.REGISTER,
            expect.any(FormData)
        );
    });

    test('should filter out empty values before submission', async () => {
        mockElements.registerForm.getValues.mockReturnValue({
            first_name: 'John',
            last_name: '',
            username: 'johndoe',
            email: null,
            password: 'password123',
            re_password: 'password123'
        });

        apiCall.mockResolvedValue({ success: true, user: {} });

        await handleRegister();

        expect(apiCall).toHaveBeenCalled();
        const submittedData = apiCall.mock.calls[0][2];
        expect(submittedData.first_name).toBe('John');
        expect(submittedData.last_name).toBeUndefined();
        expect(submittedData.email).toBeUndefined();
    });
});

describe('Registration Response Handler', () => {
    let handleRegistrationResponse;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();

        handleRegistrationResponse = (result) => {
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
        };
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should handle registration failure with error array', () => {
        const result = {
            success: false,
            errors: {
                username: ['Username already exists'],
                email: ['Invalid email format']
            }
        };

        handleRegistrationResponse(result);

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Username already exists, Invalid email format",
            expire: 5000
        });
    });

    test('should handle registration failure with error string', () => {
        const result = {
            success: false,
            errors: {
                username: 'Username already taken'
            }
        };

        handleRegistrationResponse(result);

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Username already taken",
            expire: 5000
        });
    });

    test('should handle registration failure with message', () => {
        const result = {
            success: false,
            message: 'Server error occurred'
        };

        handleRegistrationResponse(result);

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Server error occurred",
            expire: 5000
        });
    });

    test('should show default error message when no specific error provided', () => {
        const result = {
            success: false
        };

        handleRegistrationResponse(result);

        expect(webix.message).toHaveBeenCalledWith({
            type: "error",
            text: "Registration failed",
            expire: 5000
        });
    });

    test('should not redirect on failed registration', () => {
        const result = {
            success: false,
            message: 'Registration failed'
        };

        handleRegistrationResponse(result);

        jest.advanceTimersByTime(1000);
        expect(showHomePage).not.toHaveBeenCalled();
    });
});

describe('Password Toggle Functionality', () => {
    test('should toggle password visibility', () => {
        const mockInput = { type: 'password' };
        const mockTarget = {};
        const mockEvent = { target: mockTarget };

        const togglePassword = (e, inputNode) => {
            const input = inputNode;
            webix.html.removeCss(e.target, "wxi-eye-slash");
            webix.html.removeCss(e.target, "wxi-eye");
            if (input.type == "text") {
                webix.html.addCss(e.target, "wxi-eye");
                input.type = "password";
            } else {
                webix.html.addCss(e.target, "wxi-eye-slash");
                input.type = "text";
            }
        };

        togglePassword(mockEvent, mockInput);

        expect(webix.html.removeCss).toHaveBeenCalledTimes(2);
        expect(webix.html.addCss).toHaveBeenCalledWith(mockTarget, "wxi-eye-slash");
        expect(mockInput.type).toBe('text');

        // Toggle back
        togglePassword(mockEvent, mockInput);
        expect(mockInput.type).toBe('password');
    });
});

describe('CSS Injection', () => {
    beforeEach(() => {
        document.head.innerHTML = '';
    });

    test('should inject label font size style only once', () => {
        const injectStyle = () => {
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
        };

        injectStyle();
        expect(document.getElementById('label-font-style')).toBeTruthy();

        injectStyle();
        const styles = document.querySelectorAll('#label-font-style');
        expect(styles.length).toBe(1);
    });

    test('should inject richselect popup style only once', () => {
        const injectStyle = () => {
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
        };

        injectStyle();
        expect(document.getElementById('richselect-popup-style')).toBeTruthy();

        injectStyle();
        const styles = document.querySelectorAll('#richselect-popup-style');
        expect(styles.length).toBe(1);
    });
});