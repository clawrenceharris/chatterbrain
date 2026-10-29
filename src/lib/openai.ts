import "server-only";
import OpenAI from "openai";
import { ApplicationError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (client) return client;

  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_PROJECT_ID) {
    throw new ApplicationError({
      code: AppErrorCode.EXTERNAL_SERVICE_ERROR,
      message:
        "A service we depend on isn’t available right now. Please try again soon.",
    });
  }

  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    project: process.env.OPENAI_PROJECT_ID,
  });

  return client;
}
