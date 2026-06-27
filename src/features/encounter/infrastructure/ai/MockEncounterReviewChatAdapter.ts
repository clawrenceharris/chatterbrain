import type {
  AnswerEncounterReviewQuestionInput,
  EncounterReviewChatPort,
  ReviewChatAnswer,
} from "../../domain/services";

export class MockEncounterReviewChatAdapter implements EncounterReviewChatPort {
  async answerQuestion(
    input: AnswerEncounterReviewQuestionInput,
  ): Promise<ReviewChatAnswer> {
    const firstInsight = Object.values(
      input.context.review?.turnInsights ?? {},
    )[0];
    const skill = firstInsight?.criterion
      ? firstInsight.criterion.toLowerCase().replaceAll("_", " ")
      : "clarity";

    return {
      answer: `Chitter mock: for "${input.context.scenario.title}", I would focus your next practice on ${skill}. Try revisiting one user turn, adding one concrete detail, and ending with a follow-up question that keeps ${input.context.actor.displayName} engaged.`,
      provider: "mock",
      model: "mock-review-chat",
    };
  }
}
