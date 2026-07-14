---
name: prfaq
description: >
  Working-backwards gate: write the announcement before the work. Drafts a
  one-page press release + FAQ (Amazon PRFAQ style) for an idea AFTER it
  survives vet-idea and concept research, BEFORE any architecture, specs, or
  code — to confirm the idea is clear enough to explain, worth explaining, and
  sharp enough to announce. If the press release comes out mushy or an FAQ
  answer embarrasses you, the idea isn't ready to spec; that discovery is the
  point. Trigger on "prfaq", "press release first", "working backwards",
  "write the announcement", "is this idea sharp enough".
---

# prfaq

Write the announcement before the code. The document that comes out is the cheapest prototype there is: if the idea can't survive being explained, it shouldn't survive being built.

The pattern comes from Amazon's working-backwards PRFAQ and from PRDkit (an earlier tool by this repo's maintainer), where a product requirement carries announcement-shaped artifacts — a PRFAQ, mock social posts, simulated reviews — generated before implementation to test whether a feature is sharp enough to announce.

## Position in the pipeline

**After** the idea phase: `vet-idea` has answered "should this exist at all?" and `product-researcher` (concept mode) has produced `research-brief.md`, so you know the landscape. **Before** any implementation: no `product-brief.md`, no specs, no code. This is the last cheap moment to change course.

Skippable: if the idea is already sharp and small, jump to `product-architect` (initiative) or `product-spec-writer` (single feature). The gate exists to kill mushy ideas cheaply, not to add ceremony to crisp ones.

## Inputs

- The idea (a paragraph, or the sharpened concept from `vet-idea`)
- `research-brief.md` + `wiki/` if they exist (use real landscape facts in the FAQ)
- For a feature inside an existing product: the product's `product-brief.md` and `design-context/product-context.md` if present

## Output artifact

`prfaq.md` at the workspace root (initiative-level), or `features/{slug}/prfaq.md` (feature-level). Structure:

```markdown
# PRFAQ: {name}

> Working-backwards note: written {date}, before the work it describes.
> The dateline is aspirational. Where this document and reality disagree,
> this document is the plan.

## Press release
{Title — one sentence, the customer outcome}
{Subtitle — one or two sentences}
{Dateline — location/channel, target date} — {announcement paragraph}
{Problem paragraph — concrete, from the customer's day}
{Solution paragraph — what exists now and how it works}
{Bulleted capabilities — 3-6, each concrete}
{Quote — builder/PM voice, why this matters}
{Imagined customer quote — labeled as imagined}
{Availability — how the customer gets it, what it costs}

## FAQ
{5-10 Q/A pairs — the HARDEST questions, honest kernels}

## Internal FAQ (optional)
{Strategy questions: what gets cut, risks, success metrics, why now}
```

## Workflow

1. **Gather** — read the idea + whatever research artifacts exist. Don't research from scratch; if there's no research at all, note that the FAQ answers will be assumptions and mark them.
2. **Draft the press release** — write it as if the launch already happened. Concrete nouns, one customer, one problem, one outcome. Target under 450 words.
3. **Draft the FAQ** — list the questions a skeptic would actually ask (why not the obvious alternative? who is this NOT for? what does it cost? what's the catch?) and answer them honestly. An answer you're tempted to spin is a finding.
4. **Optional — mock launch posts.** If `social-post-designer` (from the px-marketing-skills bundle) is installed, have it draft 2-3 mock social posts from the press release as clarity fiction (zero engagement, no publishing): if you can't write a post with a hook, the feature has no hook.
5. **Verdict — the gate.** End with one of:
   - **PROCEED** — the announcement is sharp; hand off to `product-architect` (initiative) or `product-spec-writer` (feature).
   - **SHARPEN** — name the mushy sentences and missing answers; loop once with the user, then re-verdict.
   - **KILL** — the press release can't be written honestly. Say so plainly and route back to `vet-idea` or `product-researcher`. A killed idea is a successful run of this skill.
6. **Polish (optional)** — if the humanizer peer is installed, run it (plus `~/.px-skills/shared/writing/humanizer-house-rules.md`) and then `clarity-review` on the document.

## Honesty rules

- **Internal fiction may use invented target metrics** ("cuts scheduling time 40%") — they're commitments to aim at, in the Amazon tradition. **Anything that will be published verbatim may not.** If the PRFAQ doubles as public launch copy, goals go in the Internal FAQ, labeled as goals.
- Imagined customer quotes are labeled imagined.
- FAQ answers state what's unknown as unknown. The document is a test, and a test you can't fail is not a test.

## Reuse after shipping

The PRFAQ is written twice-used: once now, to decide what to build; again after `/ship`, when the announce stage turns `prfaq.md` + `design-context/` into real launch content (via px-marketing-skills' `social-post-designer`). Keep it updated as the plan changes — where the document and reality disagree, the document is the plan, until you consciously change the document.
