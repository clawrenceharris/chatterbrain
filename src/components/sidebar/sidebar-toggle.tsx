import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  onToggle?: () => void;
}

export function SidebarToggle({ onToggle }: SidebarToggleProps) {
  return (
    <Button
      onClick={onToggle}
      className={"rounded-md active:translate-y-0!"}
      variant="ghost"
      size="icon"
    >
      <Menu strokeWidth={2} className="text-muted-foreground size-6.5" />
    </Button>
  );
}
