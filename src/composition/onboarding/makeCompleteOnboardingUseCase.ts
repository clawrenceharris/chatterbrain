import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers";
import { CompleteOnboardingUseCase } from "@/features/onboarding/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCompleteOnboardingUseCase() {
  const supabase = await createServerSupabaseClient();
  const profileRepository = new PrismaProfileRepository(prisma);
  const authProvider = new SupabaseAuthProvider(supabase);
  return new CompleteOnboardingUseCase(profileRepository, authProvider);
}
