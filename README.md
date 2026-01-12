# Claude Design Skills

Six Claude Code skills for improving front-end UI design quality.

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| **design-spec-writer** | Generate design specs BEFORE coding | Starting new UI features |
| **design-context-initializer** | Initialize product design context | Project setup, foundation changes |
| **design-reviewer** | Review implemented UI for issues | After implementation, before PRs |
| **review-panel** | Run expert design review panels | Getting multi-perspective design feedback |
| **design-manager-twin-creator** | Create digital twins of design leaders | Capturing someone's critique style |
| **social-post-designer** | Create social media posts with AI visuals | Social content creation |

## Installation

Copy the skill folders you want into your project's `.claude/skills/` directory:

```bash
# Copy all skills
cp -r skills/* /path/to/your-project/.claude/skills/

# Or copy individual skills
cp -r skills/design-spec-writer /path/to/your-project/.claude/skills/
cp -r skills/design-context-initializer /path/to/your-project/.claude/skills/
cp -r skills/design-reviewer /path/to/your-project/.claude/skills/
cp -r skills/review-panel /path/to/your-project/.claude/skills/
cp -r skills/design-manager-twin-creator /path/to/your-project/.claude/skills/
cp -r skills/social-post-designer /path/to/your-project/.claude/skills/
```

## Skills Overview

### design-spec-writer

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

### review-panel

Assemble and run expert design review panels with 2-4 specialists for multi-perspective critique.

**Key Features:**
- Selects optimal experts based on design type (mobile app, landing page, dashboard, etc.)
- Runs parallel sub-agent reviews from different expert perspectives
- Synthesizes findings into consensus, differing perspectives, and prioritized actions
- Supports Figma URLs, images, and design descriptions
- Includes 13 pre-built expert twins (Jony Ive, Julie Zhuo, Brad Frost, etc.)

**Usage:**
Share a design (Figma URL, image, or description) and ask for a review panel critique. Claude will select appropriate experts and run parallel reviews.

### design-manager-twin-creator

Create digital twins of design managers and leaders by analyzing their feedback patterns and interviewing them about their principles.

**Key Features:**
- Analyzes source materials (Figma comments, Slack threads, review transcripts)
- Conducts structured interviews to capture philosophy and critique style
- Outputs a standalone skill that embodies their perspective
- Created twins can be used with the review-panel skill

**Usage:**
Provide examples of someone's feedback (comments, conversations, written reviews) and/or conduct an interview. The skill generates a reusable twin profile.

### social-post-designer

Create high-converting social media posts with AI-generated visuals across multiple formats.

**Key Features:**
- Supports text-only, image, carousel, and video post formats
- Applies proven copywriting techniques (hooks, CTAs, engagement drivers)
- Generates detailed prompts for AI image generators (nano-banana) and video generators (Veo)
- Platform-specific optimization (LinkedIn, Twitter/X, Instagram, TikTok, Facebook)

**Usage:**
Describe your product/feature and desired platforms. The skill generates complete post packages including copy, visual specifications, and generation prompts.

## Skill Interactions

```
design-context-initializer (foundation)
      |
      +---> design-spec-writer (references context for grounded specs)
      |
      +---> design-reviewer (references context for informed reviews)
      |
      +---> review-panel (references context for expert critiques)

design-manager-twin-creator ---> review-panel (created twins can be added to panel)

social-post-designer (standalone, uses brand context if available)
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
│   ├── design-spec-writer/
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
│   ├── design-reviewer/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   ├── typography-review.md
│   │   │   ├── color-review.md
│   │   │   ├── layout-review.md
│   │   │   ├── overflow-review.md
│   │   │   └── severity-guide.md
│   │   ├── checklists/
│   │   │   ├── pre-review-checklist.md
│   │   │   └── issue-format.md
│   │   └── scripts/
│   │       ├── README.md
│   │       ├── screenshot.js
│   │       └── eval.js
│   │
│   ├── review-panel/
│   │   ├── SKILL.md
│   │   └── twins/
│   │       ├── aaron-walter.twin.md
│   │       ├── april-dunford.twin.md
│   │       ├── brad-frost.twin.md
│   │       ├── clark-valberg.twin.md
│   │       ├── edward-tufte.twin.md
│   │       ├── eli-woolery.twin.md
│   │       ├── emily-campbell.twin.md
│   │       ├── joanna-wiebe.twin.md
│   │       ├── jony-ive.twin.md
│   │       ├── julie-zhuo.twin.md
│   │       ├── leah-buley.twin.md
│   │       ├── luke-wroblewski.twin.md
│   │       └── val-head.twin.md
│   │
│   ├── design-manager-twin-creator/
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── extraction-patterns.md
│   │       ├── interview-guide.md
│   │       └── twin-profile-template.md
│   │
│   └── social-post-designer/
│       ├── SKILL.md
│       └── references/
│           ├── image-generation-prompts.md
│           ├── post-formats.md
│           ├── social-copywriting.md
│           └── video-generation-prompts.md
│
└── examples/
    └── design-context/   # Example output files
```

## License

MIT
