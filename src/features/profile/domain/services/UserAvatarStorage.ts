export interface UserAvatarStorage {
  upload(input: { userId: string; file: File }): Promise<{
    path: string;
    url: string | null;
  }>;

  remove(path: string): Promise<void>;
}
