"use client";

import { ContentLayout } from "@/components/sidebar";
import { DomainCard } from "@/features/domain/presentation/components/ui";
import { useDomains } from "@/features/domain/presentation/hooks";
export default function DomainsPageClient() {
  const { data: domains = [] } = useDomains();

  return (
    <ContentLayout title="Social Domains">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {domains.map((domain, index) => (
          <DomainCard key={domain.id} domain={domain} index={index} />
        ))}
      </div>
    </ContentLayout>
  );
}
