import {
  ListScenariosResult,
  ScenarioDetailResult,
} from "../../application/dto";
import type {
  ScenarioCardResult,
  ScenarioPreviewResult,
} from "../../application/dto";
import { ScenarioLike } from "../value-objects";
import { ScenarioSave } from "../value-objects/ScenarioSave";

export interface ScenarioReadRepository {
  findScenarioCardBySlug(slug: string): Promise<ScenarioCardResult | null>;
  findScenarioLikes(scenarioId: string): Promise<ScenarioLike[]>;
  findScenarioSavesByUser(
    scenarioId: string,
    userId: string,
  ): Promise<ScenarioSave[]>;
  findScenarioDetailBySlug(slug: string): Promise<ScenarioDetailResult | null>;
  findScenarioDetailByIdForUser(
    scenarioId: string,
    userId: string,
  ): Promise<ScenarioDetailResult | null>;
  findScenarioDetailById(
    scenarioId: string,
  ): Promise<ScenarioDetailResult | null>;
  listScenarios(): Promise<ListScenariosResult>;
  listScenarioCards(): Promise<ScenarioCardResult[]>;
  findScenarioCardById(scenarioId: string): Promise<ScenarioCardResult | null>;
  findScenarioPreviewById(
    scenarioId: string,
  ): Promise<ScenarioPreviewResult | null>;
  findRelatedScenarios(
    scenarioId: string,
    limit?: number,
  ): Promise<ScenarioCardResult[]>;
  listSavedScenarioCardsByUserId(userId: string): Promise<ScenarioCardResult[]>;
  listCreatedScenarioCardsByUserId(
    userId: string,
  ): Promise<ScenarioCardResult[]>;
}
