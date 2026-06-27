import { getScenarioLikes } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useScenarioLikes(scenarioId: string | null) {
  return useQuery({
    queryKey: scenarioKeys.likes(scenarioId ?? ""),
    queryFn: async () => {
      if (!scenarioId) {
        throw new Error("Scenario ID is required");
      }
      const result = await getScenarioLikes(scenarioId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!scenarioId,
  });
}
