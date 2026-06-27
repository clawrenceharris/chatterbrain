import { makeLlmPort } from "@/composition/ai";
import { AskEncounterReviewQuestionUseCase } from "@/features/encounter/application/use-cases";
import {
  LlmEncounterReviewChatAdapter,
  MockEncounterReviewChatAdapter,
} from "@/features/encounter/infrastructure/ai";
import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

const mockMode = process.env.NEXT_PUBLIC_ENCOUNTER_REVIEW_CHAT_MOCK === "true";
export function makeAskEncounterReviewQuestionUseCase() {
  const encounterRepository = new PrismaEncounterReadRepository(prisma);
  const reviewChatPort = mockMode
    ? new MockEncounterReviewChatAdapter()
    : new LlmEncounterReviewChatAdapter(makeLlmPort());

  return new AskEncounterReviewQuestionUseCase(
    encounterRepository,
    reviewChatPort,
  );
}
