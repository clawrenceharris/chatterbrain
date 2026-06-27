"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveScenarioInput } from "../../application/dto";
import { saveScenario as saveScenarioAction } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries/keys";
import { toast } from "sonner";
import { ScenarioSave } from "../../domain/value-objects";
export function useSaveScenario() {
  const queryClient = useQueryClient();
  const {
    mutate: saveScenario,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (input: SaveScenarioInput): Promise<void> => {
      const result = await saveScenarioAction(input);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: scenarioKeys.saves(variables.scenarioId),
      });
      const previous = queryClient.getQueryData<ScenarioSave[]>(
        scenarioKeys.saves(variables.scenarioId),
      );
      queryClient.setQueryData(
        scenarioKeys.saves(variables.scenarioId),
        (old: ScenarioSave[] = []) => {
          const alreadySaved = old.some(
            (l) => l.user.userId === variables.userId,
          );
          if (variables.isSave) {
            // OPTIMISTIC ADD: Only add if the user hasn't saved it yet (prevents rapid double-adds)
            if (alreadySaved) {
              // User already has a save—they shouldn't be able to "spam" more saves
              return old;
            }
            const optimisticSave: ScenarioSave = {
              user: {
                userId: variables.userId,
                avatarUrl: null,
              },
              scenarioId: variables.scenarioId,
              createdAt: new Date().toISOString(),
            };
            return [...old, optimisticSave];
          } else {
            // OPTIMISTIC REMOVE: Only remove if the user has a save in the list
            if (!alreadySaved) {
              // User isn't in the save list—can't "spam" unsaves
              return old;
            }
            return old.filter((save) => save.user.userId !== variables.userId);
          }
        },
      );

      return { previous };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.saves(variables.scenarioId),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(variables.scenarioId),
      });
    },
    onError: (
      error: unknown,
      variables: SaveScenarioInput,
      context?: { previous?: ScenarioSave[] },
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(
          scenarioKeys.saves(variables.scenarioId),
          context.previous,
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: scenarioKeys.saves(variables.scenarioId),
        });
      }
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg || "Unable to save scenario");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.saves(variables.scenarioId),
      });
    },
  });
  return { saveScenario, isLoading: isPending, error };
}
