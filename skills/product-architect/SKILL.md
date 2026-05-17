---
name: product-architect
description: >
  Initiative-level product planning. Takes a product concept or existing research, researches
  the space, decomposes the initiative into features, defines the product architecture
  (information architecture, user flows, shared patterns, cross-feature touchpoints), and
  batch-creates one directory per feature under features/. Produces product-brief.md,
  architecture.md, and features.json at the workspace root. Run this BEFORE product-spec-writer when the user
  describes a multi-feature product. Trigger on "I want to build a ...", "what should we build
  next", "here's my product idea", or when the workspace is new and empty. For per-feature
  research after the breakdown, use product-researcher.
---

# Product Architect

Figure out what's worth building, break it into features, and set up the workspace for parallel execution. This is the first skill to run on a new product — it turns a vague concept into a structured product with an architecture that keeps independently-built features coherent.

The output is three artifacts at the workspace root:
- **`product-brief.md`** — initiative-level one-pager (what, who, why, landscape)
- **`architecture.md`** — the shared product framework (IA, user flows, shared patterns, cross-feature touchpoints)
- **`features.json`** — feature breakdown manifest (slugs, dependencies, priorities)

These form the **shared product context** that every downstream skill (`product-researcher`, `product-spec-writer`, `design-spec-writer`) loads before doing per-feature work.

## When to Use

- When the user opens a new workspace and wants to figure out what to build
- When the user describes a product idea at the initiative level
- When the user says "what should we build", "I have an idea for...", "let's figure out what to build"
- When the user drops in existing research, a PRD, or market data and wants to structure it
- When the workspace has no `product-brief.md` or `features.json`
- When `product-spec-writer` bounces back because the input spans multiple features

## Relationship to Other Skills

| Skill | Level | Job |
|-------|-------|-----|
| **product-architect** (this) | Initiative | Research the space, decompose into features, define architecture |
| **product-researcher** | Feature | Deep research on a specific feature within the product |
| **product-spec-writer** | Feature | Requirements doc for a single feature |
| **design-spec-writer** | UI surface | UX spec for a feature's interface |

## Workflow

```
Phase 1: UNDERSTAND  → Parse the concept, clarify scope
Phase 2: RESEARCH    → Become an expert in the space
Phase 3: COMPILE     → Write findings to the wiki
Phase 4: BRIEF       → Write the product brief
Phase 5: DECOMPOSE   → Break into features, get builder feedback
Phase 6: ARCHITECT   → Define the product architecture
Phase 7: CREATE      → Batch-create feature directories
```

---

## Phase 1: Understand

Parse what the builder wants to build and establish scope.

### Input Modes

The builder may come in with different levels of clarity:

| Input | How to Handle |
|-------|--------------|
| **Vague concept** ("I want to build something for small teams") | Ask 2-3 clarifying questions: who specifically, what's the core problem, any existing solutions they're frustrated with? |
| **Clear concept** ("I want to build a task management app focused on async standups") | Confirm understanding, skip to research |
| **Existing product** ("Here's our app: https://...") | Browse the URL to understand the current product — its structure, features, UX patterns, design language. Use this as the foundation: the discovery is about what to build *next*, not from scratch. Extract the existing IA, navigation, and patterns into the architecture. |
| **Existing research** ("Here's our market analysis" / drops a file) | Read the document, extract concept and key findings, skip or lighten research |
| **Synthesis request** ("What should we build based on this data?") | Analyze the data, propose 2-3 directions, let the builder pick before researching |

### Ask for Existing Product

Always ask: **"Do you have an existing product or app? If so, share a URL."** This is important because:

- If there's an existing product, the architecture should extend it (not start from scratch)
- The existing product's IA, navigation, and design patterns become constraints for new features
- Research focuses on what's *missing* or *broken* rather than the full landscape
- Reference flows can be captured later using `reference-ux`

