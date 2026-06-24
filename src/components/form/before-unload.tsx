"use client"
import React, { useEffect } from "react";

export function BeforeUnload({
  children,
  disabled,
}: {
  disabled?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (disabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [disabled]);

  return <>{children}</>;
}