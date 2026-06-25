import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingState({
  variant = "default",
}: {
  variant?: "default" | "page";
  size?: number;
}) {
  if (variant === "page") {
    return (
      <div className="bg-background text-primary-300 flex h-screen w-screen items-center justify-center">
        <Loader2 strokeWidth={2.5} className="size-12 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="text-primary-300 absolute">
        <Loader2 strokeWidth={2.5} className="size-8 animate-spin" />
      </div>
    </div>
  );
}