If the builder provides a URL:
1. Browse it using WebFetch or the browse tool to understand the current product
2. Map the existing navigation structure, key screens, and UX patterns
3. Note the design language (colors, typography, component patterns) for the architecture
4. Frame the discovery as "what to build next" on top of this foundation
5. In Phase 6 (Architect), start from the existing IA rather than designing from scratch

### Resolve Workspace Context

1. Read `product.json` at workspace root for product metadata (if present)
2. Check for existing artifacts:
   - `product-brief.md` — if exists, ask: update or start fresh?
   - `features.json` — if exists, ask: revise breakdown or start fresh?
   - `wiki/` — if populated, load as existing knowledge (avoid re-researching)
3. Set working paths:
   - `WORKSPACE_ROOT` = workspace directory
   - `WIKI_DIR` = `WORKSPACE_ROOT/wiki`

### Clarification Rules

- Ask **at most 3 questions** before starting research. Don't interview — get enough to point research in the right direction.
- If the builder's answer is "I don't know yet" — that's fine. Research will help answer it.
- Capture the builder's initial concept verbatim — it's useful context even if research reshapes it.

---

## Phase 2: Research

Become an expert in the problem space. This operates at the initiative level — broader scope, more categories than per-feature research.

### Phase 2 Preamble: Check for upstream research

Before running fresh research, check whether `product-researcher` has already produced an initiative-level brief:

1. Check for `research-brief.md` at workspace root (concept or domain mode output)
2. Check whether `wiki/` exists and has populated pages under `pain-points/`, `competitors/`, `users/`, or `features/`

**If upstream research exists:**
- Load `research-brief.md` and the most recent wiki pages (top 5 per category by `updated`)
- Use these as the input to Phases 3-7 — skip fresh searching unless there are clear gaps
- Note in the wiki/log.md that product-architect consumed the upstream brief

**If no upstream research exists:**
- Suggest running `product-researcher` first:
  > No research-brief.md found at the workspace root. I can run my own research inline (Phase 2 below), or you can stop and run `product-researcher` first to produce a standalone research artifact. The standalone artifact is more reusable across sessions. Run product-researcher first? (Y/n)
- If user declines or this is a rerun, proceed with inline research below.

### Inline research (when no upstream brief exists)

Use WebSearch for queries, WebFetch on the 2-3 richest results per category. Run searches in parallel where possible.

### Research Categories

**User Pain Points:**
```
"{problem domain}" frustrating OR annoying site:reddit.com
"{problem domain}" complaints problems 2025 2026
"{problem domain}" "switched from" OR "gave up"
"{target user}" challenges OR struggles
```

**Competitive Landscape:**
```
"{problem domain}" apps OR tools OR platforms 2026
"best {category}" comparison review 2026
"{competitor}" vs "{competitor}" review
"{problem domain}" alternatives
```

**User Needs & Behaviors:**
```
"{target user}" workflow OR process OR "how do you"
"{problem domain}" "I wish" OR "would be great if" reddit
"{target user}" daily routine OR workflow
```

**Industry Context:**
```
"{problem domain}" trends 2026
"{problem domain}" market OR growth 2026
"{problem domain}" emerging OR new approach
```

**Design Patterns & UX:**
```
"best {category} app" UX OR design OR interface
"{problem domain}" "user experience" patterns
"{competitor}" redesign OR "new version" 2026
```

For each search:
1. Review results for relevance
2. WebFetch the 2-3 most promising URLs
3. Extract real quotes with source URLs
4. Note quantitative signals (star ratings, upvote counts, thread engagement)

### If Builder Provided Research

If the builder brought existing research, analysis, or data:
1. Read and extract key findings
2. Use research to fill gaps only — focus on what the existing research doesn't cover
3. Validate key claims with quick web searches where possible

### Exit Criteria

Before moving to compilation:
- 3+ user pain points with sources
- 2+ competitor approaches documented
- Understanding of the target user and their workflow
- Sense of what existing solutions get right and wrong

