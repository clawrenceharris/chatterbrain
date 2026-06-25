"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { FormLayout, InputField } from "@/components/form";
import { type ResetPasswordFormValues } from "@/lib/validation/auth";
import { useResetPasswordForm } from "../../hooks";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { form, resetPassword, isLoading, success } = useResetPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        {success ? (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Success!</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Your password was successfully updated.
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex justify-end">
              <CardAction>
                <Button
                  variant="primary"
                  onClick={() => router.push("/auth/login")}
                >
                  Log in
                </Button>
              </CardAction>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <FormLayout<ResetPasswordFormValues>
              enableBeforeUnloadProtection={false}
              title="Reset Your Password"
              description="Please enter your new password below."
              form={form}
              showsCancelButton
              onCancel={() => router.push("/auth/login")}
              onSubmit={resetPassword}
              isLoading={isLoading}
            >
              <InputField<ResetPasswordFormValues, "newPassword">
                label="New password"
                name="newPassword"
                required
                type="password"
                placeholder="Enter your new password"
              />
            </FormLayout>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
