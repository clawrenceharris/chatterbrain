import type {
  LlmGenerateTextInput,
  LlmGenerateTextOutput,
  LlmPort,
} from "../../domain";

export class MockLlmAdapter implements LlmPort {
  async generateText(
    input: LlmGenerateTextInput,
  ): Promise<LlmGenerateTextOutput> {
    const question =
      input.messages.findLast((message) => message.role === "user")?.content ??
      "this review";

    return {
      text: `Chitter mock: based on the current Chatterbrain context, focus on one specific next step and try a clearer follow-up question. You asked: "${question.slice(0, 180)}"`,
      model: "mock-llm",
      provider: "mock",
    };
  }
}
