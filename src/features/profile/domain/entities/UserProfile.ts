interface UserProfileProps {
  userId: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

export class UserProfile {
  constructor(private readonly props: UserProfileProps) {}

  get firstName() {
    return this.props.firstName;
  }

  get fullName() {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get lastName() {
    return this.props.lastName;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get userId() {
    return this.props.userId;
  }
}
