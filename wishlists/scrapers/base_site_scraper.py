import abc
import urllib.parse

from bs4 import BeautifulSoup

from wishlists.scrapers.generic_parsed_product import ParsedProduct


class BaseSiteScraper(abc.ABC):
    """
    This is a base scraper to create custom scrapers for specific hostnames.

    When scraping a URL, the site HTML is passed to many different methods, like reading the JSON-LD information
    about the product and scraping the <meta> tags. However, sometimes you might need something more specific for sites
    that don't structure their data in any of these methods. That's when you can use a custom scraper to extract the
    product data in a way that fits that particular site.

    Notice that these custom scrapers will always have priority over the <meta> and JSON-LD methods, so the information
    you extract with a custom scraper will most likely be the data stored in the database for the specified domain. The
    only exception is if there is another custom scraper that reads the same domain, then the scraper that comes first
    alphabetically (from the scraper file name) will have priority.

    Also notice the extracted information can be set as None for some fields, this will make the methods with lower
    priority fill the missing fields. For example, if you do not return a description for the product, then the
    description might be filled from the JSON-LD or <meta> methods.

    To create a custom scraper:
    1. Inherit this class in a Python script or package inside the `/custom_scrapers` directory at the root of this project
    2. Implement the required `scrape()` method
    3. Define the `compatible_domains` class attribute with the domains this scraper can handle
    4. Restart the server (scraper discovery is done once on server startup for performance)

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
    This attribute must be defined in your subclass. Notice this field should NOT include the scheme (e.g. "https://")
    nor a path (e.g. "/products/coolproduct"), only the domain.
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
                                 or None if the site couldn't be scraped.
        """
        raise NotImplementedError()
