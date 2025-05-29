from urllib.parse import urlparse

from rest_framework import serializers

from wishlists.models import ProductURL
from wishlists.models.product_url import Currency, ProductPrice
from wishlists.scrapers.generic_parsed_product import ParsedPrice


class ComposedURLField(serializers.Field):
    def __init__(self, **kwargs):
        kwargs['source'] = '*'
        super().__init__(**kwargs)

    def to_representation(self, value: 'ProductURL'):
        return f'{value.url_host}{value.url_path}'

    def to_internal_value(self, data: str):
        parsed_url = urlparse(data)
        return {
            'url_host': f'{parsed_url.scheme}://{parsed_url.netloc}',
            'url_path': parsed_url.path
        }


class PriceDisplayAmount(serializers.Field):
    def __init__(self, **kwargs):
        kwargs['source'] = '*'
        super().__init__(**kwargs)

    def to_representation(self, value: 'ProductPrice') -> str:
        return ParsedPrice(
            amount=value.amount,
            currency=value.currency,
        ).to_display_string()


class ProductPriceSerializer(serializers.ModelSerializer):
    display_amount = PriceDisplayAmount()

    class Meta:
        model = ProductPrice
        fields = [
            'currency',
            'amount',
            'comment',
            'display_amount',
        ]
        read_only_fields = ['display_amount']


class ProductURLSerializer(serializers.ModelSerializer):
    url = ComposedURLField()
    prices = ProductPriceSerializer(many=True)

    class Meta:
        model = ProductURL
        fields = [
            'url',
            'product_id',
            'name',
            'description',
            'image_url',
            'prices'
        ]
