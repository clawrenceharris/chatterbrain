import type { ScoreSummary } from "./ScoreSummary";

/** Coaching output for a single user message */
export interface UserResponseAnalysis {
  scores: ScoreSummary;
  feedback: string;
  betterResponse?: string;
}
