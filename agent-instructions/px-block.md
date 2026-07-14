<!-- BEGIN px-skills v1 -->

## PX Skills

PX Skills (`px-skills`, installed at `~/.px-skills/`) is a product-experience pipeline: nine core Claude Code skills that take a product from a one-paragraph idea to a specced, designed, reviewed build, saving every decision as a file in the workspace. Skills are symlinked into `~/.claude/skills/` and loaded at user scope.

If unsure where to start, run `next-step` — it inspects the current workspace and tells you the one concrete next thing to do.

**Core skills (the pipeline):**

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `next-step` | Workspace-aware "what should I do next?" | Anytime you're unsure where to start |
| `vet-idea` | Pressure-test an idea with Elon's five-step first-principles algorithm | Before researching or building anything — decide whether it should exist |
| `prfaq` | Working-backwards gate: write the announcement (press release + FAQ) before implementation | After the idea survives vetting/research, before architecture or specs |
| `product-researcher` | Research (concept / domain / target) — produces a research brief at every pipeline level | Before architecting, before speccing, or to flesh out a vague idea |
| `product-architect` | Initiative-level: decompose a product into features, define architecture | New product from a concept; multi-feature work |
| `product-spec-writer` | Generate product specs (requirements) BEFORE design | Scoping a feature from research/insights |
| `design-context-manager` | Initialize/maintain product design context | Project setup, foundation changes, reverse-engineer a live site |
| `design-spec-writer` | Generate design specs BEFORE coding | Starting new UI features |
| `design-reviewer` | Review implemented UI for issues | After implementation, before PRs |

**Companions:** `reference-ux` (reverse-engineer a competitor's UX flow), `clarity-review` (cold-reader test for standalone clarity — run on any prose before publishing). Panel reviews (`review-panel`, expert twin simulations) and `design-manager-twin-creator` live in the separate Crit Club project; use them at the review step when installed.

Every design skill loads curated taste references from `~/.px-skills/shared/design-taste/` (typography, color, spacing, motion, interaction, responsive, UX writing, anti-patterns — a snapshot originally from `pbakaus/impeccable`, evolved here). Treat these files as the bar for what good design looks like; reference them when generating or reviewing UI.

### Optional peers

PX Skills composes with two peer tools, each installed from its own source. Both are optional; every PX skill runs without them, and nothing in this bundle patches, hooks, or edits them.

- **gstack** ([github.com/gstack/gstack](https://github.com/gstack/gstack)) — used at two points in the pipeline: at the start of definition (`/office-hours` pressure-tests an idea with forcing questions before anything is built) and at implementation time (`/qa`, `/design-review`, `/ship`, `/land-and-deploy` for code quality, visual QA, and deployment). When handing off to gstack's design or QA skills, tell them to read `./design-context/` and `~/.px-skills/shared/design-taste/` first. Without gstack: use any QA/review/ship process; the pipeline's artifacts don't change.
- **humanizer** ([github.com/blader/humanizer](https://github.com/blader/humanizer), ships as a Claude Code plugin) — strips AI-writing tells from any copy the pipeline produces (spec prose, UI text, announcements). When running humanizer, also apply our additional rules from `~/.px-skills/shared/writing/humanizer-house-rules.md`. Run `clarity-review` after it. Without humanizer: prose cleanup is manual.

For the full pipeline diagram (idea → vet → research → prfaq → architecture → spec → design context → design spec → build → review → ship → announce) and per-skill details, see `~/.px-skills/README.md`.

<!-- END px-skills -->
