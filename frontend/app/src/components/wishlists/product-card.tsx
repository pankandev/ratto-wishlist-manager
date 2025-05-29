import {deleteProduct, type Product, type ProductPrice} from "@/lib/wishlists.ts";
import {ExternalLinkIcon, X} from "lucide-react";
import {useCallback} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";

const ProductCard = ({product, mutateProducts}: { product: Product, mutateProducts?: () => unknown }) => {
    const auth = useAuth();
    const deleteProductCallback = useCallback(async () => {
        const authToken = await auth.freshTokenGenerator();
        if (!authToken) {
            return;
        }
        await deleteProduct(product.id, authToken);
        mutateProducts?.()
    }, [product]);

    const prices = product.urls.map(url => url.prices).flat();
    const minPrice: ProductPrice | null = prices.length > 0 ?
        prices.reduce((price, minPrice): ProductPrice => {
            if (price.amount < minPrice.amount) {
                return price;
            }
            return minPrice;
        }) : null;
    const firstUrl = product.urls.length > 0 ? product.urls[0].url : null;

    return (
        <div className="flex flex-col min-w-[200px] items-stretch bg-card border border-sidebar-border rounded-md">
            <div className="flex flex-row justify-end items-center py-2 px-3">
                <Button variant="ghost" onClick={deleteProductCallback}>
                    <X></X>
                </Button>
            </div>
            <div className="grow bg-black bg-cover bg-center"
                 style={product.image_url ? {'backgroundImage': 'url(\"' + product.image_url + '\")'} : {}}/>
            <div className="flex flex-col items-stretch py-4 px-3">
                <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-col items-stretch">
                    <span className="font-bold text-x max-w-[170px] text-xs">
                        {product.display_name}
                    </span>
                        {minPrice && <span className="font-bold">{minPrice.amount} {minPrice.currency}</span>}
                    </div>
                    {firstUrl &&
                        <Button variant="ghost" size='sm' asChild>
                            <a className="text-white" href={firstUrl} target='_blank'>
                                <ExternalLinkIcon></ExternalLinkIcon>
                            </a>
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductCard;