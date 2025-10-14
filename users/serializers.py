from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    re_password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 're_password', 'first_name', 
                  'last_name', 'phone_number', 'department', 'gender', 'marital_status',
                  'birth_year', 'birth_month', 'birth_day', 'address', 'job_role', 'profile_photo']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'phone_number': {'required': True},
            'department': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['re_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('re_password')
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'phone_number', 'department', 'gender', 'marital_status',
                  'birth_year', 'birth_month', 'birth_day', 'birthday',
                  'address', 'job_role', 'profile_photo', 'bio', 'profile_visibility',
                  'show_age', 'show_gender', 'show_marital_status', 'show_email', 'show_phone', 'show_address',
                  'send_public_notifications', 'notification_preference',
                  'keyboard_navigation', 'screen_reader', 'font_size', 'theme', 'contrast_level']
        read_only_fields = ['id', 'birthday']


# NEW: Serializer for search results with conditional field visibility
class SearchUserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = {
            'id': instance.id,
            'first_name': instance.first_name,
            'last_name': instance.last_name,
            'job_role': instance.job_role,
            'department': instance.department,
            'profile_photo': instance.profile_photo.url if instance.profile_photo else None,
        }
        
        # Conditionally include fields based on visibility settings
        if instance.show_email:
            data['email'] = instance.email
        
        if instance.show_phone:
            data['phone_number'] = instance.phone_number
        
        if instance.show_address:
            data['address'] = instance.address
        
        if instance.show_age:
            data['birthday'] = instance.birthday
            data['birth_year'] = instance.birth_year
            data['birth_month'] = instance.birth_month
            data['birth_day'] = instance.birth_day
        
        if instance.show_gender:
            data['gender'] = instance.gender
        
        if instance.show_marital_status:
            data['marital_status'] = instance.marital_status
        
        return data
    
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 
                  'department', 'gender', 'marital_status', 'birthday',
                  'birth_year', 'birth_month', 'birth_day',
                  'address', 'job_role', 'profile_photo']