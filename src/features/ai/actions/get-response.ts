"use server";
import { getOpenAI } from "@/lib/openai";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import {
  Response,
  ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses.mjs";

export async function getResponse(
  params: Partial<ResponseCreateParamsNonStreaming>,
): Promise<ActionResult<Response>> {
  try {
    const response = await getOpenAI().responses.create({
      model: "gpt-4o-mini",
      ...params,
    });
    return ok(response);
  } catch (error) {
    if (error instanceof ApplicationError) {
      return fail(toActionError(error));
    }
    return fail(toActionError(normalizeError(error)));
  }
}
