# Component Patterns

## Buttons

### Variants

| Variant | Usage |
|---------|-------|
| Primary | Main action, one per section |
| Secondary | Alternative actions |
| Ghost | Tertiary actions, less emphasis |
| Destructive | Delete, remove, dangerous actions |

### Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Small | 32px | 8px 12px | 14px |
| Default | 40px | 10px 16px | 14px |
| Large | 48px | 12px 24px | 16px |

### States

- Default → Hover → Active → Disabled
- Loading state shows spinner, disables interaction
- Focus state has visible ring

## Form Elements

### Text Input

- Label above input (never inside as placeholder)
- Helper text below input
- Error state: red border + error message
- Height: 40px default

### Select

- Use native select for simple lists
- Custom select for complex options (search, multi-select)
- Always include a default/placeholder option

### Checkbox/Radio

- Minimum 44px touch target
- Label clickable
- Group related options

## Cards

### Structure

```
┌─────────────────────────┐
│ [Image/Header]          │
│ ─────────────────────── │
│ Title                   │
│ Description             │
│ ─────────────────────── │
│ [Actions]               │
└─────────────────────────┘
```

### Variants

| Variant | Usage |
|---------|-------|
| Default | General content container |
| Interactive | Clickable cards, hover state |
| Selected | Currently selected item |

## Modals

### When to Use

- Focused tasks requiring user attention
- Confirmation before destructive actions
- Content that needs isolation from main UI

### Structure

- Header with title and close button
- Body with scrollable content
- Footer with actions (cancel left, confirm right)

### Sizes

| Size | Width |
|------|-------|
| Small | 400px |
| Default | 500px |
| Large | 680px |
| Full | 90vw (max 1200px) |

## Toast Notifications

### Position

Bottom-right on desktop, bottom-center on mobile

### Duration

- Info: 3 seconds
- Success: 3 seconds
- Warning: 5 seconds
- Error: Until dismissed

### Structure

Icon + message + optional action + dismiss button

## Loading States

### Skeleton

Use for content with known structure (cards, lists)

### Spinner

Use for actions in progress (buttons, form submissions)

### Progress Bar

Use for operations with known duration (uploads, multi-step)

## Empty States

### Structure

- Illustration or icon (optional)
- Headline explaining the state
- Description with context
- Primary CTA to resolve the state
