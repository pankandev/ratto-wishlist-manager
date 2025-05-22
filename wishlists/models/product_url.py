from django.db import models

from wishlists.models.wishlisted_product import WishlistedProduct


class Currency(models.IntegerChoices):
    EUR = 1, "EUR"
    USD = 2, "USD"
    CLP = 3, "CLP"


class ProductURL(models.Model):
    url_host = models.CharField(max_length=255, db_index=True)
    url_path = models.CharField(max_length=255)
    product = models.ForeignKey(
        WishlistedProduct,
        on_delete=models.CASCADE,
        related_name='urls'
    )
    last_price = models.IntegerField()
    last_price_currency = models.PositiveSmallIntegerField(
        choices=Currency.choices,
        default=Currency.CLP
    )
