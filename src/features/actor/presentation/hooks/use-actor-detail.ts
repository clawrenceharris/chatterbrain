"use client";
import { useQuery } from "@tanstack/react-query";
import { actorKeys } from "@/lib/queries";
import { getActorDetailById } from "@/actions/actor/getActorDetailById";

export function useActorDetail(id: string | null) {
  return useQuery({
    queryKey: actorKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) {
        throw new Error("Actor ID is required");
      }
      const result = await getActorDetailById(id);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!id,
  });
}
