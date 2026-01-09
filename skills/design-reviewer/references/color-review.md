# Color Review Criteria

Review color and contrast for visibility and accessibility issues.

## Important Note on WCAG

You cannot accurately calculate WCAG contrast ratios from a screenshot. You can only identify *suspected* issues where contrast appears problematic. Don't make claims about specific WCAG compliance levels (AA, AAA) - just describe what appears difficult to read or see.

## Focus Areas

### Suspected Contrast Issues

**Look for:**
- Text on backgrounds where the contrast appears very low (hard to read)
- Light gray text on white backgrounds or dark gray on black
- Colored text on colored backgrounds that blend together
- Disabled or placeholder text that's nearly invisible
- Links or interactive elements that don't stand out from surrounding text

**DOM check for text colors:**
```javascript
[...document.querySelectorAll('p, span, a, button, label')]
  .map(el => ({
    color: getComputedStyle(el).color,
    bg: getComputedStyle(el).backgroundColor,
    text: el.innerText?.slice(0, 30)
  }))
```

### Visibility Problems

**Look for:**
- Important UI elements (buttons, links, icons) that are hard to see
- Focus states or hover states that appear too subtle (if visible in screenshot)
- Form validation errors that don't stand out
- Status indicators that lack clear visual distinction

**DOM check for button visibility:**
```javascript
[...document.querySelectorAll('button, [role="button"], a')]
  .map(el => ({
    color: getComputedStyle(el).color,
    bg: getComputedStyle(el).backgroundColor,
    border: getComputedStyle(el).border,
    text: el.innerText?.slice(0, 30)
  }))
```

### Color Usage Issues

**Look for:**
- Critical information conveyed by color alone without text/icons (accessibility concern)
- Color combinations that may be difficult for colorblind users (e.g., red/green only distinction)
- Overwhelming use of bright, saturated colors that cause visual fatigue

**Examples of color-only information:**
- Required fields marked only with red asterisk (needs text "required")
- Status shown only as red/green (needs icon or text)
- Error states using only red color (needs error message)

## What NOT to Report

- Subjective color palette preferences ("I don't like this blue")
- Minor contrast differences that are still clearly readable
- Issues that require contrast ratio calculations to detect
- Stylistic choices that don't impact visibility

## Example Issues

### Good Issue Report
> The secondary button text appears to be light gray on a white background. This low contrast makes the button text difficult to read, especially in bright lighting conditions or for users with visual impairments.

### Over-Reporting (Don't Do This)
> "This button uses #4A90E2 which doesn't pass WCAG AAA"

Can't determine exact colors or WCAG levels from screenshot - don't report.

### Good Issue Report
> The form uses red color alone to indicate required fields. Users who are colorblind may not be able to distinguish these fields. Add a text indicator like "(required)" or an asterisk with a legend.

## Severity Guidelines

| Severity | Criteria |
|----------|----------|
| **Critical** | Text/content unreadable, critical info conveyed by color only |
| **Major** | Text difficult to read in normal conditions, poor button visibility |
| **Minor** | Slightly low contrast, subtle visibility issues |
