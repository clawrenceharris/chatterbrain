"use client";
import { getEncounterById } from "@/actions/encounter";
import { encounterKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useEncounter(encounterId: string | null) {
  return useQuery({
    queryKey: encounterKeys.detail(encounterId ?? ""),
    queryFn: async () => {
      if (!encounterId) {
        throw new Error("Encounter ID is required");
      }
      const result = await getEncounterById(encounterId);
      if (!result.success) {
        console.error(result.error);
        throw result.error;
      }
      console.log(result.data);
      return result.data;
    },
    enabled: !!encounterId,
  });
}
