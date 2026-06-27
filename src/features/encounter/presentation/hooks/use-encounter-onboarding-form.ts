import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useScenario } from "@/features/scenario/presentation/hooks";

type UseEncounterOnboardingFormProps = {
  scenarioId: string;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
};
export function useEncounterOnboardingForm({
  scenarioId,
  onSubmit,
}: UseEncounterOnboardingFormProps) {
  const { data: scenario } = useScenario(scenarioId);
  const form = useForm<Record<string, string>>({
    defaultValues: {
      ...(scenario?.variables ?? []).reduce(
        (acc, v) => {
          acc[v.id] = v.defaultValue ?? "";
          return acc;
        },
        {} as Record<string, string>,
      ),
    },
    resolver: zodResolver(
      z.object({
        ...(scenario?.variables ?? []).reduce(
          (acc, field) => {
            acc[field.id] = z.string();
            return acc;
          },
          {} as Record<string, z.ZodType<string>>,
        ),
      }),
    ),
  });
  const handleSubmit = async (data: Record<string, string>) => {
    onSubmit(data);
  };
  return { form, handleSubmit, fields: scenario?.variables ?? [] };
}
