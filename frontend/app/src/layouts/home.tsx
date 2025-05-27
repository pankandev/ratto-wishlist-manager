import {Rat} from "lucide-react";
import {useNavigate} from "react-router";
import {useAuth} from "@/providers/auth-provider.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useCallback} from "react";
import LoginForm from "@/components/forms/login-form.tsx";
import MyWishlists from "@/components/wishlists/my-wishlists.tsx";

const Home = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const logout = useCallback((): void => {
        auth.logout();
        navigate('/');
    }, [auth]);

    return (
        <div className="flex flex-col items-stretch gap-6 justify-center min-h-screen bg-background text-foreground">
            <div
                className="flex flex-row items-center justify-between gap-4 bg-a bg-sidebar border-b-1 border-b-sidebar-border p-4 min-h-[4.3rem]">
                <div className="flex flex-row items-center gap-4">
                    <Rat></Rat>
                    <p className="font-bold text-lg">Wishlist Manager</p>
                </div>
                <div className="flex flex-row items-center gap-4">
                    {auth.isLoggedInSnapshot && (
                        <Button variant="link" onClick={logout}>Log out</Button>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-stretch px-8 grow">
                {
                    auth.isLoggedInSnapshot ?
                        (<MyWishlists/>) :
                        (<div className="flex flex-col items-center justify-center grow"><LoginForm/></div>)
                }
            </div>
        </div>
    );
};

export default Home;