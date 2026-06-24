import { RequestPasswordResetUseCase } from "@/features/auth/application/use-cases";
import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeRequestPasswordResetUseCase() {
  const supabase = await createServerSupabaseClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  return new RequestPasswordResetUseCase(authProvider);
};