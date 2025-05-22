from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


class Wishlist(models.Model):
    display_name = models.CharField(max_length=255)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emoji = models.CharField(max_length=1, null=True)
    color = models.CharField(max_length=6, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
