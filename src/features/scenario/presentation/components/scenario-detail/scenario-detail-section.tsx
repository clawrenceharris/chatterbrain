import { cn } from "@/lib/utils";

type ScenarioDetailSectionProps = {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function ScenarioDetailSection({
  icon,
  label,
  children,
  className,
}: ScenarioDetailSectionProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="min-w-0 space-y-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/14 text-primary flex size-9 items-center justify-center rounded-full">
            {icon}
          </div>

          <h2 className="text-foreground text-lg font-semibold">{label}</h2>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
