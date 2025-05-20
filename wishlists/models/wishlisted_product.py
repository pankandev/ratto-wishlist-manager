from  django.db import models

from wishlists.models.wishlist import Wishlist

class Currency(models.IntegerChoices):
    EUR = 1, "EUR"
    USD = 2, "USD"
    CLP = 3, "CLP"


class WishlistedProduct(models.Model):
    wishlist = models.ForeignKey(
        Wishlist,
        on_delete=models.CASCADE,
    )
    display_name = models.CharField(max_length=255)
    last_price = models.IntegerField()
    last_price_currency = models.PositiveSmallIntegerField(
        choices=Currency.choices,
        default=Currency.CLP
    )
