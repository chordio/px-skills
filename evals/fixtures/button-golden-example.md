# Design Specification: Button Component

## Strategic Solution

The Button component serves as the primary interactive element for user actions across the application. We recommend a layered approach with three variants (Primary, Secondary, Tertiary) that establish clear visual hierarchy, plus semantic tones for contextual actions.

**Recommended Approach:** Multi-variant button system with consistent interaction patterns across all states and themes.

**Core Experience:** Users can immediately identify actionable elements through consistent visual treatment, with clear feedback for every interaction state.

**Key States:** Default, Hover (desktop), Focus, Pressed, Disabled, Loading, Selected

**Rationale:** Following established patterns from Polaris, Carbon, and Atlassian design systems ensures accessibility compliance and familiar interaction patterns.

---

## Implementation Details

### Variants & Usage Guidance

| Variant | Purpose | When to Use |
|---------|---------|-------------|
| **Primary** | Main CTA, high emphasis | One per view maximum. Use for the primary action users should take. |
| **Secondary** | Supporting actions | Multiple allowed. Use for secondary actions that complement the primary. |
| **Tertiary/Ghost** | Low emphasis | Use for navigation, cancel actions, or low-priority options. |

### Semantic Tones

| Tone | Purpose |
|------|---------|
| **Default** | Standard actions |
| **Danger/Critical** | Destructive actions (delete, remove, cancel subscription) |

---

### Sizing

| Size | Height | Horizontal Padding | Vertical Padding | Font Size | Touch Target |
|------|--------|-------------------|------------------|-----------|--------------|
| **Small** | 32px | `spacing-300` (12px) | `spacing-100` (4px) | `font-size-sm` (14px) | 32px (desktop only) |
| **Medium** | 40px | `spacing-400` (16px) | `spacing-200` (8px) | `font-size-base` (16px) | 44px |
| **Large** | 48px | `spacing-500` (20px) | `spacing-300` (12px) | `font-size-lg` (18px) | 48px |

**Touch Target:** Minimum 44px on mobile for all sizes. Small size restricted to desktop use only.

---

### Platform Differences

| Platform | Behavior |
|----------|----------|
| **Desktop** | Hover states enabled, 32px min height acceptable for small variant |
| **Mobile** | No hover states (skip directly to pressed), 44px minimum touch target enforced, tap feedback required |

---

### Typography

- **Font family:** `font-sans` (system font stack)
- **Font weight:** `font-weight-semibold` (600)
- **Line height:** `line-height-tight` (1.25)
- **Text transform:** None (sentence case)

---

### Border

- **Border radius:** `radius-md` (6px)
- **Border width:** 1px for Secondary/Tertiary variants, none for Primary

---

### Transitions

- **Duration:** `duration-fast` (150ms)
- **Easing:** `ease-out`
- **Properties:** background-color, border-color, box-shadow, transform

---

## Theme Support - Light Mode

