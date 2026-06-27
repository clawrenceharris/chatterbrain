import { CompleteEncounterUseCase } from "@/features/encounter/application/use-cases/CompleteEncounterUseCase";
import { PrismaEncounterRepository } from "@/features/encounter/infrastructure/repositories";
import { OpenAIEncounterReviewAdapter } from "@/features/encounter/infrastructure/ai/OpenAIEncounterReviewAdapter";
import { prisma } from "@/lib/db/prisma";

export function makeCompleteEncounterUseCase() {
  const encounterRepository = new PrismaEncounterRepository(prisma);
  const encounterReviewPort = new OpenAIEncounterReviewAdapter();
  return new CompleteEncounterUseCase(encounterRepository, encounterReviewPort);
}
