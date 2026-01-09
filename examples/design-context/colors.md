# Color System

## Primary Palette

| Name | Token | Value | Usage |
|------|-------|-------|-------|
| Primary | `primary-500` | #3B82F6 | Primary actions, links, focus states |
| Primary Light | `primary-400` | #60A5FA | Hover states, backgrounds |
| Primary Dark | `primary-600` | #2563EB | Active states, emphasis |

## Neutral Palette

| Name | Token | Value | Usage |
|------|-------|-------|-------|
| Gray 50 | `gray-50` | #F9FAFB | Page backgrounds |
| Gray 100 | `gray-100` | #F3F4F6 | Card backgrounds |
| Gray 200 | `gray-200` | #E5E7EB | Borders, dividers |
| Gray 500 | `gray-500` | #6B7280 | Secondary text |
| Gray 700 | `gray-700` | #374151 | Primary text |
| Gray 900 | `gray-900` | #111827 | Headings |

## Semantic Colors

| Purpose | Token | Value | Usage |
|---------|-------|-------|-------|
| Success | `success` | #10B981 | Success messages, positive states |
| Warning | `warning` | #F59E0B | Warnings, caution states |
| Error | `error` | #EF4444 | Errors, destructive actions |
| Info | `info` | #3B82F6 | Informational messages |

## Accessibility Notes

- All text colors meet WCAG AA contrast requirements (4.5:1 for body, 3:1 for large text)
- Interactive elements have visible focus states using `primary-500`
- Never convey meaning through color alone - pair with icons or text

## Dark Mode

| Light Mode | Dark Mode |
|------------|-----------|
| `gray-50` background | `gray-900` background |
| `gray-900` text | `gray-50` text |
| `primary-500` accent | `primary-400` accent |
