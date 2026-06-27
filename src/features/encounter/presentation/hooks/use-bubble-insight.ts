"use client";

import { useCallback, useState } from "react";
import { useStreamingText } from "./use-streaming-text";
import {
  mockGetBetterResponse,
  mockGetFeedback,
} from "../../infrastructure/ai/mock-analysis-service";

/**
 * Manages the loading → streaming lifecycle for one analysis step's
 * "Feedback" and "Better Response" AI insights.
 */
export function useBubbleInsight(actorContent: string, userContent: string) {
  const [feedbackRaw, setFeedbackRaw] = useState<string | null>(null);
  const [betterRaw, setBetterRaw] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [isLoadingBetter, setIsLoadingBetter] = useState(false);

  const { displayed: feedbackText, isStreaming: isFeedbackStreaming } =
    useStreamingText(feedbackRaw);

  const { displayed: betterText, isStreaming: isBetterStreaming } =
    useStreamingText(betterRaw);

  const requestFeedback = useCallback(async () => {
    if (feedbackRaw !== null || isLoadingFeedback) return;
    setIsLoadingFeedback(true);
    try {
      const result = await mockGetFeedback(userContent);
      setFeedbackRaw(result);
    } finally {
      setIsLoadingFeedback(false);
    }
  }, [feedbackRaw, isLoadingFeedback, userContent]);

  const requestBetterResponse = useCallback(async () => {
    if (betterRaw !== null || isLoadingBetter) return;
    setIsLoadingBetter(true);
    try {
      const result = await mockGetBetterResponse(actorContent, userContent);
      setBetterRaw(result);
    } finally {
      setIsLoadingBetter(false);
    }
  }, [betterRaw, isLoadingBetter, actorContent, userContent]);

  return {
    feedbackText,
    isFeedbackStreaming,
    isLoadingFeedback,
    hasFeedback: feedbackRaw !== null,
    betterText,
    isBetterStreaming,
    isLoadingBetter,
    hasBetter: betterRaw !== null,
    requestFeedback,
    requestBetterResponse,
  };
}
