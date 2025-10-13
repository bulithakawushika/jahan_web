/**
 * @jest-environment jsdom
 */

// Mock Webix global functions
global.$$ = jest.fn(() => ({
    getChildViews: jest.fn(() => []),
    removeView: jest.fn(),
    addView: jest.fn()
}));

global.webix = {
    message: jest.fn()
};

// Mock localStorage
const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn(() => null),
    removeItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock API Configuration
global.API_CONFIG = {
    ENDPOINTS: {
        PROFILE: '/api/profile'
    }
};

// Mock API call
global.apiCall = jest.fn();

// Mock helper functions
global.getProfilePhotoURL = jest.fn(photo =>
    photo ? photo : 'https://via.placeholder.com/150'
);
global.createNavigationBar = jest.fn(() => ({ view: "toolbar", id: "navBar" }));
global.handleSidebarNavigation = jest.fn();
global.toggleSidebar = jest.fn();
global.removeOutsideClickListener = jest.fn();
global.showSettingsPage = jest.fn();

// Mock window
global.window = { innerWidth: 1920 };

// Import profile.js AFTER setting up mocks
const profileModule = require('../../static/js/profile.js');

const {
    formatGender,
    formatMaritalStatus,
    formatBirthday,
    displayProfileContent,
    showProfileError,
    fetchProfileFromDatabase
} = profileModule;

describe("Profile Page - Utility Function Tests", () => {
    test("formatGender() returns correct labels", () => {
        expect(formatGender('male')).toBe('Male');
        expect(formatGender('female')).toBe('Female');
        expect(formatGender('not_preferred')).toBe('Prefer not to say');
        expect(formatGender('unknown')).toBe('Not specified');
        expect(formatGender(null)).toBe('Not specified');
    });

    test("formatMaritalStatus() returns correct labels", () => {
        expect(formatMaritalStatus('single')).toBe('Single');
        expect(formatMaritalStatus('married')).toBe('Married');
        expect(formatMaritalStatus('divorced')).toBe('Divorced');
        expect(formatMaritalStatus('separated')).toBe('Separated');
        expect(formatMaritalStatus('other')).toBe('Not specified');
    });

    test("formatBirthday() formats valid date correctly", () => {
        const dateStr = "1999-05-20T00:00:00Z";
        const result = formatBirthday(dateStr);
        expect(result).toContain("1999");
    });

    test("formatBirthday() returns 'Not specified' for invalid dates", () => {
        expect(formatBirthday(null)).toBe("Not specified");
        expect(formatBirthday("invalid-date")).toBe("Not specified");
    });
});

describe("Profile Page - Rendering & Error Handling", () => {
    let mockContainer;

    beforeEach(() => {
        mockContainer = {
            getChildViews: jest.fn(() => []),
            removeView: jest.fn(),
            addView: jest.fn()
        };
        $$.mockReturnValue(mockContainer);
        jest.clearAllMocks();
    });

    test("displayProfileContent() handles valid user data", () => {
        const mockUser = { username: "kawu", first_name: "Bulitha", last_name: "Kawushika", profile_visibility: "public", department: "Cybersecurity" };
        displayProfileContent(mockUser);
        expect(mockContainer.addView).toHaveBeenCalled();
    });

    test("displayProfileContent() logs error if container missing", () => {
        console.error = jest.fn();
        $$.mockReturnValue(null);
        displayProfileContent({ username: "test" });
        expect(console.error).toHaveBeenCalledWith("ERROR: profileContentArea not found!");
    });

    test("showProfileError() adds error template and shows webix message", () => {
        const mockContainer = { getChildViews: jest.fn(() => []), removeView: jest.fn(), addView: jest.fn() };
        $$.mockReturnValue(mockContainer);
        showProfileError("Failed to load");
        expect(mockContainer.addView).toHaveBeenCalled();
        expect(webix.message).toHaveBeenCalledWith(expect.objectContaining({ type: "error", text: "Failed to load" }));
    });
});

describe("Profile Page - API Integration", () => {
    let mockContainer;

    beforeEach(() => {
        mockContainer = { getChildViews: jest.fn(() => []), removeView: jest.fn(), addView: jest.fn() };
        $$.mockReturnValue(mockContainer);
        jest.clearAllMocks();
    });

    test("fetchProfileFromDatabase() handles failure response", async () => {
        apiCall.mockResolvedValue({ success: false });
        await fetchProfileFromDatabase();
        expect(webix.message).toHaveBeenCalledWith(expect.objectContaining({ type: "error" }));
    });

    test("fetchProfileFromDatabase() handles network error", async () => {
        apiCall.mockRejectedValue(new Error("Network down"));
        await fetchProfileFromDatabase();
        expect(webix.message).toHaveBeenCalledWith(expect.objectContaining({ type: "error", text: "Network error while loading profile" }));
    });
});