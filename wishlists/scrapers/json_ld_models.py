from datetime import date
from typing import List, Optional, Literal, Union

from pydantic import BaseModel, HttpUrl, Field, AnyUrl

from wishlists.scrapers.generic_parsed_product import ParsedProduct, ParsedPrice
from wishlists.scrapers.to_list import to_list


class Person(BaseModel):
    name: str
    type: Literal["Person"] = Field(alias="@type")


class Organization(BaseModel):
    type: Literal["Organization"] = Field(alias="@type")
    name: str


class Brand(BaseModel):
    type: Literal["Brand"] = Field(alias="@type")
    name: str


class QuantitativeValue(BaseModel):
    type: Literal["QuantitativeValue"] = Field(alias="@type")
    minValue: int
    maxValue: int
    unitCode: str


class ShippingDeliveryTime(BaseModel):
    type: Literal["ShippingDeliveryTime"] = Field(alias="@type")
    handlingTime: QuantitativeValue
    transitTime: QuantitativeValue


class DefinedRegion(BaseModel):
    type: Literal["DefinedRegion"] = Field(alias="@type")
    addressCountry: str
    addressRegion: str


class MonetaryAmount(BaseModel):
    type: Literal["MonetaryAmount"] = Field(alias="@type")
    value: float
    currency: str


class OfferShippingDetails(BaseModel):
    type: Literal["OfferShippingDetails"] = Field(alias="@type")
    shippingRate: MonetaryAmount
    shippingOrigin: DefinedRegion
    shippingDestination: DefinedRegion
    deliveryTime: ShippingDeliveryTime


class MerchantReturnPolicy(BaseModel):
    type: Literal["MerchantReturnPolicy"] = Field(alias="@type")
    applicableCountry: str
    returnPolicyCategory: HttpUrl
    merchantReturnDays: int
    returnMethod: HttpUrl
    returnFees: HttpUrl


class Offer(BaseModel):
    type: Literal["Offer"] = Field(alias="@type")
    price: Union[int, str]
    priceCurrency: str
    availability: HttpUrl
    url: Optional[HttpUrl] = None
    priceValidUntil: Optional[date] = None
    shippingDetails: Optional[OfferShippingDetails] = None
    hasMerchantReturnPolicy: Optional[MerchantReturnPolicy] = None
    sku: Optional[str] = None
    seller: Optional[Organization] = None

    def to_price(self) -> ParsedPrice:
        return ParsedPrice.from_string_amount(
            str(self.price),
            self.priceCurrency,
        )


class ReviewRating(BaseModel):
    bestRating: int
    ratingValue: int
    worstRating: int


class Review(BaseModel):
    type: Literal["Review"] = Field(alias="@type")
    author: Person
    reviewBody: str
    reviewRating: ReviewRating


class AggregateRating(BaseModel):
    type: Literal["AggregateRating"] = Field(alias="@type")
    ratingValue: float
    ratingCount: int
    reviewCount: int


class ProductLD(BaseModel):
    type: Literal["Product"] = Field(alias="@type")
    context: AnyUrl = Field(alias="@context")
    name: str
    id: Optional[AnyUrl] = Field(default=None, alias="@id")
    image: Union[HttpUrl, List[HttpUrl]]
    brand: Union[str, Brand]
    sku: str
    offers: Union[Offer, List[Offer]]
    review: Optional[List[Review]] = None
    aggregateRating: Optional[AggregateRating] = None
    itemCondition: Optional[HttpUrl] = None
    productID: Optional[str] = None
    description: Optional[str] = None

    def to_parsed(self) -> ParsedProduct:
        image_urls: list[HttpUrl] = to_list(self.image)

        return ParsedProduct(
            name=self.name,
            description=self.description,
            image_url=str(image_urls[0]) if len(image_urls) > 0 else None,
            prices=[
                offer.to_price()
                for offer in to_list(self.offers)
            ],
        )
