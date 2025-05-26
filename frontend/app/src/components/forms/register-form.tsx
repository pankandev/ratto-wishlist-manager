'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Button} from "@/components/ui/button";
import AuthForm from "@/components/cards/auth-form.tsx";
import {NavLink} from "react-router";
import {useAuth} from "@/providers/auth-provider.tsx";
import {notifyError} from "@/lib/alert-helper.ts";

const RegisterFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    repeatPassword: z.string().min(1, 'Required').min(6, 'Password must be at least 6 characters'),
});

const RegisterForm = () => {
    const auth = useAuth();
    const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof RegisterFormSchema>): Promise<void> {
        if (data.password !== data.repeatPassword) {
            registerForm.setError('repeatPassword', {
                type: 'manual',
                message: 'Passwords do not match',
            });
            return;
        }

        try {
            await auth.register({
                email: data.email,
                password: data.password,
            });
        } catch (e) {
            notifyError(e);
        }
    }

    return (
        <AuthForm title="Register">
            <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-4">
                    <FormField control={registerForm.control} name="email" render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="user@mail.com" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={registerForm.control} name="password" render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••••" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={registerForm.control} name="repeatPassword" render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••••" {...field}></Input>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}/>
                    <div className="flex flex-col items-stretch mt-4">
                        <Button disabled={!registerForm.formState.isValid} type="submit">Create account</Button>
                    </div>
                    <div className="flex flex-col items-center">
                        <NavLink to="/auth/login" className="text-xs">Already have an account?</NavLink>
                    </div>
                </form>
            </Form>
        </AuthForm>
    );
};

export default RegisterForm;