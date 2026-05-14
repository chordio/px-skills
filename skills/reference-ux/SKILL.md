---
name: reference-ux
description: >
  Capture and reverse-engineer UX patterns from live products. Point at any URL and say
  "reference this flow" — the agent browses the experience (desktop + mobile), captures
  screenshots, and produces a structured UX reference document. Feeds design-spec-writer
  and design-context-manager as concrete inspiration. Trigger on URLs with intent to
  study UX patterns, "reference", "how does X handle", "reverse engineer the UX".
user-invocable: true
---

# Reference UX

Reverse-engineer UX patterns from live products by browsing them. Output: a structured reference document with screenshots, annotated flow architecture, interaction patterns, responsive adaptations, and design tokens.

## Design Taste References (read first)

When characterizing what a competitor does well or poorly, judge against the references at `~/.claude-design-skills/shared/design-taste/`:

- `anti-patterns.md` — note when the captured product violates these bans (helpful when the user wants to do better, not just copy)
- `typography.md`, `color-and-contrast.md`, `spatial-design.md`, `interaction-design.md`, `responsive-design.md`, `ux-writing.md` — domain references for naming what you observe (e.g., "border-weight selection affordance" rather than "they used a border")

## Workflow

```
Phase 1: DIRECTION   → Parse target, confirm scope and focus
Phase 2: BROWSE      → Walk through the flow on desktop, then mobile
Phase 3: ANALYZE     → Synthesize patterns, decisions, and architecture
Phase 4: DOCUMENT    → Write the structured reference
```

---

## Phase 1: Direction

**Parse target:**
- URL (`airbnb.com/host`) → slug = `airbnb-host-onboarding`
- Product + flow description (`"Stripe's pricing page"`) → slug = `stripe-pricing`
- The user may also specify a focus area: "just the form steps" or "the onboarding flow"

### Resolve Output Path

Determine where the reference will live:

1. **If running inside a git repo** (`git rev-parse --is-inside-work-tree` returns true):
   - `REFERENCES_DIR = docs/references`
   - This keeps references project-local and version-controlled.
2. **If outside a git repo**:
   - Derive a slug from the cwd: `PROJECT_SLUG=$(basename "$PWD" | tr -cd 'a-zA-Z0-9._-')`
   - `REFERENCES_DIR = $HOME/.gstack/projects/$PROJECT_SLUG/references`
   - This persists references across sessions even without a repo.

**Check for existing references** at `$REFERENCES_DIR/$slug/`. If a reference for the same product/flow already exists, offer: view existing, refresh, or capture a different flow.

**Confirm scope:**
```
I'll capture the [flow name] from [product]. Here's my plan:

1. Walk through the full flow on desktop (1440px)
2. Repeat key screens on mobile (390px)
3. Document patterns, interactions, and design decisions

Focus area: [full flow / specific section]
Sound good?
```

**Create directory:**
```bash
mkdir -p "$REFERENCES_DIR/$slug/screenshots"
```

---

## Phase 2: Browse & Capture

This is the core of the skill. You walk through the flow as a user would, capturing and annotating each step.

See [workflows/browse-and-capture.md](workflows/browse-and-capture.md) for the detailed browser workflow and supported browser automation backends. Prefer `/browse` from gstack when available; otherwise use Browser Use / in-app browser tools, Playwright, or Puppeteer / Chrome remote debugging. If no backend can navigate, screenshot, resize, inspect DOM/accessibility data, interact, and evaluate JavaScript, stop and tell the user that browser automation is required.

**High-level sequence:**

### Desktop Pass (1440px viewport)

