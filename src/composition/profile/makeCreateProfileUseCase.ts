import { CreateProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseAvatarStorage } from "@/features/profile/infrastructure/storage";
import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateProfileUseCase() {
  const supabase = await createServerSupabaseClient();

  const profileRepository = new PrismaProfileRepository(prisma);
  const avatarStorage = new SupabaseAvatarStorage(supabase);
  return new CreateProfileUseCase(profileRepository, avatarStorage);
}
