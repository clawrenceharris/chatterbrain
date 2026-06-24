"use client";
import { Button } from "@/components/ui";
import { useAuth } from "@/components/providers/auth-provider";
export default function DashboardPage() {
  const { signOut } = useAuth();
  return (
  <div className="flex flex-col gap-4 p-4 items-center justify-center h-full">
    <h1>Dashboard</h1>
      <Button variant="primary" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  );
}
