from django.apps import AppConfig

from wishlists.scrapers.discover_scrapers import discover_scrapers_by_domain


class WishlistsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'wishlists'

    def ready(self):
        discover_scrapers_by_domain(True)
