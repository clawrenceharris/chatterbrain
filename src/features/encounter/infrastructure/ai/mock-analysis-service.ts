function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const MOCK_FEEDBACK: string[] = [
  "Your response was clear and assertive — you expressed your need directly without being aggressive. To push it further, try briefly acknowledging the other person's situation before stating your own; it signals empathy and often makes people more receptive to what you're saying.",
  "Good delivery overall. You stayed on-topic and kept the emotional temperature steady. One thing to explore: adding a concrete suggestion or compromise can shift the dynamic from complaint to collaboration, which tends to land better.",
  "Solid work. You communicated your boundary without over-explaining it, which is a real skill. If you wanted to go deeper, matching the other person's emotional tone a little more — even just a short opener — can create more connection before the boundary lands.",
];

const MOCK_BETTER_RESPONSES: string[] = [
  "I totally get it — I just need to flag that it's getting pretty late and I have an early start. Could we maybe wrap this up or take it to a quieter spot? I'd really appreciate it.",
  "Hey, no worries about the call — I just need a bit of quiet right now. Would it be okay to move somewhere else, or give it another 10 minutes? That would really help me out.",
  "I hear you, and I'm not trying to be difficult. It's just that I've got to be up early and the noise is making it hard to wind down. Is there any way we could find a middle ground here?",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Simulates an API call for coaching feedback on a user message. */
export async function mockGetFeedback(userContent: string): Promise<string>;
export async function mockGetFeedback(): Promise<string> {
  await delay(700);
  return pick(MOCK_FEEDBACK);
}

/** Simulates an API call for a rephrased/improved version of the user's reply. */
export async function mockGetBetterResponse(
  actorContent: string,
  userContent: string,
): Promise<string>;
export async function mockGetBetterResponse(): Promise<string> {
  await delay(700);
  return pick(MOCK_BETTER_RESPONSES);
}
