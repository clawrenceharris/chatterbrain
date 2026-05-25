"use client";
import { FieldGroup } from "@/components/ui";
import { FormLayout, InputField } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValues } from "@/lib/validation/auth";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/providers/auth-provider";

export function SignupForm() {
  const { signup, isLoading } = useAuth();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  return (
    <FormLayout<SignUpFormValues>
      form={form}
      isLoading={isLoading}
      enableBeforeUnloadProtection={false}
      id="signup-form"
      submitText="Create Account"
      onSubmit={signup}
      title="Get Started"
      description="Let's get the ball rolling! Create an account to start practicing your social skills."
      showsDescription={true}
    >
      <FieldGroup>
        {/* Email */}
        <InputField<SignUpFormValues, "email">
          name="email"
          placeholder="Enter your email address"
          label="Email"
          autoComplete="email"
          required
        />

        {/* Password */}
        <InputField<SignUpFormValues, "password">
          name="password"
          label="Password"
          placeholder={"Enter your password"}
          autoComplete="new-password"
          type="password"
          required
        />
      </FieldGroup>
    </FormLayout>
  );
}
