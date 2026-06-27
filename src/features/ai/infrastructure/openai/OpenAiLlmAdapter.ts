import OpenAI from "openai";
import type {
  LlmGenerateTextInput,
  LlmGenerateTextOutput,
  LlmPort,
} from "../../domain";

const DEFAULT_MODEL = "gpt-4o-mini";

export class OpenAiLlmAdapter implements LlmPort {
  async generateText(
    input: LlmGenerateTextInput,
  ): Promise<LlmGenerateTextOutput> {
    if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_PROJECT_ID) {
      throw new Error("Missing OpenAI environment variables");
    }

    const model = input.model ?? DEFAULT_MODEL;
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      project: process.env.OPENAI_PROJECT_ID,
    });

    const response = await client.responses.create({
      model,
      input: input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      temperature: input.temperature ?? 0.4,
      max_output_tokens: input.maxOutputTokens ?? 700,
      metadata: input.metadata,
    });

    return {
      text: response.output_text,
      model,
      provider: "openai",
    };
  }
}
