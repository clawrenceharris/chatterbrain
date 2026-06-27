"use client";

import { getGamificationSummary } from "@/actions/gamification";
import { gamificationKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useGamificationSummary() {
  return useQuery({
    queryKey: gamificationKeys.summary(),
    queryFn: async () => {
      const result = await getGamificationSummary();
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
