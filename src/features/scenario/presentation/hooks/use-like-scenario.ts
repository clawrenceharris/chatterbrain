"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LikeScenarioInput,
  ScenarioDetailPageOutput,
} from "../../application/dto";
import { ScenarioLike } from "../../domain/value-objects";
import { likeScenario as likeScenarioAction } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries/keys";
import { toast } from "sonner";
export function useLikeScenario() {
  const queryClient = useQueryClient();
  const {
    mutate: likeScenario,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (input: LikeScenarioInput) => {
      const result = await likeScenarioAction(input);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: scenarioKeys.likes(variables.scenarioId),
      });
      const previous = queryClient.getQueryData<ScenarioDetailPageOutput>(
        scenarioKeys.likes(variables.scenarioId),
      );
      queryClient.setQueryData(
        scenarioKeys.likes(variables.scenarioId),
        (old: ScenarioLike[] = []) => {
          const alreadyLiked = old.some(
            (l) => l.user.userId === variables.userId,
          );
          if (variables.isLike) {
            // OPTIMISTIC ADD: Only add if the user hasn't liked it yet (prevents rapid double-adds)
            if (alreadyLiked) {
              // User already has a like—they shouldn't be able to "spam" more likes
              return old;
            }
            const optimisticLike: ScenarioLike = {
              user: {
                userId: variables.userId,
                avatarUrl: null,
              },
              scenarioId: variables.scenarioId,
              createdAt: new Date().toISOString(),
            };
            return [...old, optimisticLike];
          } else {
            // OPTIMISTIC REMOVE: Only remove if the user has a like in the list
            if (!alreadyLiked) {
              // User isn't in the like list—can't "spam" unlikes
              return old;
            }
            return old.filter((like) => like.user.userId !== variables.userId);
          }
        },
      );

      return { previous };
    },

    onError: (
      err: unknown,
      variables: LikeScenarioInput,
      context?: { previous?: ScenarioDetailPageOutput },
    ) => {
      if (context?.previous) {
        queryClient.setQueryData(
          scenarioKeys.page(variables.scenarioId),
          context.previous,
        );
      } else {
        // fallback: remove the optimistic like
        queryClient.setQueryData(
          scenarioKeys.page(variables.scenarioId),
          (old: ScenarioDetailPageOutput) => {
            if (!old) return old;
            return {
              ...old,
              likes: old.likes.filter(
                (like) => like.user.userId !== variables.userId,
              ),
            } as ScenarioDetailPageOutput;
          },
        );
      }

      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Unable to like scenario");
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(variables.scenarioId),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.likes(variables.scenarioId),
      });
    },
  });
  return { likeScenario, isLoading: isPending, error };
}
