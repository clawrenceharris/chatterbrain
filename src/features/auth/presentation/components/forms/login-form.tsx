"use client";
import { FieldGroup } from "@/components/ui";
import { FormLayout, InputField } from "@/components/form";
import Link from "next/link";
import {loginSchema, type LoginFormValues } from "@/lib/validation/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/auth-provider";

export function LoginForm() {
  const { login, isLoading } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <FormLayout<LoginFormValues>
      form={form}
      isLoading={isLoading}
      enableBeforeUnloadProtection={false}
      showsCancelButton={false}
      submitText="Log In"
      onSubmit={login}
      title="Welcome Back!"
      description="Sign back in to your account to continue chattering."
    >
      <FieldGroup>
        {/* Email */}
        <InputField<LoginFormValues, "email">
          name="email"
          placeholder="Email"
          label="Email"
          required
          autoComplete="current-email"
        />

        {/* Password */}
        <div className="space-y-2">
          <InputField<LoginFormValues, "password">
            placeholder="Your password"
            type="password"
            label="Password"
            name="password"
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="ml-auto inline-block text-sm font-medium underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </FieldGroup>
    </FormLayout>
  );
}
