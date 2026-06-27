import { cn } from "@/lib/utils";
import type { ScenarioDetailTagVariant } from "@/features/scenario/application/dto";

const tagVariantStyles: Record<ScenarioDetailTagVariant, string> = {
  category:
    "bg-primary-foreground text-primary border-primary [&_svg]:text-primary",
  domain:
    "bg-primary-foreground text-primary border-2 border-primary/20 [&_svg]:text-primary",
  difficulty: "bg-transparent border-2",
  successCriteria: "bg-transparent text-primary border-0 px-0",
  contentWarning:
    "text-warning border-warning/20 border-2 [&_svg]:text-warning w-fit",
};

type ScenarioTagProps = {
  label?: string;
  children?: React.ReactNode;
  variant?: ScenarioDetailTagVariant;
  icon?: React.ReactNode;
  className?: string;
  description?: string;
};

export function ScenarioTag({
  label,
  description,
  children,
  variant = "category",
  icon,
  className,
}: ScenarioTagProps) {
  return (
    <span
      className={cn(
        "flex cursor-default flex-col gap-2 border px-3 py-1 text-sm font-medium",
        tagVariantStyles[variant],
        description ? "rounded-md" : "rounded-full",
        className,
      )}
    >
      <div className="inline-flex items-center gap-1.5">
        {icon}
        {children ?? label}
      </div>
      {description && (
        <span className="text-foreground/70 text-xs">{description}</span>
      )}
    </span>
  );
}
