import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Voice } from "@elevenlabs/elevenlabs-js/api";
import { getTextToSpeechAction } from "@/features/ai/actions";
import { getUserErrorMessage } from "@/shared/utils/errors";

interface VoiceStore {
  voices?: Record<string, Voice>;
  ids: string[];
  selectedVoice: Voice | null;
  setVoice: (voice: Voice) => void;
  error: string | null;
  loading: boolean;
  getAudioUrl: (id: string, text: string) => Promise<string>;
}

const audioUrlCache = new Map<string, string>();

function buildCacheKey(voiceId: string, text: string) {
  return `${voiceId}:${text}`;
}

function base64ToObjectUrl(audioBase64: string, mimeType: string) {
  const binary = atob(audioBase64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set) => ({
      voices: undefined,
      ids: [],
      error: null,
      selectedVoice: null,
      loading: false,

      setVoice: (voice: Voice) => {
        set({ selectedVoice: voice });
      },

      getAudioUrl: async (voiceId: string, text: string): Promise<string> => {
        const trimmed = text.trim();
        if (!trimmed) {
          throw new Error("No text provided for speech synthesis.");
        }

        const cacheKey = buildCacheKey(voiceId, trimmed);
        const cachedUrl = audioUrlCache.get(cacheKey);
        if (cachedUrl) {
          return cachedUrl;
        }

        try {
          set({ loading: true, error: null });

          const result = await getTextToSpeechAction({
            text: trimmed,
            voiceId,
          });

          if (!result.success) {
            throw new Error(result.error.message);
          }

          const audioUrl = base64ToObjectUrl(
            result.data.audioBase64,
            result.data.mimeType,
          );
          audioUrlCache.set(cacheKey, audioUrl);
          return audioUrl;
        } catch (err) {
          const message = getUserErrorMessage(err);
          set({ error: message });
          throw new Error(message);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "voice-storage",
      partialize: (state) => ({
        voices: state.voices,
        selectedVoice: state.selectedVoice,
        ids: state.ids,
      }),
    },
  ),
);
