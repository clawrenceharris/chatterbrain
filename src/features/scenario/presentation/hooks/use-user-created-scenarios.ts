import { listUserCreatedScenarios } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useUserCreatedScenarios(userId: string | null) {
  return useQuery({
    queryKey: scenarioKeys.userCreated(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const result = await listUserCreatedScenarios(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
  });
}
