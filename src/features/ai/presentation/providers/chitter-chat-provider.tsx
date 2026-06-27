"use client";

import { askChitter } from "@/actions/ai";
import type {
  ChitterChatMessage,
  ChitterRecommendedScenario,
} from "../../application";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type ChitterThreadMessage = ChitterChatMessage & {
  id: string;
  recommendedScenarios?: ChitterRecommendedScenario[];
};

type ChitterChatContextValue = {
  ask: (question: string, currentPath?: string) => Promise<void>;
  close: () => void;
  error: string | null;
  isLoading: boolean;
  isOpen: boolean;
  messages: ChitterThreadMessage[];
  mockMode: boolean;
  open: () => void;
  setMockMode: (mockMode: boolean) => void;
  toggle: () => void;
};

const ChitterChatContext = createContext<ChitterChatContextValue | undefined>(
  undefined,
);

export function ChitterChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChitterThreadMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(
    process.env.NODE_ENV !== "production",
  );

  const ask = useCallback(
    async (question: string, currentPath?: string) => {
      const trimmedQuestion = question.trim();
      if (!trimmedQuestion || isLoading) return;

      const userMessage: ChitterThreadMessage = {
        id: createMessageId(),
        role: "user",
        content: trimmedQuestion,
      };
      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setIsOpen(true);
      setIsLoading(true);
      setError(null);

      try {
        const result = await askChitter({
          question: trimmedQuestion,
          currentPath,
          history: messages.map(({ role, content }) => ({ role, content })),
        });

        if (!result.success) {
          setError(result.error.message);
          return;
        }

        setMessages([
          ...nextMessages,
          {
            id: createMessageId(),
            role: "assistant",
            content: result.data.answer,
            recommendedScenarios: result.data.recommendedScenarios,
          },
        ]);
      } catch {
        setError("Chitter could not answer right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages],
  );

  const value = useMemo<ChitterChatContextValue>(
    () => ({
      ask,
      close: () => setIsOpen(false),
      error,
      isLoading,
      isOpen,
      messages,
      mockMode,
      open: () => setIsOpen(true),
      setMockMode,
      toggle: () => setIsOpen((current) => !current),
    }),
    [ask, error, isLoading, isOpen, messages, mockMode],
  );

  return (
    <ChitterChatContext.Provider value={value}>
      {children}
    </ChitterChatContext.Provider>
  );
}

export function useChitterChat() {
  const context = useContext(ChitterChatContext);
  if (!context) {
    throw new Error("useChitterChat must be used within a ChitterChatProvider");
  }
  return context;
}

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
