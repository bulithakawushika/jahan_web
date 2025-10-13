import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from tests.factories import UserFactory, PublicUserFactory, PrivateUserFactory

User = get_user_model()


@pytest.fixture
def api_client():
    """Provides an API client for making requests"""
    return APIClient()


@pytest.fixture
def user_factory():
    """Provides UserFactory"""
    return UserFactory


@pytest.fixture
def public_user_factory():
    """Provides PublicUserFactory"""
    return PublicUserFactory


@pytest.fixture
def private_user_factory():
    """Provides PrivateUserFactory"""
    return PrivateUserFactory


@pytest.fixture
def create_user(db):
    """Fixture to create a user with custom attributes"""
    def make_user(**kwargs):
        return UserFactory(**kwargs)
    return make_user


@pytest.fixture
def authenticated_user(db):
    """Creates and returns an authenticated user"""
    user = UserFactory(
        username='testuser',
        email='testuser@example.com',
        first_name='Test',
        last_name='User',
        password='testpass123'
    )
    return user


@pytest.fixture
def authenticated_client(api_client, authenticated_user):
    """Provides an authenticated API client"""
    api_client.force_authenticate(user=authenticated_user)
    return api_client, authenticated_user


@pytest.fixture
def multiple_public_users(db):
    """Creates multiple users with public profiles"""
    users = []
    users.append(PublicUserFactory(
        first_name='John',
        last_name='Doe',
        job_role='Software Engineer',
        password='testpass123'
    ))
    users.append(PublicUserFactory(
        first_name='Jane',
        last_name='Smith',
        job_role='Data Scientist',
        password='testpass123'
    ))
    users.append(PublicUserFactory(
        first_name='Bob',
        last_name='Johnson',
        job_role='Product Manager',
        password='testpass123'
    ))
    return users


@pytest.fixture
def mixed_visibility_users(db):
    """Creates users with mixed visibility settings"""
    public_user = PublicUserFactory(
        first_name='Public',
        last_name='User',
        job_role='Engineer',
        password='testpass123'
    )
    private_user = PrivateUserFactory(
        first_name='Private',
        last_name='User',
        job_role='Engineer',
        password='testpass123'
    )
    return {'public': public_user, 'private': private_user}