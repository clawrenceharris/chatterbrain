import { fail, ok, Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { EncounterPageAssembler } from "../assemblers/EncounterPageAssembler";
import { EncounterReadRepository } from "../../domain/repositories";
import { AppErrorCode } from "@/types";
import {
  EncounterPageActor,
  EncounterPageOutput,
  GetEncounterPageInput,
} from "../dto";

export type GetEncounterPageUseCaseResult = Result<
  EncounterPageOutput | null,
  ApplicationError
>;

export interface EncounterPageActorRepository {
  findDefaultActor(encounterId: string): Promise<EncounterPageActor | null>;
  findById(actorId: string): Promise<EncounterPageActor | null>;
}

export class GetEncounterPageUseCase {
  constructor(
    private readonly encounterRepository: EncounterReadRepository,
    private readonly actorRepository: EncounterPageActorRepository,
  ) {}

  async execute(
    input: GetEncounterPageInput,
  ): Promise<GetEncounterPageUseCaseResult> {
    try {
      const { encounterId, actorId, userId } = input;
      const encounter =
        await this.encounterRepository.findEncounterDetailById(encounterId);

      if (!encounter) {
        return fail(
          new ApplicationError({
            code: AppErrorCode.RESOURCE_NOT_FOUND,
            message: "Encounter not found",
          }),
        );
      }

      const [actor, defaultValues] = await Promise.all([
        encounter.actor
          ? await this.actorRepository.findById(encounter.actor.id)
          : actorId
            ? await this.actorRepository.findById(actorId)
            : await this.actorRepository.findDefaultActor(
                encounter.scenario.id,
              ),
        this.encounterRepository.findDefaultVariableValuesForEncounter(userId),
      ]);
      if (!actor) {
        return fail(
          new ApplicationError({
            code: AppErrorCode.RESOURCE_NOT_FOUND,
            message: "An actor was not found for this encounter.",
          }),
        );
      }
      return ok(
        EncounterPageAssembler.toPageOutput({
          id: encounter.id,
          status: encounter.status,
          title: encounter.title,
          actor: {
            id: actor.id,
            displayName: actor.displayName,
            avatarUrl: actor.avatarUrl,
            voiceId: actor.voiceId,
            description: actor.description,
            personalityTraits: actor.personalityTraits,
            communicationStyle: actor.communicationStyle,
          },
          createdAt: encounter.createdAt,
          scenario: encounter.scenario,
          variableValues: { ...defaultValues, ...encounter.variableValues },
          turns: encounter.turns,
          conversationHistory: encounter.conversationHistory,
          conversationPhase: encounter.conversationPhase,
        }),
      );
    } catch (error) {
      console.error("Error getting encounter page:", error);
      return fail(normalizeError(error));
    }
  }
}
