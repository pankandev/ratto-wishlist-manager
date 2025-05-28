import json
import logging

from bs4 import BeautifulSoup
from pydantic import ValidationError

from wishlists.scrapers.generic_parsed_product import ParsedProduct
from wishlists.scrapers.json_ld_models import ProductLD


def get_json_ld(soup: BeautifulSoup) -> ParsedProduct | None:
    json_ld_scripts = soup.find_all('script', type='application/ld+json')

    product_jsons: list[dict] = []
    for script in json_ld_scripts:
        data: dict
        try:
            data = json.loads(script.string)
        except json.JSONDecodeError:
            continue
        if data.get('@type') == 'Product':
            product_jsons.append(data)

    # sort desc. by heuristic -> more fields, mean this ld+json is more believable (has more info)
    # JSONs with more fields are put at the end of the list. this is to make sure the .update() method
    # used later gives it priority
    product_jsons = sorted(product_jsons, key=lambda ld: len(ld))

    merged = {}
    for product in product_jsons:
        merged.update(product)

    if len(product_jsons) == -1:
        return None
    try:
        product_ld = ProductLD.model_validate(merged)
    except ValidationError as e:
        logging.exception(e)
        return None

    return product_ld.to_parsed()
