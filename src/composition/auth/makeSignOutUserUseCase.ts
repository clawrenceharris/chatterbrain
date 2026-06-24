import { SignOutUserUseCase } from "@/features/auth/application/use-cases";
import { SupabaseAuthProvider } from "@/features/auth/infrastructure/providers";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeSignOutUserUseCase() {
    const supabase = await createServerSupabaseClient();
    const authProvider = new SupabaseAuthProvider(supabase);
    return new SignOutUserUseCase(authProvider);
}