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
  suggestions?: string[];
  rewrittenDraft?: string;
};

const MOCK_RESPONSES: Record<
  InvokeEncounterHelperInput["helperId"],
  InvokeEncounterHelperOutput
> = {
  "vibe-check": {
    text: "This draft sounds friendly and direct. If you want it softer, add a short acknowledgement before your main point.",
  },
  rephraser: {
    text: "Chitter made your draft a little easier to read.",
    rewrittenDraft:
      "I get what you mean. It can be hard when you don't have the words.",
    suggestions: [
      "I understand. It can be hard when you don't have the words.",
    ],
  },
  "response-builder": {
    text: "Chitter found a few possible ways you could respond next.",
    suggestions: [
      "I get what you mean. It can be hard when you don't have the words.",
      "I understand. It can be hard when you don't have the words.",
    ],
  },
  "tone-analyzer": {
    text: "This message may include a social cue. Notice the feeling behind the words before choosing your response.",
  },
  "cue-detector": {
    text: "Chitter sees a useful cue here: notice what the other person might be feeling before choosing your next line.",
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
        temperature: 0.35,
        maxOutputTokens: 500,
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

    if (helperId === "response-builder") {
      return {
        text,
        suggestions:
          suggestions && suggestions.length > 0
            ? suggestions
            : fallback.suggestions,
      };
    }

    if (helperId === "rephraser") {
      return {
        text,
        rewrittenDraft:
          rewrittenDraft || suggestions?.[0] || fallback.rewrittenDraft,
        suggestions,
      };
    }

    return { text };
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
