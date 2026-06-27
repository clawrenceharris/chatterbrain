import { listScenarios } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ScenarioCardResult } from "../../application/dto";

export function useScenarios() {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: scenarioKeys.lists(),
    placeholderData: keepPreviousData,
    initialData:
      queryClient.getQueryData<ScenarioCardResult[]>(scenarioKeys.lists()) ??
      [],
    staleTime: 30_000,
    queryFn: async () => {
      const result = await listScenarios();
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
