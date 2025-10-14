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
        url = reverse('users:login')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
        assert response.data['user']['username'] == 'testuser'
    
    def test_login_with_invalid_password(self, api_client, authenticated_user):
        url = reverse('users:login')
        data = {'username': 'testuser', 'password': 'wrongpassword'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
    
    def test_login_with_invalid_username(self, api_client):
        url = reverse('users:login')
        data = {'username': 'nonexistent', 'password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
    
    def test_login_with_missing_fields(self, api_client):
        url = reverse('users:login')
        data = {'username': 'testuser'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_login_returns_user_settings(self, api_client, authenticated_user):
        url = reverse('users:login')
        data = {'username': 'testuser', 'password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        user_data = response.data['user']
        assert 'profile_visibility' in user_data
        assert 'notification_preference' in user_data
        assert 'theme' in user_data
        assert 'font_size' in user_data


@pytest.mark.django_db
class TestRegisterUser:
    """Test cases for user registration functionality"""
    
    def test_register_with_valid_data(self, api_client):
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
    
    def test_register_with_duplicate_username(self, api_client, authenticated_user):
        url = reverse('users:register')
        data = {'username': 'testuser', 'email': 'different@example.com', 'password': 'SecurePass123!', 're_password': 'SecurePass123!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_register_with_duplicate_email(self, api_client, authenticated_user):
        url = reverse('users:register')
        data = {'username': 'newuser', 'email': 'testuser@example.com', 'password': 'SecurePass123!', 're_password': 'SecurePass123!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_register_with_password_mismatch(self, api_client):
        url = reverse('users:register')
        data = {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'SecurePass123!', 're_password': 'DifferentPass123!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False
    
    def test_register_with_missing_required_fields(self, api_client):
        url = reverse('users:register')
        data = {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'SecurePass123!', 're_password': 'SecurePass123!'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['success'] is False


@pytest.mark.django_db
class TestSearchUsers:
    """Test cases for user search functionality"""
    
    def test_search_users_by_first_name(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'John'})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_search_users_by_last_name(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'Smith'})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_search_users_by_job_role(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'Engineer'})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_search_with_empty_query(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': ''})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_search_with_no_matches(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response = api_client.get(url, {'query': 'NonExistentUserXYZ123'})
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_search_case_insensitive(self, api_client, multiple_public_users):
        url = reverse('users:search_users')
        response_lower = api_client.get(url, {'query': 'john'})
        response_upper = api_client.get(url, {'query': 'JOHN'})
        assert response_lower.status_code == status.HTTP_200_OK
        assert response_upper.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestGetProfile:
    """Test cases for loading user profile details"""
    
    def test_get_profile_authenticated(self, authenticated_client):
        api_client, user = authenticated_client
        url = reverse('users:get_profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_get_profile_unauthenticated(self, api_client):
        url = reverse('users:get_profile')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is False
    
    def test_get_profile_privacy_settings(self, authenticated_client):
        api_client, user = authenticated_client
        user.profile_visibility = 'private'
        user.save()
        url = reverse('users:get_profile')
        response = api_client.get(url)
        assert response.data['user']['profile_visibility'] == 'private'


@pytest.mark.django_db
class TestVerifyCurrentPassword:
    """Test cases for password verification before update"""
    
    def test_verify_correct_password(self, authenticated_client):
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        data = {'current_password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['success'] is True
    
    def test_verify_incorrect_password(self, authenticated_client):
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        data = {'current_password': 'wrongpassword'}
        response = api_client.post(url, data, format='json')
        assert response.data['success'] is False
    
    def test_verify_password_unauthenticated(self, api_client):
        url = reverse('users:verify_password')
        data = {'current_password': 'testpass123'}
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert response.data['success'] is False
    
    def test_verify_password_missing_field(self, authenticated_client):
        api_client, user = authenticated_client
        url = reverse('users:verify_password')
        data = {}
        response = api_client.post(url, data, format='json')
        assert response.data['success'] is False
    
    def test_change_password_with_verification(self, authenticated_client):
        api_client, user = authenticated_client
        verify_url = reverse('users:verify_password')
        verify_data = {'current_password': 'testpass123'}
        verify_response = api_client.post(verify_url, verify_data, format='json')
        assert verify_response.data['success'] is True
        change_url = reverse('users:change_password')
        change_data = {'current_password': 'testpass123', 'new_password': 'NewSecurePass123!', 'confirm_password': 'NewSecurePass123!'}
        change_response = api_client.post(change_url, change_data, format='json')
        assert change_response.data['success'] is True
