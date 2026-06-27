import { describe, expect, it } from "vitest";
import type { ConversationMessageProps } from "../../entities/ConversationMessage";
import {
  canCompleteEncounter,
  resolveMockPhaseAfterUserTurn,
  resolveNextPhase,
  resolveAIPhaseAfterUserTurn,
  shouldForceWrapUp,
} from "../encounter-phase";

function userTurn(
  phase: ConversationMessageProps["phase"],
  content = "message",
): ConversationMessageProps {
  return {
    id: crypto.randomUUID(),
    speaker: "user",
    phase,
    content,
  };
}

describe("encounter phase transitions", () => {
  it("does not complete until the user has spoken in wrap_up", () => {
    const history = [
      userTurn("introduction"),
      userTurn("main_topic"),
      userTurn("main_topic"),
    ];

    expect(canCompleteEncounter("main_topic", history)).toBe(false);
    expect(canCompleteEncounter("wrap_up", history)).toBe(false);

    const afterWrapUpTurn = [...history, userTurn("wrap_up")];
    expect(canCompleteEncounter("wrap_up", afterWrapUpTurn)).toBe(true);
  });

  it("advances mock encounters through phases using per-phase minimums", () => {
    const introOnly = [userTurn("introduction")];
    expect(resolveMockPhaseAfterUserTurn("introduction", introOnly)).toBe(
      "main_topic",
    );

    const oneMainTopicTurn = [...introOnly, userTurn("main_topic")];
    expect(resolveMockPhaseAfterUserTurn("main_topic", oneMainTopicTurn)).toBe(
      "main_topic",
    );

    const twoMainTopicTurns = [...oneMainTopicTurn, userTurn("main_topic")];
    expect(resolveMockPhaseAfterUserTurn("main_topic", twoMainTopicTurns)).toBe(
      "wrap_up",
    );

    const wrapUpTurn = [...twoMainTopicTurns, userTurn("wrap_up")];
    expect(
      resolveNextPhase("wrap_up", wrapUpTurn, undefined, { mockMode: true }),
    ).toBe("completed");
  });

  it("lets AI stay in main_topic until the actor suggests wrap_up", () => {
    const history = [userTurn("introduction"), userTurn("main_topic")];

    expect(
      resolveAIPhaseAfterUserTurn("main_topic", history, "main_topic"),
    ).toBe("main_topic");

    expect(resolveAIPhaseAfterUserTurn("main_topic", history, "wrap_up")).toBe(
      "main_topic",
    );

    const enoughMainTopic = [...history, userTurn("main_topic")];
    expect(
      resolveAIPhaseAfterUserTurn("main_topic", enoughMainTopic, "wrap_up"),
    ).toBe("wrap_up");
  });

  it("forces wrap_up when the conversation exceeds the soft max length", () => {
    const history = Array.from({ length: 10 }, () => userTurn("main_topic"));

    expect(shouldForceWrapUp("main_topic", history)).toBe(true);
    expect(resolveAIPhaseAfterUserTurn("main_topic", history)).toBe("wrap_up");
  });
});
