import useSWR, {type SWRResponse} from "swr";
import {callJsonApi, getJsonFetcher, getListSchema} from "@/lib/http-helper.ts";
import {useAuth} from "@/providers/auth-provider.tsx";
import {z} from "zod";

export interface ProductPrice {
    currency: string;
    amount: number;
    display_amount: string;
}

export const ProductPriceSchema: z.ZodSchema<ProductPrice, z.ZodTypeDef, unknown> = z.object({
    currency: z.string(),
    amount: z.number(),
    display_amount: z.string(),
});

export interface ProductURL {
    url: string;
    product_id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    prices: ProductPrice[];
}

export const ProductURLSchema: z.ZodSchema<ProductURL, z.ZodTypeDef, unknown> = z.object({
    url: z.string(),
    product_id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    image_url: z.string().nullable(),
    prices: z.array(ProductPriceSchema),
});

export interface Product {
    display_name: string;
    description: string | null;
    image_url: string | null;
    id: number;
    priority: number | null;
    urls: ProductURL[];
}

const ProductSchema: z.ZodSchema<Product, z.ZodTypeDef, unknown> = z.object({
    display_name: z.string(),
    description: z.string().nullable(),
    image_url: z.string().nullable(),
    id: z.number(),
    priority: z.number().nullable(),
    urls: z.array(ProductURLSchema),
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

export async function createProductFromUrl(wishlistId: number, url: string, authToken: string): Promise<void> {
    const response = await callJsonApi({
        method: 'POST',
        path: `/api/v1/wishlists/${wishlistId}/products/from-url/`,
        authToken,
        body: {
            url,
        }
    });
    if (!response.ok) {
        throw response;
    }
}

export async function createWishlist(displayName: string, authToken: string): Promise<void> {
    const response = await callJsonApi({
        method: 'POST',
        path: '/api/v1/wishlists/',
        authToken,
        body: {
            display_name: displayName,
        }
    });
    if (!response.ok) {
        throw response;
    }
}
