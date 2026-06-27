/** Rachel — ElevenLabs default voice used when an actor has no voice configured. */
export const DEFAULT_ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";

export function resolveElevenLabsVoiceId(voiceId: string | null | undefined) {
  if (!voiceId || voiceId === "default") {
    return DEFAULT_ELEVENLABS_VOICE_ID;
  }
  return voiceId;
}

export async function readableStreamToBase64(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks).toString("base64");
}

export function unwrapElevenLabsAudioStream(
  response: ReadableStream<Uint8Array> | { data?: ReadableStream<Uint8Array> },
): ReadableStream<Uint8Array> {
  if (response instanceof ReadableStream) {
    return response;
  }

  if (response.data instanceof ReadableStream) {
    return response.data;
  }

  throw new Error("ElevenLabs did not return an audio stream.");
}
