import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui";
import { UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCardResult } from "@/features/profile/application/dto";

type ProfileAvatarProps = {
  profile: ProfileCardResult | null;
  previewUrl?: string | null;
} & React.ComponentProps<typeof Avatar>;
export function ProfileAvatar({
  profile,
  previewUrl,
  className,
  ...props
}: ProfileAvatarProps) {
  return (
    <Avatar
      className={cn(
        "border-muted-background size-full rounded-full border object-cover",
        className,
      )}
      {...props}
    >
      <AvatarImage
        src={previewUrl ?? profile?.avatarUrl ?? undefined}
        className="object-cover"
        key={previewUrl}
      />
      <AvatarFallback className="rounded-full text-xl group-hover:hidden">
        {profile ? (
          (profile?.displayName?.charAt(0).toUpperCase() ??
          profile?.username.charAt(0).toUpperCase())
        ) : (
          <UserIcon className="text-muted-foreground size-8" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
