# Chatterbrain Design Principles

Chatterbrain is an AI-powered social-practice app for autistic and neurodivergent users. The interface should feel like a calm, structured practice environment — not a generic AI SaaS dashboard, not a childish learning app, and not a clinical worksheet.

## Core design thesis

Quiet foundation, expressive focal points.

Most of the UI should be restrained, readable, and low-cognitive-load. Personality should appear only where the product experience becomes emotionally meaningful.

## Design personality

Chatterbrain should feel:

- Calm but not boring
- Friendly but not childish
- Structured but not clinical
- Polished but not flashy
- Supportive without being patronizing
- Neurodivergent-conscious without looking like an accessibility worksheet

## Inspiration

Quizlet-style design:

- Strong information hierarchy
- Clean typography
- Calm, muted surfaces
- Obvious next action
- Minimal decorative noise

But Chatterbrain should have more distinctive personality in:

- AI practice/encounter modules
- Helper tools
- Completion states, badges, XP and progress
- Encouragement and empty/error states
- Actor/persona details

## Visual principle

70% neutral structure:

- typography
- whitespace
- alignment
- clear grouping
- calm surfaces

20% subtle brand character:

- gentle accent borders
- rounded details
- friendly microcopy
- quiet mascot/brain references
- soft affordances

10% expressive pop:

- reserved for Start Encounter
- AI practice/chat state
- completion/progress moments
- emotionally meaningful feedback

## Do not use

- Gradient text
- Glassmorphism
- Heavy shadows
- Generic SaaS hero sections
- Random colorful icon grids
- Too many card containers
- Purple/green/orange/blue competing sections
- Decorative shapes without meaning
- Overly playful children’s app styling

Favored Visual Patterns

Favor the patterns documented in docs/design/design-system-tokens.md, especially:

white or near-white main backgrounds
muted section backgrounds
medium-width muted borders instead of heavy shadows
rounded-xl, rounded-2xl, rounded-3xl, and rounded-full used consistently
soft semantic badges such as bg-success/20 text-success rounded-full
restrained accent-tinted modules such as border-primary/20 bg-primary/5
dividers, spacing, and typography instead of excessive card containers

When separating content, prefer border, background contrast, spacing, and hierarchy before using shadows.

Do not use heavy shadows as the default surface treatment.
