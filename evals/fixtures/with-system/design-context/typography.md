# Typography

## Font Family

**Primary:** Inter (sans-serif)
- Used for all UI text
- Fallback: system-ui, -apple-system, sans-serif

**Monospace:** JetBrains Mono
- Used for code snippets, task IDs
- Fallback: ui-monospace, monospace

## Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| `text-xs` | 12px | 16px | 400 | Labels, captions, metadata |
| `text-sm` | 14px | 20px | 400 | Body text, form labels |
| `text-base` | 16px | 24px | 400 | Primary body text |
| `text-lg` | 18px | 28px | 500 | Subheadings, card titles |
| `text-xl` | 20px | 28px | 600 | Section headers |
| `text-2xl` | 24px | 32px | 600 | Page titles |
| `text-3xl` | 30px | 36px | 700 | Hero headings |

## Semantic Styles

### Headings
- **Page Title:** `text-2xl`, `font-bold`, `color.text`
- **Section Header:** `text-xl`, `font-semibold`, `color.text`
- **Card Title:** `text-lg`, `font-medium`, `color.text`
- **Subsection:** `text-base`, `font-semibold`, `color.text`

### Body Text
- **Primary:** `text-sm`, `font-normal`, `color.text`
- **Secondary:** `text-sm`, `font-normal`, `color.text-secondary`
- **Caption:** `text-xs`, `font-normal`, `color.text-tertiary`

### Interactive
- **Button Text:** `text-sm`, `font-semibold`
- **Link:** `text-sm`, `font-medium`, `color.primary`
- **Input:** `text-sm`, `font-normal`, `color.text`
- **Placeholder:** `text-sm`, `font-normal`, `color.text-tertiary`

### Feedback
- **Error Text:** `text-xs`, `font-normal`, `color.error`
- **Helper Text:** `text-xs`, `font-normal`, `color.text-secondary`
- **Success Text:** `text-xs`, `font-normal`, `color.success`

## Guidelines

1. **Hierarchy:** Use no more than 3 text sizes per view to maintain clarity
2. **Contrast:** Ensure 4.5:1 minimum contrast ratio for body text
3. **Line Length:** Keep body text between 50-75 characters per line
4. **Weight:** Use semibold (600) or bold (700) for emphasis, avoid underlines
