from rest_framework import serializers

from wishlists.models import Wishlist
from wishlists.serializers.product import ProductSerializer


class WishlistSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'display_name',
            'creator',
            'products',
            'emoji',
            'color'
        ]
        read_only_fields = ['creator']