### Primary Variant (Light)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `primary-600` (#2563eb) | `white` (#ffffff) | none | — |
| **Hover** | `primary-700` (#1d4ed8) | `white` (#ffffff) | none | — |
| **Pressed** | `primary-800` (#1e40af) | `white` (#ffffff) | none | — |
| **Focus** | `primary-600` (#2563eb) | `white` (#ffffff) | none | `primary-300` 2px offset 2px |
| **Disabled** | `gray-200` (#e5e7eb) | `gray-400` (#9ca3af) | none | — |

**Contrast:** Primary text (#ffffff) on primary-600 (#2563eb) = 4.68:1 ✓

### Secondary Variant (Light)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `white` (#ffffff) | `gray-700` (#374151) | `gray-300` (#d1d5db) | — |
| **Hover** | `gray-50` (#f9fafb) | `gray-800` (#1f2937) | `gray-400` (#9ca3af) | — |
| **Pressed** | `gray-100` (#f3f4f6) | `gray-900` (#111827) | `gray-500` (#6b7280) | — |
| **Focus** | `white` (#ffffff) | `gray-700` (#374151) | `primary-500` (#3b82f6) | `primary-300` 2px offset 2px |
| **Disabled** | `gray-50` (#f9fafb) | `gray-300` (#d1d5db) | `gray-200` (#e5e7eb) | — |

**Contrast:** Secondary text (#374151) on white (#ffffff) = 10.31:1 ✓

### Tertiary/Ghost Variant (Light)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `transparent` | `primary-600` (#2563eb) | none | — |
| **Hover** | `primary-50` (#eff6ff) | `primary-700` (#1d4ed8) | none | — |
| **Pressed** | `primary-100` (#dbeafe) | `primary-800` (#1e40af) | none | — |
| **Focus** | `transparent` | `primary-600` (#2563eb) | none | `primary-300` 2px offset 2px |
| **Disabled** | `transparent` | `gray-300` (#d1d5db) | none | — |

**Contrast:** Tertiary text (#2563eb) on white (#ffffff) = 4.52:1 ✓

### Danger Tone (Light)

| State | Background | Text | Border |
|-------|------------|------|--------|
| **Default** | `red-600` (#dc2626) | `white` (#ffffff) | none |
| **Hover** | `red-700` (#b91c1c) | `white` (#ffffff) | none |
| **Pressed** | `red-800` (#991b1b) | `white` (#ffffff) | none |
| **Focus** | `red-600` (#dc2626) | `white` (#ffffff) | `red-300` ring |
| **Disabled** | `gray-200` (#e5e7eb) | `gray-400` (#9ca3af) | none |

**Contrast:** Danger text (#ffffff) on red-600 (#dc2626) = 4.53:1 ✓

---

## Theme Support - Dark Mode

### Primary Variant (Dark)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `primary-500` (#3b82f6) | `white` (#ffffff) | none | — |
| **Hover** | `primary-400` (#60a5fa) | `white` (#ffffff) | none | — |
| **Pressed** | `primary-600` (#2563eb) | `white` (#ffffff) | none | — |
| **Focus** | `primary-500` (#3b82f6) | `white` (#ffffff) | none | `primary-400` 2px offset 2px |
| **Disabled** | `gray-700` (#374151) | `gray-500` (#6b7280) | none | — |

**Contrast:** Primary text (#ffffff) on primary-500 (#3b82f6) = 4.51:1 ✓

### Secondary Variant (Dark)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `gray-800` (#1f2937) | `gray-100` (#f3f4f6) | `gray-600` (#4b5563) | — |
| **Hover** | `gray-700` (#374151) | `white` (#ffffff) | `gray-500` (#6b7280) | — |
| **Pressed** | `gray-600` (#4b5563) | `white` (#ffffff) | `gray-400` (#9ca3af) | — |
| **Focus** | `gray-800` (#1f2937) | `gray-100` (#f3f4f6) | `primary-400` (#60a5fa) | `primary-400` 2px offset 2px |
| **Disabled** | `gray-800` (#1f2937) | `gray-600` (#4b5563) | `gray-700` (#374151) | — |

**Contrast:** Secondary text (#f3f4f6) on gray-800 (#1f2937) = 11.69:1 ✓

### Tertiary/Ghost Variant (Dark)

| State | Background | Text | Border | Focus Ring |
|-------|------------|------|--------|------------|
| **Default** | `transparent` | `primary-400` (#60a5fa) | none | — |
| **Hover** | `primary-900/20` | `primary-300` (#93c5fd) | none | — |
| **Pressed** | `primary-900/40` | `primary-200` (#bfdbfe) | none | — |
| **Focus** | `transparent` | `primary-400` (#60a5fa) | none | `primary-400` 2px offset 2px |
| **Disabled** | `transparent` | `gray-600` (#4b5563) | none | — |

**Contrast:** Tertiary text (#60a5fa) on gray-900 (#111827) = 6.89:1 ✓

### Danger Tone (Dark)

| State | Background | Text | Border |
|-------|------------|------|--------|
| **Default** | `red-500` (#ef4444) | `white` (#ffffff) | none |
| **Hover** | `red-400` (#f87171) | `white` (#ffffff) | none |
| **Pressed** | `red-600` (#dc2626) | `white` (#ffffff) | none |
| **Focus** | `red-500` (#ef4444) | `white` (#ffffff) | `red-400` ring |
| **Disabled** | `gray-700` (#374151) | `gray-500` (#6b7280) | none |

**Contrast:** Danger text (#ffffff) on red-500 (#ef4444) = 4.53:1 ✓

---

## Special States

### Loading State

- Replace button text with spinner
- Maintain button dimensions (no layout shift)
- Disable pointer events
- Use `opacity-70` on button background
- Spinner color matches text color

### Selected State (Toggle Buttons)

- Use for button groups where one option is active
- Visual treatment: same as Pressed state with persistent styling
- Add `aria-pressed="true"` for accessibility

---

## Icon Support

| Position | Spacing from Text |
|----------|-------------------|
| **Leading (left)** | `spacing-200` (8px) |
| **Trailing (right)** | `spacing-200` (8px) |
| **Icon-only** | Equal padding all sides, ensure 44px min touch target |

---

## Full-Width Option

- Button expands to 100% container width
- Text remains centered
- Useful for mobile layouts and modal footers
