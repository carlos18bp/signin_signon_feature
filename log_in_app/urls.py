from .views import userAuth
from django.urls import path

urlpatterns = [
    path('sign_on/', userAuth.sign_on, name='sign_on'),
    path('sign_in/', userAuth.sign_in, name='sign_in'),
    path('send_passcode/', userAuth.send_passcode, name='send_passcode'),
    path('google_login/', userAuth.google_login, name='google_login'),
    path('update_profile/', userAuth.update_profile, name='update_profile'),
    path('update_password/', userAuth.update_password, name='update_password'),    
    path('verify_passcode_and_reset_password/', userAuth.verify_passcode_and_reset_password, name='verify_passcode_and_reset_password'),
]
