# Design Skills Augmentation Plan

Started: 2026-05-13
Owner: ehudhal

## Goal

Augment this repo so:
1. Existing skills load impeccable's curated design references for stronger "taste"
2. A `reference-ux` skill (ported from chordio/workbench) is added
3. `design-context-manager` gains a **Path C** live-URL extraction mode
4. The whole bundle installs on any machine via a single command
5. Setup survives Conductor worktrees (mirrors gstack's pattern)

## Context

Two upstream projects feed this work.

**pbakaus/impeccable (Apache-2.0).** 1 skill + 36 reference files + a CLI. We vendor only the 7 domain reference markdowns (typography, color-and-contrast, spatial-design, motion-design, interaction-design, responsive-design, ux-writing) plus an extracted `anti-patterns.md`. We skip the 23 commands, the live-design daemon, and the CLI — the user wants taste, not vocabulary.

**chordio/workbench (private).** 20 skills built around the `products/<product>/projects/<project>/` filesystem layout. Most overlap with skills already in this repo or with gstack. Status of the three highest-value ports:

| Chordio skill | This repo's equivalent | Status |
|---|---|---|
| `panel-review` | `skills/review-panel/` (26 twins) | already ported |
| `extract-design-system` | `skills/design-context-manager/` | already ported (paths A + B); Path C added by this plan |
| `reference-ux` | — | this plan adds it |

Tier 2/3/4 chordio skills are skipped — see conversation logs.

## Design decisions

- **Canonical clone path:** `~/.claude-design-skills` (mirrors `~/.gstack`, `~/.claude` style)
- **Install via symlinks** from canonical path → `~/.claude/skills/<name>` — `git pull` instantly updates the live install on every machine
- **Hard-code absolute paths** in SKILL.md when referencing `shared/design-taste/` (mirrors gstack's `~/.claude/skills/gstack/bin/...` pattern)
- **Per-project slug** derived from `git remote get-url origin`, sanitized — stable across Conductor worktrees of the same product repo (mirrors `gstack-slug`)
- **Vendor impeccable refs** (don't git-submodule) — enables local edits and annotations; `refresh-impeccable.sh` re-fetches from upstream when desired
- **Worktree experimentation** — `install.sh` defaults source to its own directory, so `cd <worktree> && bash install.sh` swaps the live symlinks to that worktree; `bash install.sh --check` shows which checkout each symlink points at

## Tasks

- [x] **1. Add `install.sh`** — symlink installer with `--check` / `--force` / `--uninstall` modes
- [x] **2. Vendor impeccable references** into `shared/design-taste/` + `refresh-impeccable.sh` + `NOTICE.md` (pinned to impeccable@dc715c7)
- [x] **3. Wire taste refs** into existing design skills (design-spec-writer, design-reviewer, review-panel, design-context-manager, hero-builder, landing-page-builder)
- [x] **4. Port `reference-ux`** skill from chordio — strip product/project paths, prefer `/browse` from gstack with Browser Use / Playwright / Puppeteer fallbacks
- [x] **5. Add Path C live-URL mode** to `design-context-manager` — uses available browser automation to capture computed CSS, fonts, colors, spacing from rendered DOM
- [x] **6. Update README + cross-machine setup docs** — symlink install replaces `cp -r` as primary path; worktree handling notes

## Confidence notes

| Item | Confidence | Rationale |
|---|---|---|
| Symlink install pattern | high | proven via gstack |
| Impeccable vendoring | high | Apache-2.0 license, files are stable markdown |
| Twin set already at chordio parity | high | diff is identical (26 files) |
| Path C extraction precision | moderate | depends on what the selected browser backend exposes — computed styles vs raw stylesheets; may need LLM-inference fallback for messy sites |
| review-panel SKILL.md drift from chordio | unknown | will diff during task 3 wiring pass |

## Notes / open questions

- Whether to set `CLAUDE_DESIGN_SKILLS_ROOT` as an env var for path indirection vs hard-code `~/.claude-design-skills` — decided against env var indirection; the gstack precedent shows hard-coded paths work fine for single-canonical-install setups
- Whether to commit per-task or bundle commits — defer to user

---

## v2 follow-ups (post-PR)

- [x] **7. Vendor `heuristics-scoring.md`** — Nielsen's 10 heuristics with 0–4 rubric, vendored from impeccable. Added to `shared/design-taste/`, refresh script's REFS array, NOTICE.md, and wired into design-reviewer for severity grading.
- [x] **8. Restructure `extraction-guide.md`** — Path A and Path C now parallel sections in `skills/design-context-manager/references/extraction-guide.md`, with shared Design Tokens JSON Structure / Confidence Annotations / Error Handling at the bottom. SKILL.md's Path C section now links to the guide.
- [x] **9. Smoke-test canonical install** — cloned `chordio/claude-design-skills@ehudhal/inspect-claude-md` to `~/.claude-design-skills`, ran `bash install.sh`, all 10 symlinks created, `bash install.sh --check` confirms all point at canonical paths, Claude Code harness auto-discovered the new skills (confirmed via skill listing). **Note:** v2 work (heuristics-scoring, Path C in extraction-guide, refresh script self-heal) is not yet pushed — `~/.claude-design-skills` is at `b836a9a` and won't include those until you commit + push + `git pull` from canonical.

## Refresh script hardening (incidental)

`refresh-impeccable.sh` was missing a "fetch if any expected file is missing" check — fixed during v2. Now self-heals if you delete a file from `shared/design-taste/`.
