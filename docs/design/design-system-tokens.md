## Favored UI Patterns

Chatterbrain should favor calm, structured interface patterns that create hierarchy without relying on heavy decoration.

### Background and page structure

Use color sparingly:

- One primary accent per screen
- Secondary color only for rare emphasis or illustrations
- Metadata should usually be neutral
- Do not assign different colors to every content category
- Do not use color as the only meaning carrier

## Typography

The hierarchy should be obvious without relying on decoration.

Suggested scale:

- Page title: large, confident, clear
- Section title: medium, concise
- Body: comfortable reading size
- Metadata: smaller, neutral, subdued
- Helper text: readable, warm, not tiny

Avoid:

- Overly large marketing-style headings inside product UI
- Too many font weights
- All-caps labels except tiny metadata
- Decorative type treatments

## Layout

Use open layout, whitespace, alignment, and dividers before adding card containers.

Use cards only when:

- Content is interactive
- Content is a distinct module
- The grouping would otherwise be unclear
- The module has a meaningful state

Avoid:

- Stacking every section in a rounded card
- Same-size cards for unequal information
- Repetitive icon + title + paragraph cards
- Unnecessary shadows

Favored pattern:

- Main app/page background: white
- Secondary sections: muted background
- Important modules: muted or transparent background with a medium-width border
- Avoid heavy shadows as the primary way to separate content

Use background contrast, borders, spacing, and typography before using elevation.

Example direction:

```tsx
<section className="bg-background">
  <div className="border-muted bg-muted/40 rounded-3xl border-2 p-6">...</div>
</section>
```

### Borders over shadows

Prefer medium-width muted borders instead of heavy shadows.

Favored:

```tsx
className = "rounded-2xl border-2 border-border bg-background";
```

```tsx
className = "rounded-3xl border-2 border-muted bg-muted/30";
```

Avoid:

```tsx
className = "shadow-xl";
```

```tsx
className = "shadow-2xl";
```

```tsx
className = "shadow-lg hover:shadow-xl";
```

Shadows may be used sparingly for active overlays, popovers, menus, or highly focused interaction states, but they should not define the general visual system.

### Rounded corners

Use rounded corners generously but consistently. The interface should feel soft and approachable without becoming bubbly or childish.

Favored radius scale:

```tsx
rounded-xl    // small controls, badges, inputs
rounded-2xl   // standard modules, buttons, panels
rounded-3xl   // large featured modules or expressive focal points
rounded-full  // badges, pills, avatars, small status markers
```

Avoid mixing too many radius values on the same screen.

### Badge patterns

Badges should be quiet, readable, and semantic. They should not feel like a colorful icon grid.

Use soft background tints with clear text color.

Difficulty badge examples:

```tsx
<span className="bg-success/20 text-success rounded-full px-3 py-1 text-sm font-medium">
  Easy
</span>
```

```tsx
<span className="bg-warning/20 text-warning rounded-full px-3 py-1 text-sm font-medium">
  Medium
</span>
```

```tsx
<span className="bg-destructive/15 text-destructive rounded-full px-3 py-1 text-sm font-medium">
  Hard
</span>
```

Neutral metadata badge:

```tsx
<span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-sm font-medium">
  +50 XP
</span>
```

Skill badge:

```tsx
<span className="border-border bg-background text-foreground rounded-full border px-3 py-1 text-sm font-medium">
  Assertiveness
</span>
```

### Button hierarchy

The primary action should be visually obvious, but not loud.

Favored primary action:

```tsx
<Button className="rounded-2xl px-5 py-3 font-semibold">Start Encounter</Button>
```

Favored secondary action:

```tsx
<Button variant="outline" className="rounded-2xl border-2">
  Preview Actor
</Button>
```

Favored subtle action:

```tsx
<Button variant="ghost" className="text-muted-foreground rounded-xl">
  View history
</Button>
```

Do not make every action visually equal. The screen should clearly communicate which action matters most.

### Featured module pattern

For the most meaningful product moment on a screen, use a more distinctive but still restrained module.

Example: Start Encounter module

```tsx
<div className="border-primary/20 bg-primary/5 rounded-3xl border-2 p-6">
  ...
</div>
```

This pattern is appropriate for:

- Start Encounter
- AI practice composer
- helper tools area
- completion/progress feedback
- empty states

It should not be used for every section.

### Muted section pattern

Use muted sections to create calm grouping without over-carded layouts.

```tsx
<section className="border-border bg-muted/40 rounded-3xl border-2 p-6">
  ...
</section>
```

Use this for:

- scenario overview
- practice details
- actor summary
- skill list
- recent encounter history

Avoid placing every small item inside its own card. Prefer one calm section with internal spacing and dividers.

### Dividers and open grouping

