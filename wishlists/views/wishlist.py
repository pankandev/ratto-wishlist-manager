from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from wishlists.models import Wishlist
from wishlists.permissions.wishlist_is_creator_or_readonly_method import WishlistIsCreatorOrReadOnlyMethod
from wishlists.serializers.wishlist import WishlistSerializer


class WishlistView(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated, WishlistIsCreatorOrReadOnlyMethod]

    def get_queryset(self):
        wishlists = self.queryset
        user = self.request.user
        if not user.is_superuser:
            wishlists = self.queryset.filter(creator=self.request.user)
        return wishlists.prefetch_related('products').order_by('-created_at').prefetch_related(
            'products__urls').prefetch_related('products__urls__prices')

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