1. Navigate to the starting URL
2. For each screen in the flow:
   a. Screenshot the current state → save to `screenshots/`
   b. Note the **layout** (what's on screen, spatial arrangement)
   c. Note **interactive elements** (buttons, inputs, selections) and their states
   d. Note **copy** (headings, helper text, CTAs — exact wording matters)
   e. Note **design decisions** (what they chose NOT to do is as important as what they did)
   f. Interact to advance to the next screen
3. Capture state transitions (hover states, selection states, enabled/disabled CTAs)
4. Look for modals, bottom sheets, or sub-flows within screens

### Mobile Pass (390px viewport)

1. Resize viewport to 390px width
2. Walk through the same flow, focusing on:
   - What layout changes (sidebar → pill, split → stack, modal → bottom sheet)
   - What interaction changes (tap targets, swipe, full-width buttons)
   - What stays the same (information architecture, flow order, state machine)
3. Screenshot key screens that differ from desktop
4. Note the responsive adaptation strategy

### What to Capture Per Screen

For each screen, collect:

| Element | What to note |
|---------|-------------|
| **Layout** | Content structure, columns, whitespace, visual hierarchy |
| **Navigation** | Progress indicators, back/exit, breadcrumbs, step counters |
| **Input type** | Cards, pills, text fields, steppers, file upload, map, etc. |
| **CTA pattern** | Label, position, enabled/disabled logic, primary/secondary styling |
| **Copy tone** | Conversational vs transactional, question format, helper text |
| **Empty state** | Illustrations, placeholder content, onboarding hints |
| **Validation** | How errors surface, inline vs modal, when validation triggers |
| **Escape hatches** | Skip, save & exit, back, close — what's available and where |

### Screenshot Naming Convention

```
screenshots/
├── 01-desktop-{screen-name}.png
├── 01b-desktop-{screen-name}-{state}.png    # Hover, selected, etc.
├── 02-desktop-{screen-name}.png
├── ...
├── 01-mobile-{screen-name}.png
├── 02-mobile-{screen-name}.png
└── ...
```

---

## Phase 3: Analyze

After browsing, synthesize what you observed into patterns.

### Flow Architecture

Map the full flow structure:

```
Phase 1: [Phase name] (e.g., "Routing")
  Step 1: [Screen] — [Input type] — [Key decision]
  Step 2: [Screen] — [Input type] — [Key decision]
  ...
  Gateway: [Interstitial/transition screen]

Phase 2: [Phase name] (e.g., "Builder")
  Step 1: [Screen] — [Input type] — [Key decision]
  ...
```

### Identify Recurring Patterns

Look for patterns that repeat across screens:

- **Layout templates** — How many distinct layouts exist? (e.g., centered single-column, split with context card, sidebar + workspace)
- **Input paradigms** — Card grid, pill grid, text field, stepper, file upload, map verification
- **State machine** — The universal state flow (empty → interacting → filled → CTA enabled)
- **Modal/sheet contract** — When modals are used, what's consistent about them
- **Navigation evolution** — How nav changes as commitment deepens
- **Copy patterns** — Question format, tone shifts, helper text placement

### Identify Design Decisions

For each major pattern, ask: **why did they choose this over the obvious alternative?**

Examples:
- "One question per screen instead of a multi-field form — reduces cognitive load"
- "Auth deferred until after first interaction — captures intent before creating friction"
- "Border-weight-only selection instead of radio buttons — cleaner, more confident"
- "Icons without labels in sidebar — compact, labels available on hover/expand"

### Responsive Strategy

Characterize the overall approach:
- Mobile-first expanded to desktop, or desktop-first adapted?
- What containers change (sidebar → pill, modal → sheet)?
- What stays identical across breakpoints?

### Cross-check against taste references

For each notable pattern, ask:
- Does it match or violate anything in `~/.claude-design-skills/shared/design-taste/anti-patterns.md`?
- If it's an anti-pattern, note explicitly — the user may want to do the opposite
- If it's an exemplar (e.g., principled spacing rhythm, restrained color, calibrated copy), name the underlying principle from the domain references

---

## Phase 4: Document

Write the reference to `$REFERENCES_DIR/$slug/reference.md` using the template in [references/output-template.md](references/output-template.md).

### Reference Manifest (reference.json)

```json
{
  "name": "Airbnb Host Onboarding",
  "slug": "airbnb-host-onboarding",
  "sourceUrl": "https://airbnb.com/host",
  "description": "Progressive multi-step onboarding flow for new experience hosts",
  "capturedAt": "<ISO timestamp>",
  "screenshotCount": 24,
  "desktopScreenshots": 16,
  "mobileScreenshots": 8,
  "flowSteps": 13,
  "keyPatterns": [
    "progressive-disclosure",
    "one-question-per-screen",
    "deferred-auth",
    "context-card-anchor",
    "modal-for-focused-input"
  ]
}
```

### Present the Reference

```
Reference captured! Here's what I found:

**Flow:** {flow name} ({step count} screens across {phase count} phases)
**Key insight:** {the single most transferable pattern}
**Top patterns:**
1. {pattern} — {why it works}
2. {pattern} — {why it works}
3. {pattern} — {why it works}

Full reference: $REFERENCES_DIR/$slug/reference.md
Screenshots: {screenshot count} captured ({desktop} desktop, {mobile} mobile)

Feeds /design-spec-writer or /design-context-manager as concrete inspiration.
```

---

## Output Structure

```
$REFERENCES_DIR/$slug/
├── reference.json       # Structured metadata
├── reference.md         # The full reference document
└── screenshots/         # Annotated screenshots
    ├── 01-desktop-*.png
    ├── 02-desktop-*.png
    ├── 01-mobile-*.png
    └── ...
```

Where `$REFERENCES_DIR` is either `docs/references` (in a git repo) or `~/.gstack/projects/<slug>/references` (outside one).

---

## Example Invocations

### Full flow reference
```
/reference-ux airbnb.com/host — capture the experience hosting onboarding flow
```

### Focused reference
```
/reference-ux stripe.com/pricing — focus on the plan comparison and checkout flow
```

### Reference for a specific pattern
```
/reference-ux linear.app — how do they handle the project status dashboard layout
```

### Mobile-first reference
```
/reference-ux duolingo.com — focus on the lesson completion flow, especially mobile
```

---

## Example Session

```
User: /reference-ux airbnb.com/host — I want to understand how they break
      a complex form into friendly steps

Claude: I'll capture the Airbnb host onboarding flow. Here's my plan:

        1. Walk through the full flow on desktop (1440px)
        2. Repeat key screens on mobile (390px)
        3. Document patterns, interactions, and design decisions

        Focus: How they decompose a complex form into progressive steps.
        Sound good?

User: Yes, go for it

Claude: [Navigates to airbnb.com/host]
        [Screenshots each step, noting patterns]
        [Resizes to 390px, captures mobile variants]

        Reference captured! Here's what I found:

        **Flow:** Host Experience Onboarding (13 screens across 2 phases)
        **Key insight:** The flow uses a rigid one-question-per-screen template
        where only the input type varies — users learn the layout once and
        then focus purely on each question.

        **Top patterns:**
        1. Progressive disclosure — one question per screen, never a dense form
        2. Deferred auth — first interaction is friction-free, login comes after intent
        3. Context card anchor — previous selections persist visually as reference

        Full reference: docs/references/airbnb-host-onboarding/reference.md
        Screenshots: 24 captured (16 desktop, 8 mobile)
```

---

## Tips

- **Browse as a real user would.** Don't skip steps or use shortcuts — the flow order is part of the design.
- **Capture state transitions.** Hover states, disabled→enabled CTAs, and empty→filled inputs reveal the interaction model.
- **Note what's absent.** Missing progress bars, omitted field labels, no error messages — these are deliberate design decisions.
- **Quote exact copy.** "Welcome to Airbnb" vs "Create an account" tells you about tone. Record headings, CTAs, and helper text verbatim.
- **Time-box browsing.** Desktop pass: 10-15 minutes. Mobile pass: 5-10 minutes. Analysis: 5-10 minutes.
- **Think transferably.** The goal isn't to copy the source — it's to extract patterns that work in any context.

## Attribution

Adapted from chordio/workbench's `reference-ux` skill. Original workflow and output template structure © chordio. This adaptation strips the Chordio-specific `products/<product>/projects/<project>/` filesystem convention.
