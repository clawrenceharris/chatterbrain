import { describe, expect, it } from "vitest";
import {
  buildChitterReviewChatPrompt,
  buildChitterScenarioRecommendationPrompt,
} from "../surfaces";
import { Difficulty, SocialSkill } from "@/types";

describe("Chitter prompt builders", () => {
  it("includes Chitter identity and review boundaries", () => {
    const prompt = buildChitterReviewChatPrompt({
      id: "encounter-1",
      variableValues: {},
      scenario: {
        id: "scenario-1",
        slug: "practice",
        title: "Practice Conversation",
        description: "Practice a short exchange.",
        setting: "Cafe",
        difficulty: Difficulty.GENTLE,
        actorRole: "Friend",
        actorRelationshipType: "peer",
        focusSkills: [SocialSkill.CLARITY],
        userGoal: "Ask a follow-up question.",
        userRole: "Learner",
        successCriteria: {},
        variables: null,
      },
      actor: {
        id: "actor-1",
        displayName: "Jordan",
        description: "Warm and curious.",
        personalityTraits: ["warm"],
        communicationStyle: "casual",
      },
      conversationHistory: [],
      review: null,
    });

    expect(prompt).toContain("Chitter");
    expect(prompt).toContain("Do not roleplay as a scenario actor.");
    expect(prompt).toContain(
      "Answer only using the current encounter review context.",
    );
  });

  it("constrains scenario recommendations to candidate ids", () => {
    const prompt = buildChitterScenarioRecommendationPrompt({
      context: {
        question: "I want to practice conflict.",
        currentPath: "/scenarios",
      },
      candidates: [
        {
          id: "scenario-1",
          slug: "roommate-conflict",
          title: "Roommate Conflict",
          description: "Practice setting a boundary.",
          difficulty: "Gentle",
          focusSkills: ["Clarity"],
          imageUrl: null,
          hasActiveEncounter: false,
          actor: null,
        },
      ],
    });

    expect(prompt).toContain(
      "Recommend only scenarios from the candidate list.",
    );
    expect(prompt).toContain("scenario-1");
    expect(prompt).toContain("recommendedScenarioIds");
  });
});
