# Concept Brief Template

For **CONCEPT mode** — fleshing out a vague idea with research-backed evidence.
Write to `research-brief.md` at workspace root.

```markdown
# Concept Brief: {Idea Name}

> Researched: {date} | Mode: concept

## Original Concept

{Verbatim from user — the one-paragraph idea before research. Preserve exactly.}

## Sharpened Concept

{Rewrite of the concept, informed by research. 2-3 sentences. The version that survives contact with evidence — sharper user, sharper problem, sharper wedge.}

## Does This Pain Exist?

### Evidence FOR
> "{Specific user quote}" — [Source](url)
> "{Specific user quote}" — [Source](url)

- {Data point: star rating, upvote count, thread size, review volume}
- {Data point}

### Evidence AGAINST or weakening
> "{Counter-quote — solved by existing tools, low priority, niche}" — [Source](url)

- {Why this might not be a real opportunity}

**Verdict:** Strong | Moderate | Weak signal. {1-2 sentences on why.}

## Who Cares Most?

Top user segments who have this pain, ranked by severity and evidence:

| # | Segment | Evidence | Pain severity |
|---|---------|----------|---------------|
| 1 | {specific persona} | {what tells us they care — quotes, communities, behaviors} | High / Med / Low |
| 2 | {specific persona} | ... | ... |
| 3 | {specific persona} | ... | ... |

**Wedge:** {The narrowest segment whose pain is sharpest. Start here. One sentence on why.}

## Existing Solutions

| Existing solution | What they do | Where they fall short (for the wedge segment) |
|-------------------|--------------|-----------------------------------------------|
| {Product 1} | {their approach} | {gap your concept fills} |
| {Product 2} | {their approach} | {gap} |
| {Product 3} | {their approach} | {gap} |

## Adjacencies and Pivots

Adjacent ideas the research surfaced that might be sharper than the original concept:

### {Adjacent Idea 1}
{What it is. Why evidence suggests it could be a stronger starting point. Severity of pain, size of segment, gap vs. competitors.}

### {Adjacent Idea 2}
{Same structure.}

## Sharper Articulation

If we proceed with the concept (or a chosen adjacency), here is the version that should feed `product-architect`:

**Product:** {one sentence — what we're building}
**For:** {wedge segment — specific persona}
**Who:** {what their current workflow / pain is}
**Solves:** {the specific pain we're addressing}
**Differentiated by:** {the wedge — what only this approach does}
**Out of scope for v1:** {what we're explicitly NOT building}

## Open Questions

| # | Question | Why it matters | How to resolve |
|---|----------|---------------|----------------|
| 1 | {Unknown that changes the concept} | {what hinges on it} | {user interview / additional research / try a prototype} |
| 2 | ... | ... | ... |

## Recommended Next Step

Pick one:

- **Proceed** → run `product-architect` on the sharpened concept above to decompose into features
- **Pivot** → switch to {adjacent idea}, then run `product-architect`
- **Pressure-test first** → run `/office-hours` to test the assumption that {key claim}
- **Kill** → the evidence does not support this concept (weak verdict). Explore a different problem.

## Sources

| # | Source | URL/Path | Type | Key contribution |
|---|--------|----------|------|-----------------|
| 1 | {Description} | {url} | Reddit / Article / Review / Competitor | {What this source contributed} |
| 2 | {Wiki page} | wiki/{category}/{slug}.md | Wiki | {What it contributed} |
| 3 | ... | ... | ... | ... |
```
