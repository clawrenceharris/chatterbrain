"use client";

import { getHomePage } from "@/actions/home";
import { homeKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useHomePage() {
  return useQuery({
    queryKey: homeKeys.page(),
    queryFn: async () => {
      const result = await getHomePage();
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
