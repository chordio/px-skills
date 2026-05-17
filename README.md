# Claude Design Skills

A bundle of Claude Code skills for improving front-end UI design quality, plus curated design-taste reference material that grounds every skill.

## Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **next-step** | Workspace-aware "what should I do next?" | Anytime you're unsure where to start |
| **product-researcher** | Research (concept / domain / target) — produces a research brief at every pipeline level | Before architecting, before speccing, or to flesh out a vague idea |
| **product-architect** | Initiative-level: decompose product into features, define architecture | New product from a concept; multi-feature work |
| **product-spec-writer** | Generate product specs (requirements) BEFORE design | Scoping a feature from research/insights |
| **design-spec-writer** | Generate design specs BEFORE coding | Starting new UI features |
| **design-context-manager** | Initialize/maintain product design context | Project setup, foundation changes, reverse-engineer a live site |
| **design-reviewer** | Review implemented UI for issues | After implementation, before PRs |
| **review-panel** | Run expert design review panels (26 twins) | Multi-perspective design feedback |
| **design-manager-twin-creator** | Create digital twins of design leaders | Capturing someone's critique style |
| **reference-ux** | Reverse-engineer a competitor's UX flow | Studying how another product solves a problem |
| **hero-builder** | Build striking hero sections | Landing page heroes, above-the-fold |
| **landing-page-builder** | Build conversion-focused landing pages | Marketing sites, product homepages |
| **image-generator** | Generate AI imagery (nano-banana / Veo) | Hero imagery, marketing visuals |
| **social-post-designer** | Create social posts with AI visuals | Social content creation |

