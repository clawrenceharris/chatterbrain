import { CreateProfileCommand, UpdateProfileCommand } from "../types";
import { UserProfile } from "../entities";

export interface ProfileRepository {
  create(data: CreateProfileCommand): Promise<UserProfile>;
  update(userId: string, data: UpdateProfileCommand): Promise<UserProfile>;
  delete(id: string): Promise<void>;
  existsByUserId(userId: string): Promise<boolean>;
}
