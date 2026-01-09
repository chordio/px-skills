# Overflow Review Criteria

Review for content that is cut off, truncated, or overflowing.

## Focus Areas

### Text Overflow

**Look for:**
- Text that is visibly cut off mid-word or mid-sentence
- Content that extends beyond its container boundaries
- Text that overlaps with other elements
- Truncated text with missing ellipsis (...) indicators
- Multi-line text that's cut off without indication there's more content

**DOM check for text overflow:**
```javascript
[...document.querySelectorAll('*')]
  .filter(el => el.scrollWidth > el.clientWidth)
  .map(el => ({
    tag: el.tagName,
    class: el.className,
    overflow: getComputedStyle(el).overflow,
    textOverflow: getComputedStyle(el).textOverflow,
    text: el.innerText?.slice(0, 50)
  }))
```

### Container Overflow

**Look for:**
- Images or content extending beyond card or container bounds
- Horizontal scrollbars appearing when they shouldn't
- Content pushed outside visible viewport
- Modals or popups with content cut off at edges

**DOM check for horizontal overflow:**
```javascript
{
  bodyOverflow: document.body.scrollWidth > window.innerWidth,
  overflowingElements: [...document.querySelectorAll('*')]
    .filter(el => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight)
    .map(el => ({
      tag: el.tagName,
      class: el.className
    }))
}
```

### Truncation Issues

**Look for:**
- Important information truncated without context (e.g., "Read mo..." without visible expansion)
- Tooltips or labels cut off mid-word
- Table cells with truncated data that can't be accessed
- Navigation items or button text that's partially hidden

**DOM check for truncated text:**
```javascript
[...document.querySelectorAll('*')]
  .filter(el => {
    const style = getComputedStyle(el);
    return style.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth;
  })
  .map(el => ({
    tag: el.tagName,
    visibleText: el.innerText?.slice(0, 30),
    fullText: el.textContent?.slice(0, 100)
  }))
```

### Layout Breaking

**Look for:**
- Responsive layouts where content breaks at certain sizes
- Fixed-width containers causing overflow on smaller screens
- Long words or URLs breaking layout
- Form validation messages that overflow their containers

**DOM check for very long words:**
```javascript
[...document.querySelectorAll('p, span, div')]
  .filter(el => el.innerText?.split(/\s+/).some(word => word.length > 30))
  .map(el => ({
    tag: el.tagName,
    longWord: el.innerText?.split(/\s+/).find(w => w.length > 30)
  }))
```

## What NOT to Report

- Intentional truncation with ellipsis when full content is accessible (e.g., tooltips, expandable sections)
- Infinite scroll pagination cutoffs (normal behavior)
- Intentional cropping of decorative images
- Hover-to-reveal patterns that are working correctly

## Example Issues

### Good Issue Report
> The product description in the card component is cut off mid-sentence without an ellipsis or 'Read more' link. Users cannot see the full description: "This product features advanced tech..." The text just stops abruptly, making it unclear if there's more content.

### Not An Issue
> The card shows "This is a long description..." with an ellipsis and a "Show more" button below.

This is intentional truncation with proper UI - NOT an issue.

### Good Issue Report
> The table in the data view has text overflowing beyond the cell boundaries, overlapping with the next column. The username "johnathan.smithson@example.com" extends into the "Status" column, making both columns difficult to read.

### Good Issue Report
> On mobile (375px viewport), the navigation menu items extend beyond the screen width, causing a horizontal scrollbar. Users must scroll horizontally to see all navigation options.

## Responsive Testing

Test at multiple viewports to catch responsive overflow:

```bash
# Mobile - most likely to overflow
node scripts/screenshot.js 375 667 mobile.png

# Tablet
node scripts/screenshot.js 768 1024 tablet.png

# Desktop
node scripts/screenshot.js 1440 900 desktop.png
```

**Common overflow scenarios by viewport:**
- **Mobile**: Long titles, email addresses, URLs
- **Tablet**: Grid items that don't fit 2-column layout
- **Desktop**: Usually stable, but check wide content areas

## Severity Guidelines

| Severity | Criteria |
|----------|----------|
| **Critical** | Important content completely inaccessible, form data cut off |
| **Major** | Significant content truncated without access, layout breaking |
| **Minor** | Minor overflow, ellipsis visible but no expand option |
