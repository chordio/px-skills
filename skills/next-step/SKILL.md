---
name: next-step
description: >
  Workspace-aware pipeline guide. Inspects the current workspace to determine where you are
  in the product-experience pipeline (idea → vet → research → prfaq → architecture → spec →
  design context → design spec → build → review → ship → announce) and tells you the one
  concrete next thing to run.
  Use when starting a session, onboarding a teammate, or asking "what should I do next?".
  Trigger on "next step", "where am I", "what now", "what should I do next", "pipeline status".
---

# Next Step

Tells you where you are in the product-experience pipeline and what to run next, based on the artifacts that exist in your workspace.

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
| 0 | Verdict: should this exist? (optional) | `vet-idea` (or gstack's `/office-hours`, if installed) |
| 1 | `research-brief.md` + `wiki/` (initiative) | `product-researcher` (concept or domain mode) |
| 2 | `prfaq.md` — the announcement, written first (skippable) | `prfaq` |
| 3 | `product-brief.md` + `architecture.md` + `features.json` + feature directory scaffolds | `product-architect` |
| 4 | `features/{feature}/research/brief.md` (per feature) | `product-researcher` (target mode) |
| 5 | `features/{feature}/specs/{slug}/spec.md` | `product-spec-writer` |
| 6 | `design-context/` folder (brand + components) | `design-context-manager` |
| 7 | Design spec (per feature) | `design-spec-writer` |
| 8 | Built code | hand-implementation (Next.js + mock data, etc.) |
| 9 | Reviewed, polished code | `design-reviewer` + `review-panel`; gstack's `/qa` + `/design-review` if installed |
| 10 | Shipped + deployed | your ship process; gstack's `/ship` + `/land-and-deploy` if installed |
| 11 | Announced (optional) | `social-post-designer` (px-marketing-skills bundle, if installed) consuming `prfaq.md` + `design-context/` |

The pipeline is **artifact-driven** — each step's output is the next step's input. You don't need to remember the skills; remember the artifacts.

Steps 0, 2, and 11 are gates and endcaps, not ceremony: `vet-idea` kills ideas that shouldn't exist, `prfaq` kills ideas that can't be explained, and the announce step reuses the `prfaq.md` you already wrote.

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
ls prfaq.md                      # Step 2: working-backwards announcement
ls product-brief.md              # Step 3: product brief
ls architecture.md               # Step 3: architecture
ls features.json                 # Step 3: feature breakdown
ls wiki/                         # Step 1/3: wiki context

# Feature-level (multi-feature workspaces)
ls features/                       # Step 3: feature directories exist?
ls features/*/research/brief.md    # Step 4: per-feature research
ls features/*/prfaq.md             # Step 2 (per-feature, optional)
ls features/*/specs/*/spec.md      # Step 5: per-feature product specs
ls features/*/design-specs/*/spec.md  # Step 7: per-feature design specs

# Feature-level (single-feature workspaces — no features/ wrapper)
ls research/brief.md
ls specs/*/spec.md
ls design-specs/*/spec.md

# Design system
ls design-context/               # Step 6: design context exists?
ls DESIGN.md                     # Step 6 alternative: brand-only design doc

# Code
ls package.json src/ app/        # Step 8: code exists?
```

Build a state map:

```
{
  hasConcept: true|false,             # User has provided a concept in this session
  hasInitiativeResearch: bool,         # research-brief.md exists at root
  hasPrfaq: bool,                      # prfaq.md exists at root
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
| `research-brief.md` exists, no `prfaq.md`, no `product-brief.md` | **Step 1 → 2** (suggest `prfaq`; note it's skippable if the idea is already sharp) |
| `research-brief.md` (± `prfaq.md`) exists, no `product-brief.md` | **Step 2 → 3** |
| `product-brief.md` + `architecture.md` + `features.json` exist | **Step 3 → 4** |
| Architecture exists, some features have research, others don't | **Step 4 (continue per-feature)** |
| Features have research but no specs | **Step 4 → 5** |
| Some features have specs, no `design-context/` | **Step 5 → 6** |
| `design-context/` exists, features have specs but no design specs | **Step 6 → 7** |
| Design specs exist, no code | **Step 7 → 8** |
| Code exists | **Step 8 → 9** (review + polish) |
| Code polished, ready to ship | **Step 9 → 10** |
| Shipped, `prfaq.md` exists, launch content wanted | **Step 10 → 11** (announce) |

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

### Peer handoffs (steps 0, 9, 10, 11)

Some steps hand off to **optional peer tools** installed from their own sources. When suggesting them:

- **Check they're installed first** (`ls ~/.claude/skills/gstack` for gstack). If missing, say what the step needs generically ("run your QA and visual review process") and mention the peer as one way to get it — never present a peer as a prerequisite.
- **Pass context explicitly.** gstack's skills don't know about PX artifacts natively. When suggesting `/qa` or `/design-review`, include: "have it read `./design-context/` and `~/.px-skills/shared/design-taste/` first."
- **Step 11 (announce)** needs `social-post-designer` from the px-marketing-skills bundle; it consumes `prfaq.md` + `design-context/`. If not installed, the step is simply manual.

### Example outputs

**Pre-concept (empty workspace, no idea):**
```
Workspace: /Users/me/projects/new-thing

Position: Pre-concept (empty workspace)

You have:
  ✗ no artifacts yet

**Next step:** describe your product idea, then run one of:

  • vet-idea — pressure-test whether it should exist at all
  • product-researcher (concept mode) — if you have a one-paragraph idea
  • product-architect — if you're certain about the idea and want to skip research

If gstack is installed, /office-hours (builder mode) also helps brainstorm from zero.
```

**Step 1 → 2 (has research, no prfaq):**
```
Workspace: /Users/me/projects/standup-tool

Position: Initiative research done, ready for the working-backwards gate

You have:
  ✓ research-brief.md (concept mode, sharpened wedge: "async standups for distributed eng teams")
  ✓ wiki/ (5 pages: 2 pain-points, 2 competitors, 1 users)
  ✗ prfaq.md
  ✗ product-brief.md

**Next step:** run prfaq

  Run: prfaq

Why: it drafts the launch announcement (press release + FAQ) before anything is built.
If the announcement comes out sharp, proceed to product-architect; if it comes out
mushy, you just saved the whole downstream build. Skippable if the idea is already
crisp — jump straight to product-architect.
```

**Step 4 → 5 (research done on a feature, no spec yet):**
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

**Step 5 → 6 (specs exist, no design-context):**
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

Note: if gstack is installed, /design-consultation is a faster brand-only
alternative, but design-context-manager covers both brand and components.
```

**Step 8 → 9 (code exists, needs review):**
```
Position: Built, ready for review and polish

You have:
  ✓ features/onboarding/design-specs/welcome/spec.md
  ✓ src/ (built code)
  ✗ review findings

**Next step:** run design-reviewer on the implemented UI

  Run: design-reviewer

Why: it audits typography, color, layout, and overflow against
~/.px-skills/shared/design-taste/. For multi-perspective critique, follow with
review-panel. If gstack is installed, /qa and /design-review add a test-fix-verify
loop — tell them to read ./design-context/ and ~/.px-skills/shared/design-taste/ first.
```

## Pipeline diagram (always show after the next step)

```
[idea] → vetted → research-brief.md → prfaq.md → product-brief.md → research/brief.md → spec.md → design-context/ → design spec → code → reviewed → shipped → announced
         (vet-    (product-           (prfaq)    (product-          (product-researcher (product-  (design-context-  (design-spec- (build) (design-   (your     (social-post-
         idea)    researcher)                     architect)          target mode)        spec-      manager)          writer)               reviewer,  ship or    designer, if
                                                                                          writer)                                            /qa)       /ship)     installed)
```

Mark the user's current position with an arrow:

```
                                 ▼
[idea] → vetted → research-brief.md → prfaq.md → ...
```

## Tips

- **Don't over-suggest.** Output exactly one next step. If the user wants the full pipeline, the diagram is below — they can read on.
- **Match scope.** For single-feature workspaces, the pipeline starts at step 5 (spec) — skip steps 1-4 unless multi-feature is needed. Detect from input: if user describes one feature, suggest `product-spec-writer` directly. A per-feature `prfaq` is optional and worth suggesting only for features big enough to announce.
- **Gates are skippable, not silent.** If the workspace jumped past `vet-idea` or `prfaq`, don't force a backfill — but when the current step reveals a mushy idea, point back at the gate that would have caught it.
- **Acknowledge branches.** If multiple features need work, list them but suggest the must-have one first based on `features.json` priority.
- **Be honest about gaps.** If the pipeline has a gap that no skill in this repo covers (e.g. backend, data modeling, deploy infra), say so explicitly rather than suggesting a skill that won't help.
- **Peers are enhancements, never prerequisites.** gstack's `/office-hours`, `/design-consultation`, `/codex` and the px-marketing-skills bundle run alongside the pipeline when installed. Suggest them with the context they need (design-context/, taste refs, prfaq.md); if absent, describe the step generically.
