interface UserProfileProps {
  userId: string;
  displayName: string | null;
  username: string;
  avatarUrl: string | null;
}

export class UserProfile {
  constructor(private readonly props: UserProfileProps) {}

  get username() {
    return this.props.username;
  }

  get displayName() {
    return this.props.displayName;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get userId() {
    return this.props.userId;
  }
}
