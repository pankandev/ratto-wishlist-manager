from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class AccountManager(BaseUserManager):
    """
    Account user manager, to use email as username.
    """
    def create_user(self, email: str, password: str | None=None):
        # reference: https://dev.to/chokshiroshan/how-to-use-email-as-username-for-django-authentication-8if
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class Account(AbstractUser):
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = AccountManager()
