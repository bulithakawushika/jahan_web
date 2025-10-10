// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000',
    ENDPOINTS: {
        REGISTER: '/api/users/register/',
        LOGIN: '/api/users/login/',
        LOGOUT: '/api/users/logout/',
        CHECK_AUTH: '/api/users/check-auth/',
        SEARCH: '/api/users/search/',
        PROFILE: '/api/users/profile/',
        UPDATE_ACCOUNT: '/api/users/update-account/',
        VERIFY_PASSWORD: '/api/users/verify-password/',
        CHANGE_PASSWORD: '/api/users/change-password/',
        UPDATE_PRIVACY: '/api/users/update-privacy/',
        NOTIFICATIONS: '/api/users/notifications/',
        MARK_NOTIFICATION_READ: '/api/users/notifications/',
        NOTIFICATION_SETTINGS: '/api/users/notification-settings/'
    }
};

// Get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Get CSRF token from Django
function getCSRFToken() {
    return getCookie('csrftoken');
}

// Helper function to make API calls with credentials
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method: method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
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
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        body: formData
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

// Get profile photo URL
function getProfilePhotoURL(photoPath) {
    if (photoPath) {
        return API_CONFIG.BASE_URL + photoPath;
    }
    return '/static/assets/default_profile_pic.png';
}