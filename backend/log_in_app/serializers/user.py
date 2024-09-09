from rest_framework import serializers
from log_in_app.models.user import User

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.

    This serializer is used to convert User model instances to JSON format and vice versa,
    handling the fields specified in the `fields` attribute.

    Attributes:
        model (User): The model that is being serialized.
        fields (list): List of fields to be included in the serialized output.
        extra_kwargs (dict): Dictionary specifying additional keyword arguments for certain fields.
    """
    class Meta:
        model = User  # The model that is being serialized
        fields = ['id', 'first_name', 'last_name', 'email', 'password']  # Fields to be included in the serialized output
        extra_kwargs = {'password': {'write_only': True}}  # Additional kwargs, setting 'password' as write-only
