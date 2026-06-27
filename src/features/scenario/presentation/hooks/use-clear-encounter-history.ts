"use client";
import { clearEncounterHistory } from "@/actions/scenario/clearEncounterHistory";
import { scenarioKeys } from "@/lib/queries/keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useClearEncounterHistory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["clear-encounter-history"],
    mutationFn: async (scenarioId: string) => {
      const result = await clearEncounterHistory(scenarioId);
      if (!result.success) {
        throw result.error;
      }
      return scenarioId;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(id),
      });
      toast.success("Encounter history cleared successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
