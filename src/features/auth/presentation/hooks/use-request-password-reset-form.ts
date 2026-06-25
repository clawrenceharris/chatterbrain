import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validation/auth";
import { requestPasswordReset as requestPasswordResetAction } from "@/actions/auth/commands/requestPasswordReset";
import { useState } from "react";
export const useRequestPasswordResetForm = () => {
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const requestPasswordReset = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    const result = await requestPasswordResetAction(data.email);
    if (!result.success) {
      setIsLoading(false);
      throw result.error;
    }
    setSuccess(result.success);
    setIsLoading(false);
  };
  return { form, requestPasswordReset, success, isLoading };
};
