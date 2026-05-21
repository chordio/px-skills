<!-- BEGIN chordio-design-skills v1 -->

## Chordio Design Skills

The `chordio-design-skills` bundle installs a product-design pipeline plus curated design-taste references at `~/.claude-design-skills/`. Skills are symlinked into `~/.claude/skills/` and loaded at user scope by Claude Code.

If unsure where to start, run `next-step` — it inspects the current workspace and tells you the one concrete next thing to do.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `next-step` | Workspace-aware "what should I do next?" | Anytime you're unsure where to start |
| `product-researcher` | Research (concept / domain / target) — produces a research brief at every pipeline level | Before architecting, before speccing, or to flesh out a vague idea |
| `product-architect` | Initiative-level: decompose a product into features, define architecture | New product from a concept; multi-feature work |
| `product-spec-writer` | Generate product specs (requirements) BEFORE design | Scoping a feature from research/insights |
| `design-spec-writer` | Generate design specs BEFORE coding | Starting new UI features |
| `design-context-manager` | Initialize/maintain product design context | Project setup, foundation changes, reverse-engineer a live site |
| `design-reviewer` | Review implemented UI for issues | After implementation, before PRs |
| `review-panel` | Run expert design review panels (26 twins) | Multi-perspective design feedback |
| `design-manager-twin-creator` | Create digital twins of design leaders | Capturing someone's critique style |
| `reference-ux` | Reverse-engineer a competitor's UX flow | Studying how another product solves a problem |
| `hero-builder` | Build striking hero sections | Landing page heroes, above-the-fold |
| `landing-page-builder` | Build conversion-focused landing pages | Marketing sites, product homepages |
| `image-generator` | Generate AI imagery (nano-banana / Veo) | Hero imagery, marketing visuals |
| `social-post-designer` | Create social posts with AI visuals | Social content creation |

Every design skill loads curated taste references from `~/.claude-design-skills/shared/design-taste/` (vendored from `pbakaus/impeccable` — typography, color, spacing, motion, interaction, responsive, UX writing, anti-patterns). Treat these files as the bar for what good design looks like; reference them when generating or reviewing UI.

For the full pipeline diagram (concept → research → architecture → spec → design-context → design-spec → build → polish → ship) and per-skill details, see `~/.claude-design-skills/README.md`.

### Recommended companion: gstack

For best results, install [gstack](https://github.com/gstack/gstack) alongside chordio-design-skills. gstack provides the browse, QA, design-review, and ship workflows that chordio's pipeline hands off to once code is built — `/browse`, `/qa`, `/design-review`, `/ship`, `/land-and-deploy`, `/canary`, plus orientation skills like `/office-hours` and `/investigate`. When both are installed, chordio's SessionStart bridge automatically patches gstack's design skills (`design-review`, `plan-design-review`, `design-consultation`, `design-shotgun`, `design-html`) so they load chordio's taste references first. gstack manages its own marker-fenced sections of this file via `/setup-gbrain` and `/sync-gbrain`; the two installers coexist without touching each other's content.

<!-- END chordio-design-skills -->
