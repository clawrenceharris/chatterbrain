import { listUserSavedScenarios } from "@/actions/scenario";
import { scenarioKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useUserLibrarySavedScenarios(userId: string | null) {
  return useQuery({
    queryKey: scenarioKeys.userSaved(userId ?? ""),
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const result = await listUserSavedScenarios(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
  });
}
