# Severity Classification Guide

Classify design issues by their impact on user experience.

## Severity Levels

### Critical

**Definition:** Prevents task completion or causes data loss.

**Report when:**
- Users cannot complete their intended task
- Important information is completely inaccessible
- Data entry is impossible or leads to errors
- Navigation is broken or unusable
- Content is completely unreadable

**Examples:**
- Submit button not visible or clickable
- Form fields completely cut off on mobile
- Critical error messages unreadable due to contrast
- Navigation menu inaccessible at certain viewports
- Text so small it cannot be read at all

### Major

**Definition:** Significantly impacts usability but doesn't completely block users.

**Report when:**
- Tasks are difficult but not impossible
- Users are likely to make mistakes
- Content requires significant effort to read
- Layout issues make the interface confusing
- Accessibility barriers exist for common use cases

**Examples:**
- Body text too small for comfortable reading (12px or less)
- Low contrast text that's readable but straining
- Inconsistent alignment that looks unprofessional
- Important content truncated without expand option
- Touch targets too small for reliable tapping

### Minor

**Definition:** Noticeable issues that don't significantly impact task completion.

**Report when:**
- Issues are visible but don't block users
- Problems are aesthetic rather than functional
- Edge cases that affect few users
- Inconsistencies that don't cause confusion

**Examples:**
- Slight alignment inconsistencies in grids
- Minor spacing variations
- Truncation with proper ellipsis but no expand option for non-critical content
- Subtle contrast issues on decorative elements

## Classification Framework

| Question | Critical | Major | Minor |
|----------|----------|-------|-------|
| Can users complete tasks? | No | With difficulty | Yes |
| Is content accessible? | No | Partially | Mostly |
| Does it cause confusion? | Blocks understanding | Creates friction | Noticed but understood |
| Who is affected? | All users | Many users | Some users |

## Don't Report

Issues that don't meet any severity threshold:

- Subjective preferences ("I would have done it differently")
- Pixel-perfect differences that aren't visually noticeable
- Intentional design decisions that are working as expected
- Issues requiring tools to detect (not visible to users)
- Problems only visible with deep analysis

## Report Format

When classifying an issue:

```markdown
### [Severity]: [Brief Description]

**Location:** [Where in the UI]
**Impact:** [How it affects users]
**Recommendation:** [How to fix]
```

**Example:**
```markdown
### Major: Body text too small on mobile

**Location:** Product description in main content area
**Impact:** Users must zoom to read product details, creating friction in the purchase decision
**Recommendation:** Increase body text to minimum 16px on mobile viewports
```

## Counting Issues

A single underlying problem may manifest in multiple places. Count it once and note affected locations:

**Wrong approach:**
- Minor: Card 1 text truncated
- Minor: Card 2 text truncated
- Minor: Card 3 text truncated
- Minor: Card 4 text truncated

**Correct approach:**
- Minor: Product card descriptions truncated without expand option (affects all cards in grid)
