# Claude Design Skills

A bundle of Claude Code skills for improving front-end UI design quality, plus curated design-taste reference material that grounds every skill.

## Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
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
design-context-manager (foundation)
      |
      +---> design-spec-writer (grounded specs)
      |
      +---> design-reviewer (informed reviews)
      |
      +---> review-panel (expert critiques)
      |
      +---> hero-builder, landing-page-builder (brand-aligned output)

reference-ux ---> design-context-manager (Path C inspiration)
             ---> design-spec-writer (UX patterns to draw from)

design-manager-twin-creator ---> review-panel (created twins added to panel)

image-generator ---> hero-builder, landing-page-builder, social-post-designer
                     (sub-agent for parallel image gen)
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
│   ├── design-spec-writer/
│   ├── design-context-manager/
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
