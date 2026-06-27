"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LoadingState } from "@/components/states";
import { CatchAllPage } from "@/app/_components/CatchAllPage";
import { SidebarLayout } from "@/components/sidebar/sidebar-layout";

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
      <SidebarLayout>
        <CatchAllPage variant="error" />
      </SidebarLayout>
    );
  } else {
    return <CatchAllPage variant="error" />;
  }
}
