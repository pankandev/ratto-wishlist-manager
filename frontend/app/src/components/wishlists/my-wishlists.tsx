import {useWishlists} from "@/lib/wishlists.ts";
import WishlistSlider from "@/components/wishlists/wishlist-slider.tsx";

const MyWishlists = () => {
    const wishlists = useWishlists();
    if (wishlists.error) {
        console.error(wishlists.error);
    }
    return (
        <div className="flex flex-col items-stretch justify-start gap-2">
            <h1 className="mb-4">Your wishlists</h1>
            <div className="flex flex-col items-stretch gap-2">
                {wishlists.error && 'Something happened'}
                {wishlists.isLoading && 'Loading...'}
                {wishlists.data && wishlists.data.map(wishlist => <WishlistSlider key={wishlist.id} wishlist={wishlist}/>)}
            </div>
        </div>
    );
};

export default MyWishlists;