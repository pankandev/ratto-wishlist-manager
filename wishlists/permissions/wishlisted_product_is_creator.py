from rest_framework import permissions
from rest_framework.request import Request

from wishlists.models import Wishlist, WishlistedProduct


class WishlistedProductIsCreatorOrReadOnlyMethod(permissions.BasePermission):
    def has_object_permission(self, request: Request, view, obj: WishlistedProduct):
        return (
                request.method in permissions.SAFE_METHODS or
                obj.wishlist.creator == request.user
        )
