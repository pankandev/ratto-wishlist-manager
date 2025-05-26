import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import {router} from "@/routes.ts";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import AuthProvider from "@/providers/auth-provider.tsx";
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <RouterProvider router={router}/>
            </AuthProvider>
            <ToastContainer />
        </ThemeProvider>
    </StrictMode>,
)
