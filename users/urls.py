from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('check-auth/', views.check_auth, name='check_auth'),
    path('search/', views.search_users, name='search_users'),
    path('profile/', views.get_profile, name='get_profile'),
    path('update-account/', views.update_account_details, name='update_account'),
    path('verify-password/', views.verify_current_password, name='verify_password'),
    path('change-password/', views.change_password, name='change_password'),
    path('update-privacy/', views.update_privacy_settings, name='update_privacy'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/<int:status_id>/read/', views.mark_notification_read, name='mark_notification_read'),
    path('notification-settings/', views.update_notification_settings, name='update_notification_settings'),
]