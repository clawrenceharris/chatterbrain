import type { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

import { AuthProvider } from "../../domain/services/AuthProvider";
import { mapSupabaseAuthError } from "../mappers/mapErrors";

function appOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export class SupabaseAuthProvider implements AuthProvider {
  constructor(private readonly client: SupabaseClient) {}

  async getUserId(): Promise<string | null> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error) throw mapSupabaseAuthError(error);
    return user?.id ?? null;
  }
  
  async getUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error) throw mapSupabaseAuthError(error);
    
    return user;
  }
  async signInWithEmail(email: string, password: string): Promise<User> {
    const { error, data } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw mapSupabaseAuthError(error);
    return data.user;
  }

  async signUp(email: string, password: string): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.client.auth.signUp({
      email,
      password
    });
    if (error) throw mapSupabaseAuthError(error);
    return user;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw mapSupabaseAuthError(error);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${appOrigin()}/auth/update-password`,
    });
    if (error) throw mapSupabaseAuthError(error);
  }

  async resetPassword(newPassword: string, token: string): Promise<void> {
    void token;
    const { error } = await this.client.auth.updateUser({
      password: newPassword,
    });
    if (error) throw mapSupabaseAuthError(error);
  }
  

}


