"use client";
import { getDomainPage } from "@/actions/domain";
import { domainKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useDomainPage(slug: string) {
  return useQuery({
    queryKey: domainKeys.page(slug),

    queryFn: async () => {
      const result = await getDomainPage(slug);
      if (!result.success) {
        throw result.error;
      }

      return result.data;
    },
    enabled: !!slug,
  });
}
