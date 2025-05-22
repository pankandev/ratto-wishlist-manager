from rest_framework import routers

from accounts.views.account import AccountViewSet

accounts_router = routers.DefaultRouter()
accounts_router.register(r'accounts', AccountViewSet)


urlpatterns = accounts_router.urls