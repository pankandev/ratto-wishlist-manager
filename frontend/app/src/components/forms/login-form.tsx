'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form';
import { Input } from '../ui/input';
import {Button} from "@/components/ui/button";

const LoginFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
    const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof LoginFormSchema>) {
        console.log(data);
    }

    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="flex flex-col items-stretch gap-4">
                <FormField control={loginForm.control} name="email" render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="email" {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <FormField control={loginForm.control} name="password" render={({field}) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="***" {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <div className="flex flex-col items-stretch mt-4">
                    <Button type="submit">Login</Button>
                </div>
            </form>
        </Form>
    );
};

export default LoginForm;