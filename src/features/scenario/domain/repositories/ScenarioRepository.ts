import {
  CreateScenarioResult,
  UpdateScenarioInput,
} from "../../application/dto";
import { CreateScenarioInput } from "../../application/dto";
import { ScenarioLike, ScenarioSave } from "../value-objects";

export type UpdateScenarioCommand = Omit<UpdateScenarioInput, "scenarioId">;
export type CreateScenarioCommand = CreateScenarioInput;
export interface ScenarioRepository {
  clearEncounterHistory(scenarioId: string, userId: string): Promise<void>;
  addScenarioLike(userId: string, scenarioId: string): Promise<ScenarioLike>;
  removeScenarioLike(userId: string, scenarioId: string): Promise<void>;
  getScenarioLike(userId: string, scenarioId: string): Promise<boolean>;
  getScenarioSave(userId: string, scenarioId: string): Promise<boolean>;
  addScenarioSave(userId: string, scenarioId: string): Promise<ScenarioSave>;
  removeScenarioSave(userId: string, scenarioId: string): Promise<void>;
  createScenario(data: CreateScenarioCommand): Promise<CreateScenarioResult>;
  updateScenario(id: string, data: UpdateScenarioCommand): Promise<void>;
  deleteScenario(id: string): Promise<void>;
}
