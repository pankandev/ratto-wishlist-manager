import cloudscraper
from django.db import IntegrityError, transaction
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from wishlists.models import WishlistedProduct, ProductURL, Wishlist
from wishlists.models.product_url import ProductPrice
from wishlists.permissions.wishlisted_product_is_creator import WishlistedProductIsCreatorOrReadOnlyMethod
from wishlists.scrapers.generic_scraper import split_url_host_path, extract_product
from wishlists.serializers.product import ProductSerializer


class CreateURLSerializer(serializers.Serializer):
    url = serializers.URLField()


class NestedWishlistedProductView(viewsets.ModelViewSet):
    queryset = WishlistedProduct.objects.all().order_by('-priority')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated, WishlistedProductIsCreatorOrReadOnlyMethod]

    def perform_create(self, serializer):
        wishlist_pk = int(self.kwargs.get('wishlist_pk'))
        try:
            serializer.save(wishlist_id=wishlist_pk)
        except IntegrityError:
            raise ValidationError({"message": f'Wishlist {wishlist_pk} not found'})

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return self.queryset
        return self.queryset.filter()

    def list(self, request, **kwargs):
        wishlist_pk = kwargs.get('wishlist_pk')
        if wishlist_pk:
            queryset = self.queryset.filter(wishlist__pk=wishlist_pk)
        else:
            queryset = self.queryset.filter(wishlist__creator=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'], url_path='from-url')
    def post(self, request: Request, wishlist_pk = None, **kwargs):
        wishlist = get_object_or_404(Wishlist, pk=wishlist_pk)

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
                wishlist=wishlist,
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
