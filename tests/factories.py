import factory
from factory.django import DjangoModelFactory
from faker import Faker
from django.contrib.auth import get_user_model

fake = Faker()
User = get_user_model()


class UserFactory(DjangoModelFactory):
    """Factory for creating test users"""
    
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f'user{n}')
    email = factory.LazyAttribute(lambda obj: f'{obj.username}@example.com')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    phone_number = factory.Faker('phone_number')
    department = factory.Faker('job')
    
    gender = 'male'
    marital_status = 'single'
    
    birth_year = 1990
    birth_month = 5
    birth_day = 15
    
    address = factory.Faker('address')
    job_role = factory.Faker('job')
    bio = factory.Faker('text', max_nb_chars=200)
    
    profile_visibility = 'public'
    send_public_notifications = True
    notification_preference = 'all'
    
    keyboard_navigation = True
    screen_reader = False
    font_size = 'medium'
    theme = 'standard'
    
    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        """Set password after user creation"""
        if not create:
            return
        
        if extracted:
            self.set_password(extracted)
        else:
            self.set_password('testpass123')
        self.save()


class PublicUserFactory(UserFactory):
    """Factory for creating users with public profiles"""
    profile_visibility = 'public'


class PrivateUserFactory(UserFactory):
    """Factory for creating users with private profiles"""
    profile_visibility = 'private'