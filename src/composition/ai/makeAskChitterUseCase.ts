import { AskChitterUseCase } from "@/features/ai/application";
import { PrismaEncounterReadRepository } from "@/features/encounter/infrastructure/repositories";
import { PrismaScenarioReadRepository } from "@/features/scenario/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { makeLlmPort } from "./makeLlmPort";
const mockMode = process.env.NEXT_PUBLIC_CHITTER_CHAT_MOCK === "true";
export function makeAskChitterUseCase() {
  return new AskChitterUseCase(
    new PrismaScenarioReadRepository(prisma),
    makeLlmPort({ mockMode }),
    new PrismaEncounterReadRepository(prisma),
  );
}
