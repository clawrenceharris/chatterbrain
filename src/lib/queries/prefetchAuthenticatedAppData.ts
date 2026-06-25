import { QueryClient } from "@tanstack/react-query";
import { getProfileDetail } from "@/actions/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileKeys } from "./keys";
import type { User } from "@supabase/supabase-js";

/**
 * Warms the TanStack Query cache for the current session on the server so the
 * client can render without an extra round-trip (and with fewer DB hits on first paint).
 */
export async function prefetchAuthenticatedAppData(
  queryClient: QueryClient,
): Promise<User | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return null;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: profileKeys.detail(user.id, "detail"),
      queryFn: async () => {
        const result = await getProfileDetail(user.id);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
  ]);

  return user;
}
