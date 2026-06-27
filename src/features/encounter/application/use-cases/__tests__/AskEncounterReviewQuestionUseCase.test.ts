import { describe, expect, it, vi } from "vitest";
import { AskEncounterReviewQuestionUseCase } from "../AskEncounterReviewQuestionUseCase";
import type { EncounterReadRepository } from "../../../domain/repositories";
import type { EncounterReviewChatPort } from "../../../domain/services";
import { AppErrorCode, Difficulty, SocialSkill } from "@/types";
import { EncounterReviewChatContext } from "../../dto";

function createContext(): EncounterReviewChatContext {
  return {
    id: "encounter-1",
    variableValues: {},
    scenario: {
      id: "scenario-1",
      slug: "small-talk",
      title: "Small Talk",
      description: "Practice casual conversation.",
      setting: "Coffee shop",
      difficulty: Difficulty.GENTLE,
      actorRole: "Friend",
      actorRelationshipType: "peer",
      focusSkills: [SocialSkill.CLARITY],
      userGoal: "Keep the conversation going.",
      userRole: "Learner",
      successCriteria: {},
      variables: null,
    },
    actor: {
      id: "actor-1",
      displayName: "Jordan Lee",
      description: "Friendly and curious.",
      personalityTraits: ["warm"],
      communicationStyle: "casual",
    },
    conversationHistory: [
      {
        id: "turn-1",
        encounterId: "encounter-1",
        role: "user",
        speakerId: "user-1",
        speakerName: "You",
        content: "Nice weather today.",
        createdAt: new Date().toISOString(),
      },
    ],
    review: {
      summary: "You stayed engaged.",
      skillScores: { [SocialSkill.CLARITY]: 80 },
      retryMoment: null,
      turnInsights: {
        "turn-1": {
          feedback: "Clear and friendly.",
          betterResponse: "Nice weather today. Have you been outside much?",
          criterion: SocialSkill.CLARITY,
          score: 80,
        },
      },
    },
  };
}

function createUseCase() {
  const repository = {
    findEncounterReviewChatContext: vi.fn(),
  } as unknown as EncounterReadRepository;
  const chatPort = {
    answerQuestion: vi.fn(),
  } as unknown as EncounterReviewChatPort;

  return {
    repository,
    chatPort,
    useCase: new AskEncounterReviewQuestionUseCase(repository, chatPort),
  };
}

describe("AskEncounterReviewQuestionUseCase", () => {
  it("loads scoped context and returns a review chat answer", async () => {
    const { repository, chatPort, useCase } = createUseCase();
    vi.mocked(repository.findEncounterReviewChatContext).mockResolvedValue(
      createContext(),
    );
    vi.mocked(chatPort.answerQuestion).mockResolvedValue({
      answer: "Try adding one follow-up question.",
      provider: "mock",
      model: "mock-review-chat",
    });

    const result = await useCase.execute({
      encounterId: "encounter-1",
      userId: "user-1",
      question: "What should I try next?",
      history: [],
    });

    expect(repository.findEncounterReviewChatContext).toHaveBeenCalledWith(
      "encounter-1",
      "user-1",
    );
    expect(chatPort.answerQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        question: "What should I try next?",
      }),
    );
    expect(result).toEqual({
      success: true,
      data: {
        answer: "Try adding one follow-up question.",
        provider: "mock",
        model: "mock-review-chat",
      },
    });
  });

  it("rejects blank questions", async () => {
    const { useCase } = createUseCase();

    const result = await useCase.execute({
      encounterId: "encounter-1",
      userId: "user-1",
      question: "   ",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe(AppErrorCode.VALIDATION_FAILED);
    }
  });

  it("sanitizes chat history before calling the chat port", async () => {
    const { repository, chatPort, useCase } = createUseCase();
    vi.mocked(repository.findEncounterReviewChatContext).mockResolvedValue(
      createContext(),
    );
    vi.mocked(chatPort.answerQuestion).mockResolvedValue({
      answer: "History received.",
      provider: "mock",
      model: "mock-review-chat",
    });

    await useCase.execute({
      encounterId: "encounter-1",
      userId: "user-1",
      question: "Explain my score",
      history: [
        { role: "user", content: "  earlier question  " },
        { role: "assistant", content: " earlier answer " },
        { role: "assistant", content: "" },
      ],
    });

    expect(chatPort.answerQuestion).toHaveBeenCalledWith(
      expect.objectContaining({
        history: [
          { role: "user", content: "earlier question" },
          { role: "assistant", content: "earlier answer" },
        ],
      }),
    );
  });
});
