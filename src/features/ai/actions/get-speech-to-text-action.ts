"use server";
import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export async function getSpeechToTextAction(
  audio: Blob,
): Promise<ActionResult<string>> {
  try {
    const elevenlabs = new ElevenLabsClient();
    const response = await elevenlabs.speechToText.convert({
      file: audio,
      modelId: "scribe_v1",
    });
    return ok(response.text);
  } catch (error) {
    console.error(error);
    return fail(toActionError(ApplicationError.unexpected(error)));
  }
}
