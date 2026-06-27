import { UserProvider } from "@/components/providers";
import { SidebarLayout } from "@/components/sidebar";
import { ChitterChatDock } from "@/features/ai";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SidebarLayout>
        {children}
        <ChitterChatDock />
      </SidebarLayout>
    </UserProvider>
  );
}
