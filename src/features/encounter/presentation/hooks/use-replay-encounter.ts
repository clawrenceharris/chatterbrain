"use client";

import { replayEncounter } from "@/actions/encounter";
import { encounterKeys, scenarioKeys } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EncounterCardResult } from "../../application/dto";

export function useReplayEncounter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["replay-encounter"],
    mutationFn: async (encounterId: string) => {
      const result = await replayEncounter(encounterId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (result: EncounterCardResult) => {
      queryClient.invalidateQueries({
        queryKey: encounterKeys.page(result.id),
      });
      queryClient.invalidateQueries({
        queryKey: encounterKeys.detail(result.id),
      });
      queryClient.invalidateQueries({
        queryKey: encounterKeys.results(result.id),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(result.scenario.id),
      });
    },
  });
}
