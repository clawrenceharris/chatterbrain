import { ScenarioReadRepository } from "../../domain/repositories";
import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils";
import {
  ListScenariosResult,
  ScenarioCardResult,
  ScenarioDetailResult,
} from "../dto";
import { ScenarioLike, ScenarioSave } from "../../domain/value-objects";
import { getCurrentUser } from "@/actions/auth";

export class ScenarioReadService {
  async getScenarioBySlug(
    slug: string,
  ): Promise<Result<ScenarioCardResult | null>> {
    try {
      const scenario = await this.repository.findScenarioCardBySlug(slug);
      return ok(scenario);
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }
  constructor(private readonly repository: ScenarioReadRepository) {}
  async getScenarioLikes(scenarioId: string): Promise<Result<ScenarioLike[]>> {
    try {
      const likes = await this.repository.findScenarioLikes(scenarioId);
      return ok(likes);
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }
  async getScenarioSavesByUser(
    scenarioId: string,
  ): Promise<Result<ScenarioSave[]>> {
    try {
      const userResult = await getCurrentUser();
      if (!userResult.success) {
        return fail(normalizeError(userResult.error));
      }
      const userId = userResult.data?.id;
      if (!userId) {
        return fail(ApplicationError.unexpected("User not found"));
      }
      const saves = await this.repository.findScenarioSavesByUser(
        scenarioId,
        userId,
      );
      return ok(saves);
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }
  async getScenarioDetailById(
    id: string,
  ): Promise<Result<ScenarioDetailResult | null>> {
    try {
      const scene = await this.repository.findScenarioDetailById(id);
      return ok(scene);
    } catch (error) {
      console.error(error);
      return fail(normalizeError(error));
    }
  }

  async listScenarios(): Promise<Result<ListScenariosResult>> {
    try {
      const scenarios = await this.repository.listScenarios();
      return ok(scenarios);
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "An unexpected error occurred while loading scenarios",
        }),
      );
    }
  }

  async listSavedScenarioCardsByUserId(
    userId: string,
  ): Promise<Result<ScenarioCardResult[]>> {
    try {
      const scenarios =
        await this.repository.listSavedScenarioCardsByUserId(userId);
      return ok(scenarios);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }

  async listCreatedScenarioCardsByUserId(
    userId: string,
  ): Promise<Result<ScenarioCardResult[]>> {
    try {
      const scenarios =
        await this.repository.listCreatedScenarioCardsByUserId(userId);
      return ok(scenarios);
    } catch (error) {
      return fail(normalizeError(error));
    }
  }
}
