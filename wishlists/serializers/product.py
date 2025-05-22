from rest_framework import serializers

from wishlists.models import WishlistedProduct, ProductURL
from wishlists.serializers.product_url import ProductURLSerializer


class ProductSerializer(serializers.ModelSerializer):
    urls = ProductURLSerializer(many=True, required=False)

    class Meta:
        model = WishlistedProduct
        fields = [
            'display_name',
            'priority',
            'urls'
        ]
        read_only_fields = ['wishlist']


    def create(self, validated_data):
        urls_data = validated_data.pop('urls', [])
        product = WishlistedProduct.objects.create(**validated_data)
        for url_data in urls_data:
            ProductURL.objects.create(product=product, **url_data)

        return product
