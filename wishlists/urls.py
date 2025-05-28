from rest_framework import routers
from rest_framework_nested.routers import NestedSimpleRouter

from wishlists.views.product import WishlistedProductView
from wishlists.views.wishlist import WishlistView

wishlists_router = routers.DefaultRouter()
wishlists_router.register(r'wishlists', WishlistView)

wishlists_nested_router = NestedSimpleRouter(
    wishlists_router,
    r'wishlists',
    lookup='wishlist'
)
wishlists_nested_router.register(
    r'products',
    WishlistedProductView,
    basename='wishlist-products'
)


urlpatterns = wishlists_router.urls
