from django.contrib import admin
from .models.user import User
from .models.password_code import PasswordCode

admin.site.register(User)
admin.site.register(PasswordCode)
