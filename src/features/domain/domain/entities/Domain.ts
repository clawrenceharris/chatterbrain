export interface DomainProps {
  id: string;
  slug: string;
  title: string;
  description: string | null;
}

export class Domain {
  constructor(private readonly props: DomainProps) {}

  get id() {
    return this.props.id;
  }

  get slug() {
    return this.props.slug;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }
}
