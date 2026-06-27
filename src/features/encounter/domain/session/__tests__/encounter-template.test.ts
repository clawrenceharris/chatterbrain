import { describe, expect, it } from "vitest";
import type { EncounterPageOutput } from "../../../application/dto";
import { getEncounterOpeningMessage } from "../encounter-template";

function makeEncounter(
  overrides: Partial<EncounterPageOutput> = {},
): EncounterPageOutput {
  return {
    id: "enc-1",
    title: "Test",
    status: { value: "active", label: "In progress" },
    actor: {
      id: "actor-1",
      displayName: "Alex",
      description: "A thoughtful friend",
      avatarUrl: null,
      voiceId: "default",
      personalityTraits: ["warm"],
      communicationStyle: "gentle",
    },
    variableValues: { user_name: "Caleb" },
    scenario: {
      id: "scenario-1",
      slug: "test",
      title: "Test",
      description: "",
      actorRole: "Friend",
      actorRelationshipType: "friend",
      difficulty: "easy",
      openingMessage: "Hey {{user_name}}, good to see you.",
      variables: [],
      setting: "Cafe",
      focusSkills: [],
    },
    conversationHistory: [],
    conversationPhase: null,
    ...overrides,
  };
}

describe("getEncounterOpeningMessage", () => {
  it("renders scenario template variables", () => {
    expect(
      getEncounterOpeningMessage(makeEncounter(), {
        userId: "user-1",
        username: "caleb",
        displayName: "Caleb",
        avatarUrl: "https://example.com/avatar.jpg",
        birthday: "2000-01-01",
        gender: "male",
        goals: ["improve my conversation skills", "build confidence"],
        interests: ["coding", "reading", "writing"],
        dataConsentAcceptedAt: new Date(),
        onboardingCompletedAt: new Date(),
      }),
    ).toBe("Hey Caleb, good to see you.");
  });
});
