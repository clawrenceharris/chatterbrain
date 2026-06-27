"use client";

import { getScenarioDetailPage } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types/error.types";
import { useQuery } from "@tanstack/react-query";

export function useScenarioPage(scenarioId: string | null) {
  return useQuery({
    queryKey: scenarioKeys.page(scenarioId ?? ""),
    queryFn: async () => {
      if (!scenarioId) {
        throw new ApplicationError({
          code: AppErrorCode.RESOURCE_NOT_FOUND,
          message: "Scenario not found",
        });
      }
      const result = await getScenarioDetailPage(scenarioId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!scenarioId,
  });
}
