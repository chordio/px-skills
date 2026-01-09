# Typography System

## Font Families

| Purpose | Family | Fallback |
|---------|--------|----------|
| Headings | Inter | system-ui, sans-serif |
| Body | Inter | system-ui, sans-serif |
| Code | JetBrains Mono | ui-monospace, monospace |

## Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display | 48px / 3rem | 1.1 | 700 | Hero headlines |
| H1 | 36px / 2.25rem | 1.2 | 700 | Page titles |
| H2 | 30px / 1.875rem | 1.25 | 600 | Section headings |
| H3 | 24px / 1.5rem | 1.3 | 600 | Subsection headings |
| H4 | 20px / 1.25rem | 1.4 | 600 | Card titles |
| Body Large | 18px / 1.125rem | 1.6 | 400 | Lead paragraphs |
| Body | 16px / 1rem | 1.5 | 400 | Default body text |
| Body Small | 14px / 0.875rem | 1.5 | 400 | Secondary text, captions |
| Caption | 12px / 0.75rem | 1.4 | 400 | Labels, fine print |

## Responsive Scaling

| Breakpoint | Scale Factor |
|------------|--------------|
| Mobile (<640px) | 0.875x for display/h1 |
| Tablet (640-1024px) | 0.9375x for display/h1 |
| Desktop (>1024px) | 1x (base scale) |

## Text Colors

| Purpose | Token | Usage |
|---------|-------|-------|
| Primary | `gray-900` | Headings, important text |
| Secondary | `gray-700` | Body text |
| Muted | `gray-500` | Captions, metadata |
| Disabled | `gray-400` | Disabled states |

## Guidelines

**Maximum Line Length:** 80 characters for body text (approximately 680px)

**Heading Hierarchy:** Always use sequential heading levels (H1 → H2 → H3)

**Emphasis:**
- Use `font-weight: 600` for emphasis within body text
- Avoid italics for emphasis (use for references/citations)
- Never use underlines except for links
