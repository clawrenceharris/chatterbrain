import {
  EncounterReview,
  ConversationTurn,
  ScoreSummary,
  EncounterStatus,
} from "../value-objects";

export interface EncounterProps {
  id: string;
  scenarioId: string;
  userId: string;
  actorId: string;
  status: EncounterStatus;
  variableValues?: Record<string, unknown> | null;
  review?: EncounterReview;
  turns?: ConversationTurn[];
  summary?: ScoreSummary;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

/**
 * Persisted practice run for a scenario (resume, progress, review).
 * TODO: Add transcript JSON column mapping to ConversationMessage[] when schema grows.
 */
export class Encounter {
  withTurns(turns: ConversationTurn[]): Encounter {
    return new Encounter({
      ...this.props,
      turns,
    });
  }
  constructor(private readonly props: EncounterProps) {}

  get id() {
    return this.props.id;
  }
  get scenarioId() {
    return this.props.scenarioId;
  }
  get userId() {
    return this.props.userId;
  }
  get status() {
    return this.props.status;
  }

  get actorId() {
    return this.props.actorId;
  }
  get variableValues() {
    return this.props.variableValues;
  }
  get turns() {
    return this.props.turns;
  }
  get summary() {
    return this.props.summary;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get completedAt() {
    return this.props.completedAt;
  }

  get review() {
    return this.props.review;
  }

  markCompleted(completedAt: string): Encounter {
    return new Encounter({
      ...this.props,
      status: "completed",
      completedAt,
      updatedAt: completedAt,
    });
  }

  withSummary(summary: ScoreSummary): Encounter {
    return new Encounter({
      ...this.props,
      summary,
    });
  }
}
