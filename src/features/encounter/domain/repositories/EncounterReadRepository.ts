import {
  EncounterDetailResult,
  EncounterReviewChatContext,
  EncounterWithResults,
} from "../../application/dto";
import { EncounterCardResult } from "../../application/dto/EncounterCardResult";
import { Encounter } from "../entities";

export interface EncounterReadRepository {
  findDefaultVariableValuesForEncounter(
    userId: string,
  ): Promise<Record<string, string> | null>;
  findEncounterDetailByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<EncounterDetailResult | null>;
  findEncountersByUserId(userId: string): Promise<EncounterCardResult[]>;
  findAllEncounters(): Promise<EncounterCardResult[]>;
  findEncounterCardById(id: string): Promise<EncounterCardResult | null>;
  findEncounterDetailById(id: string): Promise<EncounterDetailResult | null>;
  findEncounterResults(id: string): Promise<EncounterWithResults | null>;
  findEncounterReviewChatContext(
    id: string,
    userId: string,
  ): Promise<EncounterReviewChatContext | null>;
  findEncounterCardByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<EncounterCardResult | null>;
  findEncounterByUserAndScenario(
    userId: string,
    scenarioId: string,
  ): Promise<Encounter | null>;
}
