# README.md

## Overview

This backend application is designed to handle user authentication and profile management. It allows users to sign up, sign in, update their profiles, reset their passwords, and authenticate using Google OAuth2 by [vue3-google-login](https://devbaji.github.io/vue3-google-login/). The backend is built with Django and Django REST Framework using JSON Web Tokens (JWT) for authentication method.

## Models

### User

The `User` model is a custom user model that extends Django's `AbstractUser`. It uses the email as the unique identifier instead of a username. The model includes the following fields:

- `email`: The user's unique email address.
- `first_name`: The user's first name.
- `last_name`: The user's last name.

### PasswordCode

The `PasswordCode` model is used to store passcodes for password reset functionality. It includes the following fields:

- `user`: A foreign key linking the passcode to a user.
- `code`: A 6-digit passcode.
- `created_at`: The timestamp of when the passcode was created.
- `used`: A flag indicating whether the passcode has been used.

## Views

### User Registration and Authentication

#### `sign_on`

This view handles user registration. It checks if the email is already registered, validates the user data, hashes the password, and creates a new user. If successful, it returns JWT tokens for the user.

```python
@api_view(['POST'])
def sign_on(request):
    # ...implementation...
```

#### `sign_in`

This view handles user sign-in. It can authenticate users using either a password or a passcode. If the credentials are valid, it returns JWT tokens for the user.

```python
@api_view(['POST'])
def sign_in(request):
    # ...implementation...
```

### Profile Management

#### `update_profile`

This view allows authenticated users to update their profile information. It validates and saves the updated user data.

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    # ...implementation...
```

#### `update_password`

This view allows authenticated users to update their password. It checks if the current password is correct before updating to the new password.

```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_password(request):
    # ...implementation...
```

### Password Reset

#### `send_passcode`

This view handles sending a password reset passcode to the user's email. It generates a 6-digit passcode and saves it in the database, then sends the passcode to the user's email.

```python
@api_view(['POST'])
def send_passcode(request):
    # ...implementation...
```

#### `verify_passcode_and_reset_password`

This view verifies the provided passcode and resets the user's password. If the passcode is valid, it updates the user's password and marks the passcode as used.

```python
@api_view(['POST'])
def verify_passcode_and_reset_password(request):
    # ...implementation...
```

### Google OAuth2 Authentication

#### `google_login`

This view handles user login via Google OAuth2. It verifies the Google token, creates a new user if necessary, and returns JWT tokens for the user.

```python
@api_view(['POST'])
def google_login(request):
    # ...implementation...
```

## Authentication Methods

The backend uses JSON Web Tokens (JWT) for authentication. JWTs are generated and returned when users sign up or sign in, and they are required for accessing protected views such as updating profiles and passwords. Additionally, Google OAuth2 is integrated for user authentication via Google accounts.

## Setting Up Google Cloud APIs and Services

To enable Google authentication in your application, you need to configure your project in Google Cloud. Follow these steps to set it up:

1. **Create a New Project**:
    - Go to the [Google Cloud Console](https://console.cloud.google.com/).
    - Click on the project dropdown at the top of the page and select "New Project".
    - Give your project a name and click "Create".

2. **Enable the Google Identity and Access Management (IAM) API**:
    - In the Google Cloud Console, navigate to "APIs & Services" > "Library".
    - Search for "Identity Toolkit API".
    - Click on the IAM API and then click "Enable".
    - Search for "People API".
    - Click on the IAM API and then click "Enable".

3. **Configure OAuth Consent Screen**:
    - Go to "APIs & Services" > "OAuth consent screen".
    - Select "External" and click "Create".
    - Fill in the required information, such as App name, User support email, and Developer contact information.
    - Click "Save and Continue" until you reach the "Summary" page, then click "Back to Dashboard".

4. **Create OAuth 2.0 Credentials**:
    - Go to "APIs & Services" > "Credentials".
    - Click "Create Credentials" and select "OAuth 2.0 Client IDs".
    - Choose "Web application" as the application type.
    - In the "Authorized JavaScript origins" section, add the URL of your frontend application (e.g., `http://localhost:5173` and `http://localhost`).
    - In the "Authorized redirect URIs" section, add the URL where users will be redirected after authentication (e.g., `http://localhost:5173` and `http://localhost`).
    - Click "Create".

5. **Get Your Client ID and Client Secret**:
    - After creating your OAuth 2.0 Client ID, you will see a dialog with your Client ID and Client Secret.
    - Copy these values and save them in a secure place. You will need the Client ID for configuring your frontend application.

## How to Run the Project

1. **Clone the repository**:

    ```sh
    git clone https://github.com/carlos18bp/signin_signon_feature.git
    cd signin_signon_feature
    ```

2. **Install dependencies**:

    ```sh
    pip install -r requirements.txt
    ```

3. **Run makemigrations**:

    ```sh
    python3 manage.py makemigrations
    ```

4. **Run migrations**:

    ```sh
    python3 manage.py migrate
    ```

5. **Create superuser**:

    ```sh
    python3 manage.py createsuperuser
    ```

6. **Start the server**:

    ```sh
    python3 manage.py runserver
    ```

5. **Test the API**: Use tools like Postman or cURL to test the endpoints.

This backend application is designed to be simple and easy to understand, making it a great starting point for learning about user authentication and profile management in Django.
