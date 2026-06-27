"use client";
import { getScenarioById } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useScenario(id: string | null) {
  return useQuery({
    queryKey: scenarioKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("Scenario ID is required");
      }
      const result = await getScenarioById(id);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!id,
  });
}
