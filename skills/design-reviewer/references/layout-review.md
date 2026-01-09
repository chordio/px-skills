# Layout Review Criteria

Review layout and spacing for alignment, crowding, and whitespace issues.

## Focus Areas

### Alignment Issues

**Look for:**
- Elements that are clearly misaligned when they should form a grid or column
- Inconsistent left/right margins across sections
- Items in a list or grid that don't line up properly
- Buttons or form fields that appear crooked or off-center
- Visible baseline misalignment in horizontal layouts

**DOM check for grid/flex layouts:**
```javascript
[...document.querySelectorAll('*')]
  .filter(el => {
    const style = getComputedStyle(el);
    return style.display === 'grid' || style.display === 'flex';
  })
  .map(el => ({
    tag: el.tagName,
    display: getComputedStyle(el).display,
    class: el.className,
    childCount: el.children.length
  }))
```

### Element Crowding

**Look for:**
- UI elements packed too tightly together, making them hard to distinguish
- Buttons touching each other without spacing
- Text blocks with no breathing room
- Cards or tiles crammed together in grids
- Form fields bunched up without adequate separation

**DOM check for touch targets:**
```javascript
[...document.querySelectorAll('button, a, input, [role="button"]')]
  .map(el => ({
    tag: el.tagName,
    width: el.offsetWidth,
    height: el.offsetHeight,
    tooSmall: el.offsetWidth < 44 || el.offsetHeight < 44,
    text: el.innerText?.slice(0, 20)
  }))
  .filter(el => el.tooSmall)
```

### Whitespace Problems

**Look for:**
- Insufficient whitespace making the interface feel cluttered or overwhelming
- Excessive whitespace that separates related elements too much
- Unbalanced spacing where some areas are cramped while others are sparse
- Lack of padding inside containers causing content to touch edges

**DOM check for container padding:**
```javascript
[...document.querySelectorAll('.card, .container, section, article, [class*="card"]')]
  .map(el => ({
    class: el.className,
    padding: getComputedStyle(el).padding,
    hasPadding: getComputedStyle(el).padding !== '0px'
  }))
```

### Grid/Layout Structure

**Look for:**
- Grids with obviously inconsistent column widths
- Card layouts where items have different heights unnecessarily
- Responsive layouts with awkward breakpoint behavior (if visible)
- Floating or positioning errors causing elements to overlap incorrectly

**DOM check for horizontal scrollbar (layout overflow):**
```javascript
document.body.scrollWidth > window.innerWidth
```

## What NOT to Report

- Minor spacing variations that are barely noticeable (1-2px differences)
- Stylistic choices you disagree with that still work functionally
- Issues that require measuring with tools to detect
- Intentional asymmetric layouts or creative spacing

## Example Issues

### Good Issue Report
> The product cards in the main grid appear misaligned - the first row has 3 cards with equal width, but the second row has cards of varying widths. This creates a visually inconsistent layout that looks unpolished.

### Good Issue Report
> The form fields are tightly packed with minimal vertical spacing between them, making it difficult to distinguish where one field ends and another begins. This could lead to user confusion when filling out the form.

### Good Issue Report
> In the product grid, the 'Add to Cart' buttons within each card are positioned inconsistently. In some cards, the button sticks to the bottom of the card, while in others it doesn't reach the bottom, leaving varying amounts of space. This creates a visually uneven appearance where the repetitive content elements don't align across the grid.

### Over-Reporting (Don't Do This)
> "The button padding is 11px instead of 12px"

Too minor unless it's visually obvious - don't report.

## Responsive Considerations

Compare layouts across viewports:
- Mobile (375px): Single column, stacked elements
- Tablet (768px): 2-column layouts where appropriate
- Desktop (1440px): Full grid layouts, sidebar visible

**Look for:**
- Breakpoints that cause awkward layouts
- Elements that overlap at certain sizes
- Content that becomes inaccessible at smaller viewports

## Severity Guidelines

| Severity | Criteria |
|----------|----------|
| **Critical** | Layout completely broken, content inaccessible |
| **Major** | Significant alignment/spacing issues, looks unprofessional |
| **Minor** | Noticeable inconsistencies, doesn't block usage |
