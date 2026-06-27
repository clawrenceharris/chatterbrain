"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Streams a string character-by-character when `text` changes from null to a string.
 * Pass null to reset.
 */
export function useStreamingText(text: string | null, charIntervalMs = 16) {
  const [displayed, setDisplayed] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (text === null) {
      setDisplayed("");
      setIsStreaming(false);
      return;
    }

    setDisplayed("");
    setIsStreaming(true);
    let i = 0;

    intervalRef.current = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        setIsStreaming(false);
      }
    }, charIntervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, charIntervalMs]);

  return { displayed, isStreaming };
}
