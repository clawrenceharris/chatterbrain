"use client";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    <Card className="relative mx-auto w-full max-w-[500px] overflow-y-auto ring-0">
      <div className="mx-auto w-full max-w-[430px]">
        <CardHeader>
          <Image
            className="self-center"
            src="/logo-text.png"
            alt="Chatterbrain Logo"
            width={200}
            height={200}
            loading="eager"
          />
        </CardHeader>
        <CardContent className="flex h-full items-center">
          {children}
        </CardContent>
      </div>
      <CardFooter className="justify-center py-8 text-sm">
        {authType === "sign-up"
          ? "Already have an account?"
          : "Don't have an account?"}
        <Link
          href={authType === "login" ? "/auth/sign-up" : "/auth/login"}
          className="btn-link text-primary ml-1 font-medium underline"
        >
          {authType === "login" ? "Sign up" : "Log in"}
        </Link>
      </CardFooter>
    </Card>
  );
}
