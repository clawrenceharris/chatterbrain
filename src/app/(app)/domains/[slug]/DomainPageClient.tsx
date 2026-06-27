"use client";
import { ContentLayout } from "@/components/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useDomainPage } from "@/features/domain/presentation/hooks";
import Image from "next/image";
import { DomainPageSkeleton } from "@/features/domain/presentation/components";
import { ExternalLink, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState, ErrorState } from "@/components/states";
import { ScenarioCard } from "@/features/scenario/presentation/components/ui";
import { EncounterCard } from "@/features/encounter/presentation/components/ui/encounter-card";
import { assets } from "@/lib/constants";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DomainDetailPageProps = {
  slug: string;
};
export default function DomainPageClient({ slug }: DomainDetailPageProps) {
  const { data, isLoading, error } = useDomainPage(slug);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("scenarios");

  if (isLoading) return <DomainPageSkeleton />;
  if (error)
    return (
      <ErrorState
        variant="page"
        title="Error loading domain"
        message={error.message}
      />
    );
  if (!data) {
    return (
      <EmptyState
        variant="page"
        title="Domain not found"
        message="Sorry, the social domain you are looking for does not exist. Please try again later."
      />
    );
  }
  return (
    <ContentLayout title="Social Domains">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/domains">Social Domains</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>/</BreadcrumbSeparator>
          <BreadcrumbItem className="text-primary font-semibold">
            <BreadcrumbLink href={`/domains/${data.slug}`}>
              {data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <section className="flex flex-col gap-4 border-b p-4">
        <div className="flex flex-col gap-6 space-y-3 md:flex-row">
          <div className="from-primary/10 to-primary/17 via-primary/28 flex-cc relative size-48 w-full max-w-[200px] shrink-0 overflow-hidden rounded-lg bg-linear-to-b">
            <div className="bg-primary/15 absolute top-0 left-0 h-[36px] w-[108px] -rotate-6 rounded-full" />
            <div className="bg-primary/10 absolute right-0 -bottom-5 h-[96px] w-[96px] rounded-full" />
            <div className="bg-primary/20 absolute bottom-[20px] -left-5 h-[24px] w-[48px] -rotate-6 rounded-full" />

            <span className="text-primary/25 absolute bottom-[18px] left-[32px]">
              ✦
            </span>
            <span className="text-primary/25 absolute top-[22px] right-[26px]">
              ✦
            </span>

            <Image
              src={data.imageUrl ?? assets.chat_bubbles_sticker}
              alt={data.title}
              aria-hidden
              width={300}
              height={300}
              loading="lazy"
              className={cn("z-5 object-contain")}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-start gap-3">
              <div className="flex w-full flex-1 flex-row items-center justify-between">
                <h2
                  title={data.title}
                  className="m-0 line-clamp-1 flex-1 text-3xl font-semibold"
                >
                  {data.title}
                </h2>
                <span className="bg-secondary/10 text-secondary rounded-full px-2 py-1 text-sm">
                  {data.scenarios.length} scenarios
                </span>
              </div>

              <p className="text-muted-foreground text-md mb-4 line-clamp-2 flex-1">
                {data.description}
              </p>
            </div>
          </div>
        </div>
        <Separator />

        {data.relatedDomains.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Globe className="text-primary size-5" />
              <h3 className="text-sm">Related Domains</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {data.relatedDomains.map((domain) => (
                <Button
                  onClick={() => router.push(`/domains/${domain.slug}`)}
                  key={domain.id}
                  className="text-primary border-primary/50 bg-primary/15 hover:bg-primary/10 rounded-full px-2 py-0 text-xs"
                >
                  <ExternalLink />
                  {domain.title}
                </Button>
              ))}
            </div>
          </div>
        )}
      </section>
      <Separator />

      <Tabs className="mt-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line">
          <TabsTrigger value="scenarios">All scenarios</TabsTrigger>
          <TabsTrigger value="quick-rounds">Quick rounds</TabsTrigger>
          <TabsTrigger value="encounters">Encounters</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <div className="grid grid-cols-1 gap-4 py-7 md:grid-cols-2 lg:grid-cols-3">
            {data.scenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="quick-rounds" className="min-h-[230px]">
          <div className="flex h-full w-full items-center justify-start">
            <EmptyState
              variant="item"
              className="bg-muted/70 mx-0"
              showImage={false}
              title="Quick rounds coming soon"
              message="We are working on adding quick rounds to this domain. Please check back soon."
            />
          </div>
        </TabsContent>
        <TabsContent value="encounters" className="min-h-[230px]">
          {data.encounters.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.encounters.map((encounter) => (
                <EncounterCard key={encounter.id} encounter={encounter} />
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-start">
              <EmptyState
                variant="item"
                showImage={false}
                className="bg-muted/70 mx-0"
                title="No encounters found"
                message="You haven't started any encounters in this social domain. When you do, you'll be able to see them here."
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </ContentLayout>
  );
}
