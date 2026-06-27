export type CreateProfileInput = {
  userId: string;
  displayName: string | null;
  username: string;
  avatarFile?: File | null;
};
