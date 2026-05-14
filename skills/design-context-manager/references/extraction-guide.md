# Design Context Extraction Guide

Step-by-step guide for extracting design context. Two extraction paths are supported:

- **Path A — Codebase Extraction** — read tailwind config, CSS variables, font imports, component files. Use when source is available.
- **Path C — Live URL Extraction** — drive a browser, harvest computed styles from the rendered DOM. Use when only the live site is available (your own production site, a competitor for inspiration, a brand reference).

Path A is preferred when both are possible — config files surface canonical token *names* (like `--color-primary-500`), while Path C only sees computed values (the rendered `#0F172A` without the name). Use them together for the strongest result.

(Path B — interactive questionnaire — is documented in `questionnaire-guide.md`, not here.)

---

## Path A: Codebase Extraction

### Sources to Check

#### 1. Tailwind Configuration
**Files:** `tailwind.config.js`, `tailwind.config.ts`, `tailwind.config.mjs`

**Extract:**
- `theme.colors` → colors.md
- `theme.fontFamily` → typography.md
- `theme.spacing` → layout.md
- `theme.screens` → layout.md (breakpoints)
- `theme.extend.*` → respective files

**Example extraction:**
```javascript
// tailwind.config.ts
theme: {
  colors: {
    primary: '#3b82f6',  // → colors.md: Primary brand color
    secondary: '#64748b',
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],  // → typography.md: Body font
    display: ['Cal Sans', 'sans-serif'],  // → typography.md: Display font
  }
}
```

#### 2. CSS Variables
**Files:** `app/globals.css`, `src/index.css`, `styles/variables.css`

**Look for:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

**Extract:** CSS custom properties → design-tokens.json, colors.md

#### 3. Package.json Dependencies
**File:** `package.json`

**Look for UI libraries:**
- `@radix-ui/*` → components.md: Radix UI primitives
- `@shadcn/*` or component imports → components.md: shadcn/ui
- `@mui/material` → components.md: Material UI
- `tailwindcss` → layout.md: Tailwind-based spacing
- Font packages (`@fontsource/*`, `next/font`) → typography.md

#### 4. Component Structure
**Directories:** `components/`, `src/components/`, `app/components/`

**Analyze:**
- Directory organization (by feature, by type)
- Common patterns (Button variants, Card usage)
- Naming conventions

#### 5. Layout Files
**Files:** `app/layout.tsx`, `pages/_app.tsx`, `src/App.tsx`

**Extract:**
- Font imports and configuration
- Global wrapper components
- Theme providers

#### 6. Documentation
**Files:** `README.md`, `CLAUDE.md`, `docs/`

**Extract:**
- Product description → product-context.md
- Tech stack information → components.md
- User information → product-context.md

### Extraction Process

#### Step 1: Gather Configuration
```
Read in this order:
1. package.json (understand tech stack)
2. tailwind.config.* (design tokens)
3. CSS variable files (additional tokens)
4. Layout files (fonts, providers)
5. README/docs (product context)
```

#### Step 2: Map to Context Files

| Source | Target File |
|--------|-------------|
| `theme.colors`, CSS `--color-*` | colors.md |
| `theme.fontFamily`, font imports | typography.md |
| `theme.spacing`, `theme.screens` | layout.md |
| UI library deps, component dirs | components.md |
| README, product description | product-context.md |
| Routes, page structure | user-journeys.md |

#### Step 3: Generate with Confidence Annotations

