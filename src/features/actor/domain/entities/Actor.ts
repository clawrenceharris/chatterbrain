export interface ActorProps {
  id: string;
  slug: string;
  personalityTraits: string[];
  firstName: string;
  lastName: string;
  voiceId: string;
  description: string;
}

export class Actor {
  constructor(private readonly props: ActorProps) {}
  get slug() {
    return this.props.slug;
  }
  get id() {
    return this.props.id;
  }
  get personalityTraits() {
    return this.props.personalityTraits;
  }
  get firstName() {
    return this.props.firstName;
  }
  get lastName() {
    return this.props.lastName;
  }
  get voiceId() {
    return this.props.voiceId;
  }
  get description() {
    return this.props.description;
  }
}
