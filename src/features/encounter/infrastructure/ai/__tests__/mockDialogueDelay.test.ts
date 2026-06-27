import { afterEach, describe, expect, it, vi } from "vitest";
import { isEncounterDialogueMockMode } from "../../../domain/session/encounter-phase-config";
import {
  mockActorResponseDelay,
  mockAnalysisDelay,
} from "../mockDialogueDelay";

describe("mockDialogueDelay", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it("skips delays when mock mode is disabled", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENCOUNTER_DIALOGUE_MOCK", "false");
    vi.useFakeTimers();

    const promise = mockActorResponseDelay(200);
    await vi.runAllTimersAsync();
    await expect(promise).resolves.toBeUndefined();
  });

  it("waits for analysis and actor response delays in mock mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_ENCOUNTER_DIALOGUE_MOCK", "true");
    vi.useFakeTimers();

    const analysisPromise = mockAnalysisDelay();
    await vi.advanceTimersByTimeAsync(799);
    let settled = false;
    void analysisPromise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await analysisPromise;
    expect(settled).toBe(true);

    const actorPromise = mockActorResponseDelay(100);
    await vi.advanceTimersByTimeAsync(2499);
    settled = false;
    void actorPromise.then(() => {
      settled = true;
    });
    await Promise.resolve();
    expect(settled).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await actorPromise;
    expect(settled).toBe(true);
  });

  it("detects mock mode from env", () => {
    vi.stubEnv("NEXT_PUBLIC_ENCOUNTER_DIALOGUE_MOCK", "true");
    expect(isEncounterDialogueMockMode()).toBe(true);
  });
});
