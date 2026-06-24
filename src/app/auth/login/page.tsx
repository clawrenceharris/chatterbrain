"use client"
import { LoginForm } from "@/features/auth/presentation/components/forms";
import { AuthLayout } from "@/features/auth/presentation/components/layout";

export default function Page() {
         
  return (
    <AuthLayout authType="login">
        <LoginForm />
    </AuthLayout>
   );
}
