"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    <Card className="bg-surface mx-auto h-full w-full max-w-110 overflow-y-auto rounded-none border-0 shadow-none ring-0">
      <CardContent className="flex h-full items-center">{children}</CardContent>
      <CardFooter className="justify-center text-sm">
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
