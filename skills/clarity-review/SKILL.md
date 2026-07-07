---
name: clarity-review
version: 1.0.0
description: |
  Verify that a piece reads clearly to someone who arrives with NO context — the
  curse-of-knowledge defect that de-slopping and structural passes both miss. A
  standalone writing skill and the sibling to humanizer: humanizer makes prose
  CLEAN (no AI tells); clarity-review makes it CLEAR (every reference resolves
  where it appears). Slices a piece into reveal levels (dek/headline only / +intro
  / full), then dispatches a panel of deliberately blind cold-reader sub-agents
  that get ONLY the text under test and are forced to answer strictly from it
  (default NOT ESTABLISHED), probing each load-bearing entity ("the map", "the
  gap", coined terms, the dek's claims) for whether it resolves at the level where
  it first appears. Adds an informed given-new linear read and a dek/title audit.
  Diagnoses and classifies; it does not rewrite. Use BEFORE publishing or in PR
  review of an article, blog post, landing page, or any publication, when an
  opening "reads clean but isn't landing", or to vet a headline/dek in isolation.
  Invoke with a file path or pasted draft. Run it after humanizer.
license: MIT
compatibility: claude-code opencode
---

# clarity-review

## Goal

Decide whether a piece is *clear*, not merely *clean*. Clean is a property of a
sentence in isolation (no em-dash, tight grammar, good cadence). Clear is
**relational**: each sentence's logic follows from the one before, and every
definite reference (`the map`, `the gap`, `the disagreement`) and coined term
points at something the reader already holds *at the point it appears*. A
de-slopping pass (humanizer) checks clean. A reverse-outline checks architecture.
Neither sees the middle band — sentence-to-sentence coherence and the given-new
contract — which is where "reads fine but isn't landing" defects live.

The output is a diagnosis: a per-entity resolution table, a dek/title audit, and a
prioritized defect list with suggested fixes. It **classifies and routes; the
author applies the fix.** No silent rewrites.

## The clean / clear / architecture split

Editing moves through three independent quality axes. A pass that checks one is
blind to the other two.

| Band | Property | Caught by | Misses |
|---|---|---|---|
| **Clean** | sentence-in-isolation: no AI tells, tight grammar | **humanizer** | dangling referents, unmotivated logic |
| **Architecture** | the spine: section order, each section earns its place | reverse-outline | breaks *inside* a paragraph |
| **Clear** *(this skill)* | relational: each sentence follows; every reference resolves where it appears | a blind cold-reader panel + given-new read | — |

**Clean is not clear.** "Here's the map" is clean and unclear: the referent
doesn't exist yet for a cold reader. The cleaner the prose, the harder to run this
gate — smooth sentences glide the reader right past the gap. Run clarity-review
**after** humanizer, not instead of it.

## Why a blind panel (the curse of knowledge)

An editor who has read the piece cannot un-know it. To that editor, `the map`
feels anchored even when the text never earned it. Self-auditing clarity is
therefore impossible from the inside. The only reliable instrument is a reader
who genuinely has no context, so this skill spawns **fresh sub-agents that see
only the text under test** — no surrounding context, no conversation, nothing but
the slice. Ignorance is the instrument.

## When to use

- Before publishing an article, blog post, landing page, or any prose piece.
- In PR review of a writing change — run it on the piece in the diff.
- When a draft is clean (humanizer-passed) but the opening "isn't landing".
- To vet a headline or dek in isolation (the highest-readership, lowest-context text).
- Any time you need to know whether a piece, or a specific term in it, stands alone.

## Inputs

| Input | What |
|---|---|
| The piece | A markdown path or pasted draft text |
| The rubric | [references/clarity-rubric.md](references/clarity-rubric.md) — the three bands, given-new contract, dek checklist, reveal levels, entity-probe protocol, defect classes |
| Reader prompt | [assets/cold-reader-prompt.md](assets/cold-reader-prompt.md) — the exact blind-reader instruction |
| Report shape | [assets/report-template.md](assets/report-template.md) |

## Process

1. **Slice the piece into reveal levels:**

   ```bash
   python3 ~/.claude/skills/clarity-review/scripts/build-clarity-payload.py \
     --file path/to/piece.md
   ```

   (or pipe a draft: `cat draft.md | python3 …/build-clarity-payload.py --stdin`.)
   It splits frontmatter from body and emits JSON with three slices — **L0**
   (title + dek/excerpt, what most readers ever see), **L1** (+ the intro, through
   the first `##`), **L2** (full) — plus a heuristic list of `candidate_entities`.
   Pure stdlib, prints to stdout, writes nothing. (If the piece has no
   `title`/`dek` frontmatter, L0 is empty — treat the first paragraph as L0.)

2. **Curate the entity list.** The script's candidates are noisy. Keep the things
   that *must* be understood where they appear: definite references with a distant
   or absent antecedent, coined/technical terms, evaluative adjectives that imply
   an axis the piece may not develop (`good benchmarks`), and the dek's central
   claim. For each, record the earliest reveal level where it **appears**.

3. **Dispatch the blind cold-reader panel.** For each reveal level (start with L0,
   it's the highest-leverage), spawn several fresh sub-agents using
   [assets/cold-reader-prompt.md](assets/cold-reader-prompt.md), passing **only**
   that slice's text and the curated entity list. See *Cold-reader panel* below for
   composition. Each returns, per entity: `RESOLVABLE | NOT ESTABLISHED | PARTIAL`,
   a one-line gloss of *what the text established* (not what they guessed), and a
   one-sentence "what is this about / what will it do for me".

4. **Run the informed passes yourself** (you, the orchestrating agent, with
   full context — these complement the blind panel, they don't replace it):
   - **Given-new linear read** of the body: read top to bottom; flag every definite
     noun phrase or pronoun whose referent isn't yet established at that point.
   - **Dek/title audit:** for every claim and adjective in the dek/title, confirm
     the body actually develops that property. An adjective the body never argues
     (the `good` in "good benchmarks") is a defect — it imports an axis and dilutes
     the promise. Confirm the dek states the *contribution* in language the body delivers.
   - **Banned-forms sweep:** flag every sentence matching the rubric's *Banned
     sentence forms* list — currently standalone "What …" fragments ("What
     measurement is worth.", "What it measures."), which hit headings and deks
     hardest. Classify as `banned-form`.

5. **Synthesize by consensus.** An entity the **majority** of the panel marks
   `NOT ESTABLISHED` at the level where it appears is a confirmed defect; a lone
   stumble is noise (record it as `watch`). Flag any entity whose resolution level
   is *later* than its appearance level (`resolves too late`). Glosses that disagree
   across readers (each thinks it means something different) are themselves a defect.

6. **Write the report** with [assets/report-template.md](assets/report-template.md):
   the per-entity resolution table, the dek/title audit, the given-new dangling-referent
   list, and a prioritized defect list. Each defect gets a suggested fix, framed as
   a proposal for the author — diagnose, don't overwrite.

7. **Surface the headline:** the confirmed L0 defects first (they cost the most
   readers), then the rest.

## Cold-reader panel

The composition is what makes this catch defects instead of theater:

- **Blind.** Each reader gets only the slice text + entity list. No surrounding
  context. A fresh sub-agent starts context-free, so this is free — just don't leak
  context into the prompt.
- **Literal, biased to NOT ESTABLISHED.** A capable model is *too good* at charitably
  reconstructing meaning from thin cues, which masks the defect. The prompt forces:
  answer only from the text, no inference, no outside knowledge, default to
  NOT ESTABLISHED when uncertain. Same logic as an adversarial verifier defaulting
  to "refuted".
- **Multi-shot + mixed tiers = consensus.** Run several readers per level and look
  at agreement. Deliberately include **weaker/cheaper models** (e.g. a small/fast
  model) as panelists: a less capable reader stumbles roughly where a distracted
  human skimmer does, which is the failure you actually care about. The strongest
  model is the *worst* proxy for "will a real reader get lost." Vary the sub-agent
  model where the host supports it (several small/fast readers + one strong reader).
- **Reveal-leveled.** Probe each entity at the level where it first appears. Most
  readers never leave L0; a term that only resolves at L2 but appears in the dek is
  mis-placed regardless of how well the full piece explains it later.

*Upgrade path:* route the same panel through a multi-provider setup for cross-model
diversity, and wire it as an advisory PR gate on your publications directory. This
skill is the manual on-ramp.

## Find / fix split

This skill **diagnoses**. It names defects, classifies them (see the rubric's
defect classes), and proposes fixes. Applying them is a separate, author-owned step.
Never let a clarity pass silently rewrite the piece.

## Cross-tool portability

- **No sub-agent primitive?** Run readers sequentially in one context, but between
  readers **fully drop the prior slice and re-read only the next** — the blindness
  is the whole point, so a reader must not carry what an earlier reader saw. Start
  each with "Forget everything prior; you are seeing this for the first time."
  Weaker than true isolation; note it in the report header as `panel: degraded (sequential)`.
- **Output format is the contract.** Keep the per-entity table columns as the
  template specifies so reports stay comparable across pieces.