All design skills load curated taste references from the canonical checkout at `~/.claude-design-skills/shared/design-taste/` — see [Design Taste References](#design-taste-references) below.

## The Pipeline

The product-design skills compose into an artifact-driven pipeline. **You don't need to remember the skill names** — each step produces a concrete file, and the file tells you what comes next. If you're ever lost, run `next-step` and it will tell you where you are.

```
  [ concept paragraph ]
            │
            ▼
  research-brief.md + wiki/                          ◄── product-researcher (concept or domain mode)
            │
            ▼
  product-brief.md + architecture.md + features.json ◄── product-architect
            │
            ▼  ── per feature ──────────────────────────────────────────┐
  features/{slug}/research/brief.md                  ◄── product-researcher (target mode)
            │
            ▼
  features/{slug}/specs/{name}/spec.md               ◄── product-spec-writer
            │
            ▼  ── once per product ────────────────────────────────────┐
  design-context/                                    ◄── design-context-manager
            │
            ▼  ── per feature ─────────────────────────────────────────┐
  features/{slug}/design-specs/{name}/spec.md        ◄── design-spec-writer
            │
            ▼
  built code                                         ◄── hand-implementation (Next.js + mocks, etc.)
            │
            ▼
  polished + tested                                  ◄── /qa + /design-review
            │
            ▼
  shipped                                            ◄── /ship + /land-and-deploy + /canary
```

| Step | Artifact | Skill | Notes |
|------|----------|-------|-------|
| 0 | (in your head) | `/office-hours` *(optional)* | Pressure-test the idea with forcing questions |
| 1 | `research-brief.md` + `wiki/` | `product-researcher` (concept or domain mode) | Initiative-level research |
| 2 | `product-brief.md` + `architecture.md` + `features.json` + project scaffolds | `product-architect` | Decomposes into features + defines architecture |
| 3 | `features/{feature}/research/brief.md` | `product-researcher` (target mode) | Per-feature deep research |
| 4 | `features/{feature}/specs/{slug}/spec.md` | `product-spec-writer` | Per-feature requirements |
| 5 | `design-context/` | `design-context-manager` | **Runs ONCE per product**, after specs, before any design-spec |
| 6 | `features/{feature}/design-specs/{slug}/spec.{json,md}` | `design-spec-writer` | Per-feature UX spec, persisted to disk |
| 7 | Built code | hand-implementation | No skill auto-generates multi-screen prototypes (yet) |
| 8 | Polished + tested | `/qa` + `/design-review` | Iterative fix loops |
| 9 | Shipped | `/ship` + `/land-and-deploy` + `/canary` | Workflow + post-deploy monitoring |

**Single-feature projects** can skip steps 1-3 and start at step 4 (`product-spec-writer`). The scope guard in `product-spec-writer` will bounce you back to `product-architect` if the input is initiative-sized.

**Lost?** Run `next-step` from your workspace and it will tell you exactly where you are and what to run next.

## Installation

The supported install path is a one-time clone to a canonical location, then `bash install.sh` to symlink every skill into `~/.claude/skills/`. Updates are then a single `git pull` away — no re-copy needed.

`install.sh` does two things:
1. Symlinks every skill into `~/.claude/skills/`
2. If gstack is installed, registers a SessionStart hook that keeps gstack's design skills patched with chordio's taste references (see [gstack bridge](#gstack-bridge) below — opt out with `--no-bridge`)

Keep the canonical checkout at `~/.claude-design-skills`: skills read shared taste references from `~/.claude-design-skills/shared/design-taste/`, so project-local copies are not supported.

### First-time install

```bash
git clone <your-fork-url> ~/.claude-design-skills
cd ~/.claude-design-skills
bash install.sh

# Verify what's installed
bash install.sh --check
```

### Updating

```bash
cd ~/.claude-design-skills
git pull
# Symlinks already point at the working tree — instantly current
```

### Removing

```bash
cd ~/.claude-design-skills
bash install.sh --uninstall
```

### Working in worktrees

`install.sh` defaults its source to the directory containing the script. To swap your live install to point at a Conductor workspace or git worktree:

```bash
cd ~/conductor/workspaces/claude-design-skills/<workspace>
bash install.sh --force      # Re-point symlinks at this worktree

# When done experimenting:
cd ~/.claude-design-skills
bash install.sh --force      # Restore the main checkout
```

Run `bash install.sh --check` from anywhere to see which checkout each skill currently points at.

### gstack bridge

If [gstack](https://github.com/gstack/gstack) is installed alongside this bundle, `install.sh` also registers a Claude Code **SessionStart hook** that keeps gstack's design skills (`design-review`, `plan-design-review`, `design-consultation`, `design-shotgun`, `design-html`) patched with a small block telling them to load chordio's taste references first.

The bridge runs `bin/chordio-bridge` on every Claude session start and is fully idempotent:

| Scenario | Behavior |
|---|---|
| Fresh install | Patches the 5 gstack SKILL.md.tmpl files, writes state to `~/.claude-design-skills/.bridge-state` |
| Re-run, nothing changed | No-op, silent |
| `gstack-upgrade` regenerated a tmpl | Detects content hash drift, re-patches that target |
| chordio bumps `BRIDGE_VERSION` | Re-patches all targets with the new block |
| gstack not installed | Silent no-op, exit 0 |
| `--quiet` and no patches needed | No output, no session interruption |

Opt out at install time with `--no-bridge`. Inspect or troubleshoot manually:

```bash
~/.claude-design-skills/bin/chordio-bridge --check     # report state, no writes
~/.claude-design-skills/bin/chordio-bridge --dry-run   # show would-patches
~/.claude-design-skills/bin/chordio-bridge --force     # re-patch everything
bash install.sh --check                                # symlink + bridge state
bash install.sh --uninstall                            # removes hook AND symlinks
```

The injected block is marker-fenced (`<!-- BEGIN chordio-taste vN --> ... <!-- END chordio-taste -->`) so it's safe to detect, replace, or strip. Patches in gstack's `SKILL.md.tmpl` survive `bun run gen:skill-docs` because they're the input to that regen. Patches in the rendered `SKILL.md` are belt-and-suspenders — if gstack regenerates and clobbers them, the next SessionStart re-patches.

## Design Taste References

`shared/design-taste/` contains curated design reference material vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0). Every design skill in this repo reads from these files as the bar for what good design looks like.

```
shared/design-taste/
├── anti-patterns.md         # Bans (no side-stripe borders, no gradient text, etc.)
├── typography.md            # Type systems, font pairing, modular scales
├── color-and-contrast.md    # OKLCH, tinted neutrals, dark mode, accessibility
├── spatial-design.md        # Spacing systems, grids, visual hierarchy
├── motion-design.md         # Easing, timing, micro-interactions
├── interaction-design.md    # Affordances, feedback, state changes
├── responsive-design.md     # Breakpoints, fluid scales
├── ux-writing.md            # Voice, error messages, calibrated copy
├── NOTICE.md                # Apache-2.0 attribution
└── .impeccable-commit       # Pinned upstream commit
```

To refresh from upstream impeccable:

```bash
cd ~/.claude-design-skills
bash refresh-impeccable.sh
```

The script no-ops if you're already at the upstream HEAD. Otherwise it pulls the latest, reports what changed, and leaves the diff for you to review and commit. `anti-patterns.md` is curated (not auto-fetched) — re-derive manually if upstream's `skill/SKILL.md` "Absolute bans" section has evolved.

## Skills Overview

### next-step

Workspace-aware pipeline guide. Scans the current workspace to determine where you are in the pipeline and tells you the one concrete next thing to run. Use this when starting a session, onboarding a teammate, or anytime you ask "what should I do next?".

**Usage:** Run `next-step` from your workspace.

### product-architect

Initiative-level product planning. Takes a vague product concept (or existing research), researches the space, decomposes it into features, defines the shared architecture (IA, nav, user flows, shared patterns, cross-feature touchpoints), and scaffolds one project per feature.

**Output:** `product-brief.md`, `architecture.md`, `features.json` at workspace root; `features/{feature-slug}/` scaffolds with `frame.md` seeded from architecture.

**Usage:** Run on a new product idea before any feature-level work. The architecture keeps independently-built features coherent.

### product-researcher

Research producer for **every** pipeline level. Three modes auto-detected from input:
- **CONCEPT mode** — a vague idea ("I want to build X") → validation + sharpening brief
- **DOMAIN mode** — a problem space ("async standup tools") → opportunity map
- **TARGET mode** — a specific product (URL, company, app name) → feature-gap brief

**Outputs:**
- Concept / Domain → `research-brief.md` + `wiki/` at workspace root → feeds `product-architect`
- Target → `features/{feature}/research/brief.md` → feeds `product-spec-writer`

**Usage:** Drop in an idea, a domain phrase, or a URL — the skill detects the mode and produces the right brief shape.

### product-spec-writer

Generate a structured product spec (requirements doc) from research briefs, user insights, or problem descriptions. Defines **what** we're building, **why**, and **who** it's for — the input that grounds `design-spec-writer`.

**Output:** `features/{feature}/specs/{spec-slug}/spec.{json,md}` (multi-feature) or `specs/{spec-slug}/spec.{json,md}` at workspace root (single-feature).

**Usage:** Ask Claude to write a product spec when you have research or a problem statement and need to scope the feature before design.

### design-spec-writer

Generate UX design specifications BEFORE implementing UI features.

**Key Features:**
- Two-stage generation: Strategic Scaffold (WHAT) then Implementation Details (HOW)
- Component selection and styling guidance
- Layout and responsive behavior specs
- Copywriting for all UI elements
- Avoids "AI slop" patterns via `shared/design-taste/anti-patterns.md`

**Usage:** Ask Claude to generate a design spec for your feature. If `design-context/` exists, it grounds the spec.

### design-context-manager

Initialize and maintain design context files that ground all design decisions.

**Three paths:**
- **Path A — Extraction**: scan tailwind config, CSS variables, components to extract from an existing codebase
- **Path B — Interactive**: questionnaire-driven for new projects with no existing patterns
- **Path C — Live URL**: point at a live site and reverse-engineer its design system via browser automation (`/browse`, Browser Use, Playwright, or Puppeteer)

**Outputs:** `brand.md`, `colors.md`, `typography.md`, `layout.md`, `components.md`, `logo.md`, `design-tokens.json` (W3C format), `product-context.md`, `user-journeys.md` — all under `design-context/` in your project root.

### design-reviewer

Review implemented UI for usability issues across four specialized domains: Typography, Color/Contrast, Layout/Spacing, and Overflow/Truncation. Cross-references findings against `shared/design-taste/anti-patterns.md`.

**Prerequisites:**
1. Chrome with remote debugging: `--remote-debugging-port=9222`
2. `npm install puppeteer-core`

**Usage:**
```bash
# Start Chrome with debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Capture screenshots
node ~/.claude/skills/design-reviewer/scripts/screenshot.js 375 667 mobile.png
node ~/.claude/skills/design-reviewer/scripts/screenshot.js 1440 900 desktop.png
```

### review-panel

Assemble and run expert design review panels with 2-4 specialists for multi-perspective critique. Includes 26 pre-built expert twins (Jony Ive, Julie Zhuo, Brad Frost, Edward Tufte, Teresa Torres, April Dunford, Bob Moesta, and more). Synthesis cross-references `shared/design-taste/anti-patterns.md`.

**Usage:** Share a design (Figma URL, image, or description). Claude selects appropriate experts based on design type and runs parallel reviews.

### design-manager-twin-creator

Create digital twins of design managers and leaders by analyzing their feedback patterns and conducting structured interviews. Created twins drop into `review-panel/twins/` for use in panel reviews.

**Usage:** Provide examples of someone's feedback (Figma comments, Slack threads, review transcripts) and/or conduct an interview. The skill generates a reusable twin profile.

### reference-ux

Capture and reverse-engineer UX patterns from live products. Point at any URL — the skill browses the experience on desktop + mobile, captures screenshots, and produces a structured UX reference document covering flow architecture, interaction patterns, layout templates, copy/tone, design tokens, responsive adaptations, and design principles.

**Output:** `docs/references/<slug>/reference.md` + `screenshots/` (when in a git repo), or `~/.gstack/projects/<slug>/references/<slug>/` otherwise.

**Usage:** `Reference Stripe's pricing flow` — Claude navigates, captures, analyzes, and documents.

### hero-builder

Build hero sections that stop the scroll. Outputs production-ready React/Next.js with curated visual effects (atmospheric, typographic, interactive, cinematic, product). Refuses the hero-metric template, gradient text, glassmorphism-as-default, and other slop patterns flagged in `shared/design-taste/anti-patterns.md`.

**Required Inputs:** Brand package (`style.md`, `tokens.json`, `logo/`) + hero brief (core promise, audience, mood).

### landing-page-builder

Build conversion-focused landing pages with exceptional visual storytelling. Section types: Hero → Problem → Solution → Benefits → How It Works → Social Proof → FAQ → Final CTA. Sub-agents handle image generation in parallel.

**Required Inputs:** Brand package + product brief (what/who/problem/solution/differentiation/features/social proof/objections).

### image-generator

Generate AI imagery via nano-banana (images) and Veo (video) with detailed prompts tuned to brand aesthetic. Used by hero-builder and landing-page-builder as a sub-agent for parallel image generation.

### social-post-designer

Create high-converting social media posts with AI-generated visuals across LinkedIn, Twitter/X, Instagram, TikTok, and Facebook. Supports text-only, image, carousel, and video formats. Generates copy and detailed visual prompts for image/video generators.

## Skill Interactions

```
Main pipeline (chronological):
product-researcher (concept/domain) → product-architect (initiative)
                                              ↓
                                      product-researcher (target, per feature)
                                              ↓
                                      product-spec-writer (per feature)
                                              ↓
                                      design-context-manager (ONCE, project-wide)
                                              ↓
                                      design-spec-writer (per feature)
                                              ↓
                                      build → /qa + /design-review → /ship

Supporting skills:
  next-step                       → workspace-aware "what now?" guide (run anytime)
  design-context-manager          → also feeds design-reviewer, review-panel, hero/landing-page builders
  reference-ux                    → feeds design-context-manager (Path C) and design-spec-writer
  design-manager-twin-creator     → produces twins for review-panel
  image-generator                 → sub-agent for hero-builder, landing-page-builder, social-post-designer
```

**Progressive Enhancement:**
- Without context: skills work but produce generic output
- With product-context only: better persona awareness
- With full design-context/ + taste references: best results

## Design Context Structure

When `design-context-manager` runs, it creates:

```
design-context/
├── brand.md              # Brand identity, voice, tone
├── colors.md             # Color system and palettes
├── typography.md         # Font families and type scale
├── layout.md             # Spacing and grid system
├── components.md         # Component patterns
├── logo.md               # Logo usage guidelines
├── design-tokens.json    # Machine-readable tokens (W3C format)
├── product-context.md    # What you're building, for whom
├── user-journeys.md      # Key pages and workflows
├── logos/                # Logo assets (SVG, PNG)
└── source/               # (Path C only) Screenshots + source manifest
```

## Repository Structure

```
claude-design-skills/
├── README.md
├── LICENSE
├── install.sh                # Symlink installer + gstack bridge hook
├── refresh-impeccable.sh     # Re-fetch upstream design references
├── bin/
│   └── chordio-bridge        # SessionStart hook: patches gstack design skills
├── docs/
│   └── augmentation-plan.md  # Plan for the design-taste augmentation
├── shared/
│   └── design-taste/         # Vendored impeccable refs (Apache-2.0)
├── skills/
│   ├── next-step/
│   ├── product-researcher/
│   ├── product-architect/
│   ├── product-spec-writer/
│   ├── design-context-manager/
│   ├── design-spec-writer/
│   ├── design-reviewer/
│   ├── review-panel/         # 26 expert twins under twins/
│   ├── design-manager-twin-creator/
│   ├── reference-ux/
│   ├── hero-builder/
│   ├── landing-page-builder/
│   ├── image-generator/
│   └── social-post-designer/
├── agent-instructions/
│   └── CLAUDE.md             # Canonical instructions for AI agents working in this repo
├── evals/                    # Test framework
└── examples/                 # Example design-context output
```

## License

MIT for code in this repo. Vendored material under `shared/design-taste/` is Apache-2.0 — see `shared/design-taste/NOTICE.md` for attribution to pbakaus/impeccable and (transitively) Anthropic's frontend-design skill.
