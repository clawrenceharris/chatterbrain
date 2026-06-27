import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { ScenarioTag } from "../scenario-detail";

type ScenarioPreviewCharacterCardProps = {
  actor: {
    id: string;
    displayName: string;
    role: string;
    description: string;
    avatarUrl: string | null;
    difficulty: string;
  };

  className?: string;
};

export function ScenarioPreviewCharacterCard({
  actor,
  className,
}: ScenarioPreviewCharacterCardProps) {
  const initials = actor.displayName.slice(0, 1).toUpperCase();
  return (
    <Card className={cn("overflow-hidden py-0", className)}>
      <CardHeader className="from-secondary/15 to-primary/10 via-secondary/50 relative bg-linear-to-b px-6 pt-8 pb-6 backdrop-blur-sm">
        {/* Low-opacity decorative circles and irregular shapes background */}
        <div className="absolute inset-x-0 top-0 h-[48%] bg-linear-to-br">
          <div className="bg-secondary/15 absolute bottom-6 left-8 h-14 w-32 -rotate-6 rounded-full" />
          <div className="bg-secondary/10 absolute top-12 right-8 h-32 w-32 rounded-full" />
          <div className="bg-secondary/20 absolute right-16 bottom-10 h-8 w-16 -rotate-6 rounded-full" />

          <span className="text-secondary/60 absolute top-12 left-14">✦</span>
          <span className="text-secondary/60 absolute top-16 right-24">✦</span>

          <div className="bg-card absolute -right-10 -bottom-32 -left-10 h-24 rounded-t-[100%]" />
        </div>

        <div className="relative mx-auto flex items-center justify-center">
          <Avatar className="border-muted bg-card size-32 border-4 shadow-lg">
            <div className="relative size-full overflow-hidden rounded-[999]">
              {actor.avatarUrl ? (
                <AvatarImage
                  className="size-full object-cover"
                  src={actor.avatarUrl}
                  alt={actor.displayName}
                />
              ) : null}
            </div>
            <AvatarFallback className="bg-secondary text-secondary-foreground text-4xl font-bold">
              {initials}
            </AvatarFallback>
            <AvatarBadge>
              <div className="flex-cc rounded-[999] bg-white p-1">
                <ScenarioTag
                  className="rounded-[999]"
                  label={actor.difficulty}
                  icon={<MessageCircle className="size-5" strokeWidth={2.5} />}
                  variant="difficulty"
                />
              </div>
            </AvatarBadge>
          </Avatar>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div className="text-center">
          <CardTitle className="text-foreground flex items-center justify-center gap-2 text-xl font-bold">
            {actor.displayName}
          </CardTitle>
          <span className="font-heading text-secondary text-sm leading-10">
            {actor.role}
          </span>
        </div>
        <CardDescription className="text-muted-foreground mx-auto max-w-sm text-center text-base leading-relaxed">
          {actor.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
