from django.db import IntegrityError
from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from wishlists.models import WishlistedProduct
from wishlists.permissions.wishlisted_product_is_creator import WishlistedProductIsCreatorOrReadOnlyMethod
from wishlists.serializers.product import ProductSerializer


class WishlistedProductView(viewsets.ModelViewSet):
    queryset = WishlistedProduct.objects.all().order_by('-priority')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, WishlistedProductIsCreatorOrReadOnlyMethod]
    def perform_create(self, serializer):
        wishlist_pk = int(self.kwargs.get('wishlist_pk'))
        try:
            serializer.save(wishlist_id=wishlist_pk)
        except IntegrityError:
            raise ValidationError({"message": f'Wishlist {wishlist_pk} not found'})

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter()

    def list(self, request, **kwargs):
        wishlist_pk = kwargs.get('wishlist_pk')
        if wishlist_pk:
            queryset = self.queryset.filter(wishlist__pk=wishlist_pk)
        else:
            queryset = self.queryset.filter(wishlist__creator=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

