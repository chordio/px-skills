# Design Anti-Patterns

Concrete rules for what NOT to do. Each rule has a reason — when in doubt, check
whether your reason for breaking the rule is stronger than the reason it exists.

Source: curated extract from [pbakaus/impeccable](https://github.com/pbakaus/impeccable)
`skill/SKILL.md` (Apache-2.0). See `NOTICE.md`.

---

## Absolute bans

If you're about to write any of these, rewrite the element with different structure.

### Side-stripe borders
`border-left` or `border-right` greater than 1px as a colored accent on cards,
list items, callouts, or alerts. Never intentional. Rewrite with full borders,
background tints, leading numbers/icons, or nothing.

### Gradient text
`background-clip: text` combined with a gradient background. Decorative, never
meaningful. Use a single solid color. Emphasis via weight or size.

### Glassmorphism as default
Blurs and glass cards used decoratively. Rare and purposeful, or nothing.

### The hero-metric template
Big number, small label, supporting stats, gradient accent. SaaS cliché.

### Identical card grids
Same-sized cards with icon + heading + text, repeated endlessly.

### Modal as first thought
Modals are usually laziness. Exhaust inline / progressive alternatives first.

### Em dashes
No em dashes (no `—`, no `--`). Use commas, colons, semicolons, periods, or
parentheses instead.

### Partial color within a text block
Wrapping select words inside any single text block (body paragraph,
headline, subhead, list item) in an accent color to "draw the eye to
value props," "highlight value tiers," or "emphasize the key phrase."
Common in AI-generated landing pages and pitch-deck slides ported to
web. Every contiguous text block is a single color; emphasis inside a
block comes from typography (italic, weight, scale) or layout
(separate lines, pull quotes, line breaks), never from color. Color
can vary across blocks (a rust label above a black headline above a
muted paragraph is fine, because each block is one color). Color
cannot vary within a block. Rewrite the block as a single color; if a
phrase truly needs visual separation, break it into its own line,
its own block, or a short bulleted list.

### Content above the header

Eyebrows, category labels, "context-setting" lines, decorative timestamps,
breadcrumbs on landing pages, "Welcome to…" or "Introducing…" labels, or
any text element placed ABOVE the page H1 or section heading. Above-the-
header content breaks information hierarchy: the reader's eye lands on a
de-prioritized fragment first, then the actual headline, then the subhead.
The reader has to parse two things sequentially before reaching the main
idea, and the eyebrow steals first attention without earning the rank of
"most important thing on the page."

The hierarchy test: if a piece of text deserves first attention, it IS the
headline; promote it. If it provides necessary context, it belongs IN the
subhead, IN the body, or in a labelled section below the fold. If it is
less important than the headline, it must not sit visually above the
headline. Above the header is the worst placement: it pushes the main
idea down without ranking as the main idea itself.

Eyebrows BELOW or BESIDE a headline are different and often correct
(the headline anchors first, the eyebrow contextualizes the section it
introduces). This rule is specifically about placement ABOVE the
headline, where the eyebrow competes for first attention without
deserving it. Breadcrumbs on internal pages are a recognized convention
and acceptable; breadcrumbs on a landing page or marketing page are
this anti-pattern wearing a navigation costume.

Common offenders: category eyebrows above an editorial H1, "Get started"
or "Pricing" labels above the section heading, promotional badges above
the hero headline when the badge is not in fact the most important idea,
"Now in beta" or "Introducing" lines that should either BE the headline
or be deleted.

---

## Color rules

- Use OKLCH. Reduce chroma as lightness approaches 0 or 100; high chroma at extremes looks garish.
- Never use `#000` or `#fff`. Tint every neutral toward the brand hue (chroma 0.005–0.01 is enough).
- Pick a **color strategy** before picking colors. Four steps on the commitment axis:
  - **Restrained**: tinted neutrals + one accent ≤10%. Product default; brand minimalism.
  - **Committed**: one saturated color carries 30–60% of the surface. Brand default for identity-driven pages.
  - **Full palette**: 3–4 named roles, each used deliberately. Brand campaigns; product data viz.
  - **Drenched**: the surface IS the color. Brand heroes, campaign pages.
- The "one accent ≤10%" rule is **Restrained only**. Don't collapse every design to Restrained by reflex.

---

## Theme

Dark vs. light is never a default. Not dark "because tools look cool dark." Not
light "to be safe." Before choosing, write one sentence of physical scene:
who uses this, where, under what ambient light, in what mood. If the sentence
doesn't force the answer, it's not concrete enough.

"Observability dashboard" does not force an answer.
"SRE glancing at incident severity on a 27-inch monitor at 2am in a dim room"
does. Run the sentence, not the category.

---

## Typography

- Cap body line length at 65–75ch.
- Hierarchy through scale + weight contrast (≥1.25 ratio between steps). Avoid flat scales.

---

## Layout

- Vary spacing for rhythm. Same padding everywhere is monotony.
- Cards are the lazy answer. Use them only when they're truly the best affordance. **Nested cards are always wrong.**
- Don't wrap everything in a container. Most things don't need one.

---

## Motion

- Don't animate CSS layout properties.
- Ease out with exponential curves (ease-out-quart / quint / expo). No bounce, no elastic.

---

## Copy

- Every word earns its place. No restated headings, no intros that repeat the title.

---

## The AI slop test

If someone could look at this interface and say "AI made that" without doubt, it's failed.

**First-order check.** If someone could guess the theme + palette from the
category alone — observability → dark blue, healthcare → white + teal,
finance → navy + gold, crypto → neon on black — it's the first
training-data reflex. Rework the scene sentence and color strategy until the
answer isn't obvious from the domain.

**Second-order check.** If someone could guess the aesthetic family from
category-plus-anti-references — "AI workflow tool that's not SaaS-cream →
editorial-typographic", "fintech that's not navy-and-gold → terminal-native
dark mode" — it's the trap one tier deeper. Rework until both answers are
not obvious.
