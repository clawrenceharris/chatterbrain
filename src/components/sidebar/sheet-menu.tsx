import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/sidebar";
import { Menu as MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui";
import Image from "next/image";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="rounded-md" variant="ghost" size="icon">
          <MenuIcon
            strokeWidth={2}
            className="text-muted-foreground size-6.5"
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="flex h-full flex-col px-3 sm:w-72"
        side="left"
      >
        <SheetHeader>
          <Button
            className="flex items-center justify-center pt-1 pb-2"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src={"images/logo-text.png"}
                alt="Logo"
                width={130}
                height={130}
              />
              <SheetTitle className="sr-only">Brand logo</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
