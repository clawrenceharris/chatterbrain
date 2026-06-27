"use client";

import Image, { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import * as React from "react";

import { assets } from "@/lib/constants/assets";
import { ContentLayout } from "@/components/sidebar";
import { SearchInput } from "@/features/search/presentation/components/ui";
import { useDomains } from "@/features/domain/presentation/hooks";
import { DomainCardResult } from "@/features/domain/application/dto/DomainCardResult";
import { DomainCard } from "@/features/domain/presentation/components/ui";
import { LoadingState } from "@/components/states";
import { Button } from "@/components/ui";

type ExploreCard = {
  title: string;
  description: string;
  href: string;
  image: StaticImageData;
  className: string;
};

const exploreCards: Record<string, ExploreCard> = {
  "meeting-someone-new": {
    title: "Meeting Someone New",
    description: "Introduce yourself with confidence",
    href: "/search?query=meeting%20someone%20new&type=all",
    image: assets.chat_bubbles_sticker,
    className: "bg-[#e7f7ff]",
  },
  "handling-conflict": {
    title: "Handling Conflict",
    description: "Navigate tough conversations",
    href: "/search?query=handling%20conflict&type=all",
    image: assets.chatterbrain_heart,
    className: "bg-[#f0e7ff]",
  },

  "group-conversations": {
    title: "Group Conversations",
    description: "Join in and keep the flow going",
    href: "/search?query=group%20conversations&type=all",
    image: assets.chatterbrain_chat_bubble,
    className: "bg-[#e8f0ff]",
  },
  "dating-and-flirting": {
    title: "Dating and Flirting",
    description: "Find your confidence in the dating world",
    href: "/search?query=dating%20and%20flirting&type=all",
    image: assets.chatterbrain_smile_sticker,
    className: "bg-[#ffe8f0]",
  },
};

type CatchAllPageProps = {
  title?: string;
  message?: string;
  heroImage?: StaticImageData;
  heroImageAlt?: string;
  variant?: "error" | "not-found";
};

export function CatchAllPage({
  title,
  message,
  heroImage,
  heroImageAlt,
  variant,
}: CatchAllPageProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const {
    data: domains = [],
    error,
    isLoading: isLoadingDomains,
  } = useDomains();
  const domainsBySlug = domains.reduce(
    (acc, domain) => {
      acc[domain.slug] = domain;
      return acc;
    },
    {} as Record<string, DomainCardResult>,
  );
  function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const params = new URLSearchParams({ query: trimmedQuery, type: "all" });
    router.push(`/search?${params.toString()}`);
  }

  if (isLoadingDomains) {
    return (
      <ContentLayout
        contentContainerClassName="centered"
        scrollable={false}
        showHeader={false}
        className="p-0"
      >
        <LoadingState />
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      showSearch={false}
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
            <h1 className="font-heading text-3xl font-bold tracking-tighter text-black sm:text-4xl">
              {!!title
                ? title
                : variant === "error"
                  ? "Oops! Something went wrong..."
                  : variant === "not-found"
                    ? "We couldn't find that page."
                    : ""}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-lg text-base leading-6">
              {!!message
                ? message
                : variant === "not-found"
                  ? "It may have moved, expired, or never existed. Try searching for some scenarios instead."
                  : variant === "error"
                    ? "Please try again later or contact support if the problem persists."
                    : ""}
            </p>

            {variant !== "error" ? (
              <form onSubmit={handleSearch} className="mt-5 w-full max-w-xl">
                <div className="relative">
                  <SearchInput
                    value={query}
                    className="bg-background shadow-sm"
                    onChange={(value) => setQuery(value)}
                    placeholder="Try searching for a scenario"
                  />
                </div>
              </form>
            ) : (
              <div>
                <Button
                  variant="primary"
                  className="mt-5"
                  onClick={() => router.push("/home")}
                >
                  <Home />
                  Back to Home
                </Button>
              </div>
            )}
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
              src={assets.error}
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
          {!error && (
            <div className="w-full text-left">
              <h2 className="font-heading text-foreground mb-3 text-base font-bold">
                Or explore one of these
              </h2>

              <div className="grid grid-cols-2 grid-rows-2 gap-3">
                {Object.entries(exploreCards).map(([slug, domain]) => (
                  <DomainCard
                    key={slug}
                    domain={domainsBySlug[slug]}
                    className={domain.className}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
