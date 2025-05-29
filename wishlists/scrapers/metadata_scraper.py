from typing import Sequence

from bs4 import BeautifulSoup
from pydantic import BaseModel, Field

from wishlists.scrapers.generic_parsed_product import ParsedProduct, ParsedPrice


class MetadataProduct(BaseModel):
    og_title: str = Field(alias='og:title')


name_attributes = (
    'og:title'
)


def get_first_values_from_metadata_dict(keys: Sequence[str], meta: dict[str, list[str]]) -> list[str] | None:
    for key in keys:
        if key in meta:
            return meta[key]
    return None

def get_first_value_from_metadata_dict(keys: Sequence[str], meta: dict[str, list[str]]) -> str | None:
    for key in keys:
        if key in meta:
            values = meta[key]
            if len(values) > 0:
                return values[0]
    return None


def get_metadata(soup: BeautifulSoup) -> ParsedProduct | None:
    meta: dict[str, list[str]] = {}

    meta_elements = soup.find_all('meta')
    for meta_element in meta_elements:
        key = meta_element.get('property')
        value = meta_element.get('content')
        if key is not None and value is not None:
            if isinstance(value, str):
                meta[key] = [value]
            else:
                meta[key] = value

    name = get_first_value_from_metadata_dict(
        ('og:title', 'title',),
        meta
    )
    image_url = get_first_value_from_metadata_dict(
        ('og:image',),
        meta
    )
    price_amount = get_first_value_from_metadata_dict(
        ('product:price:amount', ),
        meta
    )
    currency = get_first_value_from_metadata_dict(
        ('product:price:currency', ),
        meta
    )
    description = get_first_value_from_metadata_dict(
        ('og:description', ),
        meta
    )

    if name is None:
        return None

    price: ParsedPrice | None = None
    if price_amount is not None and currency is not None:
        price = ParsedPrice.from_string_amount(
            price_amount,
            currency,
        )

    return ParsedProduct(
        name=name,
        description=description,
        image_url=image_url,
        prices=[price] if price is not None else []
    )
