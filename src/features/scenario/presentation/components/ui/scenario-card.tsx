"use client";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { useModals } from "@/hooks/use-modals";
import { ScenarioCardResult } from "@/features/scenario/application/dto/ScenarioCardResult";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/providers";
import { useScenarioPreview } from "../../hooks";
import { toast } from "sonner";

interface ScenarioCardProps extends React.ComponentProps<typeof Card> {
  scenario: ScenarioCardResult;
}

export function ScenarioCard({ scenario, className }: ScenarioCardProps) {
  const {
    modals: { "preview-scenario": previewScenarioModal },
  } = useModals();
  const { user } = useUser();
  const router = useRouter();
  const { data: scenarioPreview } = useScenarioPreview(scenario.id, user.id);
  function handlePreviewClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!scenarioPreview) {
      toast.error("Failed to load scenario preview");
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    previewScenarioModal.open({
      scenario: scenarioPreview,
      userId: user.id,
    });
  }
  function handleClick() {
    router.push(`/scenarios/${scenario.id}/${scenario.slug}`);
  }
  return (
    <Card
      className={cn(
        "group/scenario-card relative w-full min-w-[330px] cursor-pointer rounded-md shadow-none transition-all",
        className,
      )}
      tabIndex={0}
      aria-label={`View scenario: ${scenario.title}`}
      onClick={handleClick}
    >
      <span
        aria-hidden
        className="bg-primary-300/80 absolute bottom-0 left-0 z-20 h-[5px] w-full opacity-0 group-focus-within/scenario-card:opacity-100 group-hover/scenario-card:opacity-100"
      />
      <CardHeader>
        <div>
          {scenario.actor && (
            <div className="flex flex-1 items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="overflow-hidden">
                  <AvatarImage src={scenario.actor.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {scenario.actor.displayName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flexflex-col gap-1">
                  <p className="font-heading text-sm leading-none font-medium">
                    {scenario.actor.displayName}
                  </p>
                  <p className="font-heading text-muted-foreground max-w-[85%] truncate text-sm leading-none">
                    {scenario.actor.role}
                  </p>
                </div>
              </div>
              <span className="text-success bg-success/20 rounded-full px-2 py-1 text-center text-xs font-semibold">
                {scenario.difficulty}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle
          title={scenario.title}
          className="line-clamp-2 max-w-[85%] flex-1 truncate text-lg font-semibold"
        >
          {scenario.title}
        </CardTitle>
        <CardDescription
          className="line-clamp-2 wrap-break-word"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
          }}
        >
          {scenario.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="justify-end">
        <div className="flex items-center gap-2">
          <CardAction>
            <Button size="sm" onClick={handlePreviewClick} variant="muted">
              <Eye strokeWidth={3} className="size-4.5" />
              Preview
            </Button>
          </CardAction>
        </div>
      </CardFooter>
    </Card>
  );
}
