"use client";
import { Menu, SidebarToggle } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { useStore } from "@/store/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { getOpenState, setIsHover, toggleOpen, settings } = sidebar;
  return (
    <aside
      className={cn(
        "bg-background fixed top-0 left-0 z-50 flex h-screen -translate-x-full flex-col justify-center py-4 transition-[width] duration-300 ease-in-out md:translate-x-0",
        !getOpenState() ? "w-[95px]" : "w-48",
        settings.disabled && "hidden",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between pr-3",
          !getOpenState() ? "justify-center px-3" : "justify-between",
        )}
      >
        {getOpenState() && (
          <Button
            className={cn(
              "mb-1 transition-opacity duration-300 ease-in-out",
              !getOpenState() ? "opacity-0" : "opacity-100",
            )}
            variant="link"
            asChild
          >
            <Link href="/home" className="relative">
              <Image
                src={"/logo.png"}
                className="size-7"
                alt="Logo"
                width={300}
                height={300}
              />
            </Link>
          </Button>
        )}
        <SidebarToggle onToggle={toggleOpen} />
      </div>

      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative flex h-full w-full flex-col overflow-y-auto px-3"
      >
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
