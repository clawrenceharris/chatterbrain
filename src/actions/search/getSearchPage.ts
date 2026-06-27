"use server";

import { makeGetSearchPageUseCase } from "@/composition/search";
import { toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";

export async function getSearchPage(query: string | null) {
  const useCase = makeGetSearchPageUseCase();
  const result = await useCase.execute(query);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
