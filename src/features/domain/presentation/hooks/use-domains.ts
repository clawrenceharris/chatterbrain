import { listDomains } from "@/actions/domain";
import { domainKeys } from "@/lib/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useDomains() {
  return useQuery({
    queryKey: domainKeys.lists(),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: async () => {
      const result = await listDomains();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}
