import { QueryClient } from "@tanstack/react-query";
import { getProfileDetail } from "@/actions/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  encounterKeys,
  gamificationKeys,
  homeKeys,
  profileKeys,
  scenarioKeys,
} from "./keys";
import { listScenarios } from "@/actions/scenario";
import { listEncountersByUserId } from "@/actions/encounter";
import { getHomePage } from "@/actions/home";
import { getGamificationSummary } from "@/actions/gamification";
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
    queryClient.prefetchQuery({
      queryKey: scenarioKeys.lists(),
      queryFn: async () => {
        const result = await listScenarios();
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: encounterKeys.listByUserId(user.id),
      queryFn: async () => {
        const result = await listEncountersByUserId(user.id);
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: homeKeys.page(),
      queryFn: async () => {
        const result = await getHomePage();
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: gamificationKeys.summary(),
      queryFn: async () => {
        const result = await getGamificationSummary();
        if (!result.success) throw result.error;
        return result.data;
      },
    }),
  ]);

  return user;
}
