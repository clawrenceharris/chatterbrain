"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { assets } from "@/lib/constants";
import { ContentLayout } from "../sidebar";

type CatchAllPageProps = {
  title?: string;
  subtitle?: string;
  message?: string;
  heroImage?: StaticImageData;
  heroImageAlt?: string;
  variant?: "error" | "not-found";
};

export function CatchAllPage({
  title,
  subtitle,
  message,
  heroImage,
  heroImageAlt,
  variant,
}: CatchAllPageProps) {
  return (
    <ContentLayout
      data-theme="default"
      className="bg-background"
      scrollable={false}
      showThemeToggle={false}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute -top-22 left-0 h-80 w-full blur-3xl" />
      </div>
      <div className="flex w-full flex-col overflow-hidden rounded-4xl px-5 py-5 backdrop-blur-sm">
        <div className="flex-0.5 grid w-full grid-cols-[minmax(0,1fr)_250px]">
          <div className="relative z-10 flex flex-col">
            <h1 className="font-heading text-3xl leading-tight font-extrabold text-black sm:text-4xl">
              {!!title
                ? title
                : variant === "error"
                  ? "Oops!"
                  : variant === "not-found"
                    ? "404 Not Found"
                    : ""}
              <span className="text-primary block text-2xl">
                {!!subtitle
                  ? subtitle
                  : variant === "error"
                    ? "Something went wrong..."
                    : variant === "not-found"
                      ? "We couldn't find the page you were looking for"
                      : ""}
              </span>
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg text-base leading-6">
              {!!message
                ? message
                : variant === "not-found"
                  ? "It may have moved, expired, or never existed. Try searching for a scenario, actor, or helper instead."
                  : variant === "error"
                    ? "Please try again later or contact support if the problem persists."
                    : ""}
            </p>
          </div>
          {variant === "not-found" && (
            <Image
              src={assets.not_found}
              alt="Not Found"
              width={1254}
              height={1254}
              priority
              className="h-auto w-full max-w-90"
            />
          )}
          {variant === "error" && (
            <Image
              src={assets.error_state}
              alt="Error"
              width={1254}
              height={1254}
              priority
              className="h-auto w-full max-w-90"
            />
          )}
          {heroImage && (
            <Image
              src={heroImage}
              alt={heroImageAlt || "Hero Image"}
              width={1254}
              height={1254}
              priority
              className="h-auto w-full max-w-90"
            />
          )}
        </div>
        <div className="flex w-full flex-1 flex-col justify-between">
          <>
            {variant === "not-found" || variant === "error" ? (
              <p className="text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-1 text-xs">
                <span className="flex size-5 items-center justify-center rounded-full border text-[11px]">
                  ?
                </span>
                {variant === "not-found"
                  ? "Still can't find what you're looking for?"
                  : variant === "error" &&
                    "If you're still having trouble, please contact support by visiting our Help Center."}
                <Link
                  href="/helpers"
                  className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
                >
                  Visit our Help Center
                  <ExternalLink size={12} />
                </Link>
              </p>
            ) : null}
          </>
        </div>
      </div>
    </ContentLayout>
  );
}
