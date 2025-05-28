import cloudscraper
from django.db import transaction
from rest_framework import views, serializers, status
from rest_framework.request import Request
from rest_framework.response import Response

from wishlists.models import WishlistedProduct, ProductURL
from wishlists.models.product_url import ProductPrice
from wishlists.scrapers.generic_scraper import extract_product, split_url_host_path
from wishlists.serializers.product import ProductSerializer


class CreateURLSerializer(serializers.Serializer):
    url = serializers.URLField()


class CreateProductFromURLView(views.APIView):
    def post(self, request: Request, **kwargs):
        wishlist_pk = int(self.kwargs.get('wishlist_pk'))

        # validate request body
        input_serializer = CreateURLSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(
                input_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # scrape url
        scraper = cloudscraper.create_scraper()
        scraped_product = extract_product(scraper, input_serializer.url.__str__())

        if scraped_product is None:
            return Response(
                {
                    'code': 'invalid_url',
                    'message': 'Could not process the URL to get the product\'s information'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            # create product and first URL
            product = WishlistedProduct.objects.create(
                wishlist_id=wishlist_pk,
                display_name=scraped_product.name,
            )

            url = split_url_host_path(input_serializer.url.__str__())
            assert url is not None, f'Received invalid url: {url}'

            product_url = ProductURL.objects.create(
                url_host=url[0],
                url_path=url[1],
                product=product,
            )

            for price in scraped_product.prices:
                ProductPrice.objects.create(
                    amount=price.amount,
                    currency=price.currency,
                    url=product_url
                )


        return Response(
            ProductSerializer(product).data,
            status=status.HTTP_201_CREATED
        )
