import { isEncounterDialogueMockMode } from "@/features/encounter/domain/session/encounter-phase-config";

export { isEncounterDialogueMockMode };

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/** Simulates analysis latency so the typing indicator is visible in mock mode. */
export async function mockAnalysisDelay(): Promise<void> {
  if (!isEncounterDialogueMockMode()) return;
  await delay(800);
}

/** Simulates actor response latency scaled to message length. */
export async function mockActorResponseDelay(
  contentLength = 120,
): Promise<void> {
  if (!isEncounterDialogueMockMode()) return;
  const typingMs = 1000 + Math.min(contentLength * 15, 2000);
  await delay(typingMs);
}
