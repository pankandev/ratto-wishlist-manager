import {createProductFromUrl, type Wishlist} from "@/lib/wishlists.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCallback} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useAuth} from "@/providers/auth-provider.tsx";
import {notifyError} from "@/lib/alert-helper.ts";
import {AppError} from "@/lib/app-error.ts";

const CreateProductFromUrlFormSchema = z.object({
    url: z.string().min(0, 'Required').url('Invalid URL'),
});

const CreateProductForm = ({wishlist, onCreate}: { wishlist: Wishlist, onCreate?: () => unknown }) => {
    const auth = useAuth();
    const createProductFromUrlForm = useForm({
        resolver: zodResolver(CreateProductFromUrlFormSchema),
        defaultValues: {
            url: ''
        },
    });

    const onSubmit = useCallback(async (data: z.infer<typeof CreateProductFromUrlFormSchema>) => {
        const authToken = await auth.freshTokenGenerator();
        if (authToken !== null) {
            try {
                await createProductFromUrl(wishlist.id, data.url, authToken);
            } catch (e) {
                if (e instanceof Response) {
                    const code = (await e.json())['code'];
                    if (code === 'invalid_url') {
                        notifyError(
                            new AppError('invalid-url', 'Given URL could not be parsed'),
                        );
                    }
                }
            }
            onCreate?.()
        }
    }, [wishlist]);

    return (
        <Form {...createProductFromUrlForm}>
            <form onSubmit={createProductFromUrlForm.handleSubmit(onSubmit)}>
                <FormField control={createProductFromUrlForm.control} name='url' render={({field}) => (
                    <FormItem>
                        <FormLabel>Product URL</FormLabel>
                        <FormControl>
                            <Input type="url"
                                   placeholder="https://www.exampleshop.com/products/123/" {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <div className="flex flex-col items-end mt-4">
                    <Button disabled={!createProductFromUrlForm.formState.isValid} type="submit">
                        Create Product
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateProductForm;