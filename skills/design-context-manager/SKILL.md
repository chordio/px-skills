---
name: design-context-manager
description: Initialize and maintain design context files. Use when design-context/ folder doesn't exist, after design-relevant code changes (colors, fonts, spacing), or when foundation elements change. The agent should invoke this after modifying design tokens to keep context in sync.
---

# Design Context Manager

Initialize and maintain the design context files that ground all design decisions.

## Pipeline Position

This skill produces **project-wide visual infrastructure** (brand AND components). It runs **once per product**, not per feature.

```
product-architect / product-spec-writer  (defines what components are needed)
                    ↓
            design-context-manager       ← YOU ARE HERE — runs once, project-wide
                    ↓
              design-spec-writer         (per feature, references design-context/)
```

**Trigger condition:** run when either `architecture.md` exists at workspace root (multi-feature product), or the first `product-spec` is written (single-feature project). In both cases, **before any `design-spec-writer` call** — design specs need this as a reference.

If you only need a brand vision (no component-level definition), `/design-consultation` (gstack) is a faster alternative that produces brand-only `DESIGN.md`. This skill covers both brand and components in one consistent folder, so prefer it as the canonical pipeline step.

## When to Use

### Initial Setup
- Project has no `design-context/` folder
- Starting a new project from scratch

### After Design-Relevant Code Changes
Invoke this skill after modifying:
- `tailwind.config.*` (colors, fonts, spacing, breakpoints)
- CSS variables in `globals.css`, `index.css`, or similar
- Font imports or typography configuration
- Component library setup or theming

### After Feature/Flow Changes
Invoke this skill after:
- Adding new pages or routes
- Implementing major features
- Changing core user flows or navigation

### Foundation Changes
- Rebrand or design system migration
- Major style overhaul
- New component library adoption

## Design Taste References

The vendored references at `~/.claude-design-skills/shared/design-taste/` define what a complete, high-quality design system looks like. When extracting (Path A) or interviewing (Path B), use them as the **completeness bar** — does the design system you're producing have well-reasoned positions on each of these domains?

- `typography.md` — type scale, weights, line length, OpenType features
- `color-and-contrast.md` — color strategy (Restrained / Committed / Full palette / Drenched), OKLCH, tinted neutrals
- `spatial-design.md` — spacing systems, grids, container discipline
- `motion-design.md` — easing curves, timing, prefers-reduced-motion
- `interaction-design.md` — affordances, feedback, state changes
- `responsive-design.md` — breakpoint strategy, fluid scales
- `ux-writing.md` — voice, error messages, calibrated copy
- `anti-patterns.md` — what to NEVER include in the generated design system

If the source codebase (Path A) is silent on a domain, flag the gap in the generated `design-context/` file with confidence: Low and suggest follow-up.

## Output Structure

Creates `design-context/` folder in project root with:

### Modular Design Spec Files (6 markdown files)
| File | Content |
|------|---------|
| `brand.md` | Brand identity, voice, tone, personality |
| `colors.md` | Color system, palettes, semantic colors |
| `typography.md` | Font families, type scale, semantic styles |
| `layout.md` | Spacing, grid, responsive breakpoints |
| `components.md` | Component guidelines, patterns |
| `logo.md` | Logo usage, variations, clear space |

### Machine-Readable Tokens
| File | Content |
|------|---------|
| `design-tokens.json` | W3C Design Tokens format (colors + typography) |

### Product Context
| File | Content |
|------|---------|
| `product-context.md` | Product overview, audience, personas |
| `user-journeys.md` | Key pages and workflows |

## Process Selection

### Path A: Extraction (Preferred for Existing Codebases)

Use when project has existing design patterns to extract.

**Check for:**
- `tailwind.config.*` - Color, font, spacing configuration
- `package.json` - UI library dependencies (shadcn, radix, mui, etc.)
- `app/globals.css` or `src/index.css` - CSS variables
- `components/` or `src/components/` - Component structure
- `README.md`, `CLAUDE.md` - Product documentation

**Process:**
1. Read and analyze configuration files
2. Extract design tokens (colors, fonts, spacing)
3. Identify component library and patterns
4. Generate design-context files with confidence annotations
5. Ask clarifying questions for uncertain values

See [extraction-guide.md](references/extraction-guide.md) for detailed instructions.

### Path B: Interactive (For New Projects)

Use when project lacks design patterns or starting fresh.

**Process:**
1. Ask about product and audience
2. Ask about visual direction preferences
3. Generate templates with placeholder guidance
4. Recommend design system setup steps

See [questionnaire-guide.md](references/questionnaire-guide.md) for question flow.

### Path C: Live URL (Reverse-engineer from a Rendered Site)

Use when the user has a live site — their own production site, a competitor for inspiration, or a brand reference — and wants to capture its design system without source-code access.

**Inputs:**
- One URL (entry point)
- Optionally: additional URLs to broaden the sample (e.g., homepage + pricing + a dashboard view)

**Process:**

1. **Choose a browser automation backend** — use the first available backend that can navigate, resize viewport, capture screenshots, read DOM/accessibility data, interact with the page, and evaluate JavaScript for computed styles. Prefer `/browse` from gstack when available; otherwise use Browser Use / in-app browser tools, Playwright, or Puppeteer / Chrome remote debugging. If no backend with these capabilities is available, stop and tell the user that live-URL extraction requires browser automation.

2. **Browse and capture**:
   - Set viewport to 1440×900
   - Navigate to the URL
   - Take a full-page screenshot (save under `design-context/source/desktop-{n}.png`)
   - For each additional URL, repeat
   - Then resize to 390×844 and re-navigate; capture one mobile screenshot per URL

3. **Extract computed styles** by reading the rendered DOM via the selected backend's JavaScript eval and accessibility/DOM primitives. For each captured page, harvest:

   | Token type | What to read |
   |---|---|
   | CSS custom properties | `getComputedStyle(document.documentElement).getPropertyValue(...)` for `--*` names found in the stylesheet |
   | Typography | Computed `font-family`, `font-size`, `font-weight`, `line-height` on `h1`, `h2`, `h3`, `h4`, `p`, `button`, `a`, `input`, `label` |
   | Color | Computed `background-color`, `color`, `border-color` across visible elements; deduplicate; semantic-group (brand / neutral / semantic / surface) |
   | Spacing | Computed `padding`, `margin`, `gap` on layout containers; find the smallest base unit |
   | Border radius | Computed `border-radius` on buttons, cards, inputs, modals |
   | Shadows | Computed `box-shadow` on cards and floating elements |
   | Breakpoints | Inspect `<meta name="viewport">`, look for responsive CSS in stylesheets, or infer from layout shift between desktop and mobile screenshots |
   | Fonts | `document.fonts` entries; `@font-face` rules in stylesheets; `<link>` font CDN URLs |

4. **Reverse-engineer the system** — given the harvested values:
   - Cluster colors into semantic groups (Restrained / Committed / Full palette / Drenched — see `~/.claude-design-skills/shared/design-taste/color-and-contrast.md` for the framework)
   - Identify the type scale by deduplicating font-size values; check if ratios are consistent (≥1.25 between steps — see `~/.claude-design-skills/shared/design-taste/typography.md`)
   - Identify the spacing scale by deduplicating padding/margin values; find the base unit (commonly 4 or 8)
   - Note container max-widths from layout shifts

5. **Generate design-context files** with confidence annotations following Path A's pattern:
   - **High** — value appears consistently across multiple pages/elements
   - **Medium** — value found on one page or inferred from limited samples
   - **Low** — best guess from sparse data; flag for user review

6. **Save source artifacts** — write screenshots and a `source.json` manifest to `design-context/source/`:
   ```json
   {
     "extractedFrom": "live-url",
     "sourceUrls": ["https://example.com", "https://example.com/pricing"],
     "capturedAt": "<ISO timestamp>",
     "screenshots": ["desktop-1.png", "desktop-2.png", "mobile-1.png"]
   }
   ```

**Limitations to flag in the generated files:**
- Live extraction sees only what's rendered, not the underlying token system. A site may USE `#0F172A` while the source declares `--color-neutral-900` — the original names won't surface.
- Single-page captures miss states (hover, focus, error). Re-run with additional URLs or invoke `/reference-ux` for full flow capture.
- Authenticated views require either credentials or running this skill from a logged-in browser session. If using gstack, `/setup-browser-cookies` can help; with Playwright/Puppeteer, reuse an authenticated browser profile or storage state.

**Related skills:**
- `/reference-ux` — captures UX *flows*, not just tokens; different scope, complementary output
- `/browse` (from gstack) — preferred browser primitive when available

See [extraction-guide.md](references/extraction-guide.md) for the full Path C harvest table, reverse-engineering steps, common site patterns, and limitations.

## Context File Templates

See [templates/](templates/) for the full structure of each context file:
- `brand-template.md` - Brand identity, voice, tone
- `colors-template.md` - Color system and palettes
- `typography-template.md` - Fonts and type scale
- `layout-template.md` - Spacing, grid, breakpoints
- `components-template.md` - Component patterns
- `logo-template.md` - Logo usage guidelines
- `product-context-template.md` - Product overview, personas
- `user-journeys-template.md` - Flows, pages, interactions
- `design-tokens-template.json` - W3C format tokens

## Maintenance Mode

When the agent has made design-relevant code changes, follow this workflow to sync context.

### Step 1: Identify Affected Context Files

| Code Change | Update These Files |
|-------------|-------------------|
| `theme.colors.*` or CSS `--color-*` | colors.md, design-tokens.json |
| `theme.fontFamily.*` or font imports | typography.md, design-tokens.json |
| `theme.spacing.*` or CSS `--spacing-*` | layout.md, design-tokens.json |
| `theme.screens.*` (breakpoints) | layout.md |
| Component library changes | components.md |
| Brand voice/tone changes | brand.md |
| New routes or user flows | user-journeys.md |
| Product positioning changes | product-context.md |

### Step 2: Read Existing Context

Read `design-context/[affected-file].md` and preserve:
- Custom additions not from extraction
- User-provided overrides
- Sections marked with `<!-- Manual -->` annotation

### Step 3: Update Specific Sections

**Do NOT regenerate entire files.** Update only the sections affected by the code change.

For each changed value:
1. Update the value
2. Update the source annotation: `(Extracted from tailwind.config.ts)`
3. Set confidence to `High` (you know what you just changed)

### Step 4: Update Metadata

At the bottom of each modified file, update:
```markdown
_Source: Extracted from [files]_
_Last Updated: [ISO date]_
_Recent Change: [Brief description]_
```

### Step 5: Sync design-tokens.json

If colors, typography, or spacing changed, update the affected sections in `design-tokens.json` to keep it in sync with the markdown files.

---

## Self-Invocation Guidance

The agent should proactively invoke this skill after completing work that affects design foundations.

### Trigger Recognition

After completing a task, ask:
> "Did I just modify any design-system-level values (colors, fonts, spacing, breakpoints, component patterns)?"

If yes, invoke this skill with context about what changed.

### What Triggers Maintenance

| Change Type | Example | Triggers? |
|-------------|---------|-----------|
| Color value change | Changed primary from blue to indigo | **Yes** |
| Font family change | Switched body font to Inter | **Yes** |
| Spacing/breakpoint change | Changed base unit or added breakpoint | **Yes** |
| New page or route | Added `/settings` page | **Yes** |
| Major feature | Implemented checkout flow | **Yes** |
| User flow change | Restructured onboarding | **Yes** |
| Component style tweak | Adjusted button padding | No |
| Content/copy change | Updated page text | No |
| Bug fix | Fixed overflow issue | No |

### How to Self-Invoke

After completing a triggering change, the agent should invoke this skill with context:

- "I updated the primary color to #2563eb in tailwind.config.ts"
- "I added a /settings page with account and notification preferences"

The agent then follows Maintenance Mode (above) to update the affected context files.

---

## Quality Standards

**DO:**
- Extract from actual code, not assumptions
- Include source annotations: `(Extracted from tailwind.config.ts)`
- Use semantic names, not hardcoded values
- Note confidence levels for uncertain values
- Keep files focused and scannable

**DON'T:**
- Create empty placeholder files
- Invent patterns not in the codebase
- Override intentional design decisions
- Include internal/admin-only information
