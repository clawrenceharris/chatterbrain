"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LoadingState } from "@/components/states";
import { CatchAllPage } from "@/app/_components/CatchAllPage";
import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { UserProvider } from "@/components/providers";

export default function ErrorPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    }

    getUser();
  }, []);
  if (isLoading) {
    return <LoadingState variant="page" />;
  }
  if (user) {
    return (
      <UserProvider>
        <SidebarLayout>
          <CatchAllPage variant="error" />
        </SidebarLayout>
      </UserProvider>
    );
  } else {
    return <CatchAllPage variant="error" />;
  }
}
