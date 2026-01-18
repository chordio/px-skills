---
name: design-context-manager
description: Initialize and maintain design context files. Use when design-context/ folder doesn't exist, after design-relevant code changes (colors, fonts, spacing), or when foundation elements change. The agent should invoke this after modifying design tokens to keep context in sync.
---

# Design Context Manager

Initialize and maintain the design context files that ground all design decisions.

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
- Brand-related constants

### Foundation Changes
- Rebrand or design system migration
- Major style overhaul
- New component library adoption

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

## Context File Content Guidelines

### brand.md
```markdown
# Brand Identity

## Overview
- Product name and purpose
- Industry context
- Target audience

## Visual Style
- Style name (e.g., "Modern Minimal", "Brutalist", "Corporate Professional")
- Key visual characteristics
- Design principles

## Voice & Tone
- Overall voice personality
- Tone by context (marketing, UI, errors, success)
- Language principles
- Words to use / avoid
```

### colors.md
```markdown
# Color System

## Brand Colors
- Primary: [hex] - usage guidelines
- Secondary: [hex] - usage guidelines
- Accent: [hex] - usage guidelines

## Neutral Scale
- 50-950 scale with hex values

## Semantic Colors
- Success, Warning, Error, Info
- Background, foreground, border variants

## Surface Colors
- Background (primary, secondary, tertiary)
- Foreground (primary, secondary, tertiary)
- Border colors

## Usage Guidelines
- Color pairing recommendations
- Accessibility considerations
- Dark mode behavior (if applicable)
```

### typography.md
```markdown
# Typography

## Font Families
- Display/Headings: [font-family stack]
- Body: [font-family stack]
- Mono (if applicable): [font-family stack]

## Type Scale
- xs through 7xl with size, line-height, letter-spacing

## Semantic Styles
- h1-h6 specifications
- body, bodySmall, caption
- button, overline

## Usage Guidelines
- When to use each heading level
- Responsive scaling rules
- Font weight usage
```

### layout.md
```markdown
# Layout & Spacing

## Spacing Scale
- Base unit and scale values
- Common spacing tokens

## Grid System
- Container max-widths
- Column configurations
- Gutter sizes

## Responsive Breakpoints
- Mobile, tablet, desktop, large desktop
- Breakpoint values

## Common Patterns
- Card spacing
- Form field spacing
- Section padding
```

### components.md
```markdown
# Component Guidelines

## Component Library
- Primary library (e.g., shadcn/ui, Radix, MUI)
- Component locations

## Button Patterns
- Primary, secondary, ghost variants
- Size options
- Icon button patterns

## Form Patterns
- Input styling
- Label positioning
- Validation display

## Card Patterns
- Padding and spacing
- Border and shadow
- Content hierarchy
```

### logo.md
```markdown
# Logo Guidelines

## Logo Variations
- Full logo
- Icon/mark only
- Wordmark only (if applicable)

## Clear Space
- Minimum padding requirements

## Usage Rules
- Minimum sizes
- Background requirements
- Don't list
```

### product-context.md
```markdown
# Product Context

## Product Overview
- Name and description
- Core value proposition
- Industry/domain

## Target Audience
- Primary users
- User goals and pain points
- Technical proficiency level

## User Personas
### [Persona Name]
- Role
- Goals
- Pain points
- Key tasks
```

### user-journeys.md
```markdown
# User Journeys

## Primary Flows
### [Flow Name]
- Entry point
- Key steps
- Success state

## Key Pages
- Page name and purpose

## Critical Interactions
- Decision points
- Error handling
- Edge cases
```

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
| New color added | Added `accent-gold` color | **Yes** |
| Font family change | Switched body font to Inter | **Yes** |
| Spacing scale change | Changed base unit from 4px to 8px | **Yes** |
| Breakpoint modification | Added `xs` breakpoint | **Yes** |
| Component style tweak | Adjusted button padding | No |
| Content/copy change | Updated page text | No |
| Bug fix | Fixed overflow issue | No |
| Layout adjustment | Changed grid within existing system | No |

### Example Invocation

After changing `tailwind.config.ts`:
```typescript
colors: {
  primary: '#2563eb' // Changed from #3b82f6
}
```

Invoke: "I just updated the primary color to #2563eb in tailwind.config.ts. Update the design context."

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
