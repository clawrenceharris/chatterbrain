import { ProfileDetailResult, ProfileCardResult } from "../../application/dto";

export interface ProfileReadRepository {
  findProfileCard(userId: string): Promise<ProfileCardResult | null>;
  findProfileDetail(userId: string): Promise<ProfileDetailResult | null>;
}
