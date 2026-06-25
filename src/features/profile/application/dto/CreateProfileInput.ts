export type CreateProfileInput = {
  userId: string;
  firstName: string;
  lastName: string | null;
  avatarFile?: File | null;
};
