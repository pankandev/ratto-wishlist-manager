from ..generic_parsed_product import ParsedPrice


def test_parsed_price_usd():
    price_a = ParsedPrice.from_string_amount('123', 'USD')
    assert price_a.currency == 'USD'
    assert price_a.amount == 12300

    price_b = ParsedPrice.from_string_amount('123.05', 'USD')
    assert price_b.currency == 'USD'
    assert price_b.amount == 12305

    price_c = ParsedPrice.from_string_amount('123.4', 'USD')
    assert price_c is None

    price_d = ParsedPrice.from_string_amount('1.234', 'USD')
    assert price_d is None
