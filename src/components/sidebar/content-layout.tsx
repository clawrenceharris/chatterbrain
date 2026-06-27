"use client";
import { cn } from "@/lib/utils";
import { ContentHeader } from "./content-header";
import React from "react";

type ContentLayoutProps = {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  className?: string;
  showHeader?: boolean;
  contentContainerClassName?: string;
  scrollAreaClassName?: string;
  scrollable?: boolean;
  showThemeToggle?: boolean;
  headerRight?: React.ReactNode;
  headerClassName?: string;
  showSearch?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "title">;

export const ContentLayout = React.forwardRef<
  HTMLDivElement,
  ContentLayoutProps
>(
  (
    {
      title,
      children,
      onBack,
      showSearch = true,
      canGoBack = false,
      className,
      showHeader = true,
      contentContainerClassName,
      scrollable = true,
      headerRight,
      headerClassName,
      scrollAreaClassName,
      showThemeToggle = true,
      ...props
    }: ContentLayoutProps,
    ref,
  ) => {
    return (
      <div
        className={cn("flex h-full flex-1 flex-col px-1", className)}
        {...props}
      >
        {showHeader && (
          <ContentHeader
            showSearch={showSearch}
            title={title}
            canGoBack={canGoBack}
            onBack={onBack}
            headerRight={headerRight}
            className={headerClassName}
            showThemeToggle={showThemeToggle}
          />
        )}

        <div
          ref={ref}
          className={cn(
            "border-border/70 relative flex h-full flex-1 flex-col overflow-hidden rounded-tl-2xl border-t-2 border-l-2 px-6 py-4 pb-22 shadow-xs",
            scrollAreaClassName,
            scrollable && "overflow-y-auto overscroll-y-contain",
          )}
        >
          <div
            className={cn("flex flex-1 flex-col", contentContainerClassName)}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

ContentLayout.displayName = "ContentLayout";
