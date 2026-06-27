import { getScenarioPreview } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useScenarioPreview(scenarioId: string, userId: string) {
  return useQuery({
    queryKey: scenarioKeys.previewById(scenarioId),
    queryFn: async () => {
      const result = await getScenarioPreview(scenarioId, userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
