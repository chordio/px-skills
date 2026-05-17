---
name: next-step
description: >
  Workspace-aware pipeline guide. Inspects the current workspace to determine where you are
  in the product-design pipeline (concept → research → architecture → spec → design system →
  design spec → build → ship) and tells you the one concrete next thing to run.
  Use when starting a session, onboarding a teammate, or asking "what should I do next?".
  Trigger on "next step", "where am I", "what now", "what should I do next", "pipeline status".
---

# Next Step

Tells you where you are in the product-design pipeline and what to run next, based on the artifacts that exist in your workspace.

You don't need to remember the pipeline — this skill computes your position and points forward.

## When to Use

- Starting a session and not sure where you left off
- Onboarding a teammate to an existing workspace
- Anytime you ask "what should I do next?"
- After running another skill, to confirm what comes next
- When the workspace state is unclear (multiple branches, partial artifacts)

## The Canonical Pipeline (artifact-centric)

| Step | Artifact produced | Skill that produces it |
|------|-------------------|------------------------|
| 0 | Sharpened concept (optional) | `/office-hours` design doc |
| 1 | `research-brief.md` + `wiki/` (initiative) | `product-researcher` (concept or domain mode) |
| 2 | `product-brief.md` + `architecture.md` + `features.json` + feature directory scaffolds | `product-architect` |
| 3 | `features/{feature}/research/brief.md` (per feature) | `product-researcher` (target mode) |
| 4 | `features/{feature}/specs/{slug}/spec.md` | `product-spec-writer` |
| 5 | `design-context/` folder (brand + components) | `design-context-manager` |
| 6 | Design spec (per feature) | `design-spec-writer` |
| 7 | Built code | hand-implementation (Next.js + mock data, etc.) |
| 8 | Polished, tested code | `/qa` + `/design-review` |
| 9 | Shipped + deployed | `/ship` + `/land-and-deploy` |

The pipeline is **artifact-driven** — each step's output is the next step's input. You don't need to remember the skills; remember the artifacts.

## Workflow

```
Phase 1: SCAN     → Inspect the workspace, list artifacts that exist
Phase 2: LOCATE   → Determine current position in the pipeline
Phase 3: SUGGEST  → Output the one concrete next step
```

---

## Phase 1: Scan

Walk the workspace and check for each artifact in the pipeline:

```bash
# Initiative-level
ls research-brief.md             # Step 1: initiative research
ls product-brief.md              # Step 2: product brief
ls architecture.md               # Step 2: architecture
ls features.json                 # Step 2: feature breakdown
ls wiki/                         # Step 1/2: wiki context

# Feature-level (multi-feature workspaces)
ls features/                       # Step 2: feature directories exist?
ls features/*/research/brief.md    # Step 3: per-feature research
ls features/*/specs/*/spec.md      # Step 4: per-feature product specs
ls features/*/design-specs/*/spec.md  # Step 6: per-feature design specs

# Feature-level (single-feature workspaces — no features/ wrapper)
ls research/brief.md
ls specs/*/spec.md
ls design-specs/*/spec.md

# Design system
ls design-context/               # Step 5: design context exists?
ls DESIGN.md                     # Step 5 alternative: brand-only design doc

# Code
ls package.json src/ app/        # Step 7: code exists?
```

Build a state map:

```
{
  hasConcept: true|false,             # User has provided a concept in this session
  hasInitiativeResearch: bool,         # research-brief.md exists at root
  hasProductBrief: bool,
  hasArchitecture: bool,
  hasFeatures: bool,                   # features.json exists → multi-feature mode
  workspaceMode: "multi" | "single",
  featuresWithResearch: [slug, ...],
  featuresWithSpecs: [slug, ...],
  featuresWithDesignSpecs: [slug, ...],
  featuresWithoutSpecs: [slug, ...],
  hasDesignContext: bool,
  hasCode: bool
}
```

## Phase 2: Locate

Apply this decision tree, top to bottom — return the first matching position:

