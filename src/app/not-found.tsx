"use server";
import { CatchAllPage } from "@/app/_components/CatchAllPage";
import { SidebarLayout } from "@/components/sidebar/sidebar-layout";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export default async function NotFound() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <SidebarLayout>
        <CatchAllPage variant="not-found" />
      </SidebarLayout>
    );
  } else {
    return <CatchAllPage variant="not-found" />;
  }
}
