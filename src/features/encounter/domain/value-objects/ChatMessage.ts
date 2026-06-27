export interface ChatMessage {
  id: string;
  avatarUrl: string | null;
  speakerId: string;
  speakerName: string;
  role: "user" | "actor";
  content: string;
  createdAt: string;
}
