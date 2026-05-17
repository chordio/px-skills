---
name: product-researcher
description: >
  Research producer for the pipeline. Three modes auto-detected from input.
  CONCEPT mode — a vague idea ("I want to build X for Y") → validation + sharpening brief.
  DOMAIN mode — a problem space ("async standup tools") → opportunity map of the space.
  TARGET mode — a specific product (URL, company, or app name) → competitive/feature-gap brief.
  Concept and Domain write research-brief.md + wiki/ at workspace root (feeds product-architect).
  Target writes features/{feature}/research/brief.md (feeds product-spec-writer).
  Trigger on "research", "investigate this idea", "what's out there", a URL or company name,
  or a one-paragraph product idea the user wants to flesh out.
---

# Product Researcher

Produces the research artifact at every level of the pipeline. Three modes, one skill, mode auto-detected from input.

## Modes

| Mode | Input shape | Output frames around | Artifact location |
|------|-------------|---------------------|-------------------|
| **CONCEPT** | One-paragraph idea, "I want to build X" | Your idea — validate, sharpen, surface adjacencies | `research-brief.md` + `wiki/` at workspace root |
| **DOMAIN** | Problem space, "tools for X", "AI for Y" | The space — map it, find top opportunities | `research-brief.md` + `wiki/` at workspace root |
| **TARGET** | URL, company name, app name | A specific product — pain points, competitors, gaps | `features/{feature}/research/brief.md` |

## When to Use

- **Concept mode:** right after a vague idea exists. Produces evidence that feeds `product-architect`.
- **Domain mode:** exploring a problem space before committing to a specific idea. Feeds `product-architect`.
- **Target mode:** researching a specific product to inform a feature spec. Feeds `product-spec-writer`.
- Anytime existing research is stale and needs refreshing.

## Workflow

```
Phase 0: MODE DETECTION → Determine concept / domain / target from input
Phase 1: DIRECTION      → Resolve context, check existing artifacts, confirm scope
Phase 2: DISCOVER       → Broad web search (queries vary by mode)
Phase 3: DEEP DIVE      → Browse competitors and/or target product
Phase 4: SYNTHESIZE     → Write the brief (template varies by mode)
```

---

## Phase 0: Mode Detection

Inspect the input and route to one of three modes:

| Input pattern | Mode |
|--------------|------|
| URL (`yelp.com`), recognizable company/app name (`Yelp`, `Yelp for Business`) | **TARGET** |
| "I want to build...", "my idea is...", paragraph-length concept describing a solution | **CONCEPT** |
| Problem domain phrase ("X tools", "Y for Z", "X workflows") with no specific product or solution named | **DOMAIN** |

If ambiguous, ask once:
> Are you researching (a) a specific product, (b) exploring a problem space, or (c) fleshing out an idea?

Default to **CONCEPT** if the user dropped a paragraph-length idea description.

---

## Phase 1: Direction

### Target Mode

**Parse target:**
- URL (`yelp.com`) → slug = `yelp`
- Company name (`Yelp`) → slug = `yelp`
- App name (`Yelp for Business`) → slug = `yelp`

**Resolve feature context:**
1. Detect workspace mode:
   - **Multi-feature** — `features.json` exists at workspace root → look inside `features/`
   - **Single-feature** — no `features.json` at root → the workspace itself is the feature; paths live at root (`research/`, `specs/`)
2. In multi-feature mode, resolve the feature:
   - List directories in `features/` that contain `feature.json`
   - One active feature → use it (confirm with user)
   - Multiple → show list, ask user to pick
   - None → ask the user to set up features first (typically by running `product-architect`)
3. Set working paths:
   - Multi-feature: `FEATURE_ROOT = features/<feature>`, `RESEARCH_DIR = FEATURE_ROOT/research`
   - Single-feature: `FEATURE_ROOT = .` (workspace root), `RESEARCH_DIR = research`

**Load feature artifacts:**
1. Read `<FEATURE_ROOT>/feature.json` (multi-feature mode only)
2. Review the `artifacts` array — if a research entry already exists, offer refresh or focused area

**Check for existing brief** at `RESEARCH_DIR/brief.md`. If found, offer: view existing, refresh, or focus on a specific area.

**Create directory:**
```bash
mkdir -p features/{feature}/research/screenshots
```

### Concept Mode

**Capture the original concept verbatim** — this becomes the "Original Concept" section in the brief.

**Resolve workspace context:**
- `WORKSPACE_ROOT` = current working directory
- `WIKI_DIR = WORKSPACE_ROOT/wiki`

**Extract from the concept:**
- Hypothesized user / persona
- Hypothesized problem
- Hypothesized solution shape
- Any specific assumptions worth testing

**Check for existing artifacts:**
- `research-brief.md` at workspace root → if exists, offer refresh or focused area
- `product-brief.md` → if exists, the concept may have already been worked. Offer to refresh research or jump to `product-architect`

### Domain Mode

**Identify the problem domain** — extract the space being researched (e.g. "async standup tools for remote teams").

**Resolve workspace context** (same as Concept).

**Check for existing artifacts** (same as Concept).

---

## Phase 1.5: Load Wiki Context (all modes)

Before researching, check for existing product knowledge in `WIKI_DIR`:

1. Check if `wiki/index.md` exists
2. If yes, read `index.md` and select pages from relevant categories: **pain-points**, **competitors**, **users**, **features**
3. Sort by `updated` timestamp (most recent first), take top 5 pages
4. Read each selected page's `## Summary` section
5. Include as "Known context from wiki:" in research planning
6. Use this to skip well-documented ground and deepen gaps
7. If wiki doesn't exist, proceed normally — wiki context is optional

---

## Phase 2: Discover

Run broad web searches. Use WebSearch for queries, WebFetch on the 2-3 richest results per category. Run searches in parallel where possible.

### Query templates by mode

#### TARGET mode (specific product)
```
# User complaints
"{product}" complaints problems reddit 2025 2026
"{product}" frustrating OR annoying site:reddit.com
"{product}" 1 star review problems
"switched from {product}" because

# Competitors
"{product}" competitors 2025 2026
"{product}" alternatives better than
best {category} apps 2026

# Feature gaps
"{product}" missing feature request
"{product}" wishlist forum
"{product}" "should have" OR "wish it had"

# Industry & press
{category} trends 2026
{product} funding news 2026
{product} redesign OR rebrand 2025 2026

# Hiring signals
{product} hiring product designer OR UX researcher
{product} engineering blog design system
```

#### DOMAIN mode (problem space)
```
# User pain points in the space
"{problem domain}" frustrating OR annoying site:reddit.com
"{problem domain}" complaints problems 2025 2026
"{problem domain}" "switched from" OR "gave up"
"{target user}" challenges OR struggles

# Competitive landscape (broad)
"{problem domain}" apps OR tools OR platforms 2026
"best {category}" comparison review 2026
"{problem domain}" alternatives

# User needs & behaviors
"{target user}" workflow OR process OR "how do you"
"{problem domain}" "I wish" OR "would be great if" reddit
"{target user}" daily routine OR workflow

# Industry context
"{problem domain}" trends 2026
"{problem domain}" market OR growth 2026
"{problem domain}" emerging OR new approach
```

#### CONCEPT mode (vague idea)

Concept mode queries are about **validating** and **sharpening** a specific idea. Cover both the problem and the proposed solution shape:

```
# Does this pain exist?
"{hypothesized problem}" frustrating site:reddit.com
"{hypothesized problem}" "I wish" OR "would be great if"
"{target user}" "tired of" OR "struggle with"

# Has anyone built it?
"{solution shape}" tool OR app 2026
"how to {hypothesized goal}" tools
{solution shape} {target user} review

# Adjacencies
"{adjacent problem}" tools 2026
"alternative to {nearest competitor}" 2026
"{target user}" workflow tools 2026

# Counter-evidence
"why I don't use {nearest competitor}"
"{solution shape} doesn't work"
"{solution shape}" overhyped OR criticism
```

### For each search
1. Review results for relevance
2. WebFetch the 2-3 most promising URLs
3. Extract real quotes with source URLs
4. Note quantitative signals (star ratings, upvote counts, thread engagement)

### Exit criteria

| Mode | Exit criteria before Phase 3 |
|------|------------------------------|
| TARGET | 5+ pain points, 3+ competitors, 3+ feature gap signals |
| DOMAIN | 5+ pain points across users, 3+ competitor approaches, sense of the space |
| CONCEPT | 3+ pieces of validation evidence, 3+ competitors/adjacencies, at least 1 counter-signal |

Run additional targeted searches if thresholds aren't met.

---

## Phase 3: Deep Dive

### Target mode

For top 2-3 competitors AND the target product itself:
1. Navigate to main product page → screenshot
2. Perform the core user action → screenshot
3. Identify 2-3 differentiating features the target lacks → screenshot each
4. Read accessibility tree for feature inventory and IA patterns
5. Save screenshots to `RESEARCH_DIR/screenshots/{slug}-{feature}.png`

Time budget: 3-4 minutes per site.

### Domain mode

For top 3-5 competitors in the space:
1. Navigate to main product page → screenshot
2. Perform the core user action → screenshot
3. Note differentiating positioning and UX patterns
4. Save screenshots to `WORKSPACE_ROOT/wiki/competitors/screenshots/{slug}-{feature}.png`

### Concept mode

For 2-3 nearest competitors to the concept, plus 1-2 adjacencies:
1. Navigate to product → screenshot
2. Try the workflow your concept proposes — does it already exist? How does it feel?
3. Note where the concept is differentiated vs. where it overlaps
4. Save to `WORKSPACE_ROOT/wiki/competitors/screenshots/{slug}-{feature}.png`

### Pain Point Validation (all modes)

For top 3-5 pain points from Phase 2:
- Run additional targeted searches for corroboration
- WebFetch review aggregators: G2/Capterra (B2B), App Store/Google Play (consumer), Yelp/Google Reviews (local)
- Quantify: star ratings, upvote counts, thread sizes, review counts
- Look for systemic patterns vs one-off complaints

---

## Phase 4: Synthesize

Write the brief using the template that matches the mode:

| Mode | Template | Output path |
|------|----------|-------------|
| TARGET | [references/brief-template.md](references/brief-template.md) | `features/{feature}/research/brief.md` |
| DOMAIN | [references/brief-template.md](references/brief-template.md) (domain framing) | `research-brief.md` at workspace root |
| CONCEPT | [references/concept-brief-template.md](references/concept-brief-template.md) | `research-brief.md` at workspace root |

### Scoring criteria for recommendations (all modes)

| Dimension | High | Medium | Low |
|-----------|------|--------|-----|
| **Pain** | 5+ sources, systemic | 2-4 sources, recurring | 1 source, edge case |
| **Gap** | No competitor has it | Some competitors have it | All competitors have it |
| **Demo Impact** | Visually dramatic, easy to show | Clear but subtle | Hard to demo |
| **Feasibility** | UI-only, no backend needed | Some mock data needed | Complex interactions |

### Compile to wiki (Concept and Domain modes)

For Concept and Domain modes, write findings as wiki pages in `WORKSPACE_ROOT/wiki/`:

| Finding Type | Wiki Category |
|--------------|---------------|
| User pain points with evidence | `pain-points/` |
| Competitor approaches & features | `competitors/` |
| User personas and insights | `users/` |
| Feature ideas and gaps | `features/` |

Use the standard wiki page template with frontmatter (`title`, `category`, `created`, `updated`, `sources`, `tags`). Update `wiki/index.md` and append to `wiki/log.md`.

### Register the artifact (Target mode)

After writing the brief, register it in `feature.json`'s `artifacts` array:
```json
{ "type": "research", "path": "research/brief.md", "name": "Research Brief", "description": "<top opportunity summary>" }
```
Update the `updated` timestamp. Write back `feature.json`.

---

## Next step

Each mode hands off to a different downstream skill:

| Mode | Next step |
|------|-----------|
| **CONCEPT** | Run `product-architect` to decompose the sharpened concept into features. If a strong adjacency emerged, consider pivoting first. Optionally run `/office-hours` to pressure-test the assumption. |
| **DOMAIN** | Run `product-architect` to pick top opportunities from the map and decompose. |
| **TARGET** | Run `product-spec-writer` to scope the feature based on the brief. |

End the run with a one-line nudge:
```
**Next step:** run product-architect on the sharpened concept.
```

---

## Output Structure

### Target mode
```
features/{feature}/research/
├── brief.md
└── screenshots/
    ├── {competitor}-homepage.png
    ├── {competitor}-{feature}.png
    └── {product}-{page}.png
```

### Concept / Domain modes
```
WORKSPACE_ROOT/
├── research-brief.md              # Top-level brief
└── wiki/
    ├── index.md
    ├── log.md
    ├── sources.json
    ├── pain-points/
    ├── competitors/
    │   └── screenshots/
    ├── users/
    └── features/
```

---

## Tips

- **Mode detection is cheap, get it right.** Wrong mode means wrong brief shape. If in doubt, ask once.
- **Breadth over depth in Phase 2.** Cast a wide net, then narrow in Phase 3.
- **Extract real quotes.** Direct user quotes with source links are more compelling than paraphrases.
- **Quantify everything.** Star ratings, upvote counts, thread sizes — numbers make the brief actionable.
- **Time-box Phase 3.** Browsing can become a rabbit hole. 3-4 minutes per site is enough for screenshots and pattern noting.
- **Concept mode: look for counter-evidence.** It's the cheapest place to kill a bad idea. Don't just confirm the user's hypothesis.
- **Score honestly.** A "Medium" with honest scoring beats inflated "High" scores.
