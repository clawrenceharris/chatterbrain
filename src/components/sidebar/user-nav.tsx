"use client";

import Link from "next/link";
import { Home, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./";
import { useUser } from "../providers";

type UserNavProps = {
  showThemeToggle?: boolean;
};
export function UserNav({ showThemeToggle = true }: UserNavProps) {
  const { user, profile } = useUser();
  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-[999px]"
                  asChild
                >
                  <Avatar>
                    <AvatarImage
                      src={profile?.avatarUrl ?? undefined}
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {profile.displayName?.charAt(0).toUpperCase() ??
                        profile.username.charAt(0).toUpperCase() ??
                        ""}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {profile.displayName ?? profile.username}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/home" className="flex items-center">
                <Home
                  strokeWidth={3}
                  className="text-muted-foreground mr-3 h-4 w-4"
                />
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer" asChild>
              <Link href="/account" className="flex items-center">
                <User
                  strokeWidth={3}
                  className="text-muted-foreground mr-3 h-4 w-4"
                />
                Account
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => {}}>
            <LogOut
              strokeWidth={3}
              className="text-muted-foreground mr-3 h-4 w-4"
            />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showThemeToggle && <ThemeToggle />}
    </div>
  );
}
