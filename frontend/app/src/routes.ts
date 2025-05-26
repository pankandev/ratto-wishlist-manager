import {createBrowserRouter} from "react-router";
import Auth from "@/layouts/auth.tsx";
import LoginForm from "@/components/forms/login-form.tsx";
import Page404 from "@/components/special/page404.tsx";
import RegisterForm from "@/components/forms/register-form.tsx";


export const router = createBrowserRouter([
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
        path: '*',
        Component: Page404
    }
])