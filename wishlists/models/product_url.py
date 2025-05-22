from django.db import models

from wishlists.models.wishlisted_product import WishlistedProduct


class Currency(models.TextChoices):
    EUR = "EUR"
    USD = "USD"
    CLP = "CLP"


class ProductURL(models.Model):
    url_host = models.CharField(max_length=255, db_index=True)
    url_path = models.CharField(max_length=255)
    product = models.ForeignKey(
        WishlistedProduct,
        on_delete=models.CASCADE,
        related_name='urls'
    )
    last_price = models.IntegerField()
    last_price_currency = models.CharField(
        choices=Currency.choices,
        default=Currency.CLP
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.url_host}{self.url_path}"
