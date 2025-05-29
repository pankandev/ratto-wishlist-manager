import importlib
import inspect
import os.path
import pkgutil
import urllib.parse

from wishlists.scrapers.base_site_scraper import BaseSiteScraper

ScraperRegistry = dict[str, list[BaseSiteScraper]]

_SCRAPER_REGISTRY: ScraperRegistry | None = None


def discover_scrapers_by_domain(force_discover: bool = False,
                                custom_scrapers_module: str = 'custom_scrapers') -> ScraperRegistry:
    if not force_discover and _SCRAPER_REGISTRY is not None:
        return _SCRAPER_REGISTRY

    package = importlib.import_module(custom_scrapers_module)
    package_path = os.path.dirname(package.__file__)

    scraper_count = 0
    registry: ScraperRegistry = {}

    print("Starting scraper discovery...")
    for _, module_name, is_pkg in pkgutil.iter_modules([package_path]):
        full_module_name = f'{custom_scrapers_module}.{module_name}'
        try:
            module = importlib.import_module(full_module_name)
        except ImportError:
            continue
        classes = inspect.getmembers(module, inspect.isclass)

        for name, cls in classes:
            if not issubclass(cls, BaseSiteScraper):
                continue
            if cls.__module__ != full_module_name:
                continue
            print(f"Found {cls.__name__} scraper for domains: {', '.join(f'"{d}"' for d in cls.compatible_domains)}")
            for domain in cls.compatible_domains:
                previous_scrapers = registry.get(domain, [])
                previous_scrapers.append(cls())
                scraper_count += 1
                registry[domain] = previous_scrapers

    print(f"Found {scraper_count} scraper(s)")

    return registry


def discover_scrapers_for_url(url: str) -> list[BaseSiteScraper]:
    scrapers = discover_scrapers_by_domain()
    domain = urllib.parse.urlparse(url).netloc
    return scrapers.get(domain, [])
