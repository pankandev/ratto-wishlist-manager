import useSWR, {type SWRResponse} from "swr";
import {getJsonFetcher, getListSchema} from "@/lib/http-helper.ts";
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
    return useSWR(url, getJsonFetcher(getListSchema(WishlistSchema), auth.tokenSnapshot));
}
