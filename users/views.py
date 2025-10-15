from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.db.models import Q
from django.utils import timezone
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer, SearchUserSerializer
from core.models import Notification, UserNotificationStatus
from core.notification_utils import create_notification, cleanup_fully_read_notifications

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)  
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_user(request):
    """
    Logout user
    """
    logout(request)
    return Response({
        'success': True,
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def check_auth(request):
    """
    Check if user is authenticated
    """
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': UserSerializer(request.user).data
        })
    return Response({
        'authenticated': False
    })


@api_view(['GET'])
def search_users(request):
    """
    Search users by name or job role
    """
    query = request.GET.get('query', '').strip()
    
    if not query:
        return Response({
            'success': True,
            'results': []
        })
    
    
    users = User.objects.filter(
        profile_visibility='public'
    ).filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query) |
        Q(job_role__icontains=query)
    )
    
    return Response({
        'success': True,
        'results': SearchUserSerializer(users, many=True).data
    })


@api_view(['GET'])
def get_profile(request):
    """
    Get current user's profile
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_200_OK)  # Change to 200 instead of 401
    
    return Response({
        'success': True,
        'user': UserSerializer(request.user).data
    })

@api_view(['POST', 'PUT'])
def update_account_details(request):
    """
    Update user account details and send notifications
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    # Track old values for notifications
    old_job_role = user.job_role
    old_address = user.address
    
    
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.job_role = request.data.get('job_role', user.job_role)
    user.address = request.data.get('address', user.address)
    user.phone_number = request.data.get('phone_number', user.phone_number)
    user.department = request.data.get('department', user.department)
    user.gender = request.data.get('gender', user.gender)
    user.marital_status = request.data.get('marital_status', user.marital_status)
    
   
    if 'birth_year' in request.data:
        try:
            user.birth_year = int(request.data.get('birth_year'))
        except (ValueError, TypeError):
            return Response({'success': False, 'message': 'Invalid birth year'}, status=status.HTTP_400_BAD_REQUEST)

    if 'birth_month' in request.data:
        try:
            user.birth_month = int(request.data.get('birth_month'))
        except (ValueError, TypeError):
            return Response({'success': False, 'message': 'Invalid birth month'}, status=status.HTTP_400_BAD_REQUEST)

    if 'birth_day' in request.data:
        try:
            user.birth_day = int(request.data.get('birth_day'))
        except (ValueError, TypeError):
            return Response({'success': False, 'message': 'Invalid birth day'}, status=status.HTTP_400_BAD_REQUEST)

   
    if 'profile_photo' in request.FILES:
        user.profile_photo = request.FILES['profile_photo']
    
    try:
        user.save()
        
        
        if old_job_role != user.job_role and user.job_role:
            title = "Job Role Update"
            message = f"{user.first_name} has changed their job position from {old_job_role or 'None'} to {user.job_role}."
            create_notification(
                sender=user,
                notification_type='company',
                title=title,
                message=message,
                old_value=old_job_role,
                new_value=user.job_role
            )
        
       
        if old_address != user.address and user.address and user.send_public_notifications:
            title = "Address Update"
            message = f"{user.first_name} has updated their residential address from {old_address or 'None'} to {user.address}. Congratulations on the new home!"
            create_notification(
                sender=user,
                notification_type='public',
                title=title,
                message=message,
                old_value=old_address,
                new_value=user.address
            )
        
        return Response({
            'success': True,
            'message': 'Account details updated successfully',
            'user': UserSerializer(user).data
        })
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_current_password(request):
    """
    Verify current password
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    current_password = request.data.get('current_password')
    
    if request.user.check_password(current_password):
        return Response({
            'success': True,
            'message': 'Password verified'
        })
    else:
        return Response({
            'success': False,
            'message': 'Current password is incorrect'
        })


@api_view(['POST'])
def change_password(request):
    """
    Change user password
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    # Verify current password
    if not request.user.check_password(current_password):
        return Response({
            'success': False,
            'message': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if new passwords match
    if new_password != confirm_password:
        return Response({
            'success': False,
            'message': 'New passwords do not match'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update password
    request.user.set_password(new_password)
    request.user.save()
    
    # Re-login user with new password
    login(request, request.user)
    
    return Response({
        'success': True,
        'message': 'Password changed successfully'
    })


@api_view(['POST'])
def update_privacy_settings(request):
    """
    Update privacy settings including granular field visibility
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    # Update overall profile visibility
    if 'profile_visibility' in request.data:
        profile_visibility = request.data['profile_visibility']
        if profile_visibility in ['public', 'private']:
            user.profile_visibility = profile_visibility
    
    # Update granular field visibility
    if 'show_age' in request.data:
        user.show_age = request.data['show_age']
    
    if 'show_gender' in request.data:
        user.show_gender = request.data['show_gender']
    
    if 'show_marital_status' in request.data:
        user.show_marital_status = request.data['show_marital_status']
    
    if 'show_email' in request.data:
        user.show_email = request.data['show_email']
    
    if 'show_phone' in request.data:
        user.show_phone = request.data['show_phone']
    
    if 'show_address' in request.data:
        user.show_address = request.data['show_address']
    
    user.save()
    
    return Response({
        'success': True,
        'message': 'Privacy settings updated',
        'user': UserSerializer(request.user).data
    })


@api_view(['GET'])
def get_notifications(request):
    """
    Get all notifications for the current user
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get notification statuses for this user
    statuses = UserNotificationStatus.objects.filter(
        user=request.user
    ).select_related('notification', 'notification__sender').order_by('-notification__created_at')
    
    notifications = []
    for status in statuses:
        notifications.append({
            'id': status.id,
            'notification_id': status.notification.id,
            'type': status.notification.notification_type,
            'title': status.notification.title,
            'message': status.notification.message,
            'sender_name': status.notification.sender.first_name + ' ' + status.notification.sender.last_name,
            'is_read': status.is_read,
            'created_at': status.notification.created_at,
            'read_at': status.read_at
        })
    
    unread_count = statuses.filter(is_read=False).count()
    
    return Response({
        'success': True,
        'notifications': notifications,
        'unread_count': unread_count
    })

@api_view(['POST'])
def mark_notification_read(request, status_id):
    """
    Mark a notification as read for current user
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        status = UserNotificationStatus.objects.get(
            id=status_id,
            user=request.user
        )
        
        status.is_read = True
        status.read_at = timezone.now()
        status.save()
        
        # Cleanup fully read notifications
        from core.notification_utils import cleanup_fully_read_notifications
        cleanup_fully_read_notifications()
        
        # Get updated unread count
        unread_count = UserNotificationStatus.objects.filter(
            user=request.user,
            is_read=False
        ).count()
        
        return Response({
            'success': True,
            'message': 'Notification marked as read',
            'unread_count': unread_count
        })
    except UserNotificationStatus.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Notification not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Log the actual error
        print(f"Error marking notification as read: {str(e)}")
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_notification_settings(request):
    """
    Update user's notification preferences
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    # Update preferences
    if 'send_public_notifications' in request.data:
        user.send_public_notifications = request.data['send_public_notifications']
    
    if 'notification_preference' in request.data:
        pref = request.data['notification_preference']
        if pref in ['all', 'company', 'none']:
            user.notification_preference = pref
    
    user.save()
    
    return Response({
        'success': True,
        'message': 'Notification settings updated',
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
def update_accessibility_settings(request):
    """
    Update user's accessibility preferences
    """
    if not request.user.is_authenticated:
        return Response({
            'success': False,
            'message': 'Not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    user = request.user
    
    # Update accessibility settings
    if 'keyboard_navigation' in request.data:
        user.keyboard_navigation = request.data['keyboard_navigation']
    
    if 'screen_reader' in request.data:
        user.screen_reader = request.data['screen_reader']
    
    if 'high_contrast' in request.data:
        user.high_contrast = request.data['high_contrast']
    
    if 'font_size' in request.data:
        font_size = request.data['font_size']
        if font_size in ['small', 'medium', 'large']:
            user.font_size = font_size
    
    if 'theme' in request.data:
        theme = request.data['theme']
        if theme in ['light', 'dark', 'standard']:
            user.theme = theme
    
    if 'brightness_level' in request.data:
        brightness = request.data['brightness_level']
        if brightness in ['low', 'normal', 'high', 'highest']:
            user.brightness_level = brightness
    
    user.save()
    
    return Response({
        'success': True,
        'message': 'Accessibility settings updated',
        'user': UserSerializer(request.user).data
    })

@api_view(['GET'])
def check_auth(request):
    """
    Check if user is authenticated
    """
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': UserSerializer(request.user).data
        })
    return Response({
        'authenticated': False
    })

@api_view(['POST'])
def login_user(request):
    """
    Login user
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({
                'success': True,
                'message': 'Login successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Invalid username or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)