import { deleteEncounterById } from "@/actions/encounter";
import { encounterKeys, scenarioKeys } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteEncounterResult } from "../../application/dto";

export function useDeleteEncounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-encounter"],
    mutationFn: async (encounterId: string) => {
      const result = await deleteEncounterById(encounterId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: (result: DeleteEncounterResult) => {
      queryClient.invalidateQueries({
        queryKey: encounterKeys.detail(result.encounterId),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.page(result.scenarioId),
      });
      queryClient.invalidateQueries({
        queryKey: scenarioKeys.detail(result.scenarioId),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
