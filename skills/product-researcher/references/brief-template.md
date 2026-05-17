# Research Brief Template

Write the brief to `features/{feature}/research/brief.md` (multi-feature) or `research/brief.md` at workspace root (single-feature) using this structure:

```markdown
# Research Brief: {Product Name}

> Researched: {date} | Target: {url} | Focus: {scope}

## Executive Summary

{2-3 sentences: biggest opportunity and what to prototype.}

## Pain Points

### 1. {Pain Point Title}
**Severity:** Critical | High | Medium
**Sources:** {count} independent sources

> "{Direct quote}" — [Source](url)
> "{Another quote}" — [Source](url)

**Impact:** {Why this matters to users/business}
**Opportunity:** {What solving this looks like}

### 2. ...
(Repeat for each pain point, ranked by severity)

## Competitor Landscape

### Feature Matrix

| Feature | {Target} | {Comp 1} | {Comp 2} | {Comp 3} |
|---------|----------|----------|----------|----------|
| {Feature 1} | ✓/✗/Partial | ... | ... | ... |

### {Competitor 1}
**URL:** ...
**Key differentiator:** ...
**Screenshot:** screenshots/{slug}.png

### {Competitor 2}
...

## Feature Gaps & Opportunities

### 1. {Gap Title}
**Who has it:** {Competitors with this feature}
**User demand:** {Evidence — quotes, upvotes, thread sizes}
**Demo potential:** High | Medium | Low

### 2. ...

## Industry Trends

- **{Trend}:** {Relevance to the target product}
- ...

## Prioritized Recommendations

| # | Feature | Pain | Gap | Demo Impact | Feasibility |
|---|---------|------|-----|-------------|-------------|
| 1 | ... | H/M/L | H/M/L | H/M/L | H/M/L |
| 2 | ... | H/M/L | H/M/L | H/M/L | H/M/L |
| 3 | ... | H/M/L | H/M/L | H/M/L | H/M/L |

### Recommended Prototype: {Feature Name}

{Why this is the top pick. Reference specific pain points and competitive gaps.}

**Design direction:** {What the prototype should show}
**Target states:** {Suggested states for capture}
**Story angle:** {How to frame this in a video demo for outreach}

## Sources

| # | Source | URL/Path | Type |
|---|--------|----------|------|
| 1 | {Description} | {url} | Reddit/Review/Article/Competitor |
| 2 | {Wiki page title} | wiki/{category}/{slug}.md | Wiki |
| 3 | ... | ... | ... |
```
