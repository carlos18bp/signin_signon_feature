from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    """
    Custom user manager to handle user creation with email as the unique identifier.
    """
    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and returns a regular user with the given email and password.

        Args:
            email (str): The email of the user.
            password (str, optional): The password for the user. Defaults to None.
            **extra_fields: Additional fields for the user model.

        Raises:
            ValueError: If the email is not provided.

        Returns:
            User: The created user instance.
        """
        if not email:
            raise ValueError('The email must be defined')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and returns a superuser with the given email and password.

        Args:
            email (str): The email of the superuser.
            password (str, optional): The password for the superuser. Defaults to None.
            **extra_fields: Additional fields for the superuser model.

        Raises:
            ValueError: If is_staff or is_superuser is not set to True.

        Returns:
            User: The created superuser instance.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Custom user model extending AbstractUser. Uses email as the unique identifier instead of username.
    
    Attributes:
        email (EmailField): The unique email of the user.
        first_name (CharField): The first name of the user.
        last_name (CharField): The last name of the user.
    """
    # Remove the username, groups, and user_permissions fields
    username = None
    groups = None
    user_permissions = None
    
    # Use email as the unique identifier
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=60)
    last_name = models.CharField(max_length=60)

    # Set email as the username field and define required fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    # Use the custom user manager
    objects = UserManager()

    def __str__(self):
        """
        String representation of the User instance.
        
        Returns:
            str: The email of the user.
        """
        return self.email
