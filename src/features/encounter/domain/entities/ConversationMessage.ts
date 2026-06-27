import type { ConversationPhase } from "../value-objects/ConversationPhase";
import type { UserResponseAnalysis } from "../value-objects/UserResponseAnalysis";

export type MessageSpeaker = "user" | "actor";

export interface ConversationMessageProps {
  id: string;
  speaker: MessageSpeaker;
  content: string;
  phase: ConversationPhase;
  analysis?: UserResponseAnalysis;
}

/** Single line in the scene transcript */
export class ConversationMessage {
  constructor(private readonly props: ConversationMessageProps) {}

  get id() {
    return this.props.id;
  }
  get speaker() {
    return this.props.speaker;
  }
  get content() {
    return this.props.content;
  }
  get phase() {
    return this.props.phase;
  }
  get analysis() {
    return this.props.analysis;
  }

  static create(
    props: Omit<ConversationMessageProps, "id"> & { id?: string },
  ): ConversationMessage {
    return new ConversationMessage({
      ...props,
      id: props.id ?? crypto.randomUUID(),
    });
  }
}
