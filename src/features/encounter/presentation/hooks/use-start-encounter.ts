import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StartEncounterInput } from "../../application/dto";
import { startEncounter } from "@/actions/encounter";
import { encounterKeys, scenarioKeys } from "@/lib/queries";
import { toast } from "sonner";
import { getUserErrorMessage } from "@/shared/utils";
export function useStartEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["start-encounter"],
    mutationFn: async (input: StartEncounterInput) => {
      const result = await startEncounter(input);
      if (!result.success) {
        throw result.error;
      }
      return { encounterId: result.data.id, ...input };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: encounterKeys.detail(data.encounterId),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(data.scenarioId),
      });
    },
    onError: (error) => {
      toast.error(getUserErrorMessage(error));
    },
  });
}
