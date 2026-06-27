function readEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/** Tunable encounter pacing — override via NEXT_PUBLIC_ENCOUNTER_* env vars. */
export const ENCOUNTER_PHASE_LIMITS = {
  minIntroductionUserTurns: readEnvInt(
    "NEXT_PUBLIC_ENCOUNTER_MIN_INTRO_TURNS",
    1,
  ),
  minMainTopicUserTurns: readEnvInt(
    "NEXT_PUBLIC_ENCOUNTER_MIN_MAIN_TOPIC_TURNS",
    2,
  ),
  minWrapUpUserTurns: readEnvInt("NEXT_PUBLIC_ENCOUNTER_MIN_WRAP_UP_TURNS", 1),
  maxUserTurnsBeforeForcedWrapUp: readEnvInt(
    "NEXT_PUBLIC_ENCOUNTER_FORCE_WRAP_UP_USER_TURNS",
    10,
  ),
  maxUserTurns: readEnvInt("NEXT_PUBLIC_ENCOUNTER_MAX_USER_TURNS", 14),
} as const;

export function isEncounterDialogueMockMode(): boolean {
  return process.env.NEXT_PUBLIC_ENCOUNTER_DIALOGUE_MOCK === "true";
}