---

## Phase 3: Compile

Write all research findings to the wiki. The wiki is the durable knowledge base that downstream skills read.

### What to Compile

Create or update wiki pages across categories:

| Finding Type | Wiki Category |
|-------------|---------------|
| User pain points with evidence | `pain-points/` |
| Competitor approaches & features | `competitors/` |
| User personas and insights | `users/` |
| Feature ideas and gaps | `features/` |

### Writing to the Wiki

For each wiki page:

1. **Check existing pages** — read `WIKI_DIR/index.md` for existing topics. Merge into existing pages rather than creating duplicates.
2. **Create or update pages** using the standard wiki page template:

```markdown
---
title: "{Topic Title}"
category: {category}
created: {ISO timestamp}
updated: {ISO timestamp}
sources:
  - product-architect-research
  - {web source URLs}
tags: [{tag1}, {tag2}]
---

## Summary

{Synthesize the key findings. Be concrete — include specific numbers, quotes, evidence.
2-5 paragraphs.}

## Key Facts

- {Specific, citable fact} [source]
- {Specific, citable fact} [source]

## Timeline

### {ISO date} — product-architect: initial research
- Source: product-architect research + web research
- {1-3 bullet points of what this source contributed}
```

3. **Update `WIKI_DIR/index.md`** — add entries for new pages, organized by category
4. **Update `WIKI_DIR/sources.json`** — register the product-architect session as a source
5. **Append to `WIKI_DIR/log.md`** — log what was compiled

### Initialize Wiki (first run)

If `WIKI_DIR` doesn't exist:

```bash
mkdir -p WIKI_DIR
```

Write initial `sources.json`, `index.md`, and `log.md`.

---

## Phase 4: Brief

Write the product brief — an initiative-level one-pager that captures the full product vision.

### Self-Q&A

Work through these questions internally, drawing on research. Don't ask the builder — answer them yourself. Flag genuine uncertainty as open questions.

**The Concept:**
1. **What is this product?** — Concrete, jargon-free description. One paragraph.
2. **Who is the primary user?** — Specific persona grounded in research evidence.
3. **What problem does it solve?** — The core pain point, backed by evidence.

**The Opportunity:**
4. **Why does this matter now?** — Market shift, unmet need, or technology enabler.
5. **What do existing solutions get wrong?** — Synthesize competitive weaknesses.
6. **What's the wedge?** — The initial differentiator.

**The Shape:**
7. **What are the key user flows?** — Walk through the 3-5 most important journeys end-to-end. These become the backbone of the architecture.
8. **What's explicitly out of scope for v1?** — Boundaries.
9. **What does success look like?** — The qualitative outcome.

### Write the Brief

Write to `WORKSPACE_ROOT/product-brief.md`:

```markdown
---
title: "{Product Name}"
scope: initiative
created: {ISO timestamp}
updated: {ISO timestamp}
sources:
  - {wiki page paths referenced}
---

# {Product Name}

## What is this?

{1 paragraph — concrete, jargon-free description of the full product}

## Who is it for?

{Primary user persona — grounded in research evidence}

## The Problem

{The core pain point with evidence. Real quotes, numbers, sources.}

## Why Now

{Market timing, competitive gap, or enabling trend}

## Competitive Landscape

{What exists today, what they get right, what they get wrong.}

## The Wedge

{Initial differentiator — why someone would adopt this}

## Key User Flows

{The 3-5 most important user journeys, described end-to-end.
These flows will guide the feature breakdown and architecture.}

### Flow 1: {Flow Name}
{Step-by-step walkthrough}

### Flow 2: {Flow Name}
{Step-by-step walkthrough}

### Flow 3: {Flow Name}
{Step-by-step walkthrough}

## Out of Scope (v1)

- {Explicit boundary}
- {Explicit boundary}

## What Success Looks Like

{Qualitative description of the desired outcome}

## Open Questions

- {Question that needs deeper exploration}
- {Question that needs user testing}

---

*Sources: compiled from wiki research — see wiki/ for evidence.*
```

