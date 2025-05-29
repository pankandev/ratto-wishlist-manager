from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from wishlists.models import WishlistedProduct
from wishlists.serializers.product import ProductSerializer


class WishlistedProductViewSet(viewsets.ModelViewSet):
    queryset = WishlistedProduct.objects.all().order_by('-priority')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]