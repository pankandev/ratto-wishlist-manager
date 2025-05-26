'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import {Input} from '../ui/input';
import {Button} from "@/components/ui/button";
import AuthForm from "@/components/cards/auth-form.tsx";

const RegisterFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    repeatPassword: z.string().min(1, 'Required').min(6, 'Password must be at least 6 characters'),
});

const RegisterForm = () => {
    const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof RegisterFormSchema>) {
        console.log(data);
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
                        <Button type="submit">Login</Button>
                    </div>
                </form>
            </Form>
        </AuthForm>
    );
};

export default RegisterForm;