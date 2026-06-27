import {
  Button,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from "@/components/ui";
import { PreviewScenarioModalProps } from "@/lib/modals/types";
import {
  SampleConversationCard,
  ScenarioDetailSection,
  ScenarioTag,
} from "../scenario-detail";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useModal } from "@/components/providers";

export function PreviewScenarioModal({
  scenario,
  onCancel,
}: PreviewScenarioModalProps) {
  const { closeModal } = useModal();
  function handleStartClick() {
    router.push(`/scenarios/${scenario.id}/${scenario.slug}`);
    closeModal();
  }
  const router = useRouter();
  return (
    <DialogContent className="flex max-h-[min(900px,90vh)] min-w-[70vw] flex-col gap-0 p-0 sm:max-w-md">
      <DialogHeader className="contents space-y-0 text-left">
        <DialogTitle className="border-b px-6 py-6">
          {scenario.title}
        </DialogTitle>
        <ScrollArea className="flex flex-col overflow-hidden">
          <div>
            <DialogDescription className="bg-primary/20 text-primary p-4 font-medium">
              See the practice setup before starting. This is only a sample —
              the actual encounter changes based on your settings and replies.
            </DialogDescription>
            <div className="grid grid-cols-1 gap-6 px-4 py-5">
              <div className="relative px-4">
                <div className="space-y-4 px-3">
                  <h3 className="text-foreground mb-4 text-2xl font-bold">
                    About this scenario
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {scenario.description}
                  </p>
                  <ScenarioDetailSection
                    icon={
                      <MessageCircle className="size-5" strokeWidth={2.25} />
                    }
                    label="What you'll practice"
                  >
                    <div className="flex flex-wrap gap-2">
                      {scenario.focusSkills.map((skill) => (
                        <ScenarioTag
                          key={skill}
                          label={skill}
                          variant="domain"
                        />
                      ))}
                    </div>
                  </ScenarioDetailSection>
                  {scenario.sampleConversation?.length && scenario.actor ? (
                    <SampleConversationCard
                      messages={scenario.sampleConversation}
                      actor={scenario.actor}
                      user={{ name: "You", avatarUrl: null }}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogHeader>
      <DialogFooter className="border-t px-4 py-4">
        <Button onClick={onCancel} variant="outline">
          Close
        </Button>

        <Button onClick={handleStartClick} variant="primary">
          Start Practice
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
