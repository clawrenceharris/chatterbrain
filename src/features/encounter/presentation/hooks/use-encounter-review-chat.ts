"use client";

import { askEncounterReviewQuestion } from "@/actions/encounter";
import type { EncounterReviewChatMessage } from "../../application/dto";
import { useState } from "react";

type ReviewChatMessage = EncounterReviewChatMessage & {
  id: string;
};

type UseEncounterReviewChatOptions = {
  encounterId: string;
};

export function useEncounterReviewChat({
  encounterId,
}: UseEncounterReviewChatOptions) {
  const [messages, setMessages] = useState<ReviewChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockMode, setMockMode] = useState(
    process.env.NODE_ENV !== "production",
  );

  async function ask(question: string) {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;

    const userMessage: ReviewChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedQuestion,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setIsLoading(true);
    setError(null);

    try {
      const result = await askEncounterReviewQuestion({
        encounterId,
        question: trimmedQuestion,
        history: messages.map(({ role, content }) => ({ role, content })),
      });

      if (!result.success) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      setMessages([
        ...nextMessages,
        {
          id: createMessageId(),
          role: "assistant",
          content: result.data.answer,
        },
      ]);
    } catch {
      setError("Chitter could not answer right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    ask,
    error,
    isLoading,
    messages,
    mockMode,
    setMockMode,
  };
}

function createMessageId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
