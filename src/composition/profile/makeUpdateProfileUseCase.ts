import { UpdateProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseUserAvatarStorage } from "@/features/profile/infrastructure/storage";
import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeUpdateProfileUseCase() {
  const profileRepository = new PrismaProfileRepository(prisma);
  const supabase = await createServerSupabaseClient();
  const avatarStorage = new SupabaseUserAvatarStorage(supabase);
  return new UpdateProfileUseCase(profileRepository, avatarStorage);
}
