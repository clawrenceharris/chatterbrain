
export class User {
    constructor(private readonly props: {
        id: string;
        email: string;
        displayName: string | null;
        username: string;
    }) {}

    get id() {
        return this.props.id;
    }

    get email() {
        return this.props.email;
    }

    get displayName() {
        return this.props.displayName;
    }

    get username() {
        return this.props.username;
    }
}