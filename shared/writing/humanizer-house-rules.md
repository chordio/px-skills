# Humanizer house rules (PX Skills additions)

These are our own prose rules, layered **on top of** the
[blader/humanizer](https://github.com/blader/humanizer) skill, which is an
**optional peer**: install it from its own repo (it ships as a Claude Code
plugin). We keep our rules in this separate file, rather than forking the
skill, so upstream stays upstream and our layer stays maintainable.

**How to use:** run `humanizer` as normal, applying every pattern in its
`SKILL.md`, then also apply the amendments and additional patterns below. They
extend the same draft → audit → final loop; nothing here overrides upstream,
it only adds. Section numbers (§7, §14, …) refer to upstream's `SKILL.md`
(v2.8.2 at the time of writing; sections are also named, so number drift is
survivable).

---

## Amendments to upstream sections

### Voice Calibration — add step 4

4. **Accumulate corrections during the session (not optional).** Treat every in-session correction as a standing constraint. If the user bans a word or a move, apply it to the whole document and every later pass, not just the line they flagged.

### PERSONALITY AND SOUL — add subsection

**Don't manufacture slop while adding soul.** Voice and edge are good, but they have failure modes. Even where the PERSONALITY section applies, the push for personality can backfire into a different kind of slop. Two brakes:

- **Vague-but-punchy filler is still filler.** "That line is load-bearing," "does real work," "that's the whole game," "it's not nothing" — these feel like voice but say nothing. Replace with the concrete claim ("This distinction matters," "Legibility is the bar, not beauty").
- **Avoid obscure or trendy idiom.** "Load-bearing," "galaxy-brained," "the long pole" read as insider tics. Favor plain words a first-time reader gets without decoding.

### §7 (Overused "AI Vocabulary" Words) — extend the word list

Add to the high-frequency AI words: **real, really**. (They co-occur with the empty-intensifier pattern below.)

### §14 (Em Dashes) — add Caution and Scope

**Caution:** a dash often joins two clauses. Don't just delete it; replace it with punctuation that holds the sentence together (usually a period or comma), then re-read the whole sentence. If it now runs long or reads as stacked fragments, split it into two.

**Scope:** this rule covers em and en dashes only. Don't over-correct by stripping other structural punctuation. A colon that sets up a list or an explanation, parentheses around a true aside, or a question mark that frames a real question all earn their place; keep them when removing them would flatten the move or change the meaning. Clarity and meaning outrank any anti-punctuation reflex. (See "Don't trade one tell for another" below: replacing every dash with a colon just moves the tell.)

### "What NOT to flag" — add false positive

- **"What / Where / When ..." as the subject of a full sentence.** "What matters is the coverage" and "Where it fits is the pipeline" are complete and fine. The tell in the fragment pattern below is the fragment that ends where the main clause should begin.

---

## Additional patterns

### Empty Intensifiers

**Words to watch:** really, real, actually, genuinely, truly, simply, just, very

**Problem:** These pad a sentence while pretending to strengthen it.

**Rule:** Intensifiers that survive deletion without loss should be deleted, not swapped for a synonym. Never replace a deleted intensifier with a word that smuggles in a new claim: cutting "can actually move through" to "can move through" is right; "can intuitively move through" overclaims.

**Before:**
> The interface is really clean and the flow is genuinely simple, so users can actually move through it.

**After:**
> The interface is clean and the flow is simple, so users can move through it.

### Standalone "What / Where / When ..." Fragments

**Phrases to watch:** What measurement is worth., What it measures., What you get., Where the model fits., Where it breaks down., When measurement pays off., When it matters. — any clause opening with an interrogative word (*what*, *where*, *when*) punctuated as its own declarative sentence, most often a marketing heading or kicker.

**Problem:** The form garden-paths: the reader starts parsing a question and hits a period instead of an answer. It gestures at content rather than stating it, and it has become a stock marketing-copy move. The tell is the fragment — an interrogative clause with no main clause completing it. ("What matters is the coverage" and "Where it fits is the pipeline" are full sentences and fine; so is a real question the next sentence answers.)

**Rule:** State the content directly. Don't rescue the fragment by prepending "Here is ..." — that keeps the gesture and adds filler.

**Before:**
> What it measures. PX-bench scores flows, empty states, and accessibility, not just task completion.

**After:**
> PX-bench measures flows, empty states, and accessibility, not just task completion.

---

## Additional global principles

### Don't trade one tell for another

After any replacement, re-scan. Removing a pattern is only a win if you didn't introduce a new one. Two specific traps:

- **Punctuation laundering.** Converting every em dash to a colon trades one tic for another. Rotate among comma, period, parenthesis, and rephrasing; reach for a colon only when it earns its place. Then count your colons — if they now dominate, you've just moved the tell.
- **Connective repetition.** If you lean on the same joiner ("including," "since," "which means") to replace several dashes, you've built a new verbal tic. Vary them, and grep your own output for any word that now repeats.

### Keep referents explicit

Cutting words can strand a "this / that / it / here." After every cut, each pointer must have one unmistakable referent. Prefer naming the thing over a pronoun ("we treat PX as a capability," not "we treat it"). Watch vague location words hardest — "not here" should become "not at the category level."

### Flag logic; don't polish over it

If a sentence is self-contradictory, a category error, or genuinely ambiguous in meaning, stop and surface it as a question. Do not prettify the prose around a logical problem — that hides the bug under better wording.

---

## Addition to Process and Output

Insert a regression-lens step into upstream's Process, between "What makes the below so obviously AI generated?" and the final rewrite:

- **Apply the regression lens:** "Did any edit make the text vaguer, more ambiguous, harder to read, or merely a different tic?" (see "Don't trade one tell for another"). Answer briefly with any regressions, then revise the final rewrite to address both the remaining tells and the regressions.

Add the **regression check** to the deliverable, alongside the draft, the "still-AI" bullets, and the final rewrite.
