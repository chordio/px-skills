# Pre-Review Checklist

Complete before starting a design review.

## 1. Environment Setup

- [ ] Chrome running with remote debugging (`--remote-debugging-port=9222`)
- [ ] `puppeteer-core` installed in project
- [ ] Target page loaded and stable in Chrome

## 2. Context Gathering

**If `design-context/` exists, load:**
- [ ] `brand.md` - Understand tone and style expectations
- [ ] `colors.md` - Know the color system
- [ ] `typography.md` - Know the type scale
- [ ] `layout.md` - Know spacing and grid systems
- [ ] `components.md` - Know component patterns

**If no design context:**
- [ ] Note that review will be against general best practices
- [ ] Suggest running `design-context-manager` after review

## 3. Feature Understanding

- [ ] Know what the feature is supposed to do
- [ ] Understand the user's task/goal
- [ ] Know expected states (loading, empty, error, success)

## 4. Screenshot Capture

Capture at minimum:
- [ ] Mobile (375 x 667) - Most common mobile viewport
- [ ] Desktop (1440 x 900) - Common desktop viewport

Additional viewports if relevant:
- [ ] Tablet (768 x 1024) - For tablet-specific layouts
- [ ] Small desktop (1024 x 768) - For laptop users
- [ ] Large desktop (1920 x 1080) - For large monitors

## 5. State Capture

If applicable, capture screenshots of:
- [ ] Default/empty state
- [ ] Loading state
- [ ] Populated/success state
- [ ] Error state
- [ ] Hover/focus states (if testable)

## 6. DOM Information (Optional)

Run relevant DOM checks:
- [ ] Text overflow check
- [ ] Heading hierarchy check
- [ ] Font size check
- [ ] Touch target size check

## Ready to Review

Once checklist is complete, proceed to apply the four review lenses:
1. Typography
2. Color/Contrast
3. Layout/Spacing
4. Overflow/Truncation
