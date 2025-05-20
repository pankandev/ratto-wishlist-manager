from django.contrib.auth.models import User
from django.db import models


class Wishlist(models.Model):
    display_name = models.CharField(max_length=255)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