### Present to Builder

Show the builder the product brief and key user flows. Ask:
- "Does this capture what you're thinking?"
- "Any flows missing or wrong?"
- "Anything that should be out of scope?"

Revise based on feedback before proceeding to decomposition.

---

## Phase 5: Decompose

Break the initiative into features. Each feature will become a directory under `features/` in the workspace.

### Decomposition Heuristic

1. **Start from user flows** — the flows defined in the product brief are the backbone
2. **Group screens and capabilities** that serve the same flow or can be built independently
3. **Each feature should be independently buildable** — it has its own UI surface area and can be prototyped without the others being done
4. **Features should map to what one person could own** — not too big, not too small
5. **Identify shared infrastructure** — auth, navigation shell, design system are not features; they're part of the architecture

### Present the Breakdown

Present each proposed feature to the builder in conversation:

```
Based on the product brief and user flows, here's how I'd break this into features:

1. **Onboarding** — First-time user setup and account creation
   Flows: sign-up, initial-setup
   Screens: welcome, create-account, configure-workspace
   Priority: must-have
   Dependencies: none

2. **Dashboard** — Main landing page with key metrics
   Flows: daily-check-in
   Screens: dashboard-home, activity-feed
   Priority: must-have
   Dependencies: onboarding (user must exist)

3. **Settings** — User preferences and configuration
   Flows: account-management
   Screens: profile, preferences, billing
   Priority: should-have
   Dependencies: onboarding

Does this breakdown make sense? Should I merge, split, add, or remove any features?
```

### Iterate on Feedback

The builder may say:
- "Merge X and Y" → combine features, update flows and screens
- "Split X into two" → create two features, divide screens
- "Add a feature for Z" → add with flows and screens
- "Remove X" → remove, reassign its screens if needed
- "Change priority" → update priority field
- "Looks good" → proceed to architecture

Keep iterating until the builder approves. **Do not proceed without explicit approval.**

### Write Features Manifest

Once approved, write to `WORKSPACE_ROOT/features.json`:

```json
{
  "version": "1.0",
  "status": "proposed",
  "created": "<ISO timestamp>",
  "updated": "<ISO timestamp>",
  "features": [
    {
      "slug": "onboarding",
      "name": "Onboarding",
      "description": "First-time user setup, account creation, and initial configuration",
      "userFlows": ["sign-up", "initial-setup"],
      "screens": ["welcome", "create-account", "configure-workspace"],
      "dependencies": [],
      "priority": "must-have",
      "featureSlug": null
    },
    {
      "slug": "dashboard",
      "name": "Dashboard",
      "description": "Main landing page showing key metrics and recent activity",
      "userFlows": ["daily-check-in"],
      "screens": ["dashboard-home", "activity-feed"],
      "dependencies": ["onboarding"],
      "priority": "must-have",
      "featureSlug": null
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | kebab-case identifier, becomes the feature directory name |
| `name` | string | Human-readable feature name |
| `description` | string | What this feature covers |
| `userFlows` | string[] | Which user flows this feature serves |
| `screens` | string[] | Key screens in this feature |
| `dependencies` | string[] | Slugs of features this one depends on |
| `priority` | `"must-have"` \| `"should-have"` \| `"nice-to-have"` | Feature priority |
| `featureSlug` | string \| null | Populated after feature directory creation |

---

## Phase 6: Architect

Define the product architecture — the shared framework that keeps features coherent when built in parallel.

### What the Architecture Covers

1. **Information Architecture** — How the product is organized. Global navigation, section hierarchy, screen inventory.
2. **User Flows** — The key journeys from the product brief, now mapped to features and screens.
3. **Shared Patterns** — UX patterns that must be consistent across features (empty states, error handling, navigation, loading states).
4. **Cross-Feature Touchpoints** — Where one feature hands off to or references another.

### Write the Architecture

Write to `WORKSPACE_ROOT/architecture.md`:

```markdown
---
title: "{Product Name} — Product Architecture"
created: {ISO timestamp}
updated: {ISO timestamp}
status: active
---

