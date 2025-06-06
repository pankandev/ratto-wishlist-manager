from  django.db import models

from wishlists.models.wishlist import Wishlist


class WishlistedProductPriority(models.IntegerChoices):
    LOW = 1, "Low"
    MEDIUM = 2, "Medium"
    HIGH = 3, "High"


class WishlistedProduct(models.Model):
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
        related_name='products'
    )
    display_name = models.CharField(max_length=255)
    description = models.CharField(null=True)
    image_url = models.URLField(null=True)
    priority = models.IntegerField(
        choices=WishlistedProductPriority.choices,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    last_json_ld = models.JSONField(null=True)
