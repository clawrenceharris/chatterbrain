export type CreateProfileCommand = {
  userId: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
};
