import { LucideIcon, Brain, Home, Dumbbell, TrendingUp } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: Home,
          submenus: [],
          active: pathname === "/dashboard",
        },
        {
          href: "/practice",
          label: "Practice",
          icon: Dumbbell,
          active: pathname === "/practice" || pathname === "practice/scenarios",
        },
        {
          href: "/helpers",
          label: "Helpers",
          icon: Brain,
          active: pathname.startsWith("/helpers"),
        },
        {
          href: "/me/progress",
          label: "Progress",
          icon: TrendingUp,
          active: pathname.startsWith("/me/progress"),
        },
      ],
    },
  ];
}
