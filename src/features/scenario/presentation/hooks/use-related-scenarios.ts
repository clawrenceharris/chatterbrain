"use client";

import { getRelatedScenarios } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useRelatedScenarios(scenarioId: string | null, limit = 3) {
  return useQuery({
    queryKey: scenarioId
      ? [...scenarioKeys.related(scenarioId), { limit }]
      : scenarioKeys.related(""),
    queryFn: async () => {
      if (!scenarioId) {
        throw new Error("Scenario id is required");
      }

      const result = await getRelatedScenarios(scenarioId, limit);
      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    enabled: !!scenarioId,
    staleTime: 60_000,
  });
}
