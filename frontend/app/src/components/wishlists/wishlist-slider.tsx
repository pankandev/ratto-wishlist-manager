import {deleteWishlist, type Wishlist} from "@/lib/wishlists.ts";
import ProductCard from "@/components/wishlists/product-card.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useCallback, useState} from "react";
import {X} from "lucide-react";
import {useAuth} from "@/providers/auth-provider.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import CreateProductForm from "@/components/forms/create-product-form.tsx";

const WishlistSlider = ({wishlist, mutateWishlists}: { wishlist: Wishlist, mutateWishlists?: () => unknown }) => {
    const auth = useAuth();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const deleteWishlistCallback = useCallback(async () => {
        const token = await auth.freshTokenGenerator()
        if (token !== null) {
            await deleteWishlist(wishlist.id, token);
            mutateWishlists?.()
        }
    }, [wishlist.id])

    const onProductCreate = useCallback(() => {
        mutateWishlists?.();
        setOpenDialog(false);
    }, [mutateWishlists]);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <div className="flex flex-col items-stretch gap-2">
                <div className="flex flex-row justify-between">
                    <h3 className="text-lg font-bold">{wishlist.display_name}</h3>
                    <Button variant="ghost" onClick={deleteWishlistCallback}>
                        <X></X>
                    </Button>
                </div>
                <div className="flex flex-row w-full min-h-[16rem] overflow-x-auto items-stretch py-2 gap-6">
                    {wishlist.products.map(product => <ProductCard key={product.id} product={product}
                                                                   mutateProducts={mutateWishlists}/>)}
                    {wishlist.products.length === 0 && (
                        <div className="flex flex-col items-center justify-center w-full text-white/50">
                            This wishlist is empty
                            <DialogTrigger asChild>
                                <Button variant="link">Add a product</Button>
                            </DialogTrigger>
                        </div>
                    )}
                </div>
            </div>
            <DialogContent>
                <DialogHeader className="mb-2">
                    <DialogTitle>Add a product to {wishlist.display_name}</DialogTitle>
                </DialogHeader>
                <CreateProductForm wishlist={wishlist} onCreate={onProductCreate}></CreateProductForm>
            </DialogContent>
        </Dialog>
    );
};

export default WishlistSlider;