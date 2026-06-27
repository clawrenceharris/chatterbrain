"use client";

import { getProgressPage } from "@/actions/progress";
import { progressKeys } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

export function useProgressPage() {
  return useQuery({
    queryKey: progressKeys.page(),
    queryFn: async () => {
      const result = await getProgressPage();
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
  });
}
