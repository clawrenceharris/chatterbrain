"use client";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { Suspense } from "react";
import { useStore } from "@/store/use-store";
import { useSidebar } from "@/store/use-sidebar";
import { Loader2 } from "lucide-react";
import { SearchProvider } from "@/features/search/presentation/components/providers";

type SidebarLayoutProps = {
  children: React.ReactNode;
};
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, settings } = sidebar;
  return (
    <SearchProvider>
      <Sidebar />
      <main
        className={cn(
          "flex min-h-0 w-full flex-1 flex-col overflow-hidden! transition-[padding-left] duration-300 ease-in-out",
          !settings.disabled && (!getOpenState() ? "md:pl-[95px]" : "md:pl-48"),
        )}
      >
        <Suspense
          fallback={
            <Loader2
              className="text-primary size-13 animate-spin"
              strokeWidth={2.5}
            />
          }
        >
          {children}
        </Suspense>
      </main>
    </SearchProvider>
  );
}
