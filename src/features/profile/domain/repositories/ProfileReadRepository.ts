import { ProfileDetailResult, ProfileCardResult } from "../../application/dto";

export interface ProfileReadRepository {
  findProfileCardById(userId: string): Promise<ProfileCardResult | null>;
  findProfileDetailById(userId: string): Promise<ProfileDetailResult | null>;
  findProfileDetailByUsername(
    username: string,
  ): Promise<ProfileDetailResult | null>;
}
