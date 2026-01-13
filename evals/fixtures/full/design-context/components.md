# Component Patterns

## Established Patterns

These patterns are used consistently across the app. When designing new features, **reuse these patterns** rather than inventing new ones.

---

### Stacked Form

**Used for:** Profile settings, task detail editing, team settings, any multi-field forms

**Structure:**
```
[Label]           <- text-sm, font-medium, color.text
[8px gap]
[Input Field]     <- full width, radius.md, border
[24px gap]
[Label]
[8px gap]
[Input Field]
...
[24px gap]
[Cancel Button] [Primary Button]   <- right-aligned, Cancel is ghost style
```

**Specifications:**
- Labels above inputs (not inline)
- `spacing.sm` (8px) gap between label and input
- `spacing.lg` (24px) gap between form groups
- Primary action button right-aligned
- Cancel button left of primary, ghost style (no background)
- Form container has `spacing.lg` padding

---

### Data Card

**Used for:** Dashboard widgets, project summaries, stats displays

**Structure:**
```
┌──────────────────────────────────┐
│ [Title]          [Optional Icon] │  <- spacing.md padding
│ [Subtitle/Description]           │
├──────────────────────────────────┤
│                                  │
│        [Content Area]            │  <- flexible height
│                                  │
├──────────────────────────────────┤
│ [Action Link]    [Action Button] │  <- optional footer
└──────────────────────────────────┘
```

**Specifications:**
- `spacing.md` (16px) padding on all sides
- Title: `text-lg`, `font-medium`
- Subtitle: `text-sm`, `color.text-secondary`
- Border: `1px solid color.border`, `radius.md`
- No shadow (flat design)
- Optional footer with `spacing.sm` padding-top, subtle top border

---

### Inline Creation

**Used for:** Quick task add, quick comment, quick note

**Structure:**
```
Before focus:
┌─────────────────────────────────────────┐
│ ⊕ Add a task...                         │  <- placeholder state
└─────────────────────────────────────────┘

After focus:
┌─────────────────────────────────────────┐
│ [Text input with cursor]          [Add] │
├─────────────────────────────────────────┤
│ [Optional: expanded fields]             │
└─────────────────────────────────────────┘
```

**Specifications:**
- Appears in-context (NOT a modal)
- Single input + submit button visible initially
- Press Escape to cancel, Enter to submit
- Click outside to cancel (if empty)
- Optional: Expands to show more fields (due date, assignee) on focus
- Transition: subtle expand animation, ~150ms

**Behavior:**
- Submit creates item with defaults
- Focus returns to input after submit (for rapid entry)
- Loading state on button while creating

---

### Action Dropdown

**Used for:** Task actions, item options, user menu

**Structure:**
```
[Trigger Button] ▾
        │
        ▼
┌──────────────────────┐
│ Action Item          │
│ Action Item          │
├──────────────────────┤
│ Destructive Action   │  <- color.error
└──────────────────────┘
```

**Specifications:**
- Trigger: icon button or text with chevron
- Dropdown: `radius.md`, `shadow.md`, `color.surface`
- Items: `spacing.sm` padding, full width hover state
- Divider between sections (1px, `color.border`)
- Destructive actions: `color.error` text
- Keyboard: Arrow keys to navigate, Enter to select, Escape to close

---

### Status Badge

**Used for:** Task status, invite status, project status

**Variations:**
```
[● Active]     <- color.success background (light), color.success text
[● Pending]    <- color.warning background (light), color.warning text
[● Completed]  <- color.surface-tertiary background, color.text-secondary text
[● Overdue]    <- color.error background (light), color.error text
```

**Specifications:**
- `text-xs`, `font-medium`
- `radius.full` (pill shape)
- `spacing.xs` horizontal padding, `spacing.xs/2` vertical
- Optional dot indicator using same color as text

---

### Empty State

**Used for:** No tasks, no projects, no search results

**Structure:**
```
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration/Icon]           │
│                                         │
│           No tasks yet                  │  <- text-lg, font-medium
│     Create your first task to get       │  <- text-sm, color.text-secondary
│            started.                     │
│                                         │
│        [+ Create Task Button]           │  <- primary button
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**
- Centered content
- Simple illustration or icon (not photo)
- Short, encouraging copy (not apologetic)
- Single primary action
- Container: no border, `spacing.2xl` vertical padding

---

## Pattern Selection Guide

| Scenario | Pattern to Use |
|----------|----------------|
| Multi-field settings form | Stacked Form |
| Dashboard metric display | Data Card |
| Quick item creation in a list | Inline Creation |
| Item-level actions (edit, delete, share) | Action Dropdown |
| Show item state | Status Badge |
| No content to display | Empty State |

**When to create a new pattern:**
1. None of the existing patterns fit the use case
2. The new pattern will be used in 3+ places
3. You've documented it in this file before implementing
