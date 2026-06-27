import { useState, useEffect, useCallback, useRef } from "react";

export type FilterFn<T> = (item: T, query: string) => boolean;

export interface UseSearchOptions<T> {
  data: T[] | (() => Promise<T[]>);
  filter: FilterFn<T>;
  minQueryLength?: number; // default 1
  debounceMs?: number; // default 250
}

export interface UseSearchResult<T> {
  results: T[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  query: string;
  search: (query: string) => void;
  clearResults: () => void;
  retry: () => void;
}

export function useSearch<T>(opts: UseSearchOptions<T>): UseSearchResult<T> {
  const { data, filter, minQueryLength = 2, debounceMs = 250 } = opts;

  // Use refs to avoid dependency issues with unstable props
  const dataRef = useRef(data);
  const filterRef = useRef(filter);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastDataError, setLastDataError] = useState<Error | null>(null);

  // Keep refs up to date
  useEffect(() => {
    dataRef.current = data;
    filterRef.current = filter;
  });

  // Debounce query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(id);
  }, [query, debounceMs]);

  const getData = useCallback(async (): Promise<T[]> => {
    if (typeof dataRef.current === "function") {
      // async data fetcher
      const fn = dataRef.current as () => Promise<T[]>;
      return fn();
    }
    return dataRef.current as T[];
  }, []); // Stable - no dependencies

  const performSearch = useCallback(
    async (q: string) => {
      if (!q || q.length < minQueryLength) {
        setResults([]);
        setError(null);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const list = await getData();
        const filtered = list.filter((item) => filterRef.current(item, q));
        setResults(filtered);
        setHasSearched(true);
        setLastDataError(null);
      } catch (err: any) {
        setLastDataError(err);
        setError(err?.message ?? "An error occurred");
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    },
    [getData, minQueryLength], // Stable dependencies
  );

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const search = useCallback((q: string) => setQuery(q), []);

  const clearResults = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  const retry = useCallback(() => {
    if (query) performSearch(query);
    else if (lastDataError) {
      // try to re-run with the last debounced query
      performSearch(debouncedQuery);
    }
  }, [query, debouncedQuery, lastDataError, performSearch]);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    query,
    search,
    clearResults,
    retry,
  };
}
