import React from 'react';

const Page404 = (): React.ReactElement => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-2xl">Page not found</p>
        </div>
    );
};

export default Page404;
