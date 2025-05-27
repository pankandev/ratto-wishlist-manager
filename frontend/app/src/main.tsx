import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Router from "@/router.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import AuthProvider from "@/providers/auth-provider.tsx";
import {ToastContainer} from "react-toastify";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <Router/>
            </AuthProvider>
            <ToastContainer />
        </ThemeProvider>
    </StrictMode>,
)
