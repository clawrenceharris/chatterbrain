import { getUserSavedScenarios } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useUserSavedScenarios(scenarioId: string | null) {
  return useQuery({
    queryKey: scenarioKeys.saves(scenarioId ?? ""),
    queryFn: async () => {
      if (!scenarioId) {
        throw new Error("Scenario ID is required");
      }
      const result = await getUserSavedScenarios(scenarioId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!scenarioId,
  });
}
