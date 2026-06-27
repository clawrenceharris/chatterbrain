import { SocialSkill } from "@/types";

export const CORE_SOCIAL_SKILLS = [
  SocialSkill.EMPATHY,
  SocialSkill.ASSERTIVENESS,
  SocialSkill.CLARITY,
  SocialSkill.ENGAGEMENT,
  SocialSkill.SOCIAL_AWARENESS,
  SocialSkill.SETTING_BOUNDARIES,
] as const;

export type CoreSocialSkill = (typeof CORE_SOCIAL_SKILLS)[number];

export const SOCIAL_SKILL_LABELS: Record<SocialSkill, string> = {
  [SocialSkill.EMPATHY]: "Empathy",
  [SocialSkill.ASSERTIVENESS]: "Assertiveness",
  [SocialSkill.CLARITY]: "Clarity",
  [SocialSkill.ENGAGEMENT]: "Engagement",
  [SocialSkill.SOCIAL_AWARENESS]: "Social awareness",
  [SocialSkill.SETTING_BOUNDARIES]: "Setting boundaries",
  [SocialSkill.REPAIR]: "Repair",
  [SocialSkill.CUE_RECOGNITION]: "Cue recognition",
  [SocialSkill.SMALL_TALK]: "Small talk",
  [SocialSkill.CONFLICT_NAVIGATION]: "Conflict navigation",
  [SocialSkill.EMOTIONAL_RECOGNITION]: "Emotional recognition",
  [SocialSkill.RELEVANCE]: "Relevance",
  [SocialSkill.TONE_AWARENESS]: "Tone awareness",
  [SocialSkill.FOLLOW_UP]: "Follow-up",
  [SocialSkill.CONVERSATION_FLOW]: "Conversation flow",
  [SocialSkill.SOCIAL_TIMING]: "Social timing",
  [SocialSkill.PERSPECTIVE_TAKING]: "Perspective taking",
};
