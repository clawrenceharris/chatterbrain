

import z from "zod";

export const password = z.string()
.min(8, "Password must be at least 8 characters long")


export const email = z.string().email("Please enter a valid email address")
export const signUpSchema = z.object({
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password,
});

export const resetPasswordSchema = z.object({
  newPassword: password,
});

export const forgotPasswordSchema = z.object({
  email,
});


export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;