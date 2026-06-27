"use client";
import { getSearchPage } from "@/actions/search";
import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import { searchKeys } from "@/lib/queries";
import { SearchPageOutput } from "../../application/dto";
import { ActionError } from "@/shared/action";

export function useSearchPage(
  query: string | null,
): UseQueryResult<SearchPageOutput, ActionError> {
  return useQuery({
    queryKey: searchKeys.page(query ?? ""),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    queryFn: async () => {
      const result = await getSearchPage(query);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    enabled: !!query,
  });
}
