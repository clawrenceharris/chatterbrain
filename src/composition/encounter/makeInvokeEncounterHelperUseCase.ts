import { makeLlmPort } from "@/composition/ai/makeLlmPort";
import { InvokeEncounterHelperUseCase } from "@/features/encounter/application/use-cases/InvokeEncounterHelperUseCase";
const mockMode = process.env.NEXT_PUBLIC_ENCOUNTER_HELPER_MOCK === "true";
export function makeInvokeEncounterHelperUseCase() {
  return new InvokeEncounterHelperUseCase(makeLlmPort({ mockMode }));
}
