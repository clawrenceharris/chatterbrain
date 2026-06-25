import { persist } from "zustand/middleware";
import { create } from "zustand";

export type Theme =
  | "default"
  | "brainwave"
  | "brainwashed"
  | "brainstorm"
  | "brainiac";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "default",

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "theme-storage", // key for localStorage
      partialize: (state) => ({
        theme: state.theme,
      }),
    },
  ),
);
