"use client";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import { FormLayout, InputField } from "@/components/form";
import { type ForgotPasswordFormValues } from "@/lib/validation/auth";
import { useRequestPasswordResetForm } from "../../hooks";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { form, requestPasswordReset, isLoading, success } =
    useRequestPasswordResetForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <FormLayout<ForgotPasswordFormValues>
              enableBeforeUnloadProtection={false}
              title="Reset Your Password"
              description="Type in your email and we'll send you a link to reset your password"
              form={form}
              isLoading={isLoading}
              onSubmit={requestPasswordReset}
              showsCancelButton={false}
            >
              <InputField<ForgotPasswordFormValues, "email">
                name="email"
                label="Email"
                placeholder="Enter your email address"
                required
              />
            </FormLayout>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-secondary font-medium underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
