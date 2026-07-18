# Clarity rubric (the data behind the skill)

The checklist `clarity-review` runs. Kept as data, not prose buried in the skill,
so it can be versioned, calibrated, and reused. This is the *clarity* gate only;
it is deliberately narrow. It does not cover slop (that's **humanizer**) or
substance/architecture (that's a reverse-outline / structural review).

## The three bands

Editing a draft moves through three independent quality axes. A pass that checks
one is blind to the other two.

| Band | Property | Caught by | Misses |
|---|---|---|---|
| **Clean** | sentence-in-isolation: no AI tells, tight grammar, good cadence | humanizer | dangling referents, unmotivated logic |
| **Architecture** | the spine: section order, each section earns its place | reverse-outline | breaks *inside* a paragraph |
| **Clear** *(this skill)* | relational: each sentence follows; every reference resolves where it appears | a blind cold-reader panel + given-new read | — |

**Clean is not clear.** "Here's the map" is clean and unclear: the referent
doesn't exist yet for a cold reader. The cleaner the prose, the harder to run this
gate — smooth sentences glide the reader past the gap.

## The given-new contract

(Williams, *Style*; Gopen & Swan, *The Science of Scientific Writing*.) Every
sentence should open with something the reader already holds (old / topic) and end
with the new thing (new / stress). A definite reference — `the map`, `the gap`,
`the disagreement` — is a promise that its referent is already old information. If
it isn't, the sentence is clean and broken.

**The test:** read strictly linearly. At every definite noun phrase, pronoun, and
coined term, ask: *has the text supplied this referent yet?* If not, defect.

## Reveal levels

A reference resolves only if it resolves **at the level where it appears**, because
readers arrive at different depths.

- **L0** — title + dek/excerpt (or, with no frontmatter, the first paragraph). The
  link-preview / social reader. *Most readers never leave L0.* A term the full piece
  explains beautifully but that appears unexplained in the dek is still a defect.
- **L1** — + the intro (to the first `##`). The reader who started.
- **L2** — + the full body. The committed reader.

Weight defects by the level they occur at: an L0 defect costs the most readers.

## Entity-probe protocol

1. **Collect** the things that must stand alone: definite references with a distant
   or absent antecedent; coined / technical terms; evaluative adjectives implying an
   axis the piece may not develop (`good benchmarks`); pronouns with distant
   antecedents; the dek's central claim. (The script dumps rough candidates; curate.)
2. **Locate** each entity's earliest **appearance** level.
3. **Probe** with the blind panel at that level (see the skill's *Cold-reader
   panel*): multi-shot, mixed tiers, biased to `NOT ESTABLISHED`.
4. **Score** by consensus: majority `NOT ESTABLISHED` at the appearance level =
   confirmed defect. Lone stumble = `watch`. Glosses that disagree across readers =
   defect (the text supports several readings).

## Dek / title audit (informed pass)

The dek/headline is the highest-readership, lowest-context text in the piece. It
earns its own checklist, run by the orchestrating agent with full context:

- **D-1 Contribution.** Does the dek state what the piece *does for the reader*, in
  language the body delivers? "Here's the map" fails: map of what?
- **D-2 Earned claims.** For every adjective and claim, does the body actually argue
  that property? An unearned adjective imports an axis and dilutes the promise (the
  `good` in "good benchmarks", when the piece is about *coverage*, not quality).
- **D-3 Standalone parse.** Reading only the dek, is anything referenced that a
  zero-context reader cannot identify?

## Banned sentence forms (marketing copy)

Sentence *shapes* that fail a cold reader regardless of content. Flag every
instance in marketing copy (site, deks, headings, publications); classify as
`banned-form`.

- **Interrogative-word fragments.** A free-relative clause opening with *any*
  interrogative word — *what*, *where*, *when*, *how*, *why*, *who*, *which*,
  *whose* — punctuated as a standalone declarative sentence: "What measurement is
  worth." "What it measures." "Where the model fits." "Where it breaks down."
  "When measurement pays off." "How a wrong score happens." "How the score holds
  up." "Why the number moves." "Who checks the checker." "Which model wins." A
  cold reader starts parsing a question and hits a period — the sentence
  garden-paths, and the form is a stock AI-marketing kicker besides. Common in
  headings, where it costs the most (L0/L1). The fix is not to prepend "Here
  is…"; state the content directly ("Measurement pays for itself when…", "It
  measures the experience the model ships.", "The model fits the pipeline at code
  review.", "A wrong score starts in one of four places.") or, rarely, use a real
  question the next sentence answers.
  **In a section heading the ban is absolute: a heading may never open with an
  interrogative word, fragment or complete sentence.** Headings are skim surfaces
  read out of order, so even a well-formed "What matters is the coverage"
  garden-paths on first scan and reads as the stock AI kicker; rewrite so the
  first word is not one of these ("Coverage is what matters."). (A genuine yes/no
  question opening with an auxiliary — "Can the model tell?" — is outside this
  list and allowed.) (Humanizer §35 is the same rule on the clean axis.)

## Defect classes (locked vocabulary)

Classify each finding. Don't invent classes; use `other` + explanation if nothing fits.

| Class | What it is | Example |
|---|---|---|
| `banned-form` | a sentence shape on the banned-forms list above | "What measurement is worth." as a standalone sentence/heading |
| `unestablished-referent` | a definite reference / term used before it's introduced | "the disagreement" with no disagreement mentioned yet |
| `resolves-too-late` | resolves, but below its appearance level | a coined term defined in §3 but first used in the dek |
| `unearned-claim` | an adjective/claim the body never develops | "good benchmarks" in a coverage piece |
| `unmotivated-move` | a logical step with no stated reason the reader can follow | "but without a map, every result competes" (why do they compete?) |
| `ambiguous-referent` | resolvable to more than one thing; readers' glosses diverge | "it" with two candidate antecedents |
| `contribution-unclear` | reader can't state what the piece is / does from L0 or L1 | dek that lists topics but no thesis |
| `other` | anything real that doesn't fit | + explanation |

## Severity

- `blocker` — an L0/L1 defect, or a body defect on the central claim. Fix before publish.
- `fix` — a real defect deeper in the body. Fix before publish.
- `watch` — a lone-reader stumble, or a minor L2 ambiguity. Author's judgment.

## What this gate does NOT check

Slop (run humanizer first), factual accuracy (separate fact-check pass), and the
strength of the idea or the section architecture (separate structural review). A
piece can pass clarity and still be boring, wrong, or badly structured. Clarity is
necessary, not sufficient.
