import { SupabaseClient } from "@supabase/supabase-js";
import { ActorAvatarStorage } from "../../domain/services/ActorAvatarStorage";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "avatars";
export class SupabaseActorAvatarStorage implements ActorAvatarStorage {
  constructor(private readonly supabase: SupabaseClient) {}
  async upload(input: {
    actorSlug: string;
    file: File;
  }): Promise<{ path: string; url: string | null }> {
    const { actorSlug, file } = input;
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${actorSlug}/avatar.${extension}`;
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
  getAvatarUrl(slug: string): string {
    const { data } = this.supabase.storage
      .from(BUCKET)
      .getPublicUrl(`/${slug}.jpg`);
    return data.publicUrl;
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
