import { describe, expect, it } from "vitest";
import {
  buildEncounterActorPrompt,
  buildEncounterAnalysisPrompt,
  getDifficultyBehaviorGuidance,
} from "../buildEncounterActorPrompt";
import type { EncounterMachineContext } from "../../../domain/types/encounter-machine-context";
import { Difficulty } from "@/types";

function makeContext(
  difficulty: string,
  overrides: Partial<EncounterMachineContext> = {},
): EncounterMachineContext {
  return {
    encounter: {
      id: "enc-1",
      title: "Test",
      status: { value: "active", label: "In progress" },
      actor: {
        id: "actor-1",
        displayName: "Jordan",
        description: "Direct and observant.",
        avatarUrl: null,
        voiceId: "default",
        personalityTraits: ["direct"],
        communicationStyle: "casual",
      },
      variableValues: null,
      scenario: {
        id: "scenario-1",
        slug: "test",
        title: "Coffee chat",
        description: "",
        actorRole: "Coworker",
        actorRelationshipType: "coworker",
        difficulty,
        openingMessage: null,
        variables: [],
        setting: "Office break room",
        focusSkills: ["CLARITY"],
      },
      conversationHistory: [],
      conversationPhase: null,
    },
    userProfile: {
      userId: "user-1",
      username: "caleb",
      displayName: "Caleb",
    } as EncounterMachineContext["userProfile"],
    variableValues: {},
    responses: [],
    conversationHistory: [
      {
        id: "1",
        speaker: "actor",
        content: "Hey, got a minute?",
        phase: "introduction",
      },
      {
        id: "2",
        speaker: "user",
        content: "banana helicopter purple Tuesday",
        phase: "introduction",
      },
    ],
    currentPhase: "introduction",
    currentActorResponse: {
      content: "Hey, got a minute?",
      userResponseOptions: [],
    },
    currentUserInput: "banana helicopter purple Tuesday",
    totalScores: {},
    ...overrides,
  };
}

describe("buildEncounterActorPrompt", () => {
  it("requires realistic reactions to unclear user input", () => {
    const prompt = buildEncounterActorPrompt({
      context: makeContext(Difficulty.REALISTIC),
      actorMessageCount: 1,
      phaseGuidance: "Maintain the current phase.",
    });

    expect(prompt).toContain("do NOT invent meaning");
    expect(prompt).toContain("Garbled speech-to-text is common");
    expect(prompt).toContain("Do not smooth over nonsense");
  });

  it("keeps gentle difficulty forgiving without pretending nonsense made sense", () => {
    const prompt = getDifficultyBehaviorGuidance(Difficulty.GENTLE);

    expect(prompt).toContain("patient");
    expect(prompt).toContain(
      "never pretend garbled or nonsensical input made sense",
    );
  });

  it("makes realistic difficulty stricter than gentle", () => {
    const gentle = getDifficultyBehaviorGuidance("Gentle");
    const realistic = getDifficultyBehaviorGuidance("REALISTIC");

    expect(gentle).toContain("patient");
    expect(realistic).toContain("Do not smooth over nonsense");
  });
});

describe("buildEncounterAnalysisPrompt", () => {
  it("penalizes nonsensical user input in scoring guidance", () => {
    const prompt = buildEncounterAnalysisPrompt(
      "banana helicopter purple Tuesday",
      makeContext(Difficulty.REALISTIC),
    );

    expect(prompt).toContain("nonsensical, garbled, off-topic");
    expect(prompt).toContain("Do not give high scores for improvised meaning");
  });
});
