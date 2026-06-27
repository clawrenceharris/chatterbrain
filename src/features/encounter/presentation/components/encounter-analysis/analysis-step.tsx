"use client";

import { useState } from "react";
import type { SocialSkill } from "@/types";
import { AnalysisBubbleRow } from "./analysis-bubble-row";
import { SkillScoreChip } from "./skill-score-chip";
import {
  ConversationTurn,
  UserResponseAnalysis,
} from "@/features/encounter/domain/value-objects";

type AnalysisStepProps = {
  actorMessage: ConversationTurn;
  userMessage: ConversationTurn;
  actorName: string;
  actorAvatarUrl: string | null;
  userAvatarUrl: string | null;
  defaultOpen?: boolean;
  insight?: {
    feedback: string;
    betterResponse: string | null;
    criterion: SocialSkill;
    score: number;
  };
};

export interface ConversationMessage {
  id: string;
  speaker: "user" | "actor";
  content: string;
  phase: DialoguePhase;
  analysis?: UserResponseAnalysis;
}

export type DialoguePhase =
  | "introduction"
  | "main_topic"
  | "wrap_up"
  | "completed";

export interface ActorResponse {
  content: string;
  userResponseOptions: string[];
  nextPhase?: DialoguePhase;
  contextUsed?: string[];
}
export function AnalysisStep({
  actorMessage,
  userMessage,
  actorName,
  actorAvatarUrl,
  userAvatarUrl,
  insight,
}: AnalysisStepProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showBetterResponse, setShowBetterResponse] = useState(false);

  const scores = insight ? { [insight.criterion]: insight.score } : {};
  const scoreEntries = Object.entries(scores) as [SocialSkill, number][];

  return (
    <div className="rounded-2xl border shadow-xs">
      <div className="flex flex-col gap-4 px-5 py-5">
        {/* Actor message */}
        <AnalysisBubbleRow
          role="actor"
          speakerName={actorName}
          content={actorMessage.content}
          avatarUrl={actorAvatarUrl}
          insight={{
            text: insight?.betterResponse ?? "",
            isStreaming: false,
            isLoading: false,
            hasContent: showBetterResponse && Boolean(insight?.betterResponse),
          }}
          onInsightRequest={
            insight?.betterResponse
              ? () => setShowBetterResponse(true)
              : undefined
          }
        />

        {/* User message */}
        <AnalysisBubbleRow
          role="user"
          speakerName="You"
          content={userMessage.content}
          avatarUrl={userAvatarUrl}
          insight={{
            text: insight?.feedback ?? "",
            isStreaming: false,
            isLoading: false,
            hasContent: showFeedback && Boolean(insight?.feedback),
          }}
          onInsightRequest={
            insight?.feedback ? () => setShowFeedback(true) : undefined
          }
        />

        {/* Points earned breakdown */}
        {scoreEntries.length > 0 && (
          <div className="mt-1">
            <p className="text-foreground mb-3 text-sm font-bold">
              Points Earned This Step:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {scoreEntries.map(([skill, score]) => (
                <SkillScoreChip key={skill} skill={skill} score={score} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
