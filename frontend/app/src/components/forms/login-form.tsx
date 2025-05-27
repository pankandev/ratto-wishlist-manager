'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Button} from "@/components/ui/button";
import AuthForm from "@/components/cards/auth-form.tsx";
import {NavLink, useNavigate} from "react-router";
import {useAuth} from "@/providers/auth-provider.tsx";
import {notifyError} from "@/lib/alert-helper.ts";

const LoginFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof LoginFormSchema>): Promise<void> {
        try {
            const loggedIn = await auth.login({
                email: data.email,
                password: data.password
            });
            if (!loggedIn) {
                notifyError('invalid-credentials');
                return;
            }
        } catch (e) {
            notifyError(e);
            return;
        }

        navigate('/');
    }

    return (
        <AuthForm title="Log in">
            <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-4">
                    <FormField control={loginForm.control} name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="user@mail.com" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={loginForm.control} name="password" render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••••" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className="flex flex-col items-stretch mt-4">
                        <Button disabled={!loginForm.formState.isValid} variant="default" type="submit">Login</Button>
                    </div>
                    <div className="flex flex-col items-center">
                        <NavLink to="/auth/register" className="text-xs">Do not have an account?</NavLink>
                    </div>
                </form>
            </Form>
        </AuthForm>
    );
};

export default LoginForm;