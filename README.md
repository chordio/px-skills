# Claude Design Skills

Three Claude Code skills for improving front-end UI design quality.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **design-specifier** | Generate design specs BEFORE coding | Starting new UI features |
| **design-context-initializer** | Initialize product design context | Project setup, foundation changes |
| **design-reviewer** | Review implemented UI for issues | After implementation, before PRs |

## Installation

Copy the skill folders you want into your project's `.claude/skills/` directory:

```bash
# Copy all skills
cp -r skills/* /path/to/your-project/.claude/skills/

# Or copy individual skills
cp -r skills/design-specifier /path/to/your-project/.claude/skills/
cp -r skills/design-context-initializer /path/to/your-project/.claude/skills/
cp -r skills/design-reviewer /path/to/your-project/.claude/skills/
```

## Skills Overview

### design-specifier

Generate UX design specifications BEFORE implementing UI features.

**Key Features:**
- Two-stage generation: Strategic Scaffold (WHAT) then Implementation Details (HOW)
- Component selection and styling guidance
- Layout and responsive behavior specs
- Copywriting for all UI elements
- Avoids "AI slop" patterns (generic designs)

**Usage:**
Ask Claude to generate a design spec for your feature. If `design-context/` exists, it will be used for grounding.

### design-context-initializer

Initialize and maintain design context files that ground all design decisions.

**Key Features:**
- Two paths: Auto-extraction from codebase OR interactive questionnaire
- Outputs modular design files: `brand.md`, `colors.md`, `typography.md`, `layout.md`, `components.md`, `logo.md`
- Machine-readable `design-tokens.json` (W3C format)
- Product context for functional design critique

**When to Use:**
- Initial project setup (no `design-context/` exists)
- After major foundation changes (new fonts, colors, rebrand)
- NOT for day-to-day use

**Output Location:** `design-context/` in your project root

### design-reviewer

Review implemented UI for usability issues across four specialized domains.

**Key Features:**
- Four review lenses: Typography, Color/Contrast, Layout/Spacing, Overflow/Truncation
- Visual inspection via Puppeteer scripts
- Responsive testing at multiple viewports
- Severity classification (Critical, Major, Minor)

**Prerequisites:**
1. Chrome with remote debugging: `--remote-debugging-port=9222`
2. Install puppeteer-core: `npm install puppeteer-core`

**Usage:**
```bash
# Start Chrome with debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Capture screenshots
node .claude/skills/design-reviewer/scripts/screenshot.js 375 667 mobile.png
node .claude/skills/design-reviewer/scripts/screenshot.js 1440 900 desktop.png

# Run DOM checks
node .claude/skills/design-reviewer/scripts/eval.js "[...document.querySelectorAll('*')].filter(el => el.scrollWidth > el.clientWidth).length"
```

## Skill Interactions

```
design-context-initializer (foundation)
      |
      +---> design-specifier (references context for grounded specs)
      |
      +---> design-reviewer (references context for informed reviews)
```

**Progressive Enhancement:**
- Without context: Skills work but produce generic output
- With product-context only: Better persona awareness
- With full context: Best results, full system awareness

## Design Context Structure

When `design-context-initializer` runs, it creates:

```
design-context/
├── brand.md              # Brand identity, voice, tone
├── colors.md             # Color system and palettes
├── typography.md         # Font families and type scale
├── layout.md             # Spacing and grid system
├── components.md         # Component patterns
├── logo.md               # Logo usage guidelines
├── design-tokens.json    # Machine-readable tokens (W3C format)
├── product-context.md    # What you're building, for whom
├── user-journeys.md      # Key pages and workflows
└── logos/                # Logo assets (SVG, PNG)
```

## Repository Structure

```
claude-design-skills/
├── README.md
├── skills/
│   ├── design-specifier/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   ├── strategic-scaffold-guide.md
│   │   │   ├── implementation-expert-guide.md
│   │   │   ├── ux-patterns.md
│   │   │   └── anti-patterns.md
│   │   └── templates/
│   │       └── spec-output-template.md
│   │
│   ├── design-context-initializer/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   ├── extraction-guide.md
│   │   │   └── questionnaire-guide.md
│   │   └── templates/
│   │       ├── brand-template.md
│   │       ├── colors-template.md
│   │       ├── typography-template.md
│   │       ├── layout-template.md
│   │       ├── components-template.md
│   │       ├── logo-template.md
│   │       ├── product-context-template.md
│   │       ├── user-journeys-template.md
│   │       └── design-tokens-template.json
│   │
│   └── design-reviewer/
│       ├── SKILL.md
│       ├── references/
│       │   ├── typography-review.md
│       │   ├── color-review.md
│       │   ├── layout-review.md
│       │   ├── overflow-review.md
│       │   └── severity-guide.md
│       ├── checklists/
│       │   ├── pre-review-checklist.md
│       │   └── issue-format.md
│       └── scripts/
│           ├── README.md
│           ├── screenshot.js
│           └── eval.js
│
└── examples/
    └── design-context/   # Example output files
```

## License

MIT
