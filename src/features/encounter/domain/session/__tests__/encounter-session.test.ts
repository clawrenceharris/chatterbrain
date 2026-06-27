import { describe, expect, it } from "vitest";
import type { ConversationMessageProps } from "../../entities/ConversationMessage";
import type { EncounterPageOutput } from "../../../application/dto";
import { deriveSessionFromEncounter } from "../encounter-session";

function turn(
  speaker: "user" | "actor",
  phase: ConversationMessageProps["phase"],
  content = "message",
): ConversationMessageProps {
  return {
    id: crypto.randomUUID(),
    speaker,
    phase,
    content,
  };
}

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
      description: "",
      avatarUrl: null,
      voiceId: "default",
      personalityTraits: [],
      communicationStyle: null,
    },
    variableValues: null,
    scenario: {
      id: "scenario-1",
      slug: "test",
      title: "Test",
      description: "",
      actorRole: "Friend",
      actorRelationshipType: "friend",
      difficulty: "easy",
      openingMessage: null,
      variables: [],
      setting: "Cafe",
      focusSkills: [],
    },
    conversationHistory: [],
    conversationPhase: null,
    ...overrides,
  };
}

describe("deriveSessionFromEncounter", () => {
  it("starts fresh encounters in needs_start", () => {
    expect(deriveSessionFromEncounter(makeEncounter())).toEqual({
      status: "needs_start",
      history: [],
      phase: "introduction",
      totalScores: expect.any(Object),
    });
  });

  it("waits for user input when the actor spoke last in wrap_up", () => {
    const history = [
      turn("actor", "introduction", "Hello"),
      turn("user", "introduction", "Hi"),
      turn("actor", "main_topic", "Let's talk"),
      turn("user", "main_topic", "Sure"),
      turn("actor", "wrap_up", "Great chat"),
    ];

    const session = deriveSessionFromEncounter(
      makeEncounter({
        conversationHistory: history,
        conversationPhase: "wrap_up",
      }),
    );

    expect(session.status).toBe("awaiting_user");
    expect(session.phase).toBe("wrap_up");
    expect(session.currentActorResponse).toEqual({
      content: "Great chat",
      userResponseOptions: [],
    });
  });

  it("continues actor generation when the user spoke last", () => {
    const history = [
      turn("actor", "introduction", "Hello"),
      turn("user", "introduction", "Hi there"),
    ];

    const session = deriveSessionFromEncounter(
      makeEncounter({
        conversationHistory: history,
        conversationPhase: "introduction",
      }),
    );

    expect(session.status).toBe("pending_actor_response");
    expect(session.phase).toBe("introduction");
    expect(session.currentUserInput).toBe("Hi there");
    expect(session.currentActorResponse?.content).toBe("Hello");
  });
});
