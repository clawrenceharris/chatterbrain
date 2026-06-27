import {
  AvatarFallback,
  AvatarImage,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui";
import { ActorCardResult } from "@/features/actor/application/dto/ActorCardResult";
type ActorCardProps = {
  actor: ActorCardResult;
} & React.ComponentProps<typeof Card>;
export function ActorCard({ actor }: ActorCardProps) {
  return (
    <Card className="border-border w-full min-w-[330px] border bg-transparent shadow-none">
      <CardHeader className="flex flex-row items-center gap-2">
        <Avatar className="size-12">
          <AvatarImage src={actor.avatarUrl ?? undefined} />
          <AvatarFallback>
            {actor.name.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{actor.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
          {actor.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
