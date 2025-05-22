'use client';

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import LoginForm from "@/components/forms/login-form";

const AuthForm = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Log in</CardTitle>
            </CardHeader>
            <CardContent>
                <LoginForm></LoginForm>
            </CardContent>
        </Card>
    );
};

export default AuthForm;
