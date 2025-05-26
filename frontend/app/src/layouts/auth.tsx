import {Outlet} from "react-router";

const Auth = () => {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Outlet></Outlet>
    </div>;
};

export default Auth;
