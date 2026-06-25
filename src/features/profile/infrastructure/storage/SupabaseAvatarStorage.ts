import { SupabaseClient } from "@supabase/supabase-js";
import { AvatarStorage } from "../../domain/services/AvatarStorage";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "user_avatars";
export class SupabaseAvatarStorage implements AvatarStorage {
  constructor(private readonly supabase: SupabaseClient) {}
  async upload(input: {
    userId: string;
    file: File;
  }): Promise<{ path: string; url: string | null }> {
    const { userId, file } = input;
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${extension}`;
    const { data, error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, file);
    if (error) {
      throw error;
    }
    const {
      data: { publicUrl },
    } = this.supabase.storage.from("avatars").getPublicUrl(data.path);
    return { path: data.path, url: publicUrl };
  }
  async remove(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from("avatars")
      .remove([path]);
    if (error) {
      throw error;
    }
  }
}
