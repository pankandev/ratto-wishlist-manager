from urllib.parse import urlparse

from rest_framework import serializers

from wishlists.models import ProductURL
from wishlists.models.product_url import Currency


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



class ProductURLSerializer(serializers.ModelSerializer):
    url = ComposedURLField()

    class Meta:
        model = ProductURL
        fields = [
            'url',
            'product_id'
        ]
