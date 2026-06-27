import { SidebarLayout } from "@/components/sidebar";
import { ChitterChatDock } from "@/features/ai";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout>
      {children}
      <ChitterChatDock />
    </SidebarLayout>
  );
}
