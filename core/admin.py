from django.contrib import admin
from .models import Notification, UserNotificationStatus

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'notification_type', 'sender', 'created_at']
    list_filter = ['notification_type', 'created_at']
    search_fields = ['title', 'message']

@admin.register(UserNotificationStatus)
class UserNotificationStatusAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification', 'is_read', 'read_at']
    list_filter = ['is_read']