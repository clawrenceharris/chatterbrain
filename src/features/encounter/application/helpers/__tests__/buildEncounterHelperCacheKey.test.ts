import { describe, expect, it } from "vitest";
import { buildEncounterHelperCacheKey } from "../buildEncounterHelperCacheKey";
import type { InvokeEncounterHelperActionInput } from "../../dto/InvokeEncounterHelperDto";

const baseInput: InvokeEncounterHelperActionInput = {
  helperId: "rephraser",
  draftInput: "  um hello  ",
  conversationHistory: [
    { role: "actor", content: "Hey", speakerName: "Sam" },
    { role: "user", content: "Hi", speakerName: "You" },
  ],
  scenario: {
    title: "Coffee chat",
    setting: "Cafe",
    actorRole: "Friend",
    focusSkills: ["CLARITY"],
  },
  actor: {
    displayName: "Sam",
    personalityTraits: [],
    communicationStyle: null,
    description: "",
  },
};

describe("buildEncounterHelperCacheKey", () => {
  it("matches when draft whitespace is equivalent", () => {
    const a = buildEncounterHelperCacheKey(baseInput);
    const b = buildEncounterHelperCacheKey({
      ...baseInput,
      draftInput: "um hello",
    });

    expect(a).toBe(b);
  });

  it("changes when draft content changes", () => {
    const a = buildEncounterHelperCacheKey(baseInput);
    const b = buildEncounterHelperCacheKey({
      ...baseInput,
      draftInput: "hello there",
    });

    expect(a).not.toBe(b);
  });

  it("changes when conversation history changes", () => {
    const a = buildEncounterHelperCacheKey({
      ...baseInput,
      helperId: "response-builder",
      draftInput: undefined,
    });
    const b = buildEncounterHelperCacheKey({
      ...baseInput,
      helperId: "response-builder",
      draftInput: undefined,
      conversationHistory: [
        ...baseInput.conversationHistory,
        { role: "actor", content: "What's up?", speakerName: "Sam" },
      ],
    });

    expect(a).not.toBe(b);
  });
});
