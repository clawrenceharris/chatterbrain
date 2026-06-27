"use client";
import { listEncountersByUserId } from "@/actions/encounter";
import { encounterKeys } from "@/lib/queries";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { EncounterCardResult } from "../../application/dto";

export function useEncounters(userId: string | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: encounterKeys.listByUserId(userId ?? ""),
    placeholderData: keepPreviousData,
    initialData:
      queryClient.getQueryData<EncounterCardResult[]>(
        encounterKeys.listByUserId(userId ?? ""),
      ) ?? [],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const result = await listEncountersByUserId(userId);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!userId,
  });
}
