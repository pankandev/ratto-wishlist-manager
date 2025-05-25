import './App.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import AuthForm from "@/components/forms/auth-form.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthForm></AuthForm>
        </ThemeProvider>
    )
}

export default App
