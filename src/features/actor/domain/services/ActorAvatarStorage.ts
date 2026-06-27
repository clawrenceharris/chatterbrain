export interface ActorAvatarStorage {
  upload(input: { actorSlug: string; file: File }): Promise<{
    path: string;
    url: string | null;
  }>;
  getAvatarUrl(slug: string): string;
  remove(path: string): Promise<void>;
}
