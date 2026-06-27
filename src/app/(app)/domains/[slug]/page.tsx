import React from "react";
import DomainPageClient from "./DomainPageClient";
type DomainPageProps = {
  params: Promise<{ slug: string }>;
};
export default function DomainPage({ params }: DomainPageProps) {
  const { slug } = React.use(params);
  return <DomainPageClient slug={slug} />;
}
