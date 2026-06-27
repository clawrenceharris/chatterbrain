import type { LlmPort } from "@/features/ai/domain";
import { fail, ok, type Result } from "@/shared/application";
import { ApplicationError, normalizeError } from "@/shared/utils/errors";
import { AppErrorCode } from "@/types";
import type {
  InvokeEncounterHelperInput,
  InvokeEncounterHelperOutput,
} from "../dto";
import { buildEncounterHelperPrompt } from "../../infrastructure/ai/buildEncounterHelperPrompt";

type InvokeEncounterHelperResult = Result<
  InvokeEncounterHelperOutput,
  ApplicationError
>;

type ParsedHelperResponse = {
  text?: string;
  tone?: string;
  suggestions?: string[];
  rewrittenDraft?: string;
};

const MOCK_RESPONSES: Record<
  InvokeEncounterHelperInput["helperId"],
  InvokeEncounterHelperOutput
> = {
  "vibe-check": {
    text: "Playful and a little casual — fits the chat, but the joke might land softer with a quick acknowledgement first.",
  },
  rephraser: {
    rewrittenDraft:
      "I get what you mean. It can be hard when you don't have the words.",
  },
  "response-builder": {
    suggestions: [
      "I hear you — can you tell me more?",
      "That makes sense. What happened next?",
      "Got it. How are you feeling about it?",
    ],
  },
  "tone-analyzer": {
    tone: "guarded",
    text: "Short replies and careful wording suggest they're not fully opening up yet.",
  },
  "cue-detector": {
    text: "They may be hinting at frustration without saying it directly — notice the clipped phrasing.",
  },
};

export class InvokeEncounterHelperUseCase {
  constructor(private readonly llm: LlmPort) {}

  async execute(
    input: InvokeEncounterHelperInput,
  ): Promise<InvokeEncounterHelperResult> {
    if (input.mockMode) {
      return ok(MOCK_RESPONSES[input.helperId]);
    }

    if (
      (input.helperId === "vibe-check" || input.helperId === "rephraser") &&
      !input.draftInput?.trim()
    ) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Type a draft before using this helper.",
        }),
      );
    }

    if (
      (input.helperId === "tone-analyzer" ||
        input.helperId === "cue-detector") &&
      !input.targetMessage?.content.trim()
    ) {
      return fail(
        new ApplicationError({
          code: AppErrorCode.VALIDATION_FAILED,
          message: "Select a message before using this helper.",
        }),
      );
    }

    try {
      const response = await this.llm.generateText({
        messages: [
          {
            role: "system",
            content: buildEncounterHelperPrompt(input),
          },
        ],
        temperature: 0.25,
        maxOutputTokens: 220,
        metadata: {
          feature: "encounter-helper",
          helperId: input.helperId,
          userId: input.userId,
        },
      });

      return ok(this.parseResponse(input.helperId, response.text));
    } catch (error) {
      const appError = normalizeError(error);
      return fail(
        new ApplicationError({
          code: appError.code,
          message: "Chitter could not help right now. Please try again.",
        }),
      );
    }
  }

  private parseResponse(
    helperId: InvokeEncounterHelperInput["helperId"],
    rawText: string,
  ): InvokeEncounterHelperOutput {
    const parsed = this.tryParseJson(rawText);
    const fallback = MOCK_RESPONSES[helperId];

    const text = parsed?.text?.trim() || fallback.text;
    const suggestions = parsed?.suggestions
      ?.map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);
    const rewrittenDraft = parsed?.rewrittenDraft?.trim();

    if (helperId === "rephraser") {
      return {
        rewrittenDraft:
          rewrittenDraft || suggestions?.[0] || fallback.rewrittenDraft,
      };
    }

    if (helperId === "tone-analyzer") {
      return {
        tone: parsed?.tone?.trim() || fallback.tone,
        text: parsed?.text?.trim() || fallback.text,
      };
    }

    if (helperId === "response-builder") {
      return {
        suggestions:
          suggestions && suggestions.length > 0
            ? suggestions
            : fallback.suggestions,
      };
    }

    return { text: text || fallback.text };
  }

  private tryParseJson(rawText: string): ParsedHelperResponse | null {
    try {
      const trimmed = rawText
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();
      return JSON.parse(trimmed) as ParsedHelperResponse;
    } catch {
      return null;
    }
  }
}
