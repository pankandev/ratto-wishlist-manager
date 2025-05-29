import logging
import urllib.parse

from bs4 import BeautifulSoup
from cloudscraper import CloudScraper

from wishlists.scrapers.discover_scrapers import discover_scrapers_for_url
from wishlists.scrapers.generic_parsed_product import ParsedProduct
from wishlists.scrapers.json_ld_scraper import get_json_ld
from wishlists.scrapers.metadata_scraper import get_metadata


def split_url_host_path(url: str) -> tuple[str, str] | None:
    """
    Splits a URL into its hostname and path + query.
    :param url: A URL.
    :return: A tuple with the hostname and path segment.
    """
    url_parsed = urllib.parse.urlparse(url)
    if url_parsed.hostname is None:
        return None
    if url_parsed.path is None:
        return None
    return (
        f'{url_parsed.scheme}://{url_parsed.hostname}',
        f'{url_parsed.path}?{url_parsed.query}',
    )


def extract_product(cloudscraper: CloudScraper, url: str) -> ParsedProduct | None:
    """
    Attempts to find the product information from a URL.
    :param cloudscraper: The CloudScraper instance to use to get the information.
    :param url: The URL to scrape
    :return: The ParsedProduct object
    """
    html_text = cloudscraper.get(url).text
    soup = BeautifulSoup(html_text, features='html.parser')

    custom_scraper_products = []
    for scraper in discover_scrapers_for_url(url):
        try:
            custom_scraper_products.append(scraper.scrape(soup, url))
        except Exception as e:
            logging.error(f'Found exception when parsing with {scraper.__class__.__name__}')
            logging.exception(e)

    # an array of parsed products as scraped by different methods.
    # missing fields from the first scraped products will be filled with the information
    # gotten from the following.
    products: list[ParsedProduct | None] = [
        *custom_scraper_products,
        get_json_ld(soup),
        get_metadata(soup),
    ]
    product = ParsedProduct.merge([p for p in products if p is not None])
    if product.name is None:
        product.name = url

    return product
