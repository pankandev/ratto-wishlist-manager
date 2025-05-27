import {Lock} from "lucide-react";
import {NavLink} from "react-router";

const PageProtected = ({message}: {message?: string}) => {
    message ??= 'You must be logged in to access this page.'
    return (
        <div className="flex flex-col items-center justify-center gap-2 min-h-screen bg-background text-foreground">
            <Lock size={48}></Lock>
            <p className="text-2xl font-bold">Access to this page is restricted</p>
            <p>{message}</p>
            <NavLink to="/auth/login">Log in</NavLink>
        </div>
    );
};

export default PageProtected;