"use server";
import { openai } from "@/lib/openai";
import { ActionResult } from "@/shared/action";
import { ok } from "@/shared/application";
import {
  Response,
  ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses.mjs";

export async function getResponse(
  params: Partial<ResponseCreateParamsNonStreaming>,
): Promise<ActionResult<Response>> {
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    ...params,
  });
  return ok(response);
}
