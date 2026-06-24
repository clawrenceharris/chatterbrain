import { createServerSupabaseClient } from "@/lib/supabase/server";

const BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET ?? "avatars";

/**
 * Uploads a profile image to Supabase Storage and returns the public URL.
 * Requires an authenticated session whose user id matches `userId`.
 * Create a public bucket (or adjust policies) named `avatars` unless
 * `NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET` is set.
 */
export async function uploadProfileAvatar(
  userId: string,
  file: File
): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user || user.id !== userId) {
    throw new Error("Unauthorized");
  }
  if (!file.size) {
    throw new Error("Empty file");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const safeExt =
    ext && /^[a-z0-9]+$/.test(ext) && ext.length <= 8 ? ext : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${safeExt}`;

  const body = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, body, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
