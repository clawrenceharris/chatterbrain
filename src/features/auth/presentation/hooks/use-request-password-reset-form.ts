import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validation/auth";

export const useRequestPasswordResetForm = () => {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
            
        },
    });
    const requestPasswordReset = async (data: ForgotPasswordFormValues) => {
        // TODO: Implement request password reset
        console.log(data);
    }
    return {form, requestPasswordReset};
}