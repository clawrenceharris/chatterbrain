"use client"
import { useState } from 'react'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import Link from 'next/link'
import { FormLayout, InputField } from '@/components/form'
import { type ForgotPasswordFormValues } from '@/lib/validation/auth'
import { useRequestPasswordResetForm } from '../../hooks'

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [success, setSuccess] = useState(false)
  const { form, requestPasswordReset } = useRequestPasswordResetForm();
  const handleRequestPasswordReset = async (data: ForgotPasswordFormValues) => {
    try {
      await requestPasswordReset(data);
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              If you registered using your email and password, you will receive a password reset
              email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset Your Password</CardTitle>
            <CardDescription>
              Type in your email and we&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormLayout<ForgotPasswordFormValues> 
              form={form}
              onSubmit={handleRequestPasswordReset}
              
              showsCancelButton={false}
            >
                
                  
              <InputField<ForgotPasswordFormValues, "email">
                name="email"
                label="Email"
                placeholder="Your email"
                required
              />
            
             
            </FormLayout>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium underline text-secondary-400">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
