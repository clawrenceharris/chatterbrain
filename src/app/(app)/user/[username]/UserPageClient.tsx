"use client";
import { ContentLayout } from "@/components/sidebar/content-layout";
import { ErrorState, LoadingState } from "@/components/states";
import { EmptyState } from "@/components/states/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileDetailByUsername } from "@/features/profile/presentation/hooks";
import { getUserErrorMessage } from "@/shared/utils";
import UserPageProgressSection from "../_components/progress-section";
import { UserScenariosSection } from "../_components/user-scenarios-section";

type UserPageClientProps = {
  username: string;
};

export default function UserPageClient({ username }: UserPageClientProps) {
  const { data: user, error, isLoading } = useProfileDetailByUsername(username);

  if (isLoading) {
    return (
      <ContentLayout contentContainerClassName="centered">
        <LoadingState />
      </ContentLayout>
    );
  }
  if (error) {
    return (
      <ContentLayout contentContainerClassName="centered">
        <ErrorState
          variant="card"
          title="Error loading user"
          message={getUserErrorMessage(error.message)}
        />
      </ContentLayout>
    );
  }
  if (!user) {
    return (
      <ContentLayout contentContainerClassName="centered">
        <EmptyState
          title="User not found"
          message="The user you are looking for does not exist."
        />
      </ContentLayout>
    );
  }
  return (
    <ContentLayout
      title={
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={user?.avatarUrl ?? undefined} />
            <AvatarFallback>
              {user?.displayName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">
              {user?.displayName ?? user.username}
            </h1>
            {user.displayName && (
              <p className="text-muted-foreground text-sm">{user.username}</p>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="order-1 w-full lg:order-2 lg:w-[340px] lg:shrink-0">
          <UserPageProgressSection username={username} />
        </div>
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <UserScenariosSection userId={user.userId} />
        </div>
      </div>
    </ContentLayout>
  );
}