# Product Architecture

This document defines the shared framework for {Product Name}. All features reference this architecture to ensure the product feels coherent even when features are built independently.

## Information Architecture

### Global Navigation
- **Primary nav:** {Tab 1} | {Tab 2} | {Tab 3}
- **Secondary nav (contextual):** {varies by section}
- **Utility nav:** {Search, Notifications, Profile, etc.}

### Screen Map

| Screen ID | Screen Name | Feature | Section | Notes |
|-----------|------------|---------|---------|-------|
| {id} | {name} | {feature-slug} | {nav section} | {notes} |

## User Flows

### {Flow Name} ({feature-slug})

**Entry:** {where the user starts}
**Goal:** {what the user is trying to accomplish}

1. {Step} → {Screen ID}
2. {Step} → {Screen ID}
3. {Step} → {Screen ID}

**Exit:** {where the user ends up}
**Cross-feature:** {any handoffs to other features}

### {Flow Name} ({feature-slug})
{... same pattern}

## Shared Patterns

These patterns must be consistent across all features:

### Empty States
{Description of the empty state pattern — illustration? CTA? Copy tone?}

### Error Handling
{Toast vs inline vs modal — when to use each}

### Navigation
{Breadcrumbs? Back buttons? Tab-based? Sidebar?}

### Loading States
{Skeleton screens? Spinners? Progressive loading?}

### Form Patterns
{Validation approach, input styling, submit behavior}

## Cross-Feature Touchpoints

| From Feature | To Feature | Trigger | Screen Transition | Notes |
|-------------|-----------|---------|-------------------|-------|
| {from-slug} | {to-slug} | {user action} | {from-screen} → {to-screen} | {notes} |

## Design System Notes

{Any initial notes on visual direction — these will be refined by design-context-manager
or /design-consultation. Include: color mood, typography direction, density preference,
motion approach.}
```

### Quality Bar

The architecture should:
- **Be concrete enough to build from.** Screen IDs should be specific. Navigation should be clear.
- **Not over-specify.** This is a framework, not a pixel-perfect spec. Features will fill in details.
- **Make cross-feature touchpoints explicit.** These are the most important part — they're where coherence breaks down.
- **Be grounded in user flows.** The IA should serve the flows, not the other way around.

---

## Phase 7: Create

Batch-create feature directories for each feature. This is the final step — it turns the feature breakdown into the workspace structure.

### Create Feature Directories

For each feature in `features.json`:

1. Use the feature's `slug` as the directory name
2. Create the feature directory skeleton:

```
WORKSPACE_ROOT/features/{slug}/
├── feature.json
├── research/
├── specs/
├── clones/
├── prototypes/
└── share/
```

3. Write `feature.json`:

```json
{
  "name": "{feature name}",
  "slug": "{feature slug}",
  "description": "{feature description}",
  "status": "active",
  "created": "{ISO timestamp}",
  "updated": "{ISO timestamp}"
}
```

4. Update `features.json` — set `featureSlug` to the created slug
5. Seed the feature with architecture context — write `FEATURE_ROOT/frame.md` with:

```markdown
---
title: "{Feature Name}"
feature: {slug}
scope: large-feature
created: {ISO timestamp}
sources:
  - ../product-brief.md
  - ../architecture.md
---

# {Feature Name}

## Product Architecture Reference

This feature is part of **{Product Name}**. See the shared architecture for the full product context.

- Product brief: product-brief.md
- Architecture: architecture.md
- Feature manifest: features.json

### This Feature's Scope

