import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type ScenarioActionBarProps = {
  onPreviewEncounter?: () => void;
  onResume?: () => void;
  scenario: {
    lastReviewEncounter: {
      id: string;
    } | null;
    resumeEncounter: {
      id: string;
    } | null;
  };
};
export function ScenarioActionBar({
  onPreviewEncounter,
}: ScenarioActionBarProps) {
  return (
    <div className="border-border/70 flex flex-wrap gap-3 border-b py-4">
      <Button variant="muted" onClick={onPreviewEncounter}>
        <Eye />
        Preview
      </Button>
    </div>
  );
}
