import { encounterKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { getEncounterResultsPage } from "@/actions/encounter";

export function useEncounterResultsPage(encounterId: string | null) {
  return useQuery({
    queryKey: encounterKeys.results(encounterId ?? ""),
    queryFn: async () => {
      if (!encounterId) {
        throw new Error("Encounter ID is required");
      }
      const result = await getEncounterResultsPage(encounterId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!encounterId,
  });
}
