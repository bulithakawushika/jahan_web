// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000',
    ENDPOINTS: {
        REGISTER: '/api/users/register/',
        LOGIN: '/api/users/login/',
        LOGOUT: '/api/users/logout/',
        CHECK_AUTH: '/api/users/check-auth/',
        SEARCH: '/api/users/search/'
    }
};

// Helper function to make API calls with credentials
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        credentials: 'include',  // Important for session cookies
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(API_CONFIG.BASE_URL + endpoint, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error' };
    }
}

// Helper function to upload files (for profile photo)
async function apiCallWithFile(endpoint, formData) {
    const options = {
        method: 'POST',
        credentials: 'include',
        body: formData  // Don't set Content-Type, browser will set it with boundary
    };

    try {
        const response = await fetch(API_CONFIG.BASE_URL + endpoint, options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { success: false, message: 'Network error' };
    }
}