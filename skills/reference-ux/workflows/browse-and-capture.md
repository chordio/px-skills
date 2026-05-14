# Browse & Capture Workflow

Detailed browser workflow for walking through a live product experience and capturing it as a UX reference.

## Browser Automation Backend

Use the first available browser automation backend that can satisfy the capture contract below. Prefer `/browse` from gstack when it is available, but do not require it.

Fallback order:

1. `/browse` from gstack
2. Browser Use / in-app browser tools
3. Playwright, when available in the project or reasonable to run transiently
4. Puppeteer / Chrome remote debugging
5. If none are available, stop and tell the user that browser automation is required for this workflow

Required capabilities:

| Action | Purpose |
|--------|---------|
| Navigate to URL | Go to starting page |
| Screenshot | Capture current state |
| Read page / accessibility tree | Understand element structure |
| Click / interact | Advance through the flow |
| Resize viewport | Switch between desktop and mobile |
| Evaluate JavaScript | Extract computed styles, fonts, dimensions, and state when needed |

## Desktop Pass

### Setup

1. Set viewport to **1440×900** (standard desktop)
2. Navigate to the starting URL
3. Take initial screenshot

### Walking the Flow

For each screen in the flow:

**Step 1: Screenshot**
```
Take screenshot → save as screenshots/NN-desktop-{screen-name}.png
```

**Step 2: Read the page**
Read the accessibility tree to understand:
- Heading hierarchy (what's the primary question?)
- Interactive elements (buttons, inputs, links)
- ARIA states (disabled, expanded, selected)
- Navigation elements (progress indicators, back buttons)

**Step 3: Annotate**
Record in your notes:

```markdown
### Screen NN: {Screen Name}

**Layout:** {description — e.g., "split layout, question left, context card right"}
**Input type:** {card grid / pill grid / text field / stepper / file upload / map / none}
**Heading:** "{exact heading text}"
**Subtext:** "{exact subtext if present}"

**Interactive elements:**
- {element}: {state and behavior}
- {element}: {state and behavior}

**CTA:** "{label}" — {position} — {state: disabled/enabled} — {trigger to enable}
**Secondary actions:** {Back / Skip / Save & exit / Get tips — note positions}

**Design decisions:**
1. {Decision} — {why this over the alternative}
2. {Decision} — {why this over the alternative}
```

**Step 4: Capture state transitions**
If the screen has interactive states worth capturing:
- Hover over a selection option → screenshot (`NNb-desktop-{name}-hover.png`)
- Make a selection → screenshot (`NNb-desktop-{name}-selected.png`)
- Note how CTA state changes

**Step 5: Advance**
Interact with the primary CTA to move to the next screen. If a modal or sub-flow opens, capture that too:
- Modal → screenshot (`NNc-desktop-{name}-modal.png`)
- After modal closes → screenshot the updated parent state

### Capturing Modals and Sub-flows

When a modal or sub-flow appears:

1. Screenshot the modal/sheet
2. Note the contract:
   - Title (does it match the parent element's label?)
   - Input type (single field? multiple fields?)
   - Footer actions (left = secondary, right = primary?)
   - Dismiss mechanism (X button, click outside, swipe down)
3. Complete the sub-flow
4. Screenshot the post-completion state (does the parent screen update?)

### Navigation & Progress

Track how navigation evolves through the flow:

| Aspect | Early flow | Deep flow |
|--------|-----------|-----------|
| Progress indicator | Hidden? Visible? | Step counter? Sidebar? |
| Back | Button? X? Hidden? | Always present? |
| Save & exit | Available? | When does it appear? |
| Skip | When offered? | Where positioned? |

## Mobile Pass

### Setup

1. Resize viewport to **390×844** (iPhone 14 equivalent)
2. Navigate to the same starting URL

### What to Capture

Don't re-capture every screen. Focus on **what changes** from desktop:

1. **Layout adaptations** — How does multi-column become single-column?
2. **Navigation changes** — Sidebar → pill? Expanded → collapsed?
3. **Modal → sheet** — Do centered modals become bottom sheets?
4. **CTA changes** — Does the button go full-width?
5. **Touch targets** — Are interactive elements larger?
6. **Content reflow** — What gets hidden, collapsed, or reordered?

### Key Screens to Capture on Mobile

- The first screen (to show initial layout difference)
- Any screen with a sidebar or multi-column layout
- A modal/sheet interaction (to show the modal → sheet transformation)
- The navigation/progress UI (expanded state if applicable)
- Any screen that looks significantly different from desktop

### Screenshot Naming

```
screenshots/NN-mobile-{screen-name}.png
```

Use the same NN numbering as the desktop equivalent for easy cross-reference.

## Handling Auth Walls

Many flows require authentication. Options:

1. **Sign up** — If the flow is public, create a test account
2. **Observe what's visible** — Capture as much as possible before the auth wall
3. **Note the auth pattern** — When auth appears in the flow is itself a design decision (deferred auth, upfront gate, etc.)
4. **Ask the user** — If credentials are needed, ask: "The flow requires login. Can you provide test credentials, or should I capture what's visible?"

## Handling Dynamic Content

- **Location-based content** — Note that results may vary by geography
- **A/B tests** — The user might see different variants; capture what you see and note it
- **Personalized content** — Note what's personalized vs. static
- **Loading states** — If you catch a loading state, screenshot it — these are design decisions too

## Time Budget

| Phase | Target time |
|-------|------------|
| Desktop pass | 10-15 minutes |
| Mobile pass | 5-10 minutes |
| Total browsing | 15-25 minutes |

If the flow is very long (20+ screens), ask the user if they want to focus on a specific section.

## Checklist Before Moving to Analysis

- [ ] All flow screens captured on desktop
- [ ] Key state transitions captured (hover, selected, enabled CTA)
- [ ] Modals/sub-flows captured
- [ ] Mobile variants for key layout differences captured
- [ ] Navigation/progress UI captured on both breakpoints
- [ ] Exact copy recorded for headings, CTAs, and helper text
- [ ] Auth pattern noted (if applicable)
