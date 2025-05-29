import {createWishlist} from "@/lib/wishlists.ts";
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

const CreateWishlistFormSchema = z.object({
    displayName: z.string().min(0, 'Required'),
});

const CreateWishlistForm = ({onCreate}: { onCreate?: () => unknown }) => {
    const auth = useAuth();
    const createWishlistForm = useForm({
        resolver: zodResolver(CreateWishlistFormSchema),
        defaultValues: {
            displayName: ''
        },
    });

    const onSubmit = useCallback(async (data: z.infer<typeof CreateWishlistFormSchema>) => {
        const authToken = await auth.freshTokenGenerator();
        if (authToken !== null) {
            try {
                await createWishlist(data.displayName, authToken);
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
    }, []);

    return (
        <Form {...createWishlistForm}>
            <form onSubmit={createWishlistForm.handleSubmit(onSubmit)}>
                <FormField control={createWishlistForm.control} name='displayName' render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text"
                                   placeholder="" {...field}></Input>
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}/>
                <div className="flex flex-col items-end mt-4">
                    <Button disabled={!createWishlistForm.formState.isValid} type="submit">
                        Create Product
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateWishlistForm;