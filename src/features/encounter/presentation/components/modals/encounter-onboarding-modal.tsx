"use client";
import { FormLayout, InputField } from "@/components/form";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  FieldGroup,
} from "@/components/ui";
import { useScenario } from "@/features/scenario/presentation/hooks";
import { ScenarioOnboardingModalProps } from "@/lib/modals/types";
import { useEncounterOnboardingForm } from "../../hooks/use-encounter-onboarding-form";
import { ScenarioVariable } from "@/features/scenario/domain/value-objects";
import { useFormContext } from "react-hook-form";
import { LoadingState } from "@/components/states";

type SceneOnboardingFormProps = {
  variables: ScenarioVariable[];
};
function EncounterOnboardingForm({ variables }: SceneOnboardingFormProps) {
  const { register } = useFormContext<Record<string, string>>();
  return (
    <FieldGroup>
      {variables.map((variable) => {
        return (
          <InputField
            key={variable.id}
            placeholder={variable.placeholder}
            label={variable.label}
            description={variable.helperText}
            required={variable.required}
            {...register(variable.id, {
              value: variable.defaultValue,
              required: variable.required,
            })}
          />
        );
      })}
    </FieldGroup>
  );
}

export function EncounterOnboardingModal({
  scenarioId,
  onCancel,
  onSubmit,
}: ScenarioOnboardingModalProps) {
  const { data: scenario, isLoading } = useScenario(scenarioId);
  const { form, handleSubmit } = useEncounterOnboardingForm({
    scenarioId,
    onSubmit,
  });

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Start Encounter</AlertDialogTitle>
      </AlertDialogHeader>
      {scenario?.description && (
        <AlertDialogDescription className="bg-primary/20 text-primary rounded-md p-4 font-medium">
          {scenario.description}
        </AlertDialogDescription>
      )}
      <FormLayout<Record<string, string>>
        form={form}
        disabled={isLoading}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        description={
          "Customize your encounter by entering the following information."
        }
        submitText="Start"
        showsCancelButton
        cancelText="Cancel"
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <EncounterOnboardingForm variables={scenario?.variables ?? []} />
        )}
      </FormLayout>
    </AlertDialogContent>
  );
}
