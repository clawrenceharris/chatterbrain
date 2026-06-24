import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Modules such as `createBrowserClient` read these at import time; real CI/local `.env` overrides these.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "http://127.0.0.1:54321";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= "test-publishable-key";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

vi.stubGlobal(
  "Image",
  class {
    src = "";
  },
);

vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
  return window.setTimeout(() => callback(performance.now()), 0);
});

vi.stubGlobal("cancelAnimationFrame", (id: number) => {
  window.clearTimeout(id);
});

Element.prototype.scrollIntoView = vi.fn();
