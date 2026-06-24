import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, type RenderHookOptions, type RenderOptions } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function createQueryWrapper(queryClient = createTestQueryClient()) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

export function renderWithQueryClient(
  ui: ReactElement,
  options?: RenderOptions & { queryClient?: QueryClient },
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();
  const { ...renderOptions } = options ?? {};

  return {
    queryClient,
    ...render(ui, {
      wrapper: createQueryWrapper(queryClient),
      ...renderOptions,
    }),
  };
}

export function renderHookWithQueryClient<Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props> & { queryClient?: QueryClient },
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();
  const { ...hookOptions } = options ?? {};

  return {
    queryClient,
    ...renderHook(hook, {
      wrapper: createQueryWrapper(queryClient),
      ...hookOptions,
    }),
  };
}

export function createMockRouter() {
  return {
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
    push: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
  };
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    app_metadata: {},
    aud: "authenticated",
    created_at: "2026-01-01T00:00:00.000Z",
    email: "user@example.com",
    user_metadata: {},
    ...overrides,
  } as User;
}

export async function flushPromises() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
