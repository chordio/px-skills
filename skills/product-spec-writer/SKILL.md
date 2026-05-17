---
name: product-spec-writer
description: >
  Generate a product spec from research briefs, user insights, or problem descriptions.
  Produces a structured requirements document optimized for agent consumption — covering
  what we're building, why, who it's for, use cases, requirements, and success criteria.
  Output goes to features/{feature}/specs/{spec-slug}/ with spec.json + spec.md.
  Feeds into design-spec-writer for UX details. Trigger on "product spec", "requirements",
  "what should we build", "define the product", or when the user has research and needs to
  scope a feature.
---

# Product Spec Writer

Generate a structured product spec from research, user insights, or problem descriptions. The product spec defines **what** we're building, **why**, and **who** it's for — everything an agent needs to execute well. It feeds directly into `design-spec-writer` for UX details and downstream prototyping skills.

## When to Use

- After a research brief is produced and you need to scope what to build
- When the user has customer feedback, support themes, or sales insights to act on
- When a ticket or problem statement needs to be expanded into clear requirements
- When the user says "what should we build" or "define the product" or "product spec"
- Before `design-spec-writer` — the product spec is the input that grounds the design spec

## Phase 0: Scope Guard (do this first)

Before doing anything else, decide whether this input is **one feature** or **multiple features in disguise**. A product spec covers one feature. If the input is initiative-sized, bounce it back to `product-architect` instead of producing a sprawling spec that violates the "tight spec covers one problem well" principle.

### Rubric — stop and redirect if 2+ are true:

- Input spans 3+ top-level navigation sections (e.g. "dashboard, settings, billing, and onboarding")
- 2+ distinct primary user personas with non-overlapping needs (e.g. "admins and end-users and integrators")
- User framing is "X has features A, B, C..." (explicit multi-feature decomposition in the brief)
- Estimated >10 use cases or >25 requirements to cover the scope honestly
- No `architecture.md` exists at the workspace root AND the input describes a whole product, not a feature within one

### What to do when triggered:

```
This input looks initiative-sized (multiple features, multiple navigation areas, or
no shared architecture yet). A single product spec will sprawl and won't give downstream
skills (design-spec-writer, prototyping) a tight target.

Recommend running product-architect first — it will:
  • Research the space at the initiative level
  • Decompose into 3-7 features
  • Define the shared architecture (IA, nav, cross-feature patterns)
  • Scaffold one directory per feature under features/

Then run product-spec-writer on each feature.

Proceed anyway? (y/N)
```

If the user explicitly chooses to proceed, continue. The rubric is a guard, not a hard block.

---

## Resolve Feature Context

Before generating a spec, determine which feature this spec is for:

1. **Detect workspace mode:**
   - **Multi-feature** — `features.json` exists at workspace root → look inside `features/`
   - **Single-feature** — no `features.json` → the workspace is the feature; paths live at root
2. **Parse input** — extract feature slug from the user's command (if given)
3. **In multi-feature mode, if feature is not specified, resolve it:**
   - List directories in `features/` that contain `feature.json`
   - If exactly one feature exists → use it (confirm with user)
   - If multiple → show list, ask user to pick
   - If none → ask the user to run product-architect first
4. **Set working paths:**
   - Multi-feature: `FEATURE_ROOT = features/<feature>`, `SPECS_DIR = FEATURE_ROOT/specs`
   - Single-feature: `FEATURE_ROOT = .` (workspace root), `SPECS_DIR = specs`

---

## Workflow

```
Phase 0: SCOPE GUARD → One feature, or initiative-sized? Redirect if needed.
Phase 1: GATHER      → Collect inputs (research, insights, problem statement)
Phase 2: CLARIFY     → Fill gaps, resolve ambiguity, confirm scope
Phase 3: STRUCTURE   → Write the product spec
Phase 4: VALIDATE    → Review against quality checklist, persist
```

---

## Product Context Loading (before Phase 1)

Before gathering inputs, load the shared product context:

### Product-Level Context

1. **Product brief** — check if `product-brief.md` exists. If yes, read it. Use the initiative-level vision, user flows, and competitive landscape to ground the spec in the broader product direction.
2. **Architecture** — check if `architecture.md` exists. If yes, read it. Use the information architecture, shared patterns, and cross-feature touchpoints to ensure requirements align with the product framework. Reference specific screens and flows this feature owns.
3. **Features manifest** — check if `features.json` exists. If yes, read the entry for the current feature. Use dependencies and priority to inform scope decisions.

### Feature-Level Context

1. Read `features/<feature>/feature.json`
2. Check the `artifacts` array — note what already exists but do **not** load contents yet
3. Load only these by default (outputs of previous pipeline stages):
   - **Frame** — `features/<feature>/frame.md` (if it exists)
   - **Research brief** — `features/<feature>/research/brief.md` (if it exists)
4. Pull additional artifacts on demand during spec writing when they become relevant

### KB Context Loading

Check for existing product knowledge in the wiki:

1. Check if `wiki/index.md` exists
2. If yes, read `index.md` and select pages from categories: **pain-points**, **features**, **users**, **decisions**
3. Sort by `updated` timestamp in frontmatter (most recent first), take top 5 pages
4. Read each selected page's `## Summary` section
5. Include as "Known context from product wiki:" when gathering inputs
6. Use this to: ground requirements in known evidence, avoid contradicting past decisions, reference established user segments
7. If wiki doesn't exist, proceed normally — wiki context is optional

---

## Phase 1: Gather

Collect all available inputs. The more context, the stronger the spec.

### Input Sources (check in order)

1. **Research brief** — `features/{feature}/research/brief.md`
   - Extract: pain points, feature gaps, competitor landscape, recommendations
2. **User insights** — `features/{feature}/research/insights.md` or similar
   - Extract: common themes, user quotes, severity signals
3. **Personas** — `personas.json`
   - Extract: target user types, goals, frustrations
4. **Existing specs** — `features/{feature}/specs/`
   - Check for related specs to avoid duplication or contradiction
5. **User's message** — the problem statement, ticket description, or verbal brief
   - Extract: the core problem, any constraints, desired outcomes

### What to Extract

From each source, pull:
- **Problems** — What's broken, missing, or frustrating?
- **Users** — Who experiences this? How severely?
- **Evidence** — Quotes, data points, support ticket volume, churn signals
- **Constraints** — Technical limits, timeline, dependencies
- **Desired outcomes** — What does success look like?

---

## Phase 2: Clarify

Before writing, ensure you have enough to produce a strong spec. Ask the user if any of these are unclear:

1. **Core problem** — Can you articulate the problem in one sentence?
2. **Target users** — Who specifically are we solving for? (Not "everyone")
3. **Scope boundaries** — What's explicitly OUT of scope?
4. **Success signal** — How will we know this worked?
5. **Priority** — Is this a must-have, should-have, or nice-to-have?

If the research brief or user input is rich enough, you may not need to ask anything. Use judgment — don't slow things down with unnecessary questions when the answers are already in the inputs.

---

## Phase 3: Structure

Write the product spec using the template in [templates/product-spec-template.md](templates/product-spec-template.md).

### Section Guidelines

#### Overview
Three questions, answered clearly:
- **What are we building?** — The feature or capability in concrete terms. Not vision — deliverable.
- **Why are we building it?** — The problem or opportunity that justifies this work. Reference evidence from research/insights.
- **Who is it for?** — Specific user segments. Reference personas if available.

#### Use Cases
Concrete scenarios that illustrate how real users would interact with this feature. Each use case should:
- Name a specific user type (not "the user")
- Describe a realistic situation that triggers the need
- Show the expected outcome
- Cover both the happy path and important edge cases

Aim for 3-7 use cases. Cover the primary flow, at least one edge case, and at least one failure/recovery scenario.

#### Requirements
The heart of the spec. Requirements should be:
- **Specific** — "Show a confirmation before deleting" not "handle deletion gracefully"
- **Testable** — An agent reading this should be able to verify whether the requirement is met
- **Organized** — Group by area (core functionality, data handling, error handling, constraints)
- **Complete** — Cover interactions, system behaviors, edge cases, data rules
- **Concise** — Use tables to minimize prose where possible

Do NOT include:
- UX/visual details (layout, components, animations) — that's `design-spec-writer`
- Wireframes or mockups — that's downstream design work
- Technical architecture or database schema — unless it's a hard constraint
- Timelines, milestones, or resourcing
- Signoff/approval sections

#### Success Criteria
Measurable outcomes that define "done" and "done well." These become the review checklist when evaluating designs and prototypes later. Each criterion should be:
- **Observable** — Can be verified by looking at the prototype
- **Specific** — "Users can complete the core flow in under 3 steps" not "good UX"
- **Tied to a requirement** — Every criterion should trace back to a requirement or use case

Include both functional criteria (does it work?) and quality criteria (does it work well?).

#### Scope & Constraints
Explicitly state:
- What's in scope vs. out of scope
- Technical constraints (API limitations, platform restrictions)
- Dependencies on other features or systems
- Any assumptions made

#### Open Questions
Unresolved decisions that may affect requirements. Flag these rather than guessing. Each should note:
- The question
- Why it matters (what changes depending on the answer)
- A recommended default if the team needs to move forward without an answer

---

## Phase 4: Validate

Before persisting, verify the spec against this checklist:

- [ ] **Problem is clear** — A new team member could read the overview and understand why this matters
- [ ] **Users are specific** — Not "users" but named personas or segments
- [ ] **Requirements are testable** — Each one can be verified as met/not-met
- [ ] **Success criteria exist** — At least 3 criteria that can be evaluated against a prototype
- [ ] **Edge cases are covered** — Error states, empty states, boundary conditions
- [ ] **Scope is bounded** — Clear in/out of scope
- [ ] **No UX prescriptions** — Requirements describe WHAT, not HOW it should look
- [ ] **Evidence is cited** — Research findings, quotes, or data referenced where relevant

---

## Persisting the Spec

After generating the spec content, persist it as a structured artifact:

1. **Derive slug** from the spec name (lowercase, hyphens): `"Smart Price Alerts"` → `smart-price-alerts`

2. **Create directory:**
```bash
mkdir -p features/<feature>/specs/<spec-slug>
```

3. **Write `spec.json`:**
```json
{
  "name": "Smart Price Alerts",
  "slug": "smart-price-alerts",
  "type": "product-spec",
  "description": "Product spec for real-time price alert notifications",
  "stage": "draft",
  "created": "<ISO timestamp>",
  "updated": "<ISO timestamp>",
  "relatedPrototypes": [],
  "relatedResearch": [],
  "relatedDesignSpecs": [],
  "sources": [
    { "type": "research", "path": "features/<feature>/research/brief.md", "label": "Research Brief" },
    { "type": "wiki", "path": "wiki/pain-points/<topic>.md", "label": "<Wiki Page Title>" }
  ]
}
```

Note: `"type": "product-spec"` distinguishes this from design specs (`"type"` is omitted or `"design-spec"` in existing specs).

4. **Write `spec.md`** — the full product spec content using the template

5. **Link related artifacts** in `spec.json`:
   - If research briefs exist for the same feature, add filenames to `relatedResearch`
   - If design specs exist, add their slugs to `relatedDesignSpecs`
   - If prototypes exist, add their slugs to `relatedPrototypes`

6. **Report:**
```
Product spec saved to features/<feature>/specs/<spec-slug>/

  spec.json  — structured metadata (type: product-spec, stage: draft)
  spec.md    — full product spec

Sources: [list any research/insights referenced]
Related: [list any linked artifacts]

**Next step:** run design-context-manager (if design-context/ doesn't exist),
then design-spec-writer on this spec.
```

### Updating Specs

When updating an existing product spec:
- Read existing `spec.json` to preserve `created` timestamp and existing links
- Update `"updated"` timestamp
- Advance `"stage"` if appropriate (`"draft"` → `"review"` → `"approved"`)
- Rewrite `spec.md` with updated content

---

## Next step

After writing the spec, the next pipeline step is:

1. If `design-context/` doesn't exist at workspace root → run `design-context-manager` (once per product, before any design-spec-writer call)
2. Then run `design-spec-writer` on this feature spec

**Suggested command:** `design-spec-writer {feature-slug}` (or `design-context-manager` first if missing)

---

## Tips

- **Lead with evidence.** Requirements grounded in research or real user quotes are stronger than assumptions.
- **Stay concrete.** "Users can filter by date range, status, and assignee" beats "users can filter results."
- **Think in scenarios.** If you can't write a use case for a requirement, it might not be real.
- **Don't over-scope.** A tight spec that covers one problem well beats a sprawling spec that covers everything poorly.
- **Write for agents.** This spec will be consumed by `design-spec-writer` and downstream prototyping skills. Clear, structured, unambiguous text is what they need.
- **Success criteria are the bridge.** They connect this product spec to the design review that happens after prototyping. Write them so a reviewer can check each one against the prototype.
