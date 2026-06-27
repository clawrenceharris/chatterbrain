"use client";
import { assets } from "@/lib/constants/assets";
import {
  Brain,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";

const dialogueSamples1 = [
  {
    id: 1,
    actorLine: "So, what does your perfect date look like?",
    options: [
      "I don't know, maybe a movie or something?",
      "I prefer to keep it simple...",
      "Being with someone I care about is enough for me.",
    ],
  },
  {
    id: 2,
    actorLine: "I lost my dog yesterday. I've never felt this broken...",
    options: [
      "Oh no. I'm sorry...",
      "That's awful. Do you want to talk about it?",
      "[Stay Silent]",
    ],
  },
  {
    id: 3,
    actorLine: "Why do you want to work here?",
    options: [
      "I just really need a job right now.",
      "Your company mission resonates with me.",
      "My skills align perfectly with what you're looking for.",
    ],
  },
];

const dialogueSamples2 = [
  {
    id: 1,
    actorLine: "I'm sorry, but we can't accept returns without a receipt.",
    options: [
      "Can I speak to your manager please?",
      "I understand. Is there any other way to verify my purchase?",
      "Oh, give me a break!",
    ],
  },
  {
    id: 2,
    actorLine: "Would you like to join us for dinner tonight?",
    options: [
      "Yes, I'd love to! What time should I come?",
      "I'd rather starve.",
      "Thank you for the invitation. I'll let you know tomorrow.",
    ],
  },
  {
    id: 3,
    actorLine:
      "Hi, I'm new to the team. What's a typical day like around here?",
    options: [
      "It's pretty busy, you'll see.",
      "We usually start with a team huddle, then it's mostly independent work.",
      "Terrible!",
    ],
  },
];

export default function LandingPage() {
  const [currentDialogueIndex1, setCurrentDialogueIndex1] = useState(0);
  const [showDialogue1, setShowDialogue1] = useState(true);
  const [isAnimating1, setIsAnimating1] = useState(false);
  const dialogue1 = dialogueSamples1[currentDialogueIndex1];

  const [currentDialogueIndex2, setCurrentDialogueIndex2] = useState(1);
  const [showDialogue2, setShowDialogue2] = useState(true);
  const [isAnimating2, setIsAnimating2] = useState(false);
  const dialogue2 = dialogueSamples2[currentDialogueIndex2];

  const handleNextDialogue = (dialogueNum: 1 | 2) => {
    const currentIsAnimating = dialogueNum === 1 ? isAnimating1 : isAnimating2;
    if (currentIsAnimating) return;

    if (dialogueNum === 1) {
      setIsAnimating1(true);
      setShowDialogue1(false);
    } else {
      setIsAnimating2(true);
      setShowDialogue2(false);
    }

    const animationDuration = 500;
    const reEntryDelay = 100;

    setTimeout(() => {
      if (dialogueNum === 1) {
        setCurrentDialogueIndex1(
          (prev) => (prev + 1) % dialogueSamples1.length,
        );
        setShowDialogue1(true);
        setTimeout(() => setIsAnimating1(false), animationDuration);
      } else {
        setCurrentDialogueIndex2(
          (prev) => (prev + 1) % dialogueSamples2.length,
        );
        setShowDialogue2(true);
        setTimeout(() => setIsAnimating2(false), animationDuration);
      }
    }, animationDuration + reEntryDelay);
  };

  return (
    <div className="bg-white">
      {/* ── Header ───────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Chatterbrain"
              width={36}
              height={36}
              className="h-auto"
            />
            <span className="font-heading text-foreground text-lg font-bold">
              chatterbrain
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="default" asChild>
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button variant="primary" size="default" asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="text-foreground relative z-5 overflow-hidden bg-[linear-gradient(to_bottom,#ede9fe_0%,#cceef850_45%,#f5fbfd50_78%,#ffffff_100%)]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          {/* Left: Tagline */}
          <div className="flex flex-col gap-6">
            <Image
              src="/logo-text.png"
              alt="Chatterbrain"
              width={884}
              height={333}
              className="h-auto w-70 opacity-90"
            />
            <h1 className="font-heading text-4xl leading-tight font-extrabold md:text-5xl">
              <span className="text-[24px] font-light">
                Practice social skills
              </span>
              <br />
              <span className="text-md text-primary">
                without the pressure.
              </span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-gray-500">
              Interactive AI conversations that help you navigate real-world
              social situations with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/auth/sign-up">
                  <Sparkles size={18} />
                  Get Started Free
                </Link>
              </Button>
              <Button variant="tertiary" size="lg" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
            </div>
          </div>

          {/* Right: Interactive chat demo */}
          <div className="relative flex justify-center md:justify-end">
            {/* Decorative chips/stickers */}
            <Image
              src={assets.happy_face_sticker}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute top-0 left-0 z-0 w-50 -rotate-20"
            />
            <Image
              src={assets.good_empathy_chip}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute -top-8 -right-8 z-12 w-40 [animation-delay:-2s]"
            />
            <Image
              src={assets.stars_sticker}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute -bottom-10 -left-4 z-0 w-38 [animation-delay:-4s]"
            />

            <div className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
              <div className="from-primary/60 to-primary flex items-center gap-2 bg-linear-to-b px-4 py-4">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="text-sm font-medium text-white">
                  Social Scenario
                </span>
              </div>

              <div className="flex min-h-[320px] flex-col justify-between bg-gray-50/50 p-4">
                <AnimatePresence mode="wait">
                  {showDialogue1 && (
                    <div
                      key={dialogue1.id}
                      className="animate-fade-in flex flex-col gap-3"
                    >
                      <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-[85%]"
                      >
                        <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm">
                          {dialogue1.actorLine}
                        </div>
                      </motion.div>

                      <div className="mt-1 flex flex-col gap-2">
                        {dialogue1.options.map((option, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleNextDialogue(1)}
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + i * 0.08,
                              ease: "easeOut",
                            }}
                            className="border-primary/25 bg-primary/10 hover:bg-primary/20 w-full cursor-pointer rounded-xl border px-3 py-2.5 text-left text-sm text-gray-700 transition-colors"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-100 px-4 py-2.5 text-center">
                <span className="text-xs text-gray-400">
                  Tap any response to continue →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="relative bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="font-heading mb-3 text-3xl font-bold text-gray-900">
              What you can expect
            </h2>
            <p className="mx-auto max-w-md text-gray-500">
              Build real social confidence through interactive, judgment-free
              practice.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: Brain,
                title: "Personalized Scenarios",
                desc: "Tailored conversations based on your goals — from job interviews to first dates.",
              },
              {
                Icon: MessageSquare,
                title: "Realistic Dialogues",
                desc: "AI-powered characters that respond naturally, just like real people would.",
              },
              {
                Icon: Trophy,
                title: "Track Your Growth",
                desc: "See your improvement with scores and feedback after every session.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group cursor-default rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary/20 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                  <Icon size={24} />
                </div>
                <h3 className="font-heading mb-2 font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Practice section + second demo ───────────────── */}
      <section className="bg-[#f4f3ff] py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          {/* Left: Interactive chat demo (light) */}
          <div className="flex-cc relative">
            {/* Decorative chips/stickers */}
            <Image
              src={assets.tone_check_chip}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute -bottom-25 -left-8 z-20 w-55 [animation-delay:-1s]"
            />
            <Image
              src={assets.awkward_face_sticker}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute top-20 -right-9 z-0 w-50 [animation-delay:-10s]"
            />
            <Image
              src={assets.chat_bubbles_sticker}
              alt=""
              width={300}
              height={300}
              className="animate-bobble absolute right-10 -bottom-8 z-0 w-90 [animation-delay:-5s]"
            />

            <div className="relative z-10 w-full max-w-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              <div className="from-secondary to-primary flex items-center gap-2 bg-linear-to-r px-4 py-4">
                <span className="h-2 w-2 rounded-full bg-white/60" />
                <span className="text-sm font-medium text-white">
                  Social Scenario
                </span>
              </div>

              <div className="flex min-h-[300px] flex-col justify-between bg-gray-50 p-4">
                <AnimatePresence mode="wait">
                  {showDialogue2 && (
                    <div
                      key={dialogue2.id}
                      className="animate-fade-in flex flex-col gap-3"
                    >
                      <motion.div
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-[85%]"
                      >
                        <div className="rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm">
                          {dialogue2.actorLine}
                        </div>
                      </motion.div>

                      <div className="mt-1 flex flex-col gap-2">
                        {dialogue2.options.map((option, i) => (
                          <motion.button
                            key={i}
                            onClick={() => handleNextDialogue(2)}
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.1 + i * 0.08,
                              ease: "easeOut",
                            }}
                            className="border-primary/20 bg-primary/10 hover:bg-primary/20 w-full cursor-pointer rounded-xl border px-3 py-2.5 text-left text-sm text-gray-700 transition-colors"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-100 bg-white px-4 py-2.5 text-center">
                <span className="text-xs text-gray-400">
                  Tap any response to continue →
                </span>
              </div>
            </div>
          </div>
          {/* Right: Benefits */}
          <div className="flex flex-col gap-5">
            <span className="bg-secondary/10 text-secondary inline-block w-fit rounded-full px-3 py-1 text-sm font-medium">
              Practice Anytime
            </span>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Real situations.
              <br />
              Safe space to practice.
            </h2>
            <p className="leading-relaxed text-gray-500">
              From awkward small talk to tough workplace conversations —
              Chatterbrain has scenarios for every social challenge you face.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "Realistic conversation practice",
                "Personalized feedback and scoring",
                "Track your progress over time",
              ].map((text) => (
                <div key={text} className="flex items-center gap-2.5">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="text-gray-700">{text}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Button
                className="bg-black text-white hover:bg-black/70"
                variant="primary"
                asChild
              >
                <Link href="/auth/sign-up">Start Practicing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <div className="animate-float absolute top-0 left-0 h-[550px] w-[550px] rounded-full bg-[#54cbe2] blur-[100px] [animation-delay:0s]" />
          <div className="animate-float absolute top-[100px] left-[100px] h-[400px] w-[40px] rounded-full bg-[#54cbe2] blur-[100px] [animation-delay:0s]" />
          <div className="animate-float absolute right-[-200px] bottom-[100px] h-[600px] w-[600px] rounded-full bg-[#30ffbd] blur-[100px] [animation-delay:-9s]" />
          <div className="animate-float absolute top-[40%] right-[10%] z-99 h-[400px] w-[400px] rounded-full bg-[#8d54e2]/50 blur-[100px] [animation-delay:-10s]" />
          <div className="animate-float absolute top-0 right-0 z-99 h-[500px] w-[400px] rounded-full bg-[#8d54e2] blur-[100px] [animation-delay:-15s]" />
        </div>
        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 text-center text-white">
          {/* Decorative chips/stickers */}
          <Image
            src={assets.star_sticker}
            alt=""
            width={300}
            height={300}
            className="absolute top-10 left-[10%] z-0 w-[80px] opacity-80"
          />
          <Image
            src={assets.chatterbrain_smile_sticker}
            alt=""
            width={300}
            height={300}
            className="absolute right-[15%] bottom-10 z-0 w-40 opacity-80 [animation-delay:-2s]"
          />
          <Image
            src={assets.confident_chip}
            alt=""
            width={300}
            height={300}
            className="absolute top-20 right-[10%] z-0 w-30 opacity-80 [animation-delay:-4s]"
          />
          <Image
            src={assets.heart_hands_sticker}
            alt=""
            width={300}
            height={300}
            className="absolute bottom-5 left-[20%] z-0 w-[85px] opacity-80 [animation-delay:-3s]"
          />

          <div className="relative z-10 mx-auto max-w-2xl rounded-3xl px-6 text-black">
            <h2 className="font-heading mb-4 text-3xl font-extrabold">
              Ready to level up your social game?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Join thousands of chatterbrains building better social skills — no
              judgment, just practice.
            </p>
            <Button variant="tertiary" size="lg" asChild>
              <Link href="/auth/sign-up">
                <Sparkles size={18} />
                Get Started Free
              </Link>
            </Button>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="mx-auto mb-4 max-w-2xl rounded-3xl bg-white/70 px-6 py-6 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-text.png"
                alt="Chatterbrain"
                width={120}
                height={40}
                className="h-auto opacity-80"
              />
            </Link>
            <p className="text-sm text-black/50">
              © {new Date().getFullYear()} Chatterbrain. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <div className="absolute inset-0 z-0 overflow-hidden opacity-65">
        <div className="animate-float absolute top-0 left-0 h-[550px] w-[550px] rounded-full bg-[#54cbe2] blur-[100px] [animation-delay:0s]" />
        <div className="animate-float absolute top-[100px] left-[100px] h-[400px] w-[40px] rounded-full bg-[#54cbe2] blur-[100px] [animation-delay:0s]" />
        <div className="animate-float absolute right-[-200px] bottom-[100px] h-[600px] w-[600px] rounded-full bg-[#30ffbd] blur-[100px] [animation-delay:-9s]" />
        <div className="animate-float absolute top-[40%] right-[10%] z-99 h-[400px] w-[400px] rounded-full bg-[#8d54e2]/50 blur-[100px] [animation-delay:-10s]" />
        <div className="animate-float absolute top-0 right-0 z-99 h-[500px] w-[400px] rounded-full bg-[#8d54e2] blur-[100px] [animation-delay:-15s]" />
        <div className="animate-float absolute bottom-0 left-0 z-1 h-[1000px] w-[1000px] rounded-full bg-[#54cbe2]/65 blur-[100px] [animation-delay:-20s]" />
      </div>
    </div>
  );
}
