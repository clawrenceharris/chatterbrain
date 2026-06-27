"use client";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { HeaderSearch } from "./header-search";
import { UserNav } from "./user-nav";

interface NavbarProps {
  title?: string | React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
  headerRight?: React.ReactNode;
  className?: string;
  showThemeToggle?: boolean;
  showSearch?: boolean;
  showUserNav?: boolean;
}
export function ContentHeader({
  title,
  canGoBack = false,
  onBack,
  headerRight,
  className,
  showThemeToggle = true,
  showSearch = true,
  showUserNav = true,
}: NavbarProps) {
  const router = useRouter();

  return (
    <header className={cn("relative top-0 z-50 w-full pt-4 pr-3", className)}>
      <div
        className={cn("bg-background flex w-full items-center justify-between")}
      >
        {showSearch ? <HeaderSearch /> : <div />}
        {showUserNav ? <UserNav showThemeToggle={showThemeToggle} /> : <div />}
      </div>
      <div className="relative flex w-full flex-1 items-center justify-between pt-6 pb-2">
        <div className="flex h-full w-full items-center gap-3">
          {canGoBack && (
            <Button
              size="icon"
              aria-label="Go back"
              variant="outline"
              onClick={onBack ?? (() => router.back())}
            >
              <ChevronLeft strokeWidth={3} />
            </Button>
          )}
          {title &&
            (typeof title === "string" ? (
              <h1 title={title} className="line-clamp-1 text-3xl font-bold">
                {title}
              </h1>
            ) : (
              title
            ))}
        </div>
        {headerRight && <div className="flex-1">{headerRight}</div>}
      </div>
    </header>
  );
}
