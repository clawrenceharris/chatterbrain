"use server";
import { makeSaveSearchUseCase } from "@/composition/search/makeSaveSearchUseCase";
import { fail, ok } from "@/shared/application";
import { toActionError } from "@/shared/action";

export async function saveSearch(query: string) {
  const useCase = makeSaveSearchUseCase();
  const result = await useCase.execute(query);
  if (!result.success) {
    return fail(toActionError(result.error));
  }
  return ok(result.data);
}
