import type { LlmPort } from "@/features/ai/domain";
import { MockLlmAdapter, OpenAiLlmAdapter } from "@/features/ai/infrastructure";

type MakeLlmPortOptions = {
  mockMode?: boolean;
};

export function makeLlmPort({ mockMode }: MakeLlmPortOptions = {}): LlmPort {
  if (mockMode) {
    return new MockLlmAdapter();
  }

  return new OpenAiLlmAdapter();
}