Use the shared rubric in [Confidence Annotations](#shared-confidence-annotations) below.

#### Step 4: Fill Gaps with Questions

For missing information, ask the user:

**Brand/Product:**
- "What is this product? Who is it for?"
- "What visual style best describes it? (minimal, playful, corporate, etc.)"

**Technical:**
- "I didn't find font configuration. What fonts should be used?"
- "No color system found. Should I generate one or do you have preferences?"

### Common Codebase Patterns

#### Shadcn/ui Projects
```
package.json: @radix-ui/* deps
components/ui/: shadcn components
tailwind.config: CSS variable-based colors
globals.css: HSL color definitions
```

#### Next.js + Tailwind
```
tailwind.config.ts: Full theme config
app/globals.css: CSS variables
app/layout.tsx: next/font imports
```

#### Vite + React
```
tailwind.config.js: Theme config
src/index.css: Global styles
vite.config.ts: Plugin configuration
```

---

## Path C: Live URL Extraction

### Browser Automation Backend

Path C requires a browser automation backend. In order of preference:

1. `/browse` from gstack
2. Browser Use / in-app browser tools
3. Playwright (transient run if not installed: `npx playwright`)
4. Puppeteer / Chrome remote debugging

Required capabilities: navigate, screenshot, resize viewport, read accessibility tree, evaluate JavaScript. If none are available, stop and tell the user.

### Sources to Harvest

For each captured page (typically homepage + 1-2 representative interior pages, on both 1440×900 and 390×844 viewports), harvest:

| Source | What to read |
|---|---|
| **CSS custom properties** | All `--*` properties accessible via stylesheets. Closest thing Path C has to canonical token names — use them when available. |
| **Typography** | Computed `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing` on `h1`–`h6`, `p`, `button`, `a`, `input`, `label`. |
| **Color** | Computed `color`, `background-color`, `border-color` across visible elements; deduplicate. |
| **Spacing** | Computed `padding`, `margin`, `gap` on layout containers; find the smallest base unit. |
| **Border radius** | Computed `border-radius` on buttons, cards, inputs, modals. |
| **Box shadow** | Computed `box-shadow` on elevated elements. |
| **Active fonts** | `document.fonts` entries; `<link rel="stylesheet">` font CDN URLs (Google Fonts, Fontshare, etc.); `@font-face` rules in stylesheets. |
| **Viewport / breakpoints** | `<meta name="viewport">` content; infer breakpoints from CSS media queries or from observed layout shifts between desktop and mobile captures. |
| **Logo / brand assets** | `<img>` in header, `<svg>` brand marks. Download with attribution. |

### Extraction Process

#### Step 1: Capture screenshots and computed styles

Capture each URL on desktop (1440×900) and mobile (390×844). Save screenshots under `design-context/source/{desktop|mobile}-{n}.png`. Harvest computed styles. Save the raw output to `design-context/source/computed-{n}.json` for traceability.

Write a `source.json` manifest:
```json
{
  "extractedFrom": "live-url",
  "sourceUrls": ["https://example.com", "https://example.com/pricing"],
  "capturedAt": "<ISO timestamp>",
  "backend": "playwright",
  "screenshots": ["desktop-1.png", "mobile-1.png"]
}
```

#### Step 2: Reverse-engineer the system

For each token category, infer the underlying system from harvested values:

- **Type scale** — deduplicate font-size values; check if ratios between steps are consistent (≥1.25 is healthy; flat scales like 14/16/18/20 indicate a weak system). Note the base size. See `~/.claude-design-skills/shared/design-taste/typography.md`.
- **Color strategy** — cluster colors, count occurrences. Categorize against the four strategies in `~/.claude-design-skills/shared/design-taste/color-and-contrast.md`:
  - 1 brand hue + tinted neutrals + 1 accent ≤10% → Restrained
  - 1 saturated color carrying 30–60% of surface area → Committed
  - 3–4 named roles → Full palette
  - The page IS the color → Drenched
- **Spacing scale** — deduplicate padding/margin/gap values. Find the smallest non-zero value (often 4 or 8). Check if larger values are clean multiples.
- **Border radius scale** — list unique values. Note semantic mapping (small for inputs, medium for buttons, large for modals).
- **Component patterns** — read the accessibility tree to identify buttons, cards, inputs, navigation. For each notable component, screenshot and describe.

#### Step 3: Generate with Confidence Annotations

Use the shared rubric in [Confidence Annotations](#shared-confidence-annotations) below. For Path C specifically:

- **High** — value appears consistently across multiple pages AND multiple elements
- **Medium** — value seen on one page or one element type
- **Low** — single observation; flag for user review

#### Step 4: Note limitations in the generated files

Path C captures should include a "Source: live-url extraction" header in each context file noting the limitations (see below). Suggest the user supplement with Path A if source becomes available.

### Common Site Patterns

| Site type | What to expect |
|---|---|
| **Tailwind-based** | Computed styles map to Tailwind defaults (`text-base` = 16px, `p-4` = 16px). Spacing will be a 4px-based progression. |
| **CSS-in-JS (styled-components, emotion)** | Computed styles are clean but classnames are hashed (`sc-jKJlKD`). Use tag + role, not class names. |
| **Classic stylesheets** | Often have explicit CSS variables on `:root`. These are the closest thing Path C has to token names — read them. |
| **CSS Modules** | Hashed classnames like `Button_button__3xY2z`. Tag/role + DOM structure is your guide. |
| **Sites with a design system page** | Check `/design`, `/styleguide`, `/style-guide`, `/components` first — they often contain canonical token listings. |

### Path C Limitations

- **No source token names.** A site using `#0F172A` may declare `--color-neutral-900` internally. Path C surfaces the hex, not the name. Use semantic names you choose (`neutral-900`) in generated files rather than the raw hex.
- **No design intent in comments.** Path A reads `/* primary brand color — use sparingly */`. Path C doesn't.
- **States are hard.** Hover, focus, active, error — Path C only sees the default state unless you can interact via the browser backend.
- **Animation easing.** Captures show in-flight transitions, not the easing curve definitions. Inspect `transitionTimingFunction` directly.
- **Authenticated views.** Need credentials or a logged-in browser session (see `/setup-browser-cookies` from gstack).

---

## Shared: Design Tokens JSON Structure

Generate W3C Design Tokens format:

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "$metadata": {
    "name": "Project Design System",
    "generator": "design-context-manager",
    "extractedFrom": "codebase | live-url"
  },
  "color": {
    "brand": {
      "primary": {
        "500": { "$value": "#3b82f6", "$type": "color" }
      }
    }
  },
  "typography": {
    "fontFamily": {
      "display": { "$value": "Cal Sans, sans-serif", "$type": "fontFamily" }
    }
  }
}
```

Add `$extensions.confidence` per token for Path C captures:

```json
{ "$value": "#3b82f6", "$type": "color", "$extensions": { "confidence": "Medium", "observedAt": "https://example.com" } }
```

## Shared: Confidence Annotations

Mark extracted values with confidence levels so the user knows what to trust.

**Path A (codebase):**
- **High** — explicitly defined in config files (tailwind.config, CSS custom properties, etc.)
- **Medium** — inferred from usage patterns across multiple components
- **Low** — found in a single usage or edge case; flag for user review

**Path C (live URL):**
- **High** — value appears consistently across multiple pages AND multiple element types
- **Medium** — value seen on one page or one element type
- **Low** — single observation; flag for user review

Example annotation:

```markdown
## Primary Color
- Value: `#3b82f6`
- Source: `tailwind.config.ts:theme.colors.primary` (Path A)
- Confidence: High
```

```markdown
## Primary Color
- Value: `#3b82f6`
- Source: live-url extraction (https://example.com, observed on `button`, `a.cta`, `.banner`)
- Confidence: High
```

## Shared: Error Handling

### No Configuration / Capture Found
- Inform user: "No design configuration found" (Path A) or "Could not load the URL" (Path C)
- Offer to switch paths if the other is feasible
- Or fall back to Path B (interactive questionnaire) — see `questionnaire-guide.md`

### Partial Configuration / Capture
- Extract what's available
- Mark missing sections with placeholders
- Ask user to fill gaps

### Conflicting Values
- Note the conflict (e.g., Path A says primary is `#3b82f6` but Path C captures `#3B82F7` — likely the same color with rounding)
- Ask user which is canonical
- Default to most explicit configuration (Path A wins over Path C when both are available)
