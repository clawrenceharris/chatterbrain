import { UpdateProfileFormValues } from "@/lib/validation/profile";

export type UpdateProfileInput = {
  userId: string;
} & UpdateProfileFormValues;
