import type {Wishlist} from "@/lib/wishlists.ts";
import ProductCard from "@/components/wishlists/product-card.tsx";
import {Button} from "@/components/ui/button.tsx";

const WishlistSlider = ({wishlist, mutateWishlists}: { wishlist: Wishlist, mutateWishlists?: () => unknown }) => {
    return (
        <div className="flex flex-col items-stretch gap-2">
            <h3 className="text-lg font-bold">{wishlist.display_name}</h3>
            <div className="flex flex-row w-full min-h-[16rem] overflow-x-auto items-stretch py-2 gap-6">
                {wishlist.products.map(product => <ProductCard key={product.id} product={product}
                                                               mutateProducts={mutateWishlists}/>)}
                {wishlist.products.length === 0 && (
                    <div className="flex flex-col items-center justify-center w-full text-white/50">
                        This wishlist is empty
                        <Button variant="link">Add a product</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistSlider;