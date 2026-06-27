export type EncounterContext = {
  sessionId?: string;
  actorId?: string;
  messages?: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  avatarUrl: string | null;
  speakerId: string;
  speakerName: string;
  role: "user" | "actor";
  content: string;
  createdAt: string;
};
