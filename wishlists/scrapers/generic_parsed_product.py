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
    amount: int

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
    def from_string_amount(amount_str: str, currency: str) -> typing.Optional['ParsedPrice']:
        """
        Parses an amount of money as the type of currency.
        :param amount_str: The amount as a string
        :param currency: The currency to parse from

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
            currency=currency
        )


class ParsedProduct(BaseModel):
    name: str
    description: str | None = None
    image_url: str | None = None

    prices: list[ParsedPrice] = Field(default_factory=list)

    @staticmethod
    def merge(products: typing.Sequence['ParsedProduct']) -> typing.Optional['ParsedProduct']:
        if len(products) == 0:
            return None
        if len(products) == 1:
            return products[0]
        product = products[0]
        for other in products[1:]:
            product.description = product.description or other.description
            product.image_url = product.image_url or other.image_url
            product.prices = product.prices or other.prices
        return product
