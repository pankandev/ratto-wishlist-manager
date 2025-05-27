import {createBrowserRouter, RouterProvider} from "react-router";
import Auth from "@/layouts/auth.tsx";
import LoginForm from "@/components/forms/login-form.tsx";
import Page404 from "@/components/special/page404.tsx";
import RegisterForm from "@/components/forms/register-form.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";
import PageProtected from "@/components/special/page-protected.tsx";
import Home from "@/layouts/home.tsx";
import {useMemo} from "react";

const Router = () => {
    const auth = useAuth();
    const router = useMemo(() => createBrowserRouter([
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/auth',
            Component: Auth,
            children: [
                {
                    path: 'login',
                    Component: LoginForm
                },
                {
                    path: 'register',
                    Component: RegisterForm
                }
            ]
        },
        {
            path: 'my-wishlists',
            Component: auth.isLoggedInSnapshot ? LoginForm : PageProtected,
        },
        {
            path: '*',
            Component: Page404
        }
    ]), [auth.isLoggedInSnapshot]);
    return (
        <RouterProvider router={router}>
        </RouterProvider>
    );
};

export default Router;
