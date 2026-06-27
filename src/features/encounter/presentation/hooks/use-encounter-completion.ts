"use client";

import { useCallback, useState } from "react";
import { completeEncounter } from "@/actions/encounter";
import type { EncounterMachineContext } from "../../domain/types/encounter-machine-context";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  encounterKeys,
  gamificationKeys,
  progressKeys,
} from "@/lib/queries/keys";
import { useModals } from "@/hooks/use-modals";

export function useDialogueCompletion() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { modals } = useModals();
  const addDialogueProgress = useCallback(
    async (context: EncounterMachineContext) => {
      if (!context.userProfile.userId) {
        return;
      }

      setIsLoading(true);
      try {
        const result = await completeEncounter({
          userId: context.userProfile.userId,
          context,
        });
        if (!result.success) {
          toast.error(result.error.message);
          return;
        }

        if (result.data.newlyUnlockedBadges.length > 0) {
          modals["badge-unlock"].open({
            badges: result.data.newlyUnlockedBadges,
          });
        } else {
          toast.success("Encounter completed successfully");
        }

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: encounterKeys.page(result.data.encounter.id),
          }),
          queryClient.invalidateQueries({
            queryKey: encounterKeys.listByUserId(context.userProfile.userId),
          }),
          queryClient.invalidateQueries({
            queryKey: encounterKeys.detail(result.data.encounter.id),
          }),
          queryClient.invalidateQueries({
            queryKey: encounterKeys.results(result.data.encounter.id),
          }),
          queryClient.invalidateQueries({
            queryKey: progressKeys.page(),
          }),
          queryClient.invalidateQueries({
            queryKey: gamificationKeys.summary(),
          }),
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [modals, queryClient],
  );

  return { addDialogueProgress, isLoading };
}
