"use client";
import { getSpeechToTextAction } from "@/features/ai/actions";
import { useVoiceStore } from "@/store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useUser } from "@/components/providers";
import { useModals } from "@/hooks";
import { useRouter } from "next/navigation";
import { EncounterPageSkeleton } from "../components";
import { EmptyState, ErrorState } from "@/components/states";
import { useEncounterPage, useReplayEncounter } from "../hooks";
import { EncounterPageOutput } from "../../application/dto";
import { useQueryClient } from "@tanstack/react-query";
import { scenarioKeys } from "@/lib/queries";

type EncounterContextType = {
  encounter: EncounterPageOutput;

  // Audio State & Controls
  isVolumeOn: boolean;
  setIsVolumeOn: (isVolumeOn: boolean) => void;
  playAudio: (text: string) => void;
  toggleAudio: () => void;

  // Speech & Listening State
  isListening: boolean;
  isProcessingSpeech: boolean;
  toggleListening: (onUserInput: (input: string) => void) => void;

  // Encounter Navigation & Control
  handleExit: () => void;
  handleDone: () => void;
  handleReplay: () => void;
  handleViewResults: () => void;

  // Encounter State
  key: number;
  isLoading: boolean;
  isReplaying: boolean;
};
type EncounterProviderProps = {
  children: React.ReactNode;
  encounterId: string;
};
const EncounterEngineContext = createContext<EncounterContextType | undefined>(
  undefined,
);
export function EncounterProvider({
  children,
  encounterId,
}: EncounterProviderProps) {
  const [isVolumeOn, setIsVolumeOn] = useState<boolean>(false);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const listeningSessionRef = useRef(0);
  const [key, setKey] = useState<number>(0);
  const { getAudioUrl } = useVoiceStore();
  const queryClient = useQueryClient();

  const router = useRouter();
  const {
    modals: { confirmation: confirmationModal },
  } = useModals();
  const { user } = useUser();
  const {
    data: encounter = null,
    isLoading: isEncounterLoading,
    error,
    refetch,
  } = useEncounterPage(encounterId, user.id);
  const { mutateAsync: replayEncounterMutation, isPending: isReplaying } =
    useReplayEncounter();

  const {
    modals: {},
  } = useModals();

  const playAudio = useCallback(
    async (text: string) => {
      if (!encounter || !isVolumeOn) return;

      const trimmed = text.trim();
      if (!trimmed) return;

      try {
        const cacheKey = `${encounter.actor.voiceId}:${trimmed}`;
        let audioUrl = audioCacheRef.current.get(cacheKey);

        if (!audioUrl) {
          audioUrl = await getAudioUrl(
            encounter.actor.voiceId || "default",
            trimmed,
          );
          audioCacheRef.current.set(cacheKey, audioUrl);
        }

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audio.volume = 0.85;
        audioRef.current = audio;
        await audio.play();
      } catch (error) {
        console.error("Error playing audio", error);
        toast.warning("Could not play audio. Please try again.");
      }
    },
    [encounter, getAudioUrl, isVolumeOn],
  );

  useEffect(() => {
    if (isVolumeOn) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, [isVolumeOn]);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    const cache = audioCacheRef.current;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      cache.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      cache.clear();
    };
  }, []);

  const clearRecordingTimeout = useCallback(() => {
    if (!recordingTimeoutRef.current) return;
    clearTimeout(recordingTimeoutRef.current);
    recordingTimeoutRef.current = null;
  }, []);

  const releaseMediaStream = useCallback((stream?: MediaStream | null) => {
    const activeStream = stream ?? mediaStreamRef.current;
    activeStream?.getTracks().forEach((track) => track.stop());
    if (!stream || stream === mediaStreamRef.current) {
      mediaStreamRef.current = null;
    }
  }, []);

  const finishListening = useCallback(
    (stream?: MediaStream | null) => {
      clearRecordingTimeout();
      releaseMediaStream(stream);
      mediaRecorderRef.current = null;
      setIsListening(false);
    },
    [clearRecordingTimeout, releaseMediaStream],
  );

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    setIsListening(false);
    clearRecordingTimeout();

    if (recorder && recorder.state !== "inactive") {
      setIsProcessingSpeech(true);
      recorder.stop();
      return;
    }

    listeningSessionRef.current += 1;
    finishListening();
    setIsProcessingSpeech(false);
  }, [clearRecordingTimeout, finishListening]);

  useEffect(() => {
    return () => {
      listeningSessionRef.current += 1;
      clearRecordingTimeout();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
      releaseMediaStream();
      mediaRecorderRef.current = null;
    };
  }, [clearRecordingTimeout, releaseMediaStream]);

  // Speech to text functionality
  const toggleListening = useCallback(
    async (onUserInput: (input: string) => void) => {
      if (isListening) {
        stopListening();
        return;
      }

      const sessionId = ++listeningSessionRef.current;

      try {
        setIsListening(true);
        setIsProcessingSpeech(true);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        if (sessionId !== listeningSessionRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        mediaStreamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks: BlobPart[] = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        });

        mediaRecorder.addEventListener("stop", async () => {
          try {
            const audioBlob = new Blob(audioChunks, {
              type: mediaRecorder.mimeType || "audio/webm",
            });

            if (audioBlob.size > 0) {
              const response = await getSpeechToTextAction(audioBlob);
              if (response.success) {
                onUserInput(response.data);
              } else {
                toast.error(response.error.message);
              }
            }
          } catch (error) {
            console.error("Speech to text error:", error);
            toast.error(
              "Could not convert speech to text. Please try again or type your response.",
            );
          } finally {
            finishListening(stream);
            setIsProcessingSpeech(false);
          }
        });

        mediaRecorder.start();
        recordingTimeoutRef.current = setTimeout(() => {
          stopListening();
        }, 15000);
      } catch (error) {
        console.error("Microphone access error:", error);
        toast.error(
          "Could not access microphone. Please check your browser permissions.",
        );
        listeningSessionRef.current += 1;
        finishListening();
        setIsProcessingSpeech(false);
      }
    },
    [finishListening, isListening, stopListening],
  );
  const handleExit = useCallback(() => {
    if (!encounter) return;

    confirmationModal.open({
      title: "Exit Encounter",
      description:
        "Are you sure you want to exit this encounter? Don't worry, you can resume it later.",
      onConfirm: () => {
        queryClient.invalidateQueries({
          queryKey: scenarioKeys.page(encounter.scenario.id),
        });
        router.push(
          `/scenarios/${encounter.scenario.id}/${encounter.scenario.slug}`,
        );
      },
    });
  }, [encounter, confirmationModal, queryClient, router]);
  const handleReplay = useCallback(async () => {
    if (!encounter) {
      toast.error("Encounter not found");
      return;
    }

    try {
      await replayEncounterMutation(encounter.id);
      await refetch();
      setKey((prev) => prev + 1);
    } catch (replayError) {
      const message =
        replayError instanceof Error
          ? replayError.message
          : "Could not replay encounter";
      toast.error(message);
    }
  }, [encounter, refetch, replayEncounterMutation]);
  const toggleAudio = useCallback(() => {
    setIsVolumeOn((prev) => !prev);
  }, []);

  const handleDone = useCallback(() => {
    if (!encounter) return;
    router.push(`/scenarios/${encounter.scenario.slug}`);
  }, [encounter, router]);
  const handleViewResults = useCallback(() => {
    if (!encounter) return;
    router.push(`/encounters/${encounter.id}/results`);
  }, [encounter, router]);
  const value = useMemo<EncounterContextType>(
    () => ({
      isVolumeOn,
      encounter: encounter!,
      setIsVolumeOn,
      handleViewResults,
      handleDone,
      isListening,
      toggleAudio,
      handleExit,
      isLoading: isEncounterLoading,
      isProcessingSpeech,
      playAudio,
      toggleListening,
      handleReplay,
      key,
      isReplaying,
    }),
    [
      isVolumeOn,
      encounter,
      handleViewResults,
      handleDone,
      isListening,
      toggleAudio,
      handleExit,
      isProcessingSpeech,
      playAudio,
      toggleListening,
      handleReplay,
      key,
      isEncounterLoading,
      isReplaying,
    ],
  );

  if (isEncounterLoading) {
    return <EncounterPageSkeleton />;
  }
  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Error loading encounter"
        message={error.message}
        onRetry={refetch}
        actionLabel="Exit"
        onAction={handleExit}
      />
    );
  }
  if (!encounter) {
    return (
      <EmptyState
        variant="page"
        title="Encounter not found"
        message="The encounter you are looking for does not exist."
      />
    );
  }

  return (
    <EncounterEngineContext.Provider value={{ ...value, encounter }}>
      {children}
    </EncounterEngineContext.Provider>
  );
}

export function useEncounterContext() {
  const context = useContext(EncounterEngineContext);
  if (!context) {
    throw new Error("useEngineContext must be used within a EncounterProvider");
  }
  return context;
}
