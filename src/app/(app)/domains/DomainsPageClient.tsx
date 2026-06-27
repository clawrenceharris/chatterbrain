"use client";

import { ContentLayout } from "@/components/sidebar";
import { DomainCard } from "@/features/domain/presentation/components/ui";
import { useDomains } from "@/features/domain/presentation/hooks";
export default function DomainsPageClient() {
  const { data: domains = [] } = useDomains();

  const classNames = [
    "bg-[#e7f7ff]",
    "bg-[#f0e7ff]",
    "bg-[#ddfbf3]",
    "bg-[#fff3d9]",
    "bg-[#e8f0ff]",
    "bg-[#f6e7ff]",
    "bg-[#e7f7ff]",
    "bg-[#f0e7ff]",
    "bg-[#ddfbf3]",
    "bg-[#fff3d9]",
    "bg-[#e8f0ff]",
    "bg-[#f6e7ff]",
    "bg-[#e7f7ff]",
    "bg-[#f0e7ff]",
    "bg-[#ddfbf3]",
  ];
  const domainCards = domains.map((domain, index) => ({
    domain,
    className: classNames[index],
  }));

  return (
    <ContentLayout title="Social Domains">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {domainCards.map((card) => (
          <DomainCard
            key={card.domain.id}
            domain={card.domain}
            className={card.className}
          />
        ))}
      </div>
    </ContentLayout>
  );
}
