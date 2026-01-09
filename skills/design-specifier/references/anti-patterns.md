# Anti-Patterns to Avoid

Common design mistakes that lead to generic, ineffective, or problematic UIs.

## Generic "AI Slop" Patterns

These patterns signal lack of intentional design. Avoid unless specifically appropriate for your context.

### Typography Defaults

**Avoid:**
- **Inter everywhere** — The default "safe" choice. Consider if it matches your brand.
- **Roboto for everything** — Another default that screams "no design decision made"
- **System fonts with no thought** — Fine for performance, but consider readability and brand

**Instead:**
- Choose fonts that match brand personality
- Consider display vs body font pairing
- Ensure readability at target sizes

### Color Clichés

**Avoid:**
- **Purple gradients** — Overused AI/tech startup aesthetic
- **Generic blue CTAs** — The default "safe" primary color
- **Rainbow gradients** — Often signals no color strategy
- **Neon on dark** — Overdone cyberpunk aesthetic

**Instead:**
- Choose colors that support brand identity
- Ensure accessibility contrast ratios
- Use semantic colors meaningfully

### Layout Laziness

**Avoid:**
- **Everything centered** — Often hides lack of hierarchy thinking
- **Massive hero with stock photo** — Cookie-cutter landing page
- **Card grids for everything** — Not all content needs cards
- **Full-width everything** — Ignores readability and focus

**Instead:**
- Consider content hierarchy
- Use whitespace intentionally
- Match layout to content type

## UX Anti-Patterns

### Hidden Affordances

**Problem:** Users can't discover how to interact

**Examples:**
- Clickable elements that don't look clickable
- Swipe gestures with no visual hint
- Hover-only interactions on touch devices

**Fix:** Make interactive elements visually obvious

### Mystery Meat Navigation

**Problem:** Icons or labels that don't communicate purpose

**Examples:**
- Icon-only navigation without labels
- Jargon-heavy menu items
- Ambiguous button labels like "Go" or "Submit"

**Fix:** Use clear, descriptive labels

### Modal Overload

**Problem:** Using modals when inline would work better

**Symptoms:**
- Modal for every action
- Modals opening modals
- Content that could be inline

**When modals are appropriate:**
- Focused task requiring isolation
- Confirmation of destructive action
- Content that truly needs separation

### Infinite Scroll Hell

**Problem:** Infinite scroll where pagination would help

**Symptoms:**
- Can't return to previous position
- Footer unreachable
- No sense of total content
- Performance issues with many items

**When to use pagination instead:**
- Users need to reference specific items
- Content has logical pages
- Footer content is important

## Accessibility Anti-Patterns

### Color-Only Information

**Problem:** Meaning conveyed only through color

**Examples:**
- Red = error, green = success (no icons or text)
- Required fields marked only with color
- Status indicated only by color change

**Fix:** Combine color with text, icons, or patterns

### Tiny Touch Targets

**Problem:** Interactive elements too small for fingers

**Minimum:** 44×44px touch target

**Common offenders:**
- Icon buttons
- Close buttons
- Checkbox/radio inputs
- Links in dense text

### Missing Focus States

**Problem:** No visible focus indicator for keyboard navigation

**Fix:**
- Clear focus ring on all interactive elements
- Don't remove default focus styles without replacement
- Ensure sufficient contrast for focus indicator

### Auto-Playing Media

**Problem:** Video or audio that plays without user action

**Issues:**
- Disruptive
- Accessibility barrier
- Data usage concerns

**Fix:** Require user action to play, provide pause/mute

## Form Anti-Patterns

### Unclear Validation

**Problem:** Users don't understand what's wrong

**Bad:**
- "Invalid input"
- Red border with no message
- Validation only on submit

**Good:**
- Specific error: "Email must include @"
- Inline validation as user types
- Clear indication of required fields

### Label Inside Input

**Problem:** Labels disappear when user types

**Issues:**
- Users forget what field is for
- No reference while typing
- Accessibility issues

**Fix:** Labels above or beside inputs, not as placeholders

### Reset Button Placement

**Problem:** Reset/cancel button too close to submit

**Risk:** Accidental data loss

**Fix:**
- Visual differentiation (ghost vs primary)
- Separate from submit action
- Confirmation for destructive reset

## Content Anti-Patterns

### Lorem Ipsum in Production

**Problem:** Placeholder text shipped to users

**Worse:** Inconsistent content lengths that break layout

**Fix:** Always use real or realistic content

### Walls of Text

**Problem:** Dense, unformatted text blocks

**Fix:**
- Break into paragraphs
- Use headings and subheadings
- Bullet points for lists
- Bold key terms

### Jargon Without Context

**Problem:** Internal or technical terms exposed to users

**Examples:**
- "Entity not found" instead of "Page not found"
- "Null pointer exception" in error messages
- Internal feature names

**Fix:** User-friendly language, explain technical terms

## Performance Anti-Patterns

### Blocking Interactivity

**Problem:** UI unresponsive during operations

**Examples:**
- Whole page freeze during save
- Button that can be clicked multiple times
- No loading indication

**Fix:**
- Optimistic UI updates
- Loading states
- Disable buttons during submission

### Layout Shift

**Problem:** Content jumps as page loads

**Causes:**
- Images without dimensions
- Fonts loading
- Dynamic content insertion

**Fix:**
- Reserve space for content
- Font-display strategies
- Skeleton screens
