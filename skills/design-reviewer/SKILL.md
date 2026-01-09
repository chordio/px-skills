---
name: design-reviewer
description: Review implemented UI for usability issues across typography, color, layout, and overflow domains
---

# Design Reviewer

Review implemented UI for usability issues. Uses four specialized review lenses to identify clear, actionable problems.

## When to Use

Use this skill AFTER implementing UI features:
- Before submitting pull requests
- After making significant UI changes
- When debugging visual issues
- For responsive design verification

## Prerequisites

**Chrome with Remote Debugging:**
```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Linux
google-chrome --remote-debugging-port=9222

# Windows
chrome.exe --remote-debugging-port=9222
```

**Install puppeteer-core (one-time):**
```bash
npm install puppeteer-core
# or
pnpm add puppeteer-core
```

## Review Process

### Step 1: Capture Screenshots

Navigate to the page in Chrome, then capture screenshots at multiple viewports:

```bash
# Mobile
node .claude/skills/design-reviewer/scripts/screenshot.js 375 667 mobile.png

# Tablet
node .claude/skills/design-reviewer/scripts/screenshot.js 768 1024 tablet.png

# Desktop
node .claude/skills/design-reviewer/scripts/screenshot.js 1440 900 desktop.png
```

### Step 2: Gather DOM Information (Optional)

Run DOM checks to gather programmatic data:

```bash
# Check for text overflow
node .claude/skills/design-reviewer/scripts/eval.js "[...document.querySelectorAll('*')].filter(el => el.scrollWidth > el.clientWidth).map(el => ({tag: el.tagName, class: el.className, text: el.innerText?.slice(0,50)}))"

# Check heading hierarchy
node .claude/skills/design-reviewer/scripts/eval.js "[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(el => ({level: el.tagName, text: el.innerText?.slice(0,50)}))"

# Check for small text
node .claude/skills/design-reviewer/scripts/eval.js "[...document.querySelectorAll('*')].filter(el => parseFloat(getComputedStyle(el).fontSize) < 14 && el.innerText?.trim()).map(el => ({fontSize: getComputedStyle(el).fontSize, text: el.innerText?.slice(0,30)}))"
```

### Step 3: Apply Four Review Lenses

Review the screenshots through each specialized lens. See reference files for detailed criteria:

1. **Typography** - See `references/typography-review.md`
   - Text sizing issues
   - Hierarchy problems
   - Readability concerns

2. **Color/Contrast** - See `references/color-review.md`
   - Contrast issues
   - Visibility problems
   - Color-only information

3. **Layout/Spacing** - See `references/layout-review.md`
   - Alignment issues
   - Element crowding
   - Whitespace problems

4. **Overflow/Truncation** - See `references/overflow-review.md`
   - Text overflow
   - Container overflow
   - Truncation issues

### Step 4: Generate Report

Use the issue format from `checklists/issue-format.md` to document findings.

## Context Usage

If `design-context/` exists in the project, load relevant files:
- `colors.md` - For color system awareness
- `typography.md` - For type scale context
- `layout.md` - For spacing system context
- `brand.md` - For tone/style context
- `components.md` - For component pattern awareness

## Quality Standards

### DO Report
- Issues that would frustrate or confuse users
- Problems that impact accessibility
- Layout breaks at specific viewports
- Missing states (loading, error, empty)
- Inconsistencies with established patterns

### DON'T Report
- Stylistic preferences ("I would have chosen...")
- Minor spacing differences (1-2px)
- Issues requiring deep design system knowledge
- Intentional design decisions that work
- Problems that require squinting to notice

### Severity Classification

See `references/severity-guide.md` for classification criteria.

| Severity | Description |
|----------|-------------|
| **Critical** | Prevents task completion or causes data loss |
| **Major** | Significantly impacts usability |
| **Minor** | Noticeable but doesn't block users |

## Output Format

```markdown
## Design Review: [Feature/Page Name]

**Reviewed:** [Date]
**Viewports:** Mobile (375px), Tablet (768px), Desktop (1440px)

### Critical Issues
[List or "None found"]

### Major Issues
[List or "None found"]

### Minor Issues
[List or "None found"]

### Summary
[1-2 sentence overview of UI quality]
```

## Example DOM Checks

The `eval.js` script is a generic executor. Construct checks based on review criteria:

**Typography checks:**
```bash
# Heading hierarchy
node scripts/eval.js "[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName)"

# Font sizes in use
node scripts/eval.js "[...new Set([...document.querySelectorAll('*')].map(el => getComputedStyle(el).fontSize))]"
```

**Layout checks:**
```bash
# Elements with overflow
node scripts/eval.js "[...document.querySelectorAll('*')].filter(el => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight).length"

# Check for horizontal scrollbar on body
node scripts/eval.js "document.body.scrollWidth > window.innerWidth"
```

**Color checks:**
```bash
# Background colors in use
node scripts/eval.js "[...new Set([...document.querySelectorAll('*')].map(el => getComputedStyle(el).backgroundColor))].filter(c => c !== 'rgba(0, 0, 0, 0)')"
```

## Finding No Issues

**Finding no issues is a valid and good outcome.** Don't force problems where none exist. A clean review report indicates good design quality.

## Optional Integrations

Enhance reviews with external tools:

```bash
# Accessibility audit with axe-core
npx @axe-core/cli <url>

# Lighthouse report
npx lighthouse <url> --output=json --output-path=./lighthouse.json

# CSS analysis with stylelint
npx stylelint "**/*.css"
```
