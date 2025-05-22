from rest_framework import permissions
from rest_framework.request import Request

from wishlists.models import Wishlist


class WishlistIsCreatorOrReadOnlyMethod(permissions.BasePermission):
    def has_object_permission(self, request: Request, view, obj: Wishlist):
        return (
                request.method in permissions.SAFE_METHODS or
                obj.creator == request.user
        )
