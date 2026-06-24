import { LoginUserUseCase } from "@/features/auth/application/use-cases/LoginUserUseCase";
import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers/SupabaseAuthProvider";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeLoginUserUseCase() {
  const supabase = await createServerSupabaseClient();
  const authProvider = new SupabaseAuthProvider(supabase);
  return new LoginUserUseCase(authProvider);
};   