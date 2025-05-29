import useSWR, {type SWRResponse} from "swr";
import {callJsonApi, getJsonFetcher, getListSchema} from "@/lib/http-helper.ts";
import {useAuth} from "@/providers/auth-provider.tsx";
import {z} from "zod";

export interface Product {
    display_name: string;
    id: number;
    priority: number | null;
}

const ProductSchema: z.ZodSchema<Product, z.ZodTypeDef, unknown> = z.object({
    display_name: z.string(),
    id: z.number(),
    priority: z.number().nullable(),
});

export interface Wishlist {
    id: number;
    display_name: string;
    color: string | null;
    emoji: string | null;
    products: Product[];
}


export type AuthTokenGenerator = () => Promise<string | null>;

const WishlistSchema: z.ZodSchema<Wishlist, z.ZodTypeDef, unknown> = z.object({
    id: z.number(),
    display_name: z.string(),
    color: z.string().nullable(),
    emoji: z.string().nullable(),
    products: z.array(ProductSchema),
});

export function useWishlists(): SWRResponse<Wishlist[]> {
    const auth = useAuth();
    const url = '/api/v1/wishlists/';
    return useSWR(url, getJsonFetcher(getListSchema(WishlistSchema), auth.freshTokenGenerator));
}

export async function deleteWishlist(wishlistId: number, authToken: string): Promise<void> {
    await callJsonApi({
        method: 'DELETE',
        path: `/api/v1/wishlists/${wishlistId}/`,
        authToken,
    });
}
export async function deleteProduct(productId: number, authToken: string): Promise<void> {
    await callJsonApi({
        method: 'DELETE',
        path: `/api/v1/products/${productId}/`,
        authToken,
    });
}
