"use client";

import { getEncounterPage } from "@/actions/encounter";
import { encounterKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useEncounterPage(
  encounterId: string | null,
  userId: string | null,
  actorId: string | null = null,
) {
  return useQuery({
    queryKey: encounterKeys.page(encounterId ?? ""),
    queryFn: async () => {
      if (!encounterId || !userId) {
        throw new Error("Encounter ID is required");
      }
      const result = await getEncounterPage({ encounterId, actorId, userId });
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!encounterId && !!userId,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
