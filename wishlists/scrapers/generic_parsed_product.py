import re
import typing

from pydantic import BaseModel, Field

CURRENCY_DECIMALS: dict[str, int] = {
    'CLP': 0,
    'USD': 2,
    'EUR': 2,
}


def _keep_only_digits_from_string(v: str) -> str:
    return ''.join(c for c in v if c.isnumeric())


def _parse_decimal_string(s: str, decimal_separator: str = '.') -> tuple[str, str | None] | None:
    pattern = re.compile(r'(?P<integer>^\d+)(' + re.escape(decimal_separator) + r'(?P<decimal>\d+))?$')
    match = pattern.search(s)

    if match is None:
        return None

    groups = match.groupdict()
    integer_part = groups['integer']
    decimal_part = groups['decimal']

    return integer_part, decimal_part


class ParsedPrice(BaseModel):
    currency: str
    """
    The price currency (e.g. USD, CLP, etc.)
    """
    amount: int
    """
    The amount of the price as an integer. In case of USD amounts which include cents, this should
    be the integer form of the amount. The amount of "decimals" to store is defined by the CURRENCY_DECIMALS dictionary.
    e.g. USD 12.34 -> 1234, USD 12 -> 1200, CLP 1234 -> 1234
    """
    comment: str | None = None
    """
    Comment about this price. e.g. If paid with a specific card, if it is for some specific segment of clients, or
    anything about this specific price the user should know about.
    """

    @staticmethod
    def _get_amount_as_integer(
            amount_str: str,
            n_decimals: int,
            decimal_separator: str = '.'
    ) -> int | None:
        """
        Receives an amount as string and a number of decimals, then parses
        the string to check if it is either:
        - An integer
        - A decimal number with the right number of decimals
        Then returns it as an integer form.
        e.g.
        _get_amount_as_integer('123.05', 2) # 12305
        _get_amount_as_integer('123', 2) # 12300

        :param amount_str: The string to parse as a number
        :param n_decimals: The number of decimals the result should consider
        :param decimal_separator: The number decimal separator (Default: ".")

        :return: The amount as an integer
        """
        if n_decimals == 0:
            return int(_keep_only_digits_from_string(amount_str))

        parts = _parse_decimal_string(amount_str, decimal_separator)
        if parts is None:
            return None

        integer_part, decimal_part = parts

        if decimal_part is None:
            decimal_part = '0' * n_decimals
        if len(decimal_part) != n_decimals:
            return None

        total = int(integer_part) * (10 ** n_decimals) + int(decimal_part)
        return total

    @staticmethod
    def from_string_amount(amount_str: str, currency: str, price_comment: str | None = None) -> typing.Optional[
        'ParsedPrice']:
        """
        Parses an amount of money as the type of currency.
        :param amount_str: The amount as a string
        :param currency: The currency to parse from
        :param price_comment The price comment. See ParsedPrice.comment

        :return: The parsed price
        """
        n_decimals = CURRENCY_DECIMALS.get(currency)
        if n_decimals is None:
            return None
        amount = ParsedPrice._get_amount_as_integer(amount_str, n_decimals)
        if amount is None:
            return None
        return ParsedPrice(
            amount=amount,
            currency=currency,
            comment=price_comment
        )

    def to_display_string(self, decimal_separator: str = '.', thousands_separator: str = ',') -> str:
        n_decimals = CURRENCY_DECIMALS.get(self.currency, 0)
        if n_decimals == 0:
            return f"{self.amount:{thousands_separator}}"
        amount_str = str(self.amount)
        if len(amount_str) < n_decimals:
            raise ValueError(f'Invalid amount {self.amount} for currrency {self.currency}')

        decimal_part = amount_str[-n_decimals:]
        integer_part = f"{int(amount_str[:n_decimals]):{thousands_separator}}"
        return f'{decimal_part}{decimal_separator}{integer_part}'


class ParsedProduct(BaseModel):
    """
    The scraped information of a product, as extracted from a site.
    """

    name: str | None = None
    """
    The name of the product.
    """

    description: str | None = None
    """
    The description of the product
    """
    image_url: str | None = None
    """
    The image URL
    """

    prices: list[ParsedPrice] = Field(default_factory=list)
    """
    A list of the product available prices.
    """

    @staticmethod
    def merge(products: typing.Sequence['ParsedProduct']) -> typing.Optional['ParsedProduct']:
        if len(products) == 0:
            return None
        if len(products) == 1:
            return products[0]
        product = products[0]
        for other in products[1:]:
            product.name = product.name or other.name
            product.description = product.description or other.description
            product.image_url = product.image_url or other.image_url
            product.prices = product.prices if len(product.prices) > 0 else other.prices
        return product
