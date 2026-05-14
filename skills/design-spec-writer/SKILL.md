---
name: design-spec-writer
description: Generate UX design specifications before implementing UI features. Use when building new UI components, adding features with user-facing elements, or deciding between UX approaches. Triggers on "design spec", "how should I design", "UI for", "component for", or feature requests mentioning interface elements.
---

# Design Spec Writer

Generate comprehensive UX design specifications BEFORE implementation using a two-stage approach.

## When to Use

- Before implementing any user-facing UI component
- When choosing between different UX patterns
- When starting a new feature with interface elements
- When user asks "how should I design..." or "what's the best UX for..."

## Design Taste References (read first)

These references at `~/.claude-design-skills/shared/design-taste/` set what good looks like and what to avoid. Read the relevant ones before drafting a spec:

- `anti-patterns.md` — bans (side-stripe borders, gradient text, hero-metric template, identical card grids, em dashes, AI slop reflexes)
- `typography.md` — type scale, font pairing, modular scales
- `color-and-contrast.md` — OKLCH, tinted neutrals, theme decisions
- `spatial-design.md` — spacing systems, grids, visual hierarchy

The skill's own `references/anti-patterns.md` covers spec-time pattern advice; the shared `anti-patterns.md` covers implementation-time bans. Use both.

## Two-Stage Process

### Stage 1: Strategic Scaffold (WHAT)

Focus on the high-level solution, not implementation details.

**Include:**
- Recommended UX approach and why it fits
- High-level component structure (e.g., "modal dialog" vs "inline expansion")
- Key user flows and states
- Design rationale aligned with product context
- Critical considerations (constraints, edge cases, integrations)

**Exclude (for Stage 2):**
- Detailed component specs
- Specific animations
- Exact button text / microcopy
- ARIA details
- Breakpoint specifics

**Target length:** 150-300 words

See [strategic-scaffold-guide.md](references/strategic-scaffold-guide.md) for detailed guidance.

### Stage 2: Implementation Details (HOW)

Transform the strategic scaffold into actionable implementation guidance.

**Include:**

1. **Component Selection & Styling**
   - Which design system components to use
   - Custom compositions needed
   - Visual hierarchy (primary/secondary/tertiary elements)
   - Color and typography (reference tokens, not hardcoded values)

2. **Layout & Spacing**
   - Overall structure (grid/flex/stack, columns)
   - Container constraints and alignment
   - Responsive behavior at each breakpoint
   - Spacing specifications using design tokens
   - Critical considerations (overflow, touch targets, line width)

3. **Copywriting**
   - Exact button labels (action-oriented, 1-3 words)
   - Field labels, placeholders, helper text
   - Success/error/warning/loading messages
   - Section titles and navigation text
   - Tone matching brand voice

See [implementation-expert-guide.md](references/implementation-expert-guide.md) for detailed guidance.

## Context Gathering

Before generating specs, gather relevant context:

### Step 1: Check for Design Context

Look for `design-context/` folder in project root:
```
design-context/
├── brand.md         # Voice & tone
├── colors.md        # Color system
├── typography.md    # Font specs
├── layout.md        # Spacing & breakpoints
├── components.md    # Component patterns
├── product-context.md  # Product & personas
└── design-tokens.json  # Machine-readable tokens
```

Read relevant files based on the feature:
- **Visual styling:** colors.md, typography.md
- **Layout questions:** layout.md
- **Component selection:** components.md
- **Tone/copy:** brand.md
- **User context:** product-context.md

### Step 2: Understand Current Implementation

If modifying existing features:
- Review relevant component files
- Note existing patterns and styling
- Identify integration points

### Step 3: Generate Spec

Apply the two-stage process with gathered context.

## Output Format

```markdown
# Design Specification: [Feature Name]

## Strategic Solution

[Stage 1 output - 150-300 words]

- **Recommended Approach:** [Pattern/component and why]
- **Core Experience:** [User flow and interaction model]
- **Key States:** [Main states the UI needs]
- **Rationale:** [Why this approach fits the product]
- **Critical Considerations:** [Edge cases, constraints]

---

## Implementation Details

### Component Selection & Styling
[Stage 2: Components, hierarchy, visual treatment]

### Layout & Spacing
[Stage 2: Structure, responsive behavior, spacing specs]

### Copywriting
[Stage 2: Exact text for all UI elements]
```

## Quality Standards

**DO:**
- Reference design tokens (e.g., `primary-500`, `spacing-lg`)
- Consider product context and personas
- Include error states and edge cases
- Keep scaffold concise and strategic
- Be specific in implementation (exact text, component names)

**DON'T:**
- Use hardcoded values (no `#58a6ff`, use `primary-500`)
- Skip error states and loading states
- Ignore responsive considerations
- Provide generic patterns without context
- Make Stage 1 too detailed (save details for Stage 2)

## Without Design Context

If no `design-context/` folder exists:

1. Generate a useful spec based on:
   - Tech stack analysis (package.json, tailwind.config)
   - Existing component patterns
   - Industry best practices

2. Include a note:
   > **Tip:** Run `design-context-manager` to create design context for more grounded specifications.

3. Make reasonable assumptions, noting them explicitly

## Common Patterns Reference

For common UX patterns, see [ux-patterns.md](references/ux-patterns.md).
For what to avoid, see [anti-patterns.md](references/anti-patterns.md).