When content is related but does not need a full container, prefer dividers and spacing.

```tsx
<div className="space-y-5">
  <div>...</div>
  <Separator />
  <div>...</div>
</div>
```

This is favored over stacking multiple boxed cards.

### Icon usage

Icons should support recognition, not decorate the screen.

Favored:

- one icon for a major section
- neutral icon color
- icon paired with text
- icon used to clarify meaning

Avoid:

- every section having a different colored icon
- decorative icons with no functional meaning
- icon grids that look like generic SaaS dashboards

### Expressive accent treatment

When adding personality, use one subtle accent treatment rather than multiple decorative effects.

Favored:

```tsx
className = "rounded-3xl border-2 border-primary/20 bg-primary/5";
```

```tsx
className = "rounded-full bg-primary/10 text-primary";
```

```tsx
className = "border-l-4 border-primary bg-muted/30";
```

Avoid:

- gradients
- glowing borders
- colorful shadows
- animated sparkles
- multiple competing accent colors

### General rule

Favor:

- white or near-white main backgrounds
- muted section backgrounds
- medium-width borders
- rounded corners
- soft semantic badges
- restrained accent tints
- clear typographic hierarchy

Avoid:

- heavy shadows
- overuse of cards
- generic dashboard patterns
- random color-coded sections
- decorative effects that do not improve comprehension

## Theme Variant Contract

Chatterbrain supports multiple visual theme variants such as Default, Brainstorm, Brainwashed, and Brainwave.

These variants are not separate design systems. They are different expressions of the same design system.

The default theme is the canonical foundation. If a screen is well-designed in the default theme, switching to another theme should not require restructuring the layout, changing the content hierarchy, or rewriting component logic.

### Core principle

Design the structure once. Let the theme reinterpret the mood.

Default theme owns:

- layout
- information hierarchy
- content priority
- component purpose
- action hierarchy
- accessibility expectations
- spacing relationships
- interaction patterns

Theme variants may modify:

- color temperature
- accent intensity
- border softness
- corner radius
- shadow depth
- surface contrast
- density
- decorative restraint
- emotional tone

Theme variants must not modify:

- what content appears first
- which action is primary
- whether a section is important
- whether metadata is secondary
- whether the screen is usable
- whether accessibility standards are met
- the basic structure of a component

### Theme philosophy

A strong Chatterbrain screen should survive every theme.

If the design only works in one theme, the structure is probably too dependent on decoration.

The default theme should establish a quiet, balanced, accessible foundation. Other themes should only shift the feeling of that foundation.

For example:

- Brainstorm may feel more energetic, rounded, spacious, and idea-forward.
- Brainwashed may feel more stripped down, high-contrast, reduced, or low-stimulation.
- Brainwave may feel softer, smoother, more ambient, or more expressive.
- Default should remain the neutral reference point.

These differences should come from tokens, not one-off component changes.

### Required implementation approach

Use semantic tokens and component-level pattern classes.

Prefer:

```tsx
className = "surface-panel";
```

```tsx
className = "surface-featured";
```

```tsx
className = "badge-difficulty-easy";
```

```tsx
className = "button-primary";
```

Avoid hardcoding theme-specific visual choices inside components:

```tsx
className = "rounded-3xl bg-cyan-50 shadow-xl p-8";
```

```tsx
className = "border-purple-200 bg-purple-50 text-purple-700";
```

```tsx
className = "shadow-lg hover:shadow-xl";
```

The component should describe the role of the element. The theme should decide how that role looks.

### Theme-sensitive token categories

The following values may vary by theme:

```css
--radius-control
--radius-badge
--radius-panel
--radius-featured

--space-control-x
--space-control-y
--space-panel
--space-section

--shadow-surface
--shadow-popover
--shadow-featured

--border-width-panel
--border-width-featured

--surface-background
--surface-muted
--surface-panel
--surface-featured

--accent
--accent-soft
--accent-foreground

--success
--success-soft
--warning
--warning-soft
--destructive
--destructive-soft
```

### Component rule

Components should use semantic surface and state patterns:

```tsx
<div className="surface-panel">...</div>
```

```tsx
<div className="surface-featured">...</div>
```

```tsx
<span className="badge badge-success">Easy</span>
```

```tsx
<Button variant="primary">Start Encounter</Button>
```

Do not create separate component layouts for each theme unless the user experience truly requires it.

### Design review rule

When reviewing a screen, evaluate it first in the default theme.

Ask:

1. Is the hierarchy clear without relying on theme personality?
2. Is the primary action obvious?
3. Are metadata and secondary details visually secondary?
4. Does the screen still feel structured if color, radius, and shadow change?
5. Are the theme-specific differences coming from tokens rather than ad hoc classes?

If the answer is no, fix the structure before adjusting the theme.
