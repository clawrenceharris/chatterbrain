"use client";
import {
  DehydratedState,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

const isDevelopment = process.env.NODE_ENV === "development";
const queryStaleTime = isDevelopment ? 30 * 60 * 1000 : 5 * 60 * 1000;
const queryGcTime = isDevelopment ? 60 * 60 * 1000 : 10 * 60 * 1000;

export function QueryProvider({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: queryStaleTime,
          gcTime: queryGcTime,
          retry: (failureCount, error) => {
            // Don't retry on client errors (4xx)
            if (error && typeof error === "object" && "status" in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            // Dev refreshes should not multiply server-action/database calls.
            return failureCount < (isDevelopment ? 1 : 3);
          },
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
          refetchOnMount: isDevelopment ? false : "always",
          refetchOnWindowFocus: false,
          refetchOnReconnect: !isDevelopment,
        },

        mutations: {
          retry: (failureCount, error) => {
            // Don't retry mutations on client errors
            if (error && typeof error === "object" && "status" in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            return failureCount < (isDevelopment ? 0 : 2);
          },
        },
      },
    });

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>

      <ReactQueryDevtools hideDisabledQueries />
    </QueryClientProvider>
  );
}
