import urllib.parse

from bs4 import BeautifulSoup
from cloudscraper import CloudScraper

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


def extract_product(scraper: CloudScraper, url: str) -> ParsedProduct | None:
    f"""
    Attempts to find the product information from a URL.
    :param scraper: The CloudScraper instance to use to get the information.
    :param url: The URL to scrape
    :return: The {ParsedProduct} object
    """
    html_text = scraper.get(url).text
    soup = BeautifulSoup(html_text, features='html.parser')

    products = [
        get_json_ld(soup),
        get_metadata(soup),
    ]
    return ParsedProduct.merge([p for p in products if p is not None])
