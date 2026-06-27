import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockUser } from "@/test/utils";
import { updateSession } from "../middleware";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mocks.getUser,
    },
  })),
}));

function makeRequest(pathname: string) {
  return new NextRequest(`http://localhost${pathname}`);
}

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://supabase.test");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "publishable-key");
  });

  it("redirects unauthenticated users away from protected routes", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const response = await updateSession(makeRequest("/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/auth/login",
    );
  });

  it("allows unauthenticated users on auth routes", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });

    const response = await updateSession(makeRequest("/auth/login"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects authenticated users away from auth routes", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: createMockUser() },
      error: null,
    });

    const response = await updateSession(makeRequest("/auth/login?next=/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost/home");
  });

  it("allows authenticated users on protected routes", async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: createMockUser() },
      error: null,
    });

    const response = await updateSession(makeRequest("/"));

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });

  it("treats Supabase getUser failures as unauthenticated", async () => {
    mocks.getUser.mockRejectedValue(new Error("network"));

    const response = await updateSession(makeRequest("/"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost/auth/login",
    );
  });
});
