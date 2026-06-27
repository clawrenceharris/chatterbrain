import { getChitterIdentityBlock } from "./chitter";

type BuildChitterSystemPromptInput = {
  surface: string;
  taskRules: string[];
  contextBlock?: string;
};

export function buildChitterSystemPrompt({
  surface,
  taskRules,
  contextBlock,
}: BuildChitterSystemPromptInput) {
  return `${getChitterIdentityBlock()}

Surface: ${surface}

Task rules:
${taskRules.map((rule) => `- ${rule}`).join("\n")}${
    contextBlock
      ? `

Context:
${contextBlock}`
      : ""
  }`;
}
