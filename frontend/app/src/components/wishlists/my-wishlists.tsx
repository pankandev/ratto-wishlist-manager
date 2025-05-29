import {useWishlists} from "@/lib/wishlists.ts";
import WishlistSlider from "@/components/wishlists/wishlist-slider.tsx";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useCallback, useState} from "react";
import CreateWishlistForm from "@/components/forms/create-wishlist-form.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";

const MyWishlists = () => {
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const wishlists = useWishlists();
    const auth = useAuth();
    if (wishlists.error) {
        console.error(wishlists.error);
    }

    const onWishlistCreate = useCallback(async () => {
        const authToken = await auth.freshTokenGenerator();
        if (authToken !== null) {
            setOpenCreateDialog(false);
            await wishlists.mutate();
        }
    }, [setOpenCreateDialog, wishlists.mutate]);

    return (
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
            <div className="flex flex-col items-stretch justify-start gap-2">
                <div className="flex flex-row justify-between">
                    <h1 className="mb-4">Your wishlists</h1>
                    <DialogTrigger asChild>
                        <Button variant="default">
                            <Plus></Plus>
                        </Button>
                    </DialogTrigger>
                </div>
                <div className="flex flex-col items-stretch gap-2">
                    {wishlists.error && 'Something happened'}
                    {wishlists.isLoading && 'Loading...'}
                    {wishlists.data && wishlists.data.map(wishlist => <WishlistSlider key={wishlist.id}
                                                                                      wishlist={wishlist}
                                                                                      mutateWishlists={wishlists.mutate}/>)}
                    {wishlists.data?.length === 0 && <div className="flex flex-col items-center my-5">
                        <span className="text-white/50">You have no wishlists yet</span>
                        <DialogTrigger asChild>
                            <Button variant="link">Create your first wishlist!</Button>
                        </DialogTrigger>
                    </div>}
                </div>
            </div>
            <DialogContent>
                <DialogHeader>
                    Create Wishlist
                </DialogHeader>
                <CreateWishlistForm onCreate={onWishlistCreate}></CreateWishlistForm>
            </DialogContent>
        </Dialog>
    );
};

export default MyWishlists;