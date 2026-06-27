"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useScenarios } from "@/features/scenario/presentation/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useSearchPage } from "../../hooks";
import {
  SearchResultItem,
  SearchType,
} from "@/features/search/domain/value-objects";
import { saveSearch } from "@/actions/search/saveSearch";

export interface SearchContextType {
  query: string;
  changeSearchType: (t: SearchType) => void;
  type: SearchType;
  results: SearchResultItem[];
  isLoading: boolean;
  error: string | null;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  useScenarios();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("all");
  const { data, isLoading, error } = useSearchPage(query);
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const q = params.get("query");
    const t = params.get("type");
    if (t) {
      setType(t as SearchType);
    } else {
      setType("all");
    }
    if (q) {
      saveSearch(q);
      setQuery(q);
    } else {
      setQuery("");
    }
  }, [searchParams]);
  const changeSearchType = useCallback(
    (t: SearchType) => {
      setType(t);
      router.push(`/search?query=${query}&type=${t}`);
    },
    [query, router],
  );
  useEffect(() => {
    if (query) {
      saveSearch(query);
    }
  }, [query]);
  const value = useMemo<SearchContextType>(
    () => ({
      query,
      type,
      results: data?.results ?? [],
      changeSearchType,
      isLoading,
      error: error?.message ?? null,
    }),
    [query, type, data?.results, changeSearchType, isLoading, error],
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within SearchProvider");
  }
  return context;
}
