import { getDomainWithScenarios } from "@/actions/domain";
import { domainKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useDomain(slug: string | null) {
  return useQuery({
    queryKey: domainKeys.detail(slug ?? ""),
    queryFn: async () => {
      if (!slug) throw new Error("Domain slug is required");
      const result = await getDomainWithScenarios(slug);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!slug,
  });
}
