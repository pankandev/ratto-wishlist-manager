import {Card, CardContent, CardFooter, CardTitle} from "@/components/ui/card.tsx";
import type {Product} from "@/lib/wishlists.ts";

const ProductCard = ({product}: { product: Product }) => {
    return (
        <Card className="min-w-[200px] flex flex-col items-stretch overflow-x-hidden">
            <CardContent className="grow">
                {product.display_name}
            </CardContent>
            <CardFooter>
                <CardTitle>
                    {product.display_name}
                </CardTitle>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;