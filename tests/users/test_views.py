import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from tests.factories import UserFactory, PublicUserFactory, PrivateUserFactory

User = get_user_model()


@pytest.mark.django_db
class TestLoginUser:
    """Test cases for user login functionality"""
    
    def test_login_with_valid_credentials(self, api_client, authenticated_user):
        """Test 1.1: Login with correct username and password"""
        url = reverse('users:login')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['message'] == 'Login successful'
        assert 'user' in response.data
        assert response.data['user']['username'] == 'testuser'
        assert response.data['user']['email'] == 'testuser@example.com'
    
    def test_login_with_invalid_password(self, api_client, authenticated_user):
        """Test 1.2: Login with incorrect password"""
        url = reverse('users:login')
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
        assert response.data['message'] == 'Invalid username or password'
    
    def test_login_with_invalid_username(self, api_client):
        """Test 1.3: Login with non-existent username"""
        url = reverse('users:login')
        data = {
            'username': 'nonexistent',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
        assert response.data['message'] == 'Invalid username or password'
    
    def test_login_with_missing_fields(self, api_client):
        """Test 1.4: Login with missing required fields"""
        url = reverse('users:login')
        data = {
            'username': 'testuser'
            # Missing password
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
        assert 'errors' in response.data
    
    def test_login_returns_user_settings(self, api_client, authenticated_user):
        """Test 1.5: Login returns user with all settings"""
        url = reverse('users:login')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        user_data = response.data['user']
        
        # Check that settings are included
        assert 'profile_visibility' in user_data
        assert 'notification_preference' in user_data
        assert 'theme' in user_data
        assert 'font_size' in user_data
        assert 'keyboard_navigation' in user_data


@pytest.mark.django_db
class TestRegisterUser:
    """Test cases for user registration functionality"""
    
    def test_register_with_valid_data(self, api_client):
        """Test 2.1: Register a new user with all required fields"""
        url = reverse('users:register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            're_password': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'department': 'Engineering',
            'gender': 'male',
            'marital_status': 'single',
            'birth_year': 1995,
            'birth_month': 6,
            'birth_day': 15,
            'address': '123 Test Street',
            'job_role': 'Software Developer'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['success'] is True
        assert response.data['message'] == 'User registered successfully'
        assert 'user' in response.data
        
        # Verify user was created in database
        user = User.objects.get(username='newuser')
        assert user.email == 'newuser@example.com'
        assert user.first_name == 'New'
        assert user.last_name == 'User'
        assert user.check_password('SecurePass123!')
    
    def test_register_with_duplicate_username(self, api_client, authenticated_user):
        """Test 2.2: Register with an already existing username"""
        url = reverse('users:register')
        data = {
            'username': 'testuser',  # Already exists
            'email': 'different@example.com',
            'password': 'SecurePass123!',
            're_password': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'department': 'Engineering'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
        assert 'errors' in response.data
    
    def test_register_with_duplicate_email(self, api_client, authenticated_user):
        """Test 2.3: Register with an already existing email"""
        url = reverse('users:register')
        data = {
            'username': 'newuser',
            'email': 'testuser@example.com',  # Already exists
            'password': 'SecurePass123!',
            're_password': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'department': 'Engineering'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_register_with_password_mismatch(self, api_client):
        """Test 2.4: Register with passwords that don't match"""
        url = reverse('users:register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            're_password': 'DifferentPass123!',  # Doesn't match
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'department': 'Engineering'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
        assert 'errors' in response.data
    
    def test_register_with_missing_required_fields(self, api_client):
        """Test 2.5: Register with missing required fields"""
        url = reverse('users:register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'SecurePass123!',
            're_password': 'SecurePass123!'
            # Missing first_name, last_name, phone_number, department
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
        assert 'errors' in response.data
    
    def test_register_auto_login(self, api_client):
        """Test 2.6: User is automatically logged in after registration"""
        url = reverse('users:register')
        data = {
            'username': 'autouser',
            'email': 'autouser@example.com',
            'password': 'SecurePass123!',
            're_password': 'SecurePass123!',
            'first_name': 'Auto',
            'last_name': 'User',
            'phone_number': '+1234567890',
            'department': 'Engineering'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_201_CREATED
        
        # Check if user is authenticated by calling check-auth
        check_url = reverse('users:check_auth')
        check_response = api_client.get(check_url)
        
        assert check_response.data['authenticated'] is True
        assert check_response.data['user']['username'] == 'autouser'


@pytest.mark.django_db
class TestSearchUsers:
    """Test cases for user search functionality"""
    
    def test_search_users_by_first_name(self, api_client, multiple_public_users):
        """Test 3.1: Search users by first name"""
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'John'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['results']) >= 1
        
        # Verify John Doe is in results
        usernames = [user['first_name'] for user in response.data['results']]
        assert 'John' in usernames
    
    def test_search_users_by_last_name(self, api_client, multiple_public_users):
        """Test 3.2: Search users by last name"""
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'Smith'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['results']) >= 1
        
        # Verify Jane Smith is in results
        last_names = [user['last_name'] for user in response.data['results']]
        assert 'Smith' in last_names
    
    def test_search_users_by_job_role(self, api_client, multiple_public_users):
        """Test 3.3: Search users by job role"""
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'Engineer'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['results']) >= 1
        
        # Verify at least one engineer is in results
        job_roles = [user['job_role'] for user in response.data['results']]
        assert any('Engineer' in role for role in job_roles)
    
    def test_search_only_returns_public_profiles(self, api_client, mixed_visibility_users):
        """Test 3.4: Search only returns users with public visibility"""
        url = reverse('users:search_users')
        
        # Search for "User" which should match both public and private users
        response = api_client.get(url, {'query': 'User'})
        
        assert response.status_code == status.HTTP_200_OK
        
        # Verify only public user is returned
        usernames = [user['username'] for user in response.data['results']]
        assert mixed_visibility_users['public'].username in usernames
        assert mixed_visibility_users['private'].username not in usernames
    
    def test_search_with_empty_query(self, api_client, multiple_public_users):
        """Test 3.5: Search with empty query returns empty results"""
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': ''})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['results']) == 0
    
    def test_search_with_no_matches(self, api_client, multiple_public_users):
        """Test 3.6: Search with query that matches no users"""
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'NonExistentUserXYZ123'})
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert len(response.data['results']) == 0
    
    def test_search_case_insensitive(self, api_client, multiple_public_users):
        """Test 3.7: Search is case-insensitive"""
        url = reverse('users:search_users')
        
        # Search with lowercase
        response_lower = api_client.get(url, {'query': 'john'})
        # Search with uppercase
        response_upper = api_client.get(url, {'query': 'JOHN'})
        
        assert response_lower.status_code == status.HTTP_200_OK
        assert response_upper.status_code == status.HTTP_200_OK
        assert len(response_lower.data['results']) == len(response_upper.data['results'])


@pytest.mark.django_db
class TestGetProfile:
    """Test cases for loading user profile details"""
    
    def test_get_profile_authenticated(self, authenticated_client):
        """Test 4.1: Get profile for authenticated user"""
        api_client, user = authenticated_client
        url = reverse('users:get_profile')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert 'user' in response.data
        
        user_data = response.data['user']
        assert user_data['username'] == user.username
        assert user_data['email'] == user.email
        assert user_data['first_name'] == user.first_name
        assert user_data['last_name'] == user.last_name
    
    def test_get_profile_unauthenticated(self, api_client):
        """Test 4.2: Get profile for unauthenticated user"""
        url = reverse('users:get_profile')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is False
        assert response.data['message'] == 'Not authenticated'
    
    def test_get_profile_includes_all_fields(self, authenticated_client):
        """Test 4.3: Profile includes all user fields"""
        api_client, user = authenticated_client
        url = reverse('users:get_profile')
        
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        user_data = response.data['user']
        
        # Check personal information
        assert 'username' in user_data
        assert 'email' in user_data
        assert 'first_name' in user_data
        assert 'last_name' in user_data
        assert 'phone_number' in user_data
        assert 'department' in user_data
        assert 'gender' in user_data
        assert 'marital_status' in user_data
        
        # Check date fields
        assert 'birth_year' in user_data
        assert 'birth_month' in user_data
        assert 'birth_day' in user_data
        assert 'birthday' in user_data
        
        # Check additional fields
        assert 'address' in user_data
        assert 'job_role' in user_data
        assert 'bio' in user_data
        
        # Check settings
        assert 'profile_visibility' in user_data
        assert 'notification_preference' in user_data
        assert 'font_size' in user_data
        assert 'theme' in user_data
        assert 'contrast_level' in user_data
    
    def test_get_profile_privacy_settings(self, authenticated_client):
        """Test 4.4: Profile includes privacy settings"""
        api_client, user = authenticated_client
        
        # Update user privacy
        user.profile_visibility = 'private'
        user.save()
        
        url = reverse('users:get_profile')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['user']['profile_visibility'] == 'private'
    
    def test_get_profile_accessibility_settings(self, authenticated_client):
        """Test 4.5: Profile includes accessibility settings"""
        api_client, user = authenticated_client
        
        # Update accessibility settings
        user.theme = 'dark'
        user.font_size = 'large'
        user.contrast_level = 'high'
        user.keyboard_navigation = True
        user.screen_reader = True
        user.save()
        
        url = reverse('users:get_profile')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        user_data = response.data['user']
        
        assert user_data['theme'] == 'dark'
        assert user_data['font_size'] == 'large'
        assert user_data['contrast_level'] == 'high'
        assert user_data['keyboard_navigation'] is True
        assert user_data['screen_reader'] is True


@pytest.mark.django_db
class TestVerifyCurrentPassword:
    """Test cases for password verification before update"""
    
    def test_verify_correct_password(self, authenticated_client):
        """Test 5.1: Verify with correct current password"""
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        
        data = {
            'current_password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['message'] == 'Password verified'
    
    def test_verify_incorrect_password(self, authenticated_client):
        """Test 5.2: Verify with incorrect current password"""
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        
        data = {
            'current_password': 'wrongpassword'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is False
        assert response.data['message'] == 'Current password is incorrect'
    
    def test_verify_password_unauthenticated(self, api_client):
        """Test 5.3: Verify password when not authenticated"""
        url = reverse('users:verify_password')
        
        data = {
            'current_password': 'testpass123'
        }
        
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
        assert response.data['message'] == 'Not authenticated'
    
    def test_verify_password_missing_field(self, authenticated_client):
        """Test 5.4: Verify password with missing current_password field"""
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        
        data = {}  # No current_password
        
        response = api_client.post(url, data, format='json')
        
        # Should return False when password is None/missing
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is False
    
    def test_change_password_with_verification(self, authenticated_client):
        """Test 5.5: Complete password change flow with verification"""
        api_client, user = authenticated_client
        
        # First verify current password
        verify_url = reverse('users:verify_password')
        verify_data = {
            'current_password': 'testpass123'
        }
        verify_response = api_client.post(verify_url, verify_data, format='json')
        assert verify_response.data['success'] is True
        
        # Then change password
        change_url = reverse('users:change_password')
        change_data = {
            'current_password': 'testpass123',
            'new_password': 'NewSecurePass123!',
            'confirm_password': 'NewSecurePass123!'
        }
        change_response = api_client.post(change_url, change_data, format='json')
        
        assert change_response.status_code == status.HTTP_200_OK
        assert change_response.data['success'] is True
        assert change_response.data['message'] == 'Password changed successfully'
        
        # Verify old password no longer works
        user.refresh_from_db()
        assert user.check_password('NewSecurePass123!') is True
        assert user.check_password('testpass123') is False