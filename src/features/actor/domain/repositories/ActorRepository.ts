import { Actor } from "../entities";
export interface ActorRepository {
  createActor(actor: Actor): Promise<Actor>;
  updateActor(actor: Actor): Promise<Actor>;
  deleteActor(id: string): Promise<void>;
}
