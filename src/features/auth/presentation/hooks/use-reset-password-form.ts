import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPassword as resetPasswordAction } from "@/actions/auth/commands";
import { useState } from "react";
export const useResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const resetPassword = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    const result = await resetPasswordAction(data.newPassword);
    if (!result.success) {
      setIsLoading(false);
      throw result.error;
    }
    setSuccess(true);
    setIsLoading(false);
  };

  return { form, resetPassword, isLoading, success };
};
