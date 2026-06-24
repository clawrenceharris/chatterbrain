import { SignupUserUseCase } from "@/features/auth/application/use-cases/SignupUserUseCase";
import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers/SupabaseAuthProvider";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeSignupUserUseCase() {
  const supabase = await createServerSupabaseClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  return new SignupUserUseCase(authProvider);
};