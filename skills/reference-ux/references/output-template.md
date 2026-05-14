# Reference Document Output Template

Use this template when writing `reference.md` in Phase 4. Adapt sections based on what was actually observed — not every flow will have all sections.

---

```markdown
# UX Reference: {Product} — {Flow Name}

> **Source:** {URL}
> **Captured:** {date}
> **Focus:** {what the user asked to study}

## Executive Summary

{2-3 sentences: what this flow does, why it's effective, and the single most transferable insight.}

---

## Flow Architecture

{Diagram showing the full flow structure. Use a code block for ASCII art:}

```
Phase 1: {Phase name} ({description})
  1. {Screen name} — {input type}
  2. {Screen name} — {input type}
  ...
  → {Transition/gateway screen}

Phase 2: {Phase name} ({description})
  1. {Screen name} — {input type}
  2. {Screen name} — {input type}
  ...
```

**Phase boundaries are signaled by:**
- {How the UI signals a phase change — e.g., layout shift, CTA label change, progress indicator appearance}

---

## Screen-by-Screen Breakdown

### {Phase 1 Name}

#### Screen 1: {Name}
`screenshots/01-desktop-{name}.png`

**Layout:** {description}
**Input:** {type and details}
**Heading:** "{exact text}"
**CTA:** "{label}" — {position, state logic}

**Key decisions:**
1. {Decision} — {rationale}
2. {Decision} — {rationale}

{Repeat for each screen in the phase}

#### Gateway: {Transition Screen Name}
`screenshots/NN-desktop-{name}.png`

{Description of the interstitial and its purpose}

### {Phase 2 Name}

{Continue screen-by-screen breakdown}

---

## Interaction Patterns

### Selection Affordance
{How selected state is communicated — border weight, fill, checkmark, etc.}
{Is it consistent across component types (cards, pills, toggles)?}

### CTA State Machine
```
{state diagram, e.g.:}
Unselected → [user selects] → Selected → CTA enabled
CTA disabled ←→ CTA enabled (based on: {condition})
```

### Footer Contract
| Position | Role | Examples seen |
|----------|------|---------------|
| Left | {Secondary action} | {Skip, Get tips, Back} |
| Right | {Primary action} | {Next, Save, Get started} |

### Modal / Sheet Contract
| Element | Desktop | Mobile |
|---------|---------|--------|
| Container | {Modal, centered} | {Bottom sheet} |
| Title | {Matches parent label?} |
| Input | {Single field? Multiple?} |
| Footer | {Left: secondary, Right: primary} |
| Dismiss | {X button, click outside} |

### Skip Pattern
{When Skip is offered, where it's positioned, and the visual weight}

### Save & Exit
{When it appears, what triggers its appearance, positioning}

---

## Layout Templates

{List the distinct layout patterns used across the flow:}

### Template 1: {Name — e.g., "Centered Single Column"}
- **Used in:** Screens {list}
- **Structure:** {description}
- **Whitespace strategy:** {description}

### Template 2: {Name — e.g., "Split with Context Card"}
- **Used in:** Screens {list}
- **Structure:** {description}
- **Context card:** {what it shows, how it evolves}

### Template 3: {Name — e.g., "Sidebar + Workspace"}
- **Used in:** Screens {list}
- **Structure:** {description}
- **Sidebar behavior:** {collapsed/expanded states, what's shown}

---

## Copy & Tone

### Question Format
{Are headings questions or instructions? Conversational or transactional?}
{Examples from the flow}

### CTA Language Evolution
{How CTA labels change through the flow — e.g., "Next" → "Get started" → "Submit"}

### Helper Text Pattern
{When helper text appears, where it's positioned, what it communicates}
{Privacy reassurances, expectation-setting, regulatory explanations}

### Validation & Error Language
{How errors surface — inline, toast, modal? When validation triggers?}

---

## Visual Design Tokens

{Approximate values observed — these are for reference, not pixel-perfect extraction:}

### Typography
| Role | Size (approx) | Weight | Style |
|------|---------------|--------|-------|
| Page heading | {e.g., 32-36px} | {e.g., Bold/Semibold} | {e.g., Serif} |
| Body | {e.g., 16px} | Regular | Sans-serif |
| Helper text | {e.g., 14px} | Regular | Sans-serif |
| CTA label | {e.g., 16px} | Semibold | Sans-serif |

### Colors
| Role | Value (approx) | Usage |
|------|----------------|-------|
| Primary CTA | {e.g., #000000} | Next/Submit buttons |
| Disabled CTA | {e.g., #CCCCCC} | Inactive buttons |
| Selection border | {e.g., #000000, 2px} | Selected cards/pills |
| Background | {e.g., #FFFFFF} | Main content area |
| {Brand accent} | {e.g., #FF385C} | {Where used} |

### Spacing
| Context | Value (approx) |
|---------|----------------|
| Page padding | {e.g., 48-64px} |
| Card gap | {e.g., 16-24px} |
| Section spacing | {e.g., 32-48px} |
| Input field height | {e.g., 48-56px} |

### Border Radii
| Element | Value (approx) |
|---------|----------------|
| Cards | {e.g., 12px} |
| Buttons | {e.g., 8px} |
| Modals | {e.g., 16px} |
| Input fields | {e.g., 8px} |

---

## Responsive Adaptations

### Breakpoint Strategy
{Mobile-first expanded to desktop, or desktop-first adapted?}

### Key Transformations

| Desktop | Mobile | Why |
|---------|--------|-----|
| {e.g., Sidebar nav} | {e.g., Top pill + expandable overlay} | {e.g., Saves horizontal space} |
| {e.g., Centered modal} | {e.g., Bottom sheet} | {e.g., Native mobile pattern, thumb-friendly} |
| {e.g., Split layout} | {e.g., Single column stack} | {e.g., Content stacks naturally} |
| {e.g., Right-aligned CTA} | {e.g., Full-width bottom CTA} | {e.g., Thumb-friendly, impossible to miss} |

### What Stays the Same
- {e.g., Information architecture / flow order}
- {e.g., One question per screen philosophy}
- {e.g., Footer contract (secondary left, primary right)}
- {e.g., CTA state machine (disabled ↔ enabled)}

---

## Design Principles (Extracted)

{The governing principles behind this flow, derived from the patterns observed:}

1. **{Principle name}** — {Description. E.g., "One question per screen — reduces cognitive load to a single decision at each step"}
2. **{Principle name}** — {Description}
3. **{Principle name}** — {Description}
4. **{Principle name}** — {Description}
5. **{Principle name}** — {Description}

---

## Implementation Notes

{Practical notes for a developer or designer building something inspired by this reference:}

### Components Needed
1. {Component — e.g., "SelectionCard (supports card and pill variants)"}
2. {Component — e.g., "ProgressSidebar (collapsed icon-only ↔ expanded with labels)"}
3. {Component — e.g., "FocusedInputModal (reusable for text, search, upload)"}
4. ...

### State Management
- {What state needs to persist across screens}
- {What state is ephemeral per screen}
- {Save/resume behavior}

### Accessibility Considerations
- {Focus management between screens}
- {ARIA roles for custom selection components}
- {Screen reader flow for progress indicators}
- {Keyboard navigation for card/pill selection}
```
