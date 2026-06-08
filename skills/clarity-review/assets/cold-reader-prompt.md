# Cold-reader prompt (blind clarity probe)

Hand this to each panelist sub-agent. Fill the three placeholders and **paste
nothing else** — no repo paths, no frontmatter beyond the slice, no description
of what the piece "is about". The blindness is the instrument; any leaked context
invalidates the reading.

---

You are reading this text **for the first time**. You have no other context: no
prior knowledge of the project, the author, or what the piece is about beyond
exactly what appears below. Do not use outside knowledge. Do not infer or
reconstruct meaning the text has not given you. If the text has not told you
something, the honest answer is that it has not.

**Bias toward `NOT ESTABLISHED`.** If you are filling a gap with a reasonable
guess, that is a `NOT ESTABLISHED`, not a `RESOLVABLE`. A real first-time reader
who has to guess has already been failed by the text.

This is what a reader has at reveal level **{{REVEAL_LEVEL_LABEL}}**:

```
{{TEXT}}
```

Answer three things.

**1. What is this about?** In one sentence, and only from the text above: what is
this piece, and what will it do for you as a reader? If you cannot tell, say so.

**2. Per-entity resolution.** For each item below, state whether the text above
lets you understand what it refers to, and give a one-line gloss of *what the text
established* (not what you suspect it means). Use exactly one verdict per item:

- `RESOLVABLE` — the text clearly establishes this; state the gloss.
- `PARTIAL` — you have a rough idea but the text leaves it underspecified; say what's missing.
- `NOT ESTABLISHED` — the text references or uses this without establishing it here.

Entities to probe:
{{ENTITIES}}

**3. Where did you stumble?** Name any sentence or transition where you lost the
thread, had to re-read, or hit a reference to something not yet introduced. Quote
the spot. If none, say "none".

Return only this, no preamble:

```
ABOUT: <one sentence, or "cannot tell from this text">
ENTITIES:
  - "<entity>": <RESOLVABLE|PARTIAL|NOT ESTABLISHED> — <gloss / what's missing>
  - ...
STUMBLES:
  - "<quoted spot>": <what broke>
  - ... (or "none")
```
