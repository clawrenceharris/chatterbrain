import React, { useCallback, useEffect, useRef, useState } from "react";
import type { Actor, Dialogue, Scenario, UserProfile } from "../../types";

import "./DialoguePlayer.scss";
import { DialogueCompletionModal, ProgressIndicator } from "../";
import {
  AlertCircle,
  Eye,
  RotateCcw,
  Send,
  Settings,
  Volume2,
  VolumeXIcon,
  X,
} from "lucide-react";
import { useModal, useToast } from "../../context";
import { useVoiceStore } from "../../store/useVoiceStore";
import {
  useDialogueCompletion,
  useDynamicDialogue,
  useErrorHandler,
} from "../../hooks";
import { useProgressStore } from "../../store/useProgressStore";
import type { SuggestedResponse } from "../../services/dynamicDialogue";

interface DialoguePlayerProps {
  scenario: Scenario;
  dialogue: Dialogue;
  onReplay: () => void;
  user: UserProfile;
  onDialogueExit: () => void;
  actor: Actor;
  userFields: { [key: string]: string };
}

const DialoguePlayer = ({
  scenario,
  user,
  userFields,
  dialogue,
  onDialogueExit,
  onReplay,
  actor,
}: DialoguePlayerProps) => {
  const { fetchProgress, progress } = useProgressStore();

  const [customInput, setCustomInput] = useState("");
  const [isVolumeOn, setIsVolumeOn] = useState<boolean>(false);
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map());
  const [isGeneratingAudio, setIsGeneratingAudio] = useState<boolean>(false);
  const {
    updateDialogueProgress,
    addDialogueProgress,
    error,
    isLoading: isSaving,
  } = useDialogueCompletion();

  const { fetchVoices, getAudioUrl } = useVoiceStore();
  const messageWindowRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const { handleError } = useErrorHandler();
  const { openModal } = useModal();

  const {
    submitUserInput,
    selectSuggestedResponse,
    retry,
    isLoading,
    isCompleted,
    currentActorResponse,
    conversationHistory,
    context,
  } = useDynamicDialogue({
    scenario,
    dialogue,
    actor,
    userFields,
    user,
    onError: (error) => handleError({ error }),
    onDialogueComplete: () => handleDialogueComplete(),
  });

  useEffect(() => {
    fetchVoices();
    fetchProgress(user.user_id);
  }, [fetchProgress, fetchVoices, user.user_id]);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messageWindowRef.current?.scrollTo({
      top: messageWindowRef.current.scrollHeight,
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory.length]);

  const getVoiceSettings = useCallback(() => {
    const personaTags = dialogue.persona_tags || [];

    // Base voice settings
    const settings = {
      stability: 0.5,
      style: 0.5,
      use_speaker_boost: true,
    };

    // Adjust based on persona tags
    if (personaTags.includes("confident")) {
      settings.stability = 0.7;
      settings.style = 0.8;
    } else if (personaTags.includes("shy")) {
      settings.stability = 0.3;
      settings.style = 0.2;
    } else if (personaTags.includes("excited")) {
      settings.stability = 0.4;
      settings.style = 0.9;
    } else if (personaTags.includes("nervous")) {
      settings.stability = 0.2;
      settings.style = 0.3;
    }

    return settings;
  }, [dialogue.persona_tags]);

  const playAudio = useCallback(
    async (text: string) => {
      if (!isVolumeOn || isGeneratingAudio) return;

      try {
        // Check cache first
        if (audioCache.has(text)) {
          const audioUrl = audioCache.get(text)!;
          const audio = new Audio(audioUrl);
          await audio.play();
          return;
        }

        setIsGeneratingAudio(true);

        const voiceSettings = getVoiceSettings();
        const audioUrl = await getAudioUrl(actor?.voice_id || "default", {
          text,
          voice_settings: voiceSettings,
        });

        // Cache the audio URL
        setAudioCache((prev) => new Map(prev).set(text, audioUrl));

        const audio = new Audio(audioUrl);
        await audio.play();
      } catch (err) {
        console.log("Audio playback error:", err);
        showToast("Could not play audio. Please try again another time.", {
          type: "warning",
        });
      } finally {
        setIsGeneratingAudio(false);
      }
    },
    [
      isVolumeOn,
      isGeneratingAudio,
      audioCache,
      getVoiceSettings,
      getAudioUrl,
      actor?.voice_id,
      showToast,
    ]
  );

  useEffect(() => {
    if (currentActorResponse?.content && isVolumeOn) {
      playAudio(currentActorResponse.content);
    }
  }, [currentActorResponse, isVolumeOn, playAudio]);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    return () => {
      audioCache.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [audioCache]);

  const handleOptionClick = async (res: SuggestedResponse) => {
    selectSuggestedResponse(res.id);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    submitUserInput(customInput);
  };

  const handleDialogueComplete = useCallback(() => {
    if (progress?.map((p) => p.dialogue_id).includes(dialogue.id)) {
      updateDialogueProgress(
        user.user_id,
        dialogue.id,
        context.totalScores,
        dialogue.max_scoring
      );
    } else {
      addDialogueProgress(
        user.user_id,
        dialogue.id,
        context.totalScores,
        dialogue.max_scoring
      );
    }
  }, [
    addDialogueProgress,
    context.totalScores,
    dialogue.id,
    dialogue.max_scoring,
    progress,
    updateDialogueProgress,
    user.user_id,
  ]);
  const handleResultsClick = () => {
    openModal(
      <DialogueCompletionModal
        actor={actor}
        dialogue={dialogue}
        dialogueContext={context}
        userMessages={conversationHistory.filter(
          (item) => item.speaker === "user"
        )}
        actorMessages={conversationHistory.filter(
          (item) => item.speaker === "actor"
        )}
      />
    );
  };

  return (
    <>
      <div className="game-content">
        <div className="dialogue-arena">
          <div className="chat-window">
            <div className="game-header">
              <div className="header-content">
                <div className="scenario-info">
                  <h1 className="scenario-title">{scenario.title}</h1>
                  <div className="scenario-badge">{dialogue.title}</div>
                </div>
                <div className="game-controls">
                  <button
                    onClick={() => setIsVolumeOn(!isVolumeOn)}
                    className="control-btn"
                    disabled={isGeneratingAudio}
                  >
                    {isVolumeOn ? (
                      <Volume2 size={20} />
                    ) : (
                      <VolumeXIcon size={20} />
                    )}
                  </button>
                  <button className="control-btn">
                    <Settings size={20} />
                  </button>
                  <button onClick={onReplay} className="control-btn">
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={onDialogueExit}
                    className="control-btn btn-danger"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div ref={messageWindowRef} className="chat-messages">
              {conversationHistory?.map((message) => (
                <div key={message.id} className={`message ${message.speaker}`}>
                  <p className="avatar">
                    {message.speaker === "actor"
                      ? actor?.first_name.charAt(0) || ""
                      : user.first_name.charAt(0) || ""}
                  </p>
                  <div className="message-content">
                    <div className="speaker-name">
                      {message.speaker === "actor"
                        ? actor?.first_name || "Unknown"
                        : "You"}
                    </div>
                    <div className="message-bubble">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="typing-indicator">
                  <div className="avatar">
                    {actor?.first_name.charAt(0) || ""}
                  </div>
                  <div className="typing-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              )}

              <div ref={messageWindowRef} />
            </div>
          </div>
        </div>
        {!isCompleted ? (
          <div className="response-section">
            <div className="response-options">
              {currentActorResponse?.suggestedUserResponses.map(
                (res, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(res)}
                    disabled={isLoading}
                    className={`response-option ${isLoading ? "disabled" : ""}`}
                  >
                    <p className="option-text">{res.content}</p>
                  </button>
                )
              )}
            </div>

            <div className="custom-response">
              <form onSubmit={handleCustomSubmit} className="input-container">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Or type your own response..."
                  disabled={isLoading}
                  className="form-input"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim() || isLoading}
                  className="send-btn"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        ) : null}
        {isSaving && (
          <div className="loading-state">
            <ProgressIndicator />
            <p className="loading-text">Saving...</p>
          </div>
        )}
        {error && (
          <div className="error-state">
            <AlertCircle className="error-icon" />
            <h3 className="error-title">Completion Failed</h3>
            <p className="error-message">{error}</p>
            <button onClick={retry} className="btn btn-danger">
              Try Again
            </button>
          </div>
        )}
        {isCompleted && (
          <div className="dialogue-actions">
            <button onClick={handleResultsClick} className="btn btn-primary">
              <Eye /> View Results
            </button>

            <button onClick={onDialogueExit} className="btn btn-tertiary">
              Go Back
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DialoguePlayer;
