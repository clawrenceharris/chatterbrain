import { Actor } from "../entities";
import type {
  ActorDetailResult,
  ActorListItemResult,
} from "../../application/dto";

export interface ActorReadRepository {
  findDetailById(id: string): Promise<ActorDetailResult | null>;
  findAll(): Promise<Actor[]>;
  listAll(): Promise<ActorListItemResult[]>;
}
