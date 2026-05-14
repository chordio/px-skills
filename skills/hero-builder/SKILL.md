---
name: hero-builder
description: Create visually striking hero sections that celebrate the brand and captivate visitors. Use when building landing page heroes, above-the-fold experiences, or immersive brand statements. Outputs production-ready React/Next.js with curated visual effects. Requires brand package (style.md, tokens.json, logo/).
---

# Hero Builder

Create hero sections that stop the scroll and celebrate the brand.

## Required Inputs

### Brand Package (`/brand/`)
- `style.md` — Aesthetic, mood, personality
- `tokens.json` — Colors, typography, spacing
- `logo/` — SVG preferred, dark/light variants

### Hero Brief
Either from `product.md` or direct input:
- **Core promise** — What transformation do you offer?
- **Audience** — Who is this for?
- **Mood** — How should visitors feel?

## Design Taste References (read first)

Hero work needs intentional taste. Read these from `~/.claude-design-skills/shared/design-taste/` before generating:

- `anti-patterns.md` — hero-metric template (the exact thing this skill must NOT produce), gradient text, glassmorphism-as-default, em dashes, AI slop reflexes
- `typography.md` — scale + weight contrast (≥1.25 ratio); how hero headlines actually earn attention
- `spatial-design.md` — vary spacing for rhythm; cards are lazy; don't wrap everything in containers
- `motion-design.md` — exponential ease-out only (no bounce/elastic); don't animate layout properties
- `ux-writing.md` — every word earns its place; no em dashes; no restated headings

## Generation Workflow

### 1. Define the Hero Personality

Parse brand inputs to determine:

| Decision | Options |
|----------|---------|
| **Impact Level** | Immersive (fullscreen, WebGL), Bold (strong typography, motion), Subtle (elegant, restrained) |
| **Composition** | Centered (text-focused), Split (text + visual), Asymmetric (dynamic layout), Layered (depth + parallax) |
| **Motion Philosophy** | Cinematic (orchestrated reveals), Ambient (continuous subtle movement), Reactive (responds to user), Minimal (single accent) |

### 2. Craft the Message

Write the hero content BEFORE any code:

```
HEADLINE:    [6-10 words. Outcome-first. Promise transformation.]
SUBHEAD:     [One sentence. Who + what.]
CTA:         [Verb + benefit. Action-oriented.]
PROOF HINT:  [Optional: "Trusted by X" / stat badge / logo bar]
```

**Headline Patterns:**
- Outcome: "Ship products your customers actually want"
- Contrast: "Stop guessing. Start knowing."
- Identity: "For teams who refuse to ship broken software"
- Question: "What if onboarding took minutes, not months?"

### 3. Select Visual Strategy

Choose ONE primary effect category from `references/hero-effects.md`:

| Category | When to Use |
|----------|-------------|
| **Atmospheric** | Brand-first, mood-setting, immersive experiences |
| **Typographic** | Message-first, when words carry the weight |
| **Interactive** | Engagement-first, memorable micro-interactions |
| **Cinematic** | Story-first, orchestrated reveals |
| **Product** | Demo-first, when the product IS the hero |

**Critical: Adapt effects to brand—never use verbatim.** Customize colors, timing, intensity to match tokens and mood.

### 4. Generate Hero Image (If Needed)

If the hero requires imagery, spawn a sub-agent to generate images in parallel while continuing to build the component:

```
Generate hero image using the image-generator skill. Create:

hero-main.webp (16:9) - [Detailed prompt matching brand aesthetic]

Save to /hero/public/images/
```

If sub-agent spawning is unavailable, generate images sequentially before proceeding.

See `references/hero-imagery.md` for prompts by aesthetic.

### 5. Build the Hero

Generate the hero component following `references/hero-anatomy.md`:

**Layers (bottom to top):**
1. Background (effect or image)
2. Overlay (gradient for contrast)
3. Content (headline, subhead, CTA)
4. Accents (floating elements, decorative motion)
5. Navigation (floating or integrated)

**Responsive Requirements:**
- Mobile: Stack content, reduce effect intensity, ensure CTA visibility
- Tablet: Adapt layout, maintain visual hierarchy
- Desktop: Full expression of the design intent

**Performance:**
- Lazy load WebGL/heavy effects
- Use CSS animations where possible
- Target LCP < 2.5s
- Respect `prefers-reduced-motion`

### 6. Compose & Polish

- Test text contrast against all background states
- Verify CTA is visible and accessible
- Check animation timing feels intentional
- Ensure the narrative is clear reading top-to-bottom
- Validate responsive behavior at all breakpoints

## Output Structure

```
/hero
  /components
    Hero.tsx           # Main hero component
    HeroBackground.tsx # Background effect
    HeroContent.tsx    # Text + CTA
    HeroNav.tsx        # Optional floating nav
  /lib
    effects.ts         # Effect configurations
    animations.ts      # Motion variants
  page.tsx             # Demo page with hero
  globals.css          # Tailwind + custom properties
/brand/images/         # Generated hero imagery
```

## Code Standards

- React 18+ / TypeScript / Tailwind with design tokens
- Framer Motion for orchestration
- Lazy load heavy effects (Vanta, Three.js)
- Mobile-first, prefers-reduced-motion respected
- Semantic HTML, proper heading hierarchy
- WCAG AA contrast minimum

## Constraints

- Adapt effects to brand—never copy verbatim
- Max 2 distinct effect types (background + one accent)
- No placeholder copy or images
- Every element must serve the story
- Hero must work without JavaScript (content visible)
