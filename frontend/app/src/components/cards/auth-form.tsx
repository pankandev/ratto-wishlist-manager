import React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";

const AuthForm = ({children, title}: { children: React.ReactNode, title: string}) => {
    return (
        <Card className="min-w-[300px] max-w-[400px] w-full flex flex-col items-stretch gap-4">
            <CardHeader>
                <h2 className="font-bold">{title}</h2>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
};

export default AuthForm;