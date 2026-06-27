import "server-only";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY");
}
if (!process.env.OPENAI_PROJECT_ID) {
  throw new Error("Missing OPENAI_PROJECT_ID");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID,
});
