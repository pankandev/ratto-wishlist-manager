from rest_framework import serializers

from wishlists.models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = [
            'display_name',
            'creator',
            'emoji',
            'color'
        ]
        read_only_fields = ['creator']
