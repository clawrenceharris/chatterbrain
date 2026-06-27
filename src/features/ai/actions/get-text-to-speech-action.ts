"use server";

import { ActionResult, toActionError } from "@/shared/action";
import { fail, ok } from "@/shared/application";
import { ApplicationError } from "@/shared/utils";
import { AppErrorCode } from "@/types";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import {
  readableStreamToBase64,
  resolveElevenLabsVoiceId,
  unwrapElevenLabsAudioStream,
} from "../lib/elevenlabs";

const MAX_TTS_CHARACTERS = 1_500;

export type TextToSpeechResult = {
  audioBase64: string;
  mimeType: string;
};

export async function getTextToSpeechAction(input: {
  text: string;
  voiceId: string;
}): Promise<ActionResult<TextToSpeechResult>> {
  const text = input.text.trim();
  if (!text) {
    return fail(
      toActionError(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "No text provided for speech synthesis.",
        }),
      ),
    );
  }

  if (text.length > MAX_TTS_CHARACTERS) {
    return fail(
      toActionError(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Text is too long to convert to speech.",
        }),
      ),
    );
  }

  try {
    const elevenlabs = new ElevenLabsClient();
    const voiceId = resolveElevenLabsVoiceId(input.voiceId);
    const response = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId: "eleven_turbo_v2",
      outputFormat: "mp3_44100_128",
    });
    const stream = unwrapElevenLabsAudioStream(response);
    const audioBase64 = await readableStreamToBase64(stream);

    return ok({
      audioBase64,
      mimeType: "audio/mpeg",
    });
  } catch (error) {
    console.error("ElevenLabs text-to-speech failed", error);
    const message =
      error instanceof Error
        ? error.message
        : "Could not generate speech audio.";
    return fail(
      toActionError(
        new ApplicationError({
          code: AppErrorCode.EXTERNAL_SERVICE_ERROR,
          message,
        }),
      ),
    );
  }
}
