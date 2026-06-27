import { useQuery } from "@tanstack/react-query";
import { actorKeys } from "@/lib/queries";
import { listActors } from "@/actions/actor/listActors";

export function useActors() {
  return useQuery({
    queryKey: actorKeys.lists(),
    staleTime: Infinity,
    queryFn: async () => {
      const result = await listActors();
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