- **Description:** {feature description}
- **User Flows:** {list of flows this feature serves}
- **Screens:** {list of screens in this feature}
- **Dependencies:** {list of feature dependencies}
- **Priority:** {priority}

### Cross-Feature Touchpoints

{Extract from architecture.md — only the touchpoints involving this feature}

## What is this?

{1 paragraph describing what this specific feature does, grounded in the product brief}

## Core Experience

{Walk through the user flows specific to this feature}

## Open Questions

- {Any open questions specific to this feature from the product brief}
```

### Finalize

1. Set `features.json` status to `"active"` and update timestamp
2. Remove any default placeholder feature directory if it exists and is empty (no research, specs, prototypes)

### Report

```
Discovery complete for {Product Name}!

  Product brief:   product-brief.md
  Architecture:    architecture.md
  Features:        {N} features defined

  Feature directories created:
  - {feature 1 name} → features/{slug}/
  - {feature 2 name} → features/{slug}/
  - {feature 3 name} → features/{slug}/

  Shared product context:
  - Wiki: {N} pages across {M} categories
  - Architecture: IA, {N} user flows, shared patterns
  - {N} cross-feature touchpoints defined

  Each feature has a frame.md seeded with its scope from the architecture.

  **Next step:** for each must-have feature, run product-researcher (target mode)
  for deeper evidence, then product-spec-writer. You can work on multiple features
  in parallel — the shared architecture keeps them coherent.
```

---

## Output Structure

```
WORKSPACE_ROOT/
├── product.json                     ← Existing (updated displayName if needed)
├── product-brief.md                 ← NEW: initiative-level one-pager
├── architecture.md                  ← NEW: shared product framework
├── features.json                    ← NEW: feature breakdown manifest
├── design-system/                   ← Existing (empty for new workspaces)
├── personas.json                    ← Existing (empty for new workspaces)
├── wiki/                            ← Populated with research findings
│   ├── index.md
│   ├── sources.json
│   ├── log.md
│   ├── users/
│   ├── pain-points/
│   ├── competitors/
│   └── features/
└── features/
    ├── {feature-1-slug}/            ← NEW: one directory per feature
    │   ├── feature.json
    │   ├── frame.md                 ← Seeded with architecture scope
    │   ├── research/
    │   ├── specs/                   ← product specs
    │   ├── design-specs/            ← design specs (created later by design-spec-writer)
    │   └── prototypes/
    ├── {feature-2-slug}/
    │   └── ...
    └── {feature-3-slug}/
        └── ...
```

---

## Next step

After product-architect completes, the pipeline continues per-feature:

1. For each must-have feature: run `product-researcher` (target mode) on the feature's primary competitor or target product → produces `features/{feature}/research/brief.md`
2. Then `product-spec-writer {feature-slug}` → produces `features/{feature}/specs/{slug}/spec.md`
3. Once 1-2 specs exist: run `design-context-manager` once to establish product-wide design system
4. Then `design-spec-writer` per feature

**Suggested command:** start with the highest-priority must-have feature and run `product-researcher` on it.

---

## Tips

- **User flows are the backbone.** The feature breakdown and architecture both derive from the flows defined in the product brief. Get the flows right and everything else follows.
- **Features should be independently buildable.** If feature A can't be prototyped without feature B being done first, either merge them or define the interface explicitly in cross-feature touchpoints.
- **The architecture is a living document.** As features get specced and prototyped, the architecture should be updated.
- **Don't over-decompose.** 3-7 features is typical. More than 10 features for an initial product usually means the scope is too large or the granularity is too fine.
- **Cross-feature touchpoints are the hardest part.** These are where coherence breaks down when features are built in parallel. Make them explicit and specific.
- **The builder's intuition matters.** Research informs, but the builder knows their users and market. Iterate on the breakdown until they're satisfied.
- **Clean up placeholders.** If the workspace was scaffolded with a placeholder feature directory, remove it after creating the real ones (only if it's empty).
