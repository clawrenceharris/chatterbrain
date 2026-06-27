import type {
  HelperConfig,
  HelperDefinition,
} from "@/features/encounter/domain/types";
import { assets } from "./assets";

export const HELPER_REGISTRY: HelperDefinition[] = [
  {
    id: "vibe-check",
    label: "Vibe Check",
    shortLabel: "Vibe Check",
    description:
      "Let Chitter check your wording for tone, clarity, and engagement.",
    behavior: "details-from-input",
    icon: assets.tone_check_sticker,
    enabledByDefault: true,
    availability: {
      requiresInput: true,
      disabledReason: "Type a draft first.",
    },
  },
  {
    id: "rephraser",
    label: "Rephraser",
    shortLabel: "Rephrase",
    description:
      "Let Chitter rewrite your draft with improved clarity and tone.",
    behavior: "details-from-input",
    icon: assets.rephraser_sticker,
    enabledByDefault: true,
    availability: {
      requiresInput: true,
      disabledReason: "Type something to rephrase.",
    },
  },
  {
    id: "response-builder",
    label: "Response Builder",
    shortLabel: "Build",
    icon: assets.response_builder_sticker,
    description:
      "Let Chitter suggest a few possible responses based on the conversation.",
    behavior: "transform-input",
    enabledByDefault: true,
    availability: {
      requiresMessages: true,
      disabledReason: "Start the conversation first.",
    },
  },
  {
    id: "tone-analyzer",
    label: "Tone Analyzer",
    shortLabel: "Tone",
    description: "Let Chitter inspect a message's tone and how it may land.",
    behavior: "detail-from-message",
    icon: assets.tone_analyzer_sticker,
    enabledByDefault: true,
    availability: {
      requiresMessages: true,
      disabledReason: "No messages to inspect yet.",
    },
  },
  {
    id: "cue-detector",
    label: "Cue Detector",
    shortLabel: "Cues",
    description: "Let Chitter point out possible social cues in a message.",
    behavior: "detail-from-message",
    icon: assets.cue_detector_sticker,
    enabledByDefault: true,
    availability: {
      requiresMessages: true,
      disabledReason: "No messages to inspect yet.",
    },
  },
];

export const HELPER_CONFIGS: Record<string, HelperConfig> = {
  soloPractice: {
    showHelpers: true,
    showMicButton: true,
    enabledHelperIds: [
      "tone-analyzer",
      "rephraser",
      "response-builder",
      "cue-detector",
      "vibe-check",
    ],
  },
  groupPractice: {
    showHelpers: true,
    showMicButton: true,
    enabledHelperIds: ["tone-analyzer", "response-builder", "cue-detector"],
  },

  noTools: {
    showHelpers: false,
    showMicButton: true,
  },
} satisfies Record<string, HelperConfig>;
