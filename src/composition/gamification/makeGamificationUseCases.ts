import {
  GetGamificationSummaryUseCase,
  RecordPracticeActivityUseCase,
} from "@/features/gamification/application/use-cases";
import { PrismaGamificationRepository } from "@/features/gamification/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export function makeGetGamificationSummaryUseCase() {
  const repository = new PrismaGamificationRepository(prisma);
  return new GetGamificationSummaryUseCase(repository);
}

export function makeRecordPracticeActivityUseCase() {
  const repository = new PrismaGamificationRepository(prisma);
  return new RecordPracticeActivityUseCase(repository);
}
