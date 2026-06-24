# Chatterbrain

Chatterbrain is a social-skills practice app for autistic users. It offers a safe, low-pressure space to rehearse difficult or nuanced social situations before they happen in real life.

---

## Product taxonomy

| Concept           | What it is                                                   | Examples                                                     |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Social Domain** | Browse/recommendation grouping (many-to-many with scenarios) | Handling Conflict, Meeting Someone New, Workplace            |
| **Scenario**      | Primary content — a specific social situation to practice    | Meeting Your New Coworker, Confronting a Disruptive Roommate |
| **Encounter**     | A user's run through a scenario                              | Start Encounter, Resume Encounter, Review Encounter          |
| **Actor**         | AI persona with voice and traits                             | Hurt Friend, Blunt Roommate                                  |
| **Helper**        | Reusable conversation aid during/after an encounter          | Tone Analyzer, Rephraser, Cue Detector                       |
| **Practice Lane** | Mode of practice (on each scenario)                          | Quick Rounds, Encounter, Group Chat Lab, Skill Drills        |

**Domains ⇄ Scenarios** (many-to-many). **Scenario → Encounter** (one user run). Helpers are separate from the taxonomy.

---

## Tech stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **UI:** React 19, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com)
- **Data:** PostgreSQL via [Prisma](https://www.prisma.io)
- **Auth:** [Supabase Auth](https://supabase.com/docs/guides/auth)
- **AI:** OpenAI (dialogue, analysis), ElevenLabs (TTS), speech-to-text API routes
- **Client state:** XState (encounter turn flow), TanStack Query, Zustand (helpers/UI)
- **Tests:** Vitest, Playwright

---

## Getting started

```bash
npm install
npm run prisma:all     # migrate + generate client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script                    | Description              |
| ------------------------- | ------------------------ |
| `npm run dev`             | Development server       |
| `npm run build`           | Production build         |
| `npm run prisma:migrate`  | Apply migrations         |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run test`            | Vitest                   |

---

## Repository layout

```
src/
├── app/                    # Routes (thin pages)
│   └── (app)/
│       ├── practice/       # Practice scenarios and browse Practice Lanes
│       └── library/        # Chatterbrain Library
├── actions/                # Server actions → read services / use cases
│   ├── scenario/
│   ├── auth/
│   └── encounter/
├── composition/            # make* factories
├── features/
│   ├── domain/             # Social Domain browse
│   ├── scenario/           # Scenario catalog (primary content)
│   ├── encounter/          # Encounter engine + persistence
│   ├── helper/             # Helper registry
│   ├── actor/
├── components/             # Shared UI + providers
├── lib/                    # db, constants, queries
└── types/                  # Shared enums (practice.types)
```

Bounded contexts follow clean architecture: `domain` → `application` → `infrastructure` → `presentation`.

---

## User-facing language

Use: **Domain**, **Scenario**, **Encounter**, **Actor**, **Helper**, **Practice Lane**.
