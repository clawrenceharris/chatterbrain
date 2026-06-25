"use client";

import Link from "next/link";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuth } from "../providers/auth-provider";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const { signOut } = useAuth();

  return (
    <nav className="flex h-full w-full flex-1 flex-col justify-between pt-20">
      <ul className="flex flex-col justify-between space-y-1">
        {menuList.map(({ groupLabel, menus }, index) => (
          <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
            {(isOpen && groupLabel) || isOpen === undefined ? (
              <p className="text-muted-foreground max-w-[248px] truncate px-4 pb-2 text-sm font-medium">
                {groupLabel}
              </p>
            ) : !isOpen && isOpen !== undefined && groupLabel ? (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger className="w-full">
                    <div className="flex w-full items-center justify-center">
                      <Ellipsis className="h-5 w-5" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{groupLabel}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="pb-2"></p>
            )}
            {menus.map(({ href, label, icon: Icon, active }, index) => (
              <div className="w-full" key={index}>
                <TooltipProvider disableHoverableContent>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          (active === undefined && pathname.startsWith(href)) ||
                          active
                            ? "secondary"
                            : "ghost"
                        }
                        className={cn(
                          "text-muted-foreground mb-1 w-full justify-start rounded-md border-0",

                          (active === undefined && pathname.startsWith(href)) ||
                            active
                            ? "bg-primary/20 text-primary hover:bg-primary/30 border-0"
                            : "hover:text-muted-foreground/80",
                        )}
                        asChild
                      >
                        <Link href={href}>
                          <span className={cn(isOpen === false ? "" : "mr-4")}>
                            <Icon size={18} />
                          </span>
                          <p
                            className={cn(
                              "max-w-[200px] truncate",
                              isOpen === false
                                ? "-translate-x-96 opacity-0"
                                : "translate-x-0 opacity-100",
                            )}
                          >
                            {label}
                          </p>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {isOpen === false && (
                      <TooltipContent side="right">{label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </li>
        ))}
      </ul>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              onClick={signOut}
              variant="outline"
              className="mt-5 h-10 w-full justify-center"
            >
              <span className={cn(isOpen === false ? "" : "mr-4")}>
                <LogOut size={18} />
              </span>
              <p
                className={cn(
                  "whitespace-nowrap",
                  isOpen === false ? "hidden opacity-0" : "opacity-100",
                )}
              >
                Sign out
              </p>
            </Button>
          </TooltipTrigger>
          {isOpen === false && (
            <TooltipContent side="right">Sign out</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </nav>
  );
}
