"use client";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { useTheme } from "@/store/use-theme";
import { Suspense } from "react";
import { useStore } from "@/store/use-store";
import { useSidebar } from "@/store/use-sidebar";
import { ContentLayout } from "./content-layout";
import { Loader2 } from "lucide-react";

type SidebarLayoutProps = {
  children: React.ReactNode;
};
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const sidebar = useStore(useSidebar, (x) => x);
  const themeStore = useStore(useTheme, (x) => x);
  if (!sidebar || !themeStore) return null;
  const { theme } = themeStore;
  const { getOpenState, settings } = sidebar;
  return (
    <>
      <Sidebar />
      <main
        data-theme={theme}
        className={cn(
          "flex min-h-0 w-full flex-1 flex-col overflow-hidden! transition-[padding-left] duration-300 ease-in-out",
          !settings.disabled &&
            (!getOpenState() ? "md:pl-[95px]" : "md:pl-[193px]"),
        )}
      >
        <Suspense
          fallback={
            <ContentLayout contentContainerClassName="centered">
              <Loader2
                className="text-primary size-13 animate-spin"
                strokeWidth={2.5}
              />
            </ContentLayout>
          }
        >
          {children}
        </Suspense>
      </main>
    </>
  );
}
