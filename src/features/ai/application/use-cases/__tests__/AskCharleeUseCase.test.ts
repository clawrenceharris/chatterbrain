import { describe, expect, it, vi } from "vitest";
import { AskChitterUseCase } from "../AskChitterUseCase";
import type { LlmPort } from "@/features/ai/domain";
import type { ScenarioReadRepository } from "@/features/scenario/domain/repositories";
import type { ScenarioCardResult } from "@/features/scenario/application/dto";
import { AppErrorCode } from "@/types";

const scenarios: ScenarioCardResult[] = [
  {
    id: "scenario-1",
    slug: "roommate-boundary",
    title: "Roommate Boundary",
    description: "Practice setting a clear boundary with a roommate.",
    difficulty: "Gentle",
    focusSkills: ["Clarity", "Setting boundaries"],
    imageUrl: null,
    hasActiveEncounter: false,
    actor: {
      id: "actor-1",
      role: "Roommate",
      displayName: "Jordan",
      avatarUrl: null,
    },
  },
  {
    id: "scenario-2",
    slug: "small-talk",
    title: "Small Talk",
    description: "Practice keeping a casual conversation moving.",
    difficulty: "Gentle",
    focusSkills: ["Follow up"],
    imageUrl: null,
    hasActiveEncounter: false,
    actor: null,
  },
];

function createUseCase(llmText: string) {
  const scenarioRepository = {
    listScenarioCards: vi.fn().mockResolvedValue(scenarios),
  } as unknown as ScenarioReadRepository;
  const llm = {
    generateText: vi.fn().mockResolvedValue({
      text: llmText,
      provider: "mock",
      model: "mock-chitter",
    }),
  } as unknown as LlmPort;

  return {
    llm,
    scenarioRepository,
    useCase: new AskChitterUseCase(scenarioRepository, llm),
  };
}

describe("AskChitterUseCase", () => {
  it("returns only real scenario recommendations from LLM ids", async () => {
    const { useCase } = createUseCase(
      JSON.stringify({
        answer: "Chitter recommends a boundary practice next.",
        recommendedScenarioIds: ["scenario-1", "fake-scenario"],
        reasonsByScenarioId: {
          "scenario-1": "It matches your conflict and clarity goal.",
        },
      }),
    );

    const result = await useCase.execute({
      question: "I need help with roommate conflict",
      userId: "user-1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.recommendedScenarios).toHaveLength(1);
      expect(result.data.recommendedScenarios[0].scenario.id).toBe(
        "scenario-1",
      );
      expect(result.data.recommendedScenarios[0].reason).toContain("clarity");
    }
  });

  it("falls back to candidate scenarios when LLM output is malformed", async () => {
    const { useCase } = createUseCase("not json");

    const result = await useCase.execute({
      question: "What should I practice next?",
      userId: "user-1",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.answer).toBe("not json");
      expect(result.data.recommendedScenarios.length).toBeGreaterThan(0);
    }
  });

  it("rejects blank questions", async () => {
    const { useCase } = createUseCase("{}");

    const result = await useCase.execute({
      question: "   ",
      userId: "user-1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe(AppErrorCode.VALIDATION_FAILED);
    }
  });
});
