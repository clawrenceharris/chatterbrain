import { LucideIcon, Brain, Home, TrendingUp, BookOpen } from "lucide-react";

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

export function getMenuList(pathname: string, username: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/home",
          label: "Home",
          icon: Home,
          submenus: [],
          active: pathname === "/home",
        },
        {
          href: "/scenarios",
          label: "Scenarios",
          icon: Brain,
          active: pathname.startsWith("/scenarios"),
        },
        {
          href: `/user/${username}/scenarios`,
          label: "Library",
          icon: BookOpen,
          active: pathname === `/user/${username}/scenarios`,
        },

        {
          href: `/user/${username}/progress`,
          label: "Progress",
          icon: TrendingUp,
          active: pathname === `/user/${username}/progress`,
        },
      ],
    },
  ];
}
