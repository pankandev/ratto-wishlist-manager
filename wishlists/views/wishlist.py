from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from wishlists.models import Wishlist
from wishlists.permissions.wishlist_is_creator_or_readonly_method import WishlistIsCreatorOrReadOnlyMethod
from wishlists.serializers.wishlist import WishlistSerializer


class WishlistView(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all().order_by('-created_at')
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated, WishlistIsCreatorOrReadOnlyMethod]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter(creator=self.request.user)
