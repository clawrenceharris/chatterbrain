import type { LlmPort } from "@/features/ai/domain";
import { buildChitterReviewChatPrompt } from "@/features/ai/persona";
import type {
  AnswerEncounterReviewQuestionInput,
  EncounterReviewChatPort,
  ReviewChatAnswer,
} from "../../domain/services";

export class LlmEncounterReviewChatAdapter implements EncounterReviewChatPort {
  constructor(private readonly llm: LlmPort) {}

  async answerQuestion(
    input: AnswerEncounterReviewQuestionInput,
  ): Promise<ReviewChatAnswer> {
    const response = await this.llm.generateText({
      messages: [
        {
          role: "system",
          content: buildChitterReviewChatPrompt(input.context),
        },
        ...input.history.slice(-8).map((message) => ({
          role: message.role,
          content: message.content,
        })),
        {
          role: "user",
          content: input.question,
        },
      ],
      temperature: 0.35,
      maxOutputTokens: 650,
      metadata: {
        feature: "encounter-review-chat",
        encounterId: input.context.id,
      },
    });

    return {
      answer: response.text,
      provider: response.provider,
      model: response.model,
    };
  }
}
