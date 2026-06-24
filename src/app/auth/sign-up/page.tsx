
import { SignupForm } from "@/features/auth/presentation/components/forms"
import { AuthLayout } from "@/features/auth/presentation/components/layout"

export default function Page() {
  return (
    <AuthLayout authType='sign-up'>
      <SignupForm />
    </AuthLayout>
  )
}
