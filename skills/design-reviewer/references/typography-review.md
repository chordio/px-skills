# Typography Review Criteria

Review typography for clear, user-facing text issues.

## Focus Areas

### Text Sizing Issues

**Look for:**
- Body text under ~14px on desktop (too small to read comfortably)
- Text that is excessively large and dominates the interface
- Buttons or labels with text that appears cramped or overly spacious
- Mobile text that's too small for touch interfaces

**DOM check:**
```javascript
[...document.querySelectorAll('*')]
  .filter(el => parseFloat(getComputedStyle(el).fontSize) < 14 && el.innerText?.trim())
  .map(el => ({
    fontSize: getComputedStyle(el).fontSize,
    text: el.innerText?.slice(0, 30)
  }))
```

### Hierarchy Problems

**Look for:**
- Missing or unclear visual hierarchy (all text appears the same size/weight)
- Headers that are smaller or same size as body text
- Important information that lacks visual emphasis
- Multiple competing focal points that confuse the visual flow

**DOM check:**
```javascript
[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
  .map(el => ({
    level: el.tagName,
    fontSize: getComputedStyle(el).fontSize,
    fontWeight: getComputedStyle(el).fontWeight,
    text: el.innerText?.slice(0, 50)
  }))
```

### Readability Concerns

**Look for:**
- Very long line lengths (over ~80-100 characters) without breaks
- Insufficient line height causing text to feel cramped
- Poor text alignment that makes reading difficult
- Text on busy backgrounds that's hard to read
- ALL CAPS text used for long passages (harder to read)

**DOM check for line length:**
```javascript
[...document.querySelectorAll('p, .prose, article')]
  .map(el => ({
    width: el.offsetWidth,
    fontSize: parseFloat(getComputedStyle(el).fontSize),
    charsPerLine: Math.round(el.offsetWidth / (parseFloat(getComputedStyle(el).fontSize) * 0.5))
  }))
```

## What NOT to Report

- Stylistic choices that are working fine (e.g., "I would have chosen a different font")
- Minor sizing differences that don't impact readability
- Issues that require deep design system knowledge to identify
- Anything that requires squinting or deep analysis to notice

## Example Issues

### Good Issue Report
> The body text in the main content area appears to be around 12px, which is too small for comfortable reading on desktop. This could cause eye strain, especially for longer passages. Recommended minimum: 14-16px.

### Over-Reporting (Don't Do This)
> "The heading could be 2px larger for slightly better hierarchy."

This is too minor to report.

## Severity Guidelines

| Severity | Criteria |
|----------|----------|
| **Critical** | Text completely unreadable, blocks task completion |
| **Major** | Text difficult to read, causes eye strain |
| **Minor** | Slight readability issues, noticeable but functional |
