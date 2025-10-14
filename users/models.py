from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Extended User model with additional profile fields
    """
    email = models.EmailField(unique=True, blank=False)
    
    # Personal Information
    phone_number = models.CharField(max_length=20, blank=False)
    department = models.CharField(max_length=100, blank=False)
    gender = models.CharField(
        max_length=30,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('not_preferred', 'Prefer not to say'),
        ],
        blank=True,
        null=True
    )
    marital_status = models.CharField(
        max_length=20,
        choices=[
            ('single', 'Single'),
            ('married', 'Married'),
            ('divorced', 'Divorced'),
            ('separated', 'Separated'),
        ],
        blank=True,
        null=True
    )
    
    # Birthday stored as separate fields for easier selection
    birth_year = models.IntegerField(blank=True, null=True)
    birth_month = models.IntegerField(blank=True, null=True)
    birth_day = models.IntegerField(blank=True, null=True)
    
    # Keep birthday as a computed property
    birthday = models.DateField(null=True, blank=True)
    
    address = models.TextField(blank=True, null=True)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    job_role = models.CharField(max_length=100, blank=True, null=True)
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
        ],
        default='public'
    )
    
    # NEW: Granular field visibility controls
    show_age = models.BooleanField(default=True)
    show_gender = models.BooleanField(default=True)
    show_marital_status = models.BooleanField(default=True)
    show_email = models.BooleanField(default=True)
    show_phone = models.BooleanField(default=True)
    show_address = models.BooleanField(default=True)

    # Notification settings
    send_public_notifications = models.BooleanField(default=True)
    notification_preference = models.CharField(
        max_length=20,
        choices=[
            ('all', 'All Notifications'),
            ('company', 'Company Only'),
            ('none', 'None'),
        ],
        default='all'
    )
    
    # Accessibility settings
    keyboard_navigation = models.BooleanField(default=True)
    screen_reader = models.BooleanField(default=False)
    font_size = models.CharField(
        max_length=20,
        choices=[
            ('small', 'Small'),
            ('medium', 'Medium'),
            ('large', 'Large'),
        ],
        default='medium'
    )
    theme = models.CharField(
        max_length=20,
        choices=[
            ('light', 'Light Theme'),
            ('dark', 'Dark Theme'),
            ('standard', 'Standard Theme'),
        ],
        default='standard'
    )
    contrast_level = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low Contrast'),
            ('normal', 'Normal Contrast'),
            ('high', 'High Contrast'),
            ('highest', 'Highest Contrast'),
        ],
        default='normal'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Construct birthday from year, month, day if provided
        if self.birth_year and self.birth_month and self.birth_day:
            try:
                from datetime import date
                self.birthday = date(self.birth_year, self.birth_month, self.birth_day)
            except ValueError:
                pass
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.username
    
    class Meta:
        db_table = 'custom_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'