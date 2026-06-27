import type { SocialSkill } from "@/types";

export type ProgressReviewItem = {
  criterion: SocialSkill;
  xpEarned: number;
};

export type ProgressEncounter = {
  id: string;
  completedAt: string | null;
  scenario: {
    id: string;
    title: string;
    slug: string;
  };
  actor: {
    displayName: string;
    avatarUrl: string | null;
  };
  reviewItems: ProgressReviewItem[];
};
