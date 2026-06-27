export type LlmMessageRole = "system" | "user" | "assistant";

export type LlmMessage = {
  role: LlmMessageRole;
  content: string;
};

export type LlmGenerateTextInput = {
  messages: LlmMessage[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  metadata?: Record<string, string>;
};

export type LlmGenerateTextOutput = {
  text: string;
  model: string;
  provider: string;
};

export interface LlmPort {
  generateText(input: LlmGenerateTextInput): Promise<LlmGenerateTextOutput>;
}
