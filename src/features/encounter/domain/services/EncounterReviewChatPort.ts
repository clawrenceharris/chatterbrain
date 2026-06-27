import type { SocialSkill } from "@/types";
import { EncounterReviewChatContext } from "../../application/dto";

export type ReviewChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ReviewChatTurnInsight = {
  feedback: string;
  betterResponse: string | null;
  criterion: SocialSkill;
  score: number;
};

export type ReviewChatAnswer = {
  answer: string;
  provider: string;
  model: string;
};

export type AnswerEncounterReviewQuestionInput = {
  context: EncounterReviewChatContext;
  question: string;
  history: ReviewChatMessage[];
};

export interface EncounterReviewChatPort {
  answerQuestion(
    input: AnswerEncounterReviewQuestionInput,
  ): Promise<ReviewChatAnswer>;
}
