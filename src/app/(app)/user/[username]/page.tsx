import React from "react";
import UserPageClient from "./UserPageClient";

type UserPageProps = {
  params: Promise<{
    username: string;
  }>;
};
export default function UserPage({ params }: UserPageProps) {
  const { username } = React.use(params);
  return <UserPageClient username={username} />;
}
