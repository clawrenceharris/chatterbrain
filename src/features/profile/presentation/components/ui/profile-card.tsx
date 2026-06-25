import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui";
import { ProfileCardResult } from "@/features/profile/application/dto";
import { MessageCircle } from "lucide-react";

type ProfileCardProps = {
  profile: ProfileCardResult;
  encounterCount: number;
} & React.ComponentProps<typeof Card>;
export function ProfileCard({ profile, encounterCount = 0 }: ProfileCardProps) {
  return (
    <Card className="bg-transparent shadow-none">
      <CardHeader>
        <Avatar className="size-17">
          <AvatarImage src={profile.avatarUrl ?? undefined} />
          <AvatarFallback>
            {profile.firstName.charAt(0).toUpperCase()}
            {profile.lastName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="font-heading text-lg font-medium">{profile.firstName}</p>

        <span className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-[999] px-5 py-1 text-sm">
          <MessageCircle strokeWidth={2.5} className="size-4" />
          {encounterCount} {encounterCount === 1 ? "encounter" : "encounters"}
        </span>
      </CardContent>
    </Card>
  );
}
