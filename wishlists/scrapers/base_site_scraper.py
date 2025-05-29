import abc

from bs4 import BeautifulSoup

from wishlists.scrapers.generic_parsed_product import ParsedProduct


class BaseSiteScraper(abc.ABC):
    """
    This is a base scraper to create custom scrapers for specific hostnames.

    You may inherit this class to include scrapers for specific sites that aren't parsable by the generic parser
    that comes by default, which parses the <meta> tags and the Product JSON-LDs found in the site.

    Children of this class should be inside the `/custom_scrapers` directory at the root of this project to be
    discoverable by the discovery algorithm.

    Example:
    ```python
    class ExampleShopScraper(BaseSiteScraper):
        # Define the hostnames this scraper can handle
        hostnames = ['example-shop.com', 'www.example-shop.com']

        def scrape(self, url: str) -> ParsedProduct | None:
            # add your logic here...
    ```
    """

    compatible_domains: list[str]
    """
    A list of compatible domains that this scraper can handle.
    For example: ['www.myverycoolexampleshop.com']
    This attribute must be defined in your subclass. Notice this field do NOT include the scheme (e.g. "https://") nor
    a path (e.g. "/products/coolproduct"), only the domain.
    """

    def scrape(self, soup: BeautifulSoup, url: str) -> ParsedProduct | None:
        """
        Scrape product information from the given HTML and URL.

        This method should be overridden in your subclass to implement the actual scraping logic.

        Args:
            soup (BeautifulSoup): The BeautifulSoup instance of the found HTML.
            url (str): The URL of the product page to scrape.

        Returns:
            ParsedProduct | None: A ParsedProduct object containing the scraped information,
                                 or None if the URL couldn't be scraped.
        """
        return None
