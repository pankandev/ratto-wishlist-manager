from  django.db import models

from wishlists.models.wishlist import Wishlist


class WishlistedProduct(models.Model):
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
    )
    display_name = models.CharField(max_length=255)
