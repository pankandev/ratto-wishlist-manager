import {deleteProduct, type Product} from "@/lib/wishlists.ts";
import {X} from "lucide-react";
import {useCallback} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";

const ProductCard = ({product, mutateProducts}: { product: Product, mutateProducts?: () => unknown}) => {
    const auth = useAuth();
    const deleteProductCallback = useCallback(async () => {
        const authToken = await auth.freshTokenGenerator();
        if (!authToken) {
            return;
        }
        await deleteProduct(product.id, authToken);
        mutateProducts?.()
    }, [product]);

    return (
        <div className="flex flex-col min-w-[200px] items-stretch bg-card border border-sidebar-border rounded-md">
            <div className="flex flex-row justify-end items-center py-2 px-3">
                <Button variant="ghost" onClick={deleteProductCallback}>
                    <X></X>
                </Button>
            </div>
            <div className="grow bg-black"/>
            <div className="flex flex-col items-stretch py-4 px-3">
                <span className="font-bold">
                    {product.display_name}
                </span>
            </div>
        </div>
    );
};

export default ProductCard;