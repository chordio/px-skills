# PX Skills

Ten agent skills for product experience design: they take a product from a one-paragraph idea to a specced, designed, reviewed build, saving every decision as a file in your project. Built and tested on Claude Code; the skill format is an open convention other agents read too — see [Portability](#portability).

The pipeline is **artifact-driven** — each step writes a file, and the file is the next step's input. You don't need to remember the skill names; remember the artifacts. If you're ever lost, run `next-step` and it tells you the one concrete next thing to do.

PX Skills composes with two peer tools, each installed from its own source. Both are optional; every PX skill runs without them.

| Peer | Where the pipeline uses it | Why you'd want it | Without it |
|---|---|---|---|
| [gstack](https://github.com/gstack/gstack) | Start of definition (`/office-hours` pressure-tests the idea before anything is built) and implementation time (`/qa`, `/design-review`, `/ship`) | Idea-locking up front; code quality, visual QA, and deployment at the end | Bring your own QA and ship process; the artifacts don't change |
| [humanizer](https://github.com/blader/humanizer) | Any copy the pipeline produces: spec prose, UI text, announcements | Strips AI-writing tells; our additions layer on via [`shared/writing/humanizer-house-rules.md`](shared/writing/humanizer-house-rules.md) | Prose cleanup is manual |

Nothing here patches, hooks, or edits other tools. `install.sh` symlinks the skills and maintains one documented block in your CLAUDE.md — that's the whole install footprint.

## Skills

**Core (the pipeline):**

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **next-step** | Workspace-aware "what should I do next?" | Anytime you're unsure where to start |
| **vet-idea** | Pressure-test an idea/feature/requirement with Elon's five-step first-principles algorithm (question → delete → optimize → speed up → automate) | Before researching or building anything — decide whether it should exist at all |
| **prfaq** | Working-backwards gate: write the announcement (press release + FAQ) before implementation | After the idea survives vetting and research, before architecture or specs |
| **product-researcher** | Research (concept / domain / target) — produces a research brief at every pipeline level | Before architecting, before speccing, or to flesh out a vague idea |
| **product-architect** | Initiative-level: decompose product into features, define architecture | New product from a concept; multi-feature work |
| **product-spec-writer** | Generate product specs (requirements) BEFORE design | Scoping a feature from research/insights |
| **design-context-manager** | Initialize/maintain product design context | Project setup, foundation changes, reverse-engineer a live site |
| **design-spec-writer** | Generate design specs BEFORE coding | Starting new UI features |
| **design-reviewer** | Review implemented UI for issues | After implementation, before PRs |
| **review-panel** | Run expert design review panels (26 twins) | Multi-perspective design feedback |

**Companions (standalone, not counted in the pipeline):**

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **reference-ux** | Reverse-engineer a competitor's UX flow | Studying how another product solves a problem |
| **design-manager-twin-creator** | Create digital twins of design leaders | Capturing someone's critique style for review-panel |
| **clarity-review** | Cold-reader test for standalone clarity (curse-of-knowledge defense) | After humanizer, before publishing any article, post, or landing page |

Marketing-surface skills (hero sections, landing pages, social posts, AI imagery) live in the separate [px-marketing-skills](https://github.com/chordio/px-marketing-skills) bundle; the pipeline's announce step uses it when installed.

All design skills load curated taste references from the canonical checkout at `~/.px-skills/shared/design-taste/` — see [Design Taste References](#design-taste-references) below.

## The Pipeline

```
  [ idea ]
      │
      ▼  gate: should this exist?
  verdict                                            ◄── vet-idea  (or gstack's /office-hours)
      │
      ▼
  research-brief.md + wiki/                          ◄── product-researcher (concept or domain mode)
      │
      ▼  gate: can this be explained? (skippable)
  prfaq.md                                           ◄── prfaq (the announcement, written first)
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
  reviewed + polished                                ◄── design-reviewer + review-panel  (gstack's /qa + /design-review if installed)
      │
      ▼
  shipped                                            ◄── your ship process  (gstack's /ship + /land-and-deploy if installed)
      │
      ▼
  announced (optional)                               ◄── social-post-designer (px-marketing-skills) reusing prfaq.md
```

| Step | Artifact | Skill | Notes |
|------|----------|-------|-------|
| 0 | Verdict: should this exist? | `vet-idea` *(optional gate)* | Kills ideas that shouldn't exist; gstack's `/office-hours` is an alternative |
| 1 | `research-brief.md` + `wiki/` | `product-researcher` (concept or domain mode) | Initiative-level research |
| 2 | `prfaq.md` | `prfaq` *(skippable gate)* | The announcement, written before the work — kills ideas that can't be explained |
| 3 | `product-brief.md` + `architecture.md` + `features.json` + project scaffolds | `product-architect` | Decomposes into features + defines architecture |
| 4 | `features/{feature}/research/brief.md` | `product-researcher` (target mode) | Per-feature deep research |
| 5 | `features/{feature}/specs/{slug}/spec.md` | `product-spec-writer` | Per-feature requirements |
| 6 | `design-context/` | `design-context-manager` | **Runs ONCE per product**, after specs, before any design-spec |
| 7 | `features/{feature}/design-specs/{slug}/spec.{json,md}` | `design-spec-writer` | Per-feature UX spec, persisted to disk |
| 8 | Built code | hand-implementation | No skill auto-generates multi-screen prototypes (yet) |
| 9 | Reviewed + polished | `design-reviewer` + `review-panel` | gstack's `/qa` + `/design-review` add a test-fix-verify loop if installed |
| 10 | Shipped | your ship process | gstack's `/ship` + `/land-and-deploy` + `/canary` if installed |
| 11 | Announced | `social-post-designer` (px-marketing-skills) | Reuses `prfaq.md` + `design-context/`; optional |

**Single-feature projects** can skip steps 1-4 and start at step 5 (`product-spec-writer`). The scope guard in `product-spec-writer` will bounce you back to `product-architect` if the input is initiative-sized.

**Lost?** Run `next-step` from your workspace and it will tell you exactly where you are and what to run next.

## Installation

The supported install path is a one-time clone to a canonical location, then `bash install.sh`. Updates are then a single `git pull` away — no re-copy needed.

### What `install.sh` does, and why

It does exactly two things, both inspectable and reversible:

**1. Symlinks every skill** from the checkout into `~/.claude/skills/` (user scope, so the skills are available in every project you open). Symlinks rather than copies for one reason: the checkout stays the single source of truth. `git pull` updates your live install instantly, nothing drifts out of sync, and you can trial a branch by re-pointing the links from a worktree (`bash install.sh --force`), then point them back. `bash install.sh --check` shows exactly where every link points.

**2. Maintains one marker-fenced block** in `~/.claude/CLAUDE.md`, between `<!-- BEGIN px-skills v1 -->` and `<!-- END px-skills -->`. Strictly speaking this block is optional: skills are self-describing, and supporting the format means the agent auto-invokes them from each `SKILL.md`'s own frontmatter — the bundle works with `--no-claudemd`. The block is an accuracy upgrade. With thirteen skills forming one pipeline, a session-start summary makes the agent noticeably more likely to call the right skill at the right moment, and it carries cross-skill context no single frontmatter can:

- the pipeline map — which skill feeds which, so "I have an idea" routes to `vet-idea` and research instead of straight to code
- where the shared taste references live, and that design output is held to them
- the peer handoff rules: what context to pass gstack skills (`design-context/`, taste refs), and to apply our house rules whenever the humanizer peer runs

The block is replaced in place on every run — never duplicated, never touching anything outside its own markers — and `--uninstall` strips it cleanly. Its full content is one readable file in this repo: [`agent-instructions/px-block.md`](agent-instructions/px-block.md). (`CLAUDE.md` is Claude Code's name for the agent's global memory file; the `AGENTS.md`-family equivalents for other clients are on the roadmap — see [Portability](#portability).)

Everything else is a *no*: no hooks, no `settings.json` edits, no background processes, no patches to other tools, no network calls.

Keep the canonical checkout at `~/.px-skills`: skills read shared taste references from `~/.px-skills/shared/design-taste/`, so project-local copies are not supported.

### First-time install

```bash
git clone https://github.com/chordio/px-skills ~/.px-skills
cd ~/.px-skills
bash install.sh

# Verify what's installed
bash install.sh --check
```

### Updating

```bash
cd ~/.px-skills
git pull
# Symlinks already point at the working tree — instantly current
```

### Removing

```bash
cd ~/.px-skills
bash install.sh --uninstall
```

### Migrating from claude-design-skills

If you previously installed this bundle under its old name (`chordio-design-skills` at `~/.claude-design-skills`, with a SessionStart bridge hook), re-running `bash install.sh` from the new checkout migrates automatically: it removes the old CLAUDE.md block, unregisters the bridge hook from `settings.json`, strips the patch blocks the bridge injected into gstack's skill files, removes stale symlinks for skills that moved out, and tells you when it's safe to delete the old checkout.

### Working in worktrees

`install.sh` defaults its source to the directory containing the script. To swap your live install to point at a Conductor workspace or git worktree:

```bash
cd ~/conductor/workspaces/px-skills/<workspace>
bash install.sh --force      # Re-point symlinks at this worktree

# When done experimenting:
cd ~/.px-skills
bash install.sh --force      # Restore the main checkout
```

Run `bash install.sh --check` from anywhere to see which checkout each skill currently points at.

### CLAUDE.md block

`install.sh` keeps a marker-fenced block in `~/.claude/CLAUDE.md` describing the bundle so Claude sees the skill list at session start:

```
<!-- BEGIN px-skills v1 -->
… block content (skill table, taste-refs pointer, peers section) …
<!-- END px-skills -->
```

The exact content lives at `agent-instructions/px-block.md`. Idempotent: re-running install refreshes the block in place (byte-identical when nothing changed). Behaviour:

| Scenario | Behaviour |
|---|---|
| `~/.claude/CLAUDE.md` exists | Appends the block; subsequent runs replace it in place. |
| Missing file, interactive run | Prompts before seeding from `agent-instructions/CLAUDE.md` + the block. Default is no. |
| Missing file, non-interactive run | Skips with a notice. Pass `--init-claudemd` to seed without prompting. |
| `--no-claudemd` | Skip the block install/refresh entirely. |
| `--uninstall` | Strips the block in place; the rest of the file is untouched. |

`agent-instructions/CLAUDE.md` is the stack-agnostic baseline used for seeding — operating-instructions preamble, API-key recovery guidance, and the Elon first-principles algorithm. Peer tools (like gstack) manage their own marker namespaces in the same file; the installers don't touch each other's content.

## Optional peers

PX Skills points at peers; it never installs, patches, or configures them. `bash install.sh --check` reports which peers are present and where to get the missing ones.

### gstack

[gstack](https://github.com/gstack/gstack) provides the browse, QA, design-review, and ship workflows the pipeline hands off to. The pipeline uses it at two points:

- **Start of definition** — `/office-hours` runs YC-style forcing questions to lock a strong idea before any research or code. `vet-idea` (ours) covers the same gate without gstack.
- **Implementation time** — `/qa`, `/design-review` (test-fix-verify loops), then `/ship`, `/land-and-deploy`, `/canary`.

gstack's skills don't read PX artifacts natively. When handing off, tell them to read `./design-context/` and `~/.px-skills/shared/design-taste/` first — `next-step` includes this in its suggestions automatically.

### humanizer

[blader/humanizer](https://github.com/blader/humanizer) (MIT) removes AI-writing tells from prose. Install it from its own repo — it ships as a Claude Code plugin. Our additional rules (empty intensifiers, standalone interrogative fragments, a regression-check step, and more) live in [`shared/writing/humanizer-house-rules.md`](shared/writing/humanizer-house-rules.md); apply them whenever you run humanizer. The CLAUDE.md block tells the agent to do this automatically. Run our `clarity-review` after it: humanizer makes prose *clean* (no AI tells), clarity-review makes it *clear* (every reference resolves where it appears).

### px-marketing-skills

Marketing-surface skills — hero sections, landing pages, social posts, AI image generation — live in a separate bundle, [chordio/px-marketing-skills](https://github.com/chordio/px-marketing-skills), so the core stays focused (and key-free: image generation's bring-your-own-key requirement lives there, not here). The pipeline's announce step (11) uses its `social-post-designer` to turn your `prfaq.md` and `design-context/` into real launch content.

## Portability

The skill format — a folder with a `SKILL.md`, YAML frontmatter plus markdown instructions — is an open convention that multiple agents now read: Claude Code, Gemini CLI, OpenAI Codex, Cursor, GitHub Copilot, and others. Supporting the format means the client auto-invokes skills from their frontmatter descriptions, with no memory-file setup required. PX Skills is built and tested on Claude Code. What's Claude-specific today is shallow, and it's exactly three things:

1. **The installer's targets** — `install.sh` already works from a per-client table (client → skills directory → global memory file). Only the Claude Code row is active; rows for Gemini CLI, Codex, Cursor, and Copilot are in the table, commented out, and each activates only after a smoke test on that client. Unverified paths shipped as fact would be worse than no support.
2. **Sub-agent fan-out** — `review-panel` runs its twins as parallel sub-agents and `clarity-review` runs a blind reader panel. clarity-review already documents a sequential fallback for hosts without a sub-agent primitive; review-panel needs the same treatment.
3. **Peer handoffs** — gstack is itself a Claude Code bundle, so on other clients steps 9-10 fall back to "use your own QA and ship process," which the pipeline already supports.

The artifacts the pipeline writes — research briefs, `prfaq.md`, specs, `design-context/` — are plain files with no client coupling at all. Whatever agent reads them, the process comes along.

## Design Taste References

`shared/design-taste/` contains curated design reference material — the bar every design skill holds output against.

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
├── heuristics-scoring.md    # Nielsen's 10 heuristics with severity rubric
├── NOTICE.md                # Apache-2.0 attribution
└── .impeccable-commit       # Upstream commit the snapshot was taken at
```

The files were originally vendored from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0), which builds on Anthropic's frontend-design skill. Upstream has since restructured its reference set, so this snapshot is **maintained and evolved here** — we vendor data, never behavior. Attribution and license details in [`shared/design-taste/NOTICE.md`](shared/design-taste/NOTICE.md).

## Skills Overview

### next-step

Workspace-aware pipeline guide. Scans the current workspace to determine where you are in the pipeline and tells you the one concrete next thing to run — including the context to pass when a step hands off to a peer tool. Use this when starting a session, onboarding a teammate, or anytime you ask "what should I do next?".

**Usage:** Run `next-step` from your workspace.

### vet-idea

Pressure-test an idea, feature, or requirement with Elon's five-step first-principles algorithm: question the requirements → try to delete it → optimize → speed up → automate, in that order. The upstream gut-check that runs before research and design; a deleted idea is a successful run.

**Usage:** Describe the idea and ask to vet it. If it survives, hand off to `product-researcher` and `product-architect`.

### prfaq

Working-backwards gate: write the announcement before the work. Drafts a one-page press release + FAQ (Amazon PRFAQ style, via [PRDkit](https://github.com/ehudhal/PRDkit)'s artifact shape) for an idea that survived vetting and research — before any architecture, specs, or code. If the press release comes out mushy or an FAQ answer embarrasses you, the idea isn't ready to spec; that discovery is the point. Ends with a verdict: proceed, sharpen, or kill.

**Output:** `prfaq.md` at workspace root (initiative) or `features/{slug}/prfaq.md` (feature). After shipping, the announce step reuses it for real launch content.

### product-researcher

Research producer for **every** pipeline level. Three modes auto-detected from input:
- **CONCEPT mode** — a vague idea ("I want to build X") → validation + sharpening brief
- **DOMAIN mode** — a problem space ("async standup tools") → opportunity map
- **TARGET mode** — a specific product (URL, company, app name) → feature-gap brief

**Outputs:**
- Concept / Domain → `research-brief.md` + `wiki/` at workspace root → feeds `prfaq` and `product-architect`
- Target → `features/{feature}/research/brief.md` → feeds `product-spec-writer`

**Usage:** Drop in an idea, a domain phrase, or a URL — the skill detects the mode and produces the right brief shape.

### product-architect

Initiative-level product planning. Takes a product concept (or existing research), researches the space, decomposes it into features, defines the shared architecture (IA, nav, user flows, shared patterns, cross-feature touchpoints), and scaffolds one project per feature.

**Output:** `product-brief.md`, `architecture.md`, `features.json` at workspace root; `features/{feature-slug}/` scaffolds with `frame.md` seeded from architecture.

**Usage:** Run on a new product idea before any feature-level work. The architecture keeps independently-built features coherent.

### product-spec-writer

Generate a structured product spec (requirements doc) from research briefs, user insights, or problem descriptions. Defines **what** we're building, **why**, and **who** it's for — the input that grounds `design-spec-writer`.

**Output:** `features/{feature}/specs/{spec-slug}/spec.{json,md}` (multi-feature) or `specs/{spec-slug}/spec.{json,md}` at workspace root (single-feature).

**Usage:** Ask Claude to write a product spec when you have research or a problem statement and need to scope the feature before design.

### design-context-manager

Initialize and maintain design context files that ground all design decisions.

**Three paths:**
- **Path A — Extraction**: scan tailwind config, CSS variables, components to extract from an existing codebase
- **Path B — Interactive**: questionnaire-driven for new projects with no existing patterns
- **Path C — Live URL**: point at a live site and reverse-engineer its design system via browser automation

**Outputs:** `brand.md`, `colors.md`, `typography.md`, `layout.md`, `components.md`, `logo.md`, `design-tokens.json` (W3C format), `product-context.md`, `user-journeys.md` — all under `design-context/` in your project root.

### design-spec-writer

Generate UX design specifications BEFORE implementing UI features.

**Key Features:**
- Two-stage generation: Strategic Scaffold (WHAT) then Implementation Details (HOW)
- Component selection and styling guidance
- Layout and responsive behavior specs
- Copywriting for all UI elements
- Avoids "AI slop" patterns via `shared/design-taste/anti-patterns.md`

**Usage:** Ask Claude to generate a design spec for your feature. If `design-context/` exists, it grounds the spec.

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

Twins are clearly labeled simulations distilled from each person's public writing, with output attributed to the twin rather than the person, and a removal-on-request policy (7 days, no questions asked): see [`skills/review-panel/twins/DISCLAIMER.md`](skills/review-panel/twins/DISCLAIMER.md).

**Usage:** Share a design (Figma URL, image, or description). Claude selects appropriate experts based on design type and runs parallel reviews.

### reference-ux

Capture and reverse-engineer UX patterns from live products. Point at any URL — the skill browses the experience on desktop + mobile, captures screenshots, and produces a structured UX reference document covering flow architecture, interaction patterns, layout templates, copy/tone, design tokens, responsive adaptations, and design principles.

**Output:** `docs/references/<slug>/reference.md` + `screenshots/` (when in a git repo).

**Usage:** `Reference Stripe's pricing flow` — Claude navigates, captures, analyzes, and documents.

### design-manager-twin-creator

Create digital twins of design managers and leaders by analyzing their feedback patterns and conducting structured interviews. Created twins drop into `review-panel/twins/` for use in panel reviews.

**Usage:** Provide examples of someone's feedback (Figma comments, Slack threads, review transcripts) and/or conduct an interview. The skill generates a reusable twin profile.

### clarity-review

Verify a piece reads clearly to someone arriving with no context — the curse-of-knowledge defect that de-slopping and structural passes both miss. The sibling to the humanizer peer: humanizer makes prose *clean* (no AI tells), clarity-review makes it *clear* (every reference resolves where it appears). It slices a piece into reveal levels, dispatches a panel of deliberately blind cold-reader sub-agents, and probes each load-bearing entity for whether it resolves where it first appears. Diagnoses and classifies; it does not rewrite.

**Usage:** Ask Claude to run a clarity review on an article, post, landing page, or any publication (a file path or pasted draft). Run it after humanizer.

## Skill Interactions

```
Main pipeline (chronological):
vet-idea → product-researcher (concept/domain) → prfaq → product-architect
                                                              ↓
                                                      product-researcher (target, per feature)
                                                              ↓
                                                      product-spec-writer (per feature)
                                                              ↓
                                                      design-context-manager (ONCE, project-wide)
                                                              ↓
                                                      design-spec-writer (per feature)
                                                              ↓
                                                      build → design-reviewer + review-panel → ship → announce
                                                              (gstack /qa + /design-review     (gstack  (px-marketing-
                                                               if installed)                    /ship)   skills)

Supporting skills:
  next-step                       → workspace-aware "what now?" guide (run anytime)
  design-context-manager          → also feeds design-reviewer and review-panel
  reference-ux                    → feeds design-context-manager (Path C) and design-spec-writer
  design-manager-twin-creator     → produces twins for review-panel
  clarity-review                  → prose clarity gate for anything you publish (pairs with the humanizer peer)
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
px-skills/
├── README.md
├── LICENSE
├── install.sh                # Symlink installer (symlinks + CLAUDE.md block, nothing else)
├── docs/
│   ├── PRFAQ.md              # The working-backwards PRFAQ for this repo's own launch
│   └── augmentation-plan.md  # Historical design doc
├── shared/
│   ├── design-taste/         # Curated taste references (Apache-2.0 snapshot, evolved here)
│   └── writing/              # humanizer-house-rules.md (our layer on the humanizer peer)
├── skills/
│   ├── next-step/
│   ├── vet-idea/
│   ├── prfaq/
│   ├── product-researcher/
│   ├── product-architect/
│   ├── product-spec-writer/
│   ├── design-context-manager/
│   ├── design-spec-writer/
│   ├── design-reviewer/
│   ├── review-panel/         # 26 expert twins under twins/
│   ├── reference-ux/
│   ├── design-manager-twin-creator/
│   └── clarity-review/
├── agent-instructions/
│   ├── CLAUDE.md             # Stack-agnostic baseline (seed for ~/.claude/CLAUDE.md)
│   └── px-block.md           # Marker-fenced block installed into ~/.claude/CLAUDE.md
├── evals/                    # Eval harness (with-skill vs baseline comparisons)
└── examples/                 # Example design-context output
```

## License

MIT for code in this repo. The taste-reference snapshot under `shared/design-taste/` is Apache-2.0 — see `shared/design-taste/NOTICE.md` for attribution to pbakaus/impeccable and (transitively) Anthropic's frontend-design skill.
