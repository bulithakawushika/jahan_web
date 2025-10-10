from django.utils import timezone
from .models import Notification, UserNotificationStatus
from users.models import CustomUser

def create_notification(sender, notification_type, title, message, old_value=None, new_value=None):
    """
    Create a notification and assign it to relevant users
    """
    # Create the notification
    notification = Notification.objects.create(
        sender=sender,
        notification_type=notification_type,
        title=title,
        message=message,
        old_value=old_value,
        new_value=new_value
    )
    
    # Get users who should receive this notification
    recipients = get_notification_recipients(sender, notification_type)
    
    # Create notification status for each recipient
    for user in recipients:
        UserNotificationStatus.objects.create(
            user=user,
            notification=notification,
            is_read=False
        )
    
    return notification


def get_notification_recipients(sender, notification_type):
    """
    Get list of users who should receive this notification
    """
    # Exclude the sender
    users = CustomUser.objects.exclude(id=sender.id)
    
    if notification_type == 'company':
        # Company notifications: send to users who want 'all' or 'company'
        users = users.filter(notification_preference__in=['all', 'company'])
    elif notification_type == 'public':
        # Public notifications: send only to users who want 'all'
        users = users.filter(notification_preference='all')
    
    return users


def cleanup_fully_read_notifications():
    """
    Delete notifications that all users have marked as read
    """
    notifications = Notification.objects.all()
    
    for notification in notifications:
        # Check if all statuses for this notification are read
        all_read = not notification.user_statuses.filter(is_read=False).exists()
        
        if all_read:
            notification.delete()