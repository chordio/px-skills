---
name: review-panel
description: Assemble and run an expert design review panel. Use when reviewing designs, getting design feedback, critiquing UI/UX, or when users share Figma URLs or design images for critique. Selects 2-4 optimal experts based on design type (mobile app, landing page, dashboard, etc.), runs parallel sub-agent reviews, and synthesizes findings. Supports Figma URLs via MCP, images, and design descriptions.
---

# Review Panel

Expert design critique using a curated panel of design specialists. Each reviewer critiques from their unique lens, then findings are synthesized into actionable recommendations.

## Design Taste References

Panel experts critique through their individual lenses (Tufte on data-ink ratio, Ive on resolved complexity, Wroblewski on mobile tap targets, etc.). The synthesis step then cross-references shared bans from `~/.px-skills/shared/design-taste/`:

- `anti-patterns.md` — must-flag bans (side-stripe borders, gradient text, hero-metric template, identical card grids, em dashes, AI slop reflexes). Any consensus issue matching one of these gets bumped to high priority.
- `typography.md`, `color-and-contrast.md`, `spatial-design.md`, `motion-design.md`, `interaction-design.md`, `responsive-design.md`, `ux-writing.md` — domain references for cross-checking individual expert feedback against established craft norms.

If two experts disagree and one position aligns with a rule in these references, the synthesis should favor that position.

## Workflow

### 1. Gather Design Context

Before reviewing, ensure sufficient context exists:

1. **Check for `/design-context` folder** in the project
   - If exists: Read product overview, brand guidelines, user personas
   - If skill `design-context-builder` is available: Offer to invoke it

2. **If no context available**, ask the user:
   - "What is this product/feature for?"
   - "Who is the target user?"
   - "What are the key user flows or goals?"
   - "Any brand or design system constraints?"

3. **Fallback**: Offer to explore the codebase to infer context (README, components, etc.)

Never review a design without understanding its purpose and audience.

### 2. Obtain the Design

Accept designs in these formats:

**Figma URL** (preferred):
```
Use mcp__figma__get_design_context to fetch design structure and code hints
Use mcp__figma__get_screenshot to capture visual for review
Extract nodeId and fileKey from URL (e.g., figma.com/design/:fileKey/:fileName?node-id=:nodeId)
```

**Image file**: Read directly using the Read tool

**Description**: Accept text descriptions for conceptual reviews

### 3. Select the Review Panel

Choose 2-4 experts based on design type. Load expert profiles from `twins/[name].twin.md`.

**Expert resolution order:**
1. Check if `twins/[expert-name].twin.md` exists → use the twin profile
2. If no twin exists → generate an expert persona on-the-fly (see "Dynamic Expert Generation" below)

**Selection heuristics:**

| Design Type | Recommended Panel |
|-------------|-------------------|
| Mobile app | Luke Wroblewski (mobile), Jony Ive (craft), Aaron Walter (emotion) |
| Landing page | Joanna Wiebe (conversion copy), April Dunford (positioning), Aaron Walter (trust) |
| Dashboard | Edward Tufte (data viz), Brad Frost (systems), Leah Buley (accessibility) |
| Design system | Brad Frost (atomic), Julie Zhuo (process), Leah Buley (inclusive) |
| AI/Chat interface | Emily Campbell (AI UX), Aaron Walter (emotion), Val Head (motion) |
| Onboarding flow | Aaron Walter (delight), Val Head (motion), Eli Woolery (problem-framing) |
| E-commerce | Joanna Wiebe (conversion copy), April Dunford (value prop), Luke Wroblewski (mobile/forms) |
| Enterprise/B2B | Leah Buley (accessibility), Clark Valberg (strategy), Julie Zhuo (scalability) |

**Always include a generalist** (Jony Ive, Julie Zhuo, or Aaron Walter) for balanced perspective.

If user specifies experts, honor their selection.

### 4. Run Parallel Reviews

Launch sub-agents in parallel—one per expert:

```
For each selected expert:
  1. Load twins/[expert-name].twin.md
  2. Spawn a sub-agent with expert profile and design context
  3. All sub-agents run concurrently
```

If sub-agent spawning is unavailable, fall back to sequential reviews.

**Sub-agent prompt template:**

```
You are {expert.name}, {expert.title}.

## Your Design Philosophy
{expert.corePhilosophy}

## Your Focus Areas
{expert.focusAreas}

## Your Critique Methods
{expert.critiqueMethods}

## Your Voice
{expert.voiceAndCommunicationStyle}
Use phrases like: {expert.signaturePhrases}

## Design Context
Product: {productContext}
Target users: {userContext}
Goals: {designGoals}

## Your Task
Review this design from YOUR unique perspective. Focus on your specialty areas.

Structure your critique as:
1. **First Impression** (1-2 sentences)
2. **What Works** (2-3 specific observations in your domain)
3. **Concerns** (2-3 issues you'd flag, with reasoning)
4. **Recommendation** (1 actionable next step)

Be specific, reference actual elements in the design, stay in character.
```

### 5. Synthesize Findings

After all reviews complete:

1. **Present individual critiques** sequentially, labeled by expert
2. **Generate synthesis** that identifies:
   - Common themes across reviewers
   - Conflicting perspectives (and why they differ)
   - Priority actions (high/medium/low based on frequency and severity)
   - Quick wins vs. larger efforts

**Synthesis format:**

```markdown
## Panel Synthesis

### Consensus
- [Issues multiple experts flagged]

### Differing Perspectives
- [Expert A] prioritizes X because...
- [Expert B] emphasizes Y instead...

### Recommended Actions
**High Priority:**
1. [Action] - flagged by [experts], addresses [issues]

**Medium Priority:**
1. [Action]

**Quick Wins:**
1. [Action] - low effort, improves [aspect]
```

## Expert Roster

Load profiles from `twins/` folder:

| Expert | Specialty | Best For |
|--------|-----------|----------|
| jony-ive | Simplicity, craft, form | Product design, premium experiences |
| julie-zhuo | Product strategy, process | Strategy alignment, team contexts |
| brad-frost | Design systems, components | System work, scalability |
| emily-campbell | AI UX, content strategy | AI products, conversational UI |
| aaron-walter | Emotional design, delight | Consumer products, onboarding |
| clark-valberg | Design strategy, business | Executive contexts, ops |
| eli-woolery | Design thinking, problem-framing | Early concepts, validation |
| luke-wroblewski | Mobile, forms, touch | Mobile apps, responsive design |
| april-dunford | Positioning, messaging | Landing pages, marketing |
| joanna-wiebe | Conversion copy, VOC | Landing pages, sales pages |
| leah-buley | Accessibility, inclusive design | Enterprise, compliance |
| edward-tufte | Data visualization | Dashboards, analytics |
| val-head | Motion, animation | Transitions, micro-interactions |

## Dynamic Expert Generation

When the design requires expertise not covered by existing twins, generate an appropriate expert on-the-fly.

**When to use dynamic generation:**
- Design type doesn't match existing expert specialties
- User requests a specific expertise area (e.g., "gaming UI", "healthcare compliance")
- Niche domain knowledge is needed (e.g., "fintech dashboards", "educational apps")

**How to generate a dynamic expert:**

Construct a persona using this template:

```
You are an expert in [specific domain], with deep experience in [relevant background].

## Your Focus Areas
- [2-3 domain-specific focus areas derived from the design context]

## Your Critique Lens
You evaluate designs through the lens of:
- [Domain-specific consideration 1]
- [Domain-specific consideration 2]
- [Industry best practices or regulations if applicable]

## Your Task
Review this design focusing on [domain] considerations. Flag issues that someone without [domain] expertise might miss.

Structure your critique as:
1. **First Impression** (1-2 sentences)
2. **What Works** (2-3 specific observations in your domain)
3. **Concerns** (2-3 issues you'd flag, with reasoning)
4. **Recommendation** (1 actionable next step)
```

**Example dynamic experts:**

| Design Context | Generated Expert |
|----------------|------------------|
| Healthcare app | Healthcare UX specialist (HIPAA, patient anxiety, clinical workflows) |
| Gaming interface | Game UI designer (player motivation, feedback loops, accessibility) |
| Legal/compliance tool | Enterprise compliance UX expert (audit trails, regulatory requirements) |
| Kids' educational app | Child UX specialist (age-appropriate design, COPPA, developmental psychology) |
| Fintech dashboard | Financial UX expert (trust signals, data density, regulatory disclosures) |

**Combining with existing twins:**

When using dynamic experts, still include at least one existing twin as a generalist anchor:
- Healthcare app → Dynamic healthcare expert + Aaron Walter (emotion) + Leah Buley (accessibility)
- Gaming UI → Dynamic gaming expert + Val Head (motion) + Jony Ive (craft)

## Adding Custom Twins

To add a custom expert (created via `design-manager-twin-creator`):

1. Copy the `.twin.md` file to `twins/` folder
2. The expert will be available for panel selection
3. Reference by filename (without extension) when requesting specific experts
