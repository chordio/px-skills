# Issue Report Format

Use this format for documenting design issues.

## Single Issue Format

```markdown
### [Severity]: [Brief Description]

**Location:** [Where in the UI - be specific]
**Viewport:** [Which viewport(s) affected]
**Impact:** [How it affects users]
**Recommendation:** [How to fix]
```

## Example Issues

### Critical Issue Example

```markdown
### Critical: Submit button invisible on mobile

**Location:** Bottom of checkout form
**Viewport:** Mobile (375px)
**Impact:** Users cannot complete purchase - form has no visible submit action
**Recommendation:** Ensure button is visible within viewport or add sticky positioning
```

### Major Issue Example

```markdown
### Major: Body text too small for comfortable reading

**Location:** Product description in main content area
**Viewport:** All viewports
**Impact:** Users must strain to read product details, creating friction in purchase decisions
**Recommendation:** Increase body text from 12px to minimum 16px
```

### Minor Issue Example

```markdown
### Minor: Inconsistent card heights in product grid

**Location:** Featured products section on homepage
**Viewport:** Desktop (1440px)
**Impact:** Visual inconsistency makes the grid appear unpolished
**Recommendation:** Use CSS Grid with equal row heights or flexbox with align-items: stretch
```

## Full Review Report Format

```markdown
## Design Review: [Feature/Page Name]

**Reviewed:** [Date]
**Viewports:** [List viewports tested]
**Context:** [Link to design-context if available]

---

### Critical Issues

[List critical issues or "None found"]

---

### Major Issues

[List major issues or "None found"]

---

### Minor Issues

[List minor issues or "None found"]

---

### Summary

[1-2 sentences summarizing overall UI quality]

### Recommendations

[Prioritized list of fixes if issues found]
```

## Guidelines

### Be Specific
- "Header text" (vague) vs "H1 in hero section" (specific)
- "On mobile" (vague) vs "At 375px viewport" (specific)
- "The button" (vague) vs "Submit button in checkout form" (specific)

### Be Actionable
- "Fix the contrast" (not actionable) vs "Increase text color from #AAA to #666 or darker" (actionable)
- "Make it bigger" (not actionable) vs "Increase to minimum 16px" (actionable)

### Group Related Issues
If the same problem appears in multiple places, group them:

```markdown
### Major: Text overflow in data tables

**Location:** User table, Orders table, Products table
**Viewport:** Mobile and Tablet
**Impact:** Email addresses and long names overflow cells, making data unreadable
**Recommendation:** Add text-overflow: ellipsis with title attribute for full text on hover
```

### Note Positive Findings
If a domain has no issues, explicitly state it:

```markdown
### Typography Review
No issues found. Text sizing, hierarchy, and readability are all appropriate.
```