| If state matches | Position |
|------------------|----------|
| No artifacts, user mentioned an idea this session | **Pre-research** (concept exists in user's head only) |
| No artifacts, user has no idea yet | **Pre-concept** |
| No `research-brief.md` AND no `product-brief.md` AND user has a concept | **Step 0 → 1** |
| `research-brief.md` exists, no `product-brief.md` | **Step 1 → 2** |
| `product-brief.md` + `architecture.md` + `features.json` exist | **Step 2 → 3** |
| Architecture exists, some features have research, others don't | **Step 3 (continue per-feature)** |
| Features have research but no specs | **Step 3 → 4** |
| Some features have specs, no `design-context/` | **Step 4 → 5** |
| `design-context/` exists, features have specs but no design specs | **Step 5 → 6** |
| Design specs exist, no code | **Step 6 → 7** |
| Code exists | **Step 7 → 8** (polish + QA) |
| Code polished, ready to ship | **Step 8 → 9** |

## Phase 3: Suggest

Output the one concrete next step. Use this template:

```
Workspace: {workspace path}

Position: {position label}

You have:
  ✓ {artifact 1}
  ✓ {artifact 2}
  ✗ {next artifact, not yet present}

**Next step:** {one concrete command}

  Run: {exact command or skill name}

Why: {one sentence on what this produces and what comes after}

Full pipeline:
  {visual diagram with the next step highlighted}
```

### Example outputs

**Pre-concept (empty workspace, no idea):**
```
Workspace: /Users/me/projects/new-thing

Position: Pre-concept (empty workspace)

You have:
  ✗ no artifacts yet

**Next step:** describe your product idea, then run one of:

  • product-researcher (concept mode) — if you have a one-paragraph idea
  • /office-hours — if you want forcing questions before any research
  • product-architect — if you're certain about the idea and want to skip research

If you have no idea yet, /office-hours (builder mode) helps brainstorm.
```

**Step 1 → 2 (has research, no product brief):**
```
Workspace: /Users/me/projects/standup-tool

Position: Initiative research done, ready for architecture

You have:
  ✓ research-brief.md (concept mode, sharpened wedge: "async standups for distributed eng teams")
  ✓ wiki/ (5 pages: 2 pain-points, 2 competitors, 1 users)
  ✗ product-brief.md
  ✗ architecture.md

**Next step:** run product-architect

  Run: product-architect

Why: it consumes research-brief.md + wiki/, decomposes the concept into 3-7 features,
defines the cross-feature architecture, and scaffolds one directory per feature.
```

**Step 3 → 4 (research done on a feature, no spec yet):**
```
Workspace: /Users/me/projects/standup-tool

Position: Feature research done, ready for product spec

You have:
  ✓ architecture.md
  ✓ features/onboarding/research/brief.md
  ✗ features/onboarding/specs/

Features ready for specs: onboarding
Features still needing research: dashboard, settings

**Next step:** run product-spec-writer on onboarding

  Run: product-spec-writer onboarding

Why: the research brief is the input. The spec defines what/why/who, use cases,
requirements, and success criteria for this feature. Feeds design-spec-writer next.
```

**Step 4 → 5 (specs exist, no design-context):**
```
Position: Feature specs written, ready for design system

You have:
  ✓ architecture.md
  ✓ features/onboarding/specs/welcome/spec.md
  ✓ features/dashboard/specs/overview/spec.md
  ✗ design-context/

**Next step:** run design-context-manager

  Run: design-context-manager

Why: design-context-manager defines the product-wide visual infrastructure (brand
+ components) ONCE. It runs after specs so it knows what components exist (nav,
cards, forms, etc.). Every design-spec-writer call references it.

Note: /design-consultation (gstack) is a faster brand-only alternative, but
design-context-manager covers both brand and components in one folder.
```

## Pipeline diagram (always show after the next step)

```
[concept] → research-brief.md → product-brief.md     → research/brief.md → spec.md       → design-context/  → design spec     → code → polished → shipped
            (product-researcher) (product-architect)   (product-researcher  (product-spec-  (design-context-   (design-spec-     (build) (/qa +     (/ship +
                                                       target mode)         writer)         manager)           writer)                   /design-    /land-and-
                                                                                                                                          review)     deploy)
```

Mark the user's current position with an arrow:

```
                             ▼
[concept] → research-brief.md → product-brief.md → ...
```

## Tips

- **Don't over-suggest.** Output exactly one next step. If the user wants the full pipeline, the diagram is below — they can read on.
- **Match scope.** For single-feature workspaces, the pipeline starts at step 4 (spec) — skip steps 1-3 unless multi-feature is needed. Detect from input: if user describes one feature, suggest `product-spec-writer` directly.
- **Acknowledge branches.** If multiple features need work, list them but suggest the must-have one first based on `features.json` priority.
- **Be honest about gaps.** If the pipeline has a gap that no skill in this repo covers (e.g. backend, data modeling, deploy infra), say so explicitly rather than suggesting a skill that won't help.
- **Standalone gstack skills aren't pipeline-blocking.** `/office-hours`, `/design-consultation`, `/codex` etc. can run alongside the pipeline. Suggest them as enhancements, not prerequisites.
