import { Difficulty } from "@/types";
import { Leaf, MessageCircle, Scale, Shield } from "lucide-react";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.GENTLE]: "Gentle",
  [Difficulty.REALISTIC]: "Realistic",
  [Difficulty.CHALLENGE]: "Challenging",
  [Difficulty.DIFFICULT]: "Difficult",
};
export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  [Difficulty.GENTLE]: "Your conversation partner is calm and easy to talk to.",
  [Difficulty.REALISTIC]:
    "Your conversation partner responds closer to what you'd expect in a real-world conversation.",
  [Difficulty.CHALLENGE]:
    "Your conversation partner may have be harder to talk to than usual.",
  [Difficulty.DIFFICULT]:
    "Your conversation partner is difficult or impossible to talk to. Practice being assertive and setting clear boundaries.",
};

export const DIFFICULTY_CLASSNAMES: Record<Difficulty, string> = {
  [Difficulty.GENTLE]: "text-success border-success/20",
  [Difficulty.REALISTIC]: "text-warning border-warning/20",
  [Difficulty.CHALLENGE]: "text-warning border-warning/20",
  [Difficulty.DIFFICULT]: "text-destructive border-destructive/20",
};

export const DIFFICULTY_ICONS: Record<Difficulty, React.ReactNode> = {
  [Difficulty.GENTLE]: <Leaf strokeWidth={2.5} className="size-4" />,
  [Difficulty.REALISTIC]: (
    <MessageCircle strokeWidth={2.5} className="size-4" />
  ),
  [Difficulty.CHALLENGE]: <Scale strokeWidth={2.5} className="size-4" />,
  [Difficulty.DIFFICULT]: <Shield strokeWidth={2.5} className="size-4" />,
};
