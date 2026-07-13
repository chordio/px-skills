# PRFAQ: PX Skills

> **About this document.** This is a working-backwards PRFAQ, a convention borrowed from Amazon: you write the press release and FAQ before the work, and the document becomes the test of whether the idea deserves to exist. It was written on July 10, 2026, before the launch it describes, so the September 2026 dateline on the press release is aspirational. Where this document and the repository it describes disagree, this document is the plan. Internal FAQs normally stay private; this one is public because the decisions in it are part of what the project teaches. The launch also adds this exact practice to the project's pipeline as a new skill, `prfaq`: write the announcement before the work, to find out whether the idea survives being explained. This document is that step, performed by hand on the project itself.

## Press release

**PX Skills: an open-source product-experience pipeline that takes an idea from one paragraph to shipped UI, one artifact at a time**

*Ten MIT-licensed core skills for Claude Code, Anthropic's coding agent. Every step writes one artifact, a plain file that tells you what comes next; if you get lost, `next-step` reads your workspace and points at the one thing to do.*

**github.com/chordio/px-skills — September 2026.** PX Skills, ten core skills for Claude Code plus three companions, is now public under the MIT license. The pipeline takes a software product from a one-paragraph idea to research briefs, product specs, design specs, and shipped UI, and saves every step of the product thinking as plain files in your project. Chordio maintains the bundle. There are no accounts, no telemetry, and no API keys, and installation is one script.

Coding agents made building fast and left process behind. A builder can stand up a working app in an afternoon, then reopen it a week later unable to answer basic questions: why does this feature exist, what did we decide about onboarding, where was I? Chat history doesn't answer them; it captures what was said, not what was decided. So each session re-derives decisions from scratch, and with nothing recorded about how the product should look, the UI drifts toward the same generic layout every agent produces.

PX Skills treats files, not conversations, as the unit of progress. Each skill reads the files earlier steps wrote (the pipeline calls them artifacts) and writes exactly one of its own: research produces `research-brief.md`; architecture produces `product-brief.md` and a feature list; each feature gets a product spec, then a design spec; and a `design-context/` folder, written once per product, records the visual system every design spec reads. You don't need to remember the skill names; remember the artifacts. And when you forget those too, run `next-step`: it scans the workspace, sees which artifacts exist, and names the one next thing to run.

Two gate skills bracket the pipeline. Before anything gets built, `vet-idea` asks whether the thing should exist at all, and `prfaq` makes the idea prove itself in writing: a one-page press release and FAQ like this one, drafted before implementation, to show the idea is clear enough to explain and worth explaining. After the product ships, `social-post-designer` (from the companion px-marketing-skills bundle) turns that same announcement into real launch content. You write the announcement before the code to decide what to build, then reuse it after shipping to tell the world.

The bundle also includes:

- a review panel of 26 digital twins (clearly labeled simulations of public design thinkers, built from their published writing) that critique a design from several perspectives at once
- curated taste references for typography, color, spacing, and motion (a snapshot originally from the pbakaus/impeccable project, evolved in this repo), which every design skill loads as its definition of good
- `reference-ux`, which reverse-engineers how a live product solves a UX problem, and `clarity-review`, which tests whether a piece of writing survives a reader with no context (used on this document)
- an eval harness that runs the same task with and without a skill, so "the skills help" stays a measurable claim
- pointers to two optional peers, each installed from its own source: gstack, used to pressure-test ideas at the start of definition and for QA, visual review, and shipping at the end; and blader/humanizer, which strips AI-writing tells from copy, with our own rules layered on in a separate house-rules file (also used on this document)

"Coding agents made it cheap to build things that should never have been built," said Ehud Halberstam, founder of Chordio and the project's maintainer. "Half of this pipeline's value is what it stops you from building. When `vet-idea` deletes an idea, that's a successful run. And the announcement you write before the code is the cheapest prototype there is."

"I used to lose the thread between sessions," says an imagined builder, the person this project is for; the document predates its launch, so the quote is a goal rather than a testimonial. "Now the folder is the memory. I open the project, run `next-step`, and it tells me the onboarding spec exists but the design context doesn't."

PX Skills is available at [github.com/chordio/px-skills](https://github.com/chordio/px-skills). Installation is a clone and a script: `git clone https://github.com/chordio/px-skills ~/.px-skills && cd ~/.px-skills && bash install.sh`. Updating is `git pull`. It requires Claude Code and nothing else: no accounts, no API keys, and the installer's entire footprint is symlinks plus one documented block in your CLAUDE.md. To start, put a one-paragraph idea in an empty folder and run `next-step`.

## External FAQ

### Why not just prompt Claude directly?

You can; that's the baseline the eval harness compares against. What the skills add is persistence and sequence: decisions land in files, so the next session starts from artifacts instead of your memory of old chats. And because ideas pass through vetting, research, and spec stages before build, mushy thinking gets caught where it's cheap to fix.

### Is this just a folder of markdown files?

Mostly, and deliberately. The markdown is the program and Claude is the runtime; the exceptions are the installer, two small scripts in design-reviewer (screenshots and checks), a text slicer in clarity-review, and the eval dashboard. Judge it by whether the instructions change the output. That's the question `evals/` exists to answer.

### Why impose a pipeline when models keep getting smarter?

Because the pipeline is information architecture. A smarter model still can't recall a decision nobody wrote down, and it can't know your product's visual system unless something records it. The pipeline also isn't rigid: single features enter at the spec step, and every skill runs standalone.

### This much ceremony for a login form?

The full pipeline is for products, not patches. Single-feature work starts at the spec step, and a scope guard bounces initiative-sized requests back up to the architecture step. Most skills earn their keep standalone: you can run `review-panel` on a mockup or `clarity-review` on a README without touching the pipeline.

### Does it only work with Claude Code?

Claude Code is the built-and-tested path. But the skill format itself, a folder with a SKILL.md, has become an open convention that Gemini CLI, OpenAI Codex, Cursor, GitHub Copilot, and others read, so most of the porting cost is the installer's target paths, not the skills; multi-client install is on the launch checklist. The artifacts are plain files with no client coupling at all; the process, and everything it wrote, comes along for free.

### How is this different from an awesome-list, or from anthropics/skills?

Those are collections of independent items. This is a system: the skills are wired together by the files they read and write, and `next-step` knows the wiring. The taste references and the twins are shared infrastructure that other skills load.

### What does it cost, and which keys do I need?

The repo is free under MIT; you pay for your own Claude usage. There are no accounts, no server, no telemetry, and no API keys anywhere in the bundle. (AI image generation lives in the separate px-marketing-skills bundle and brings its own keys.)

### Won't all this context burn tokens?

Skills load references on demand rather than wholesale, artifacts are compact by design (a spec, not a transcript), and heavy work like panel reviews fans out to sub-agents. Weigh it against the alternative: re-explaining your product to the agent at the start of every session.

### Where's the evidence the skills produce better output?

The repo ships an eval harness that runs the same task with and without a skill and scores both against per-skill rubrics. Some rubrics are implemented; others are labeled as coming soon. The repo claims no performance numbers anywhere, on purpose. Run the comparisons and read the transcripts yourself.

### What's original here and what's borrowed?

Borrowed, and credited in `NOTICE.md` beside it: the design-taste references began as copies from pbakaus/impeccable (Apache-2.0, pinned to the commit they were taken at) and are evolved in this repo, since upstream has restructured its reference set. That's the whole borrow; the doctrine is *vendor data, never behavior*. The tools we compose with (gstack, humanizer) are peers you install from their own sources; our humanizer additions live in a separate house-rules file, not a fork. Original: the pipeline and its artifact contracts, `next-step`, `vet-idea`, `prfaq`, `clarity-review`, the 26 twins, and the eval harness.

### The review panel simulates real, named people. Is that okay?

The twins are labeled simulations distilled from each person's public writing and talks. Read a twin as "what their published thinking suggests," never as their words; none of the 26 people are affiliated with this project or endorse it. Anyone simulated can ask to be removed, and the contribution guidelines commit to honoring that.

### What happens when Anthropic changes the skill format?

Not much. The coupling is thin (frontmatter plus markdown instructions), so a format change means re-adapting text, not rebuilding a system; there is no runtime to break. The artifacts your projects accumulated are format-independent and remain yours.

## Internal FAQ

*The convention is to keep this section private. It's public here because these decisions are part of what the project teaches.*

### Is this a Chordio product or a community project?

A community project that Chordio maintains. The repo is "PX Skills" (product experience: the layer the pipeline actually covers, wider than design and narrower than everything), the license is MIT, and the commercial story stays on chordio.com. The name deliberately doesn't lean on "Claude" (it's descriptive of the skills' host, not ours to brand with) or on "Chordio" (merging the two would damage both: the repo would read as marketing, and the company would read as a folder of markdown).

### Where does the `prfaq` skill sit in the pipeline?

After the idea phase and before any implementation. An idea first survives `vet-idea` (should this exist?) and concept research (what's out there?); then it has to prove itself in announcement form. If the press release is mushy or an FAQ answer embarrasses you, the idea isn't ready to spec. This is the last cheap moment to learn that.

### What happens to `social-post-designer`?

Two things. It moves out of this repo entirely, into the companion px-marketing-skills bundle along with hero-builder, landing-page-builder, and image-generator, so the core stays ten focused skills with no API keys. And it moves to the other end of the pipeline: the announce stage after shipping, where it turns the product's PRFAQ and design context into real launch content. We considered rewriting it as the early clarity tool and decided against it; its competence is post-ship content (hooks, platform formats, visual prompts). The early slot belongs to the smaller `prfaq` skill, which can borrow it to draft mock launch posts when the press release alone isn't a sharp enough test.

### Where does the working-backwards pattern come from?

PRDkit, an earlier tool by the maintainer, modeled a product requirement as carrying announcement-shaped artifacts: a PRFAQ, mock social posts, even simulated user reviews, generated before implementation to test whether a feature was sharp enough to announce. The `prfaq` skill ports that pattern into this pipeline. This document is the same pattern applied to the repo itself.

### What gets cut before launch?

The internal homepage copy (`homepage-copy.md`), which contains placeholder metrics and invented testimonials that have no place in a public repo; a stray committed database file; and the marketing-surface skills (hero-builder, landing-page-builder, social-post-designer, image-generator), which move to their own bundle. Also cut, structurally: the gstack bridge hook, the humanizer fork, and every stale cross-reference they carried. Not cut: the twins and the eval dashboard. Those get a disclaimer and honest labeling, respectively.

### Are the real-person twins a launch risk?

A managed one. The mitigations: a disclaimer where the panel runs, a removal-on-request policy in the contribution guidelines, and twins grounded in cited public sources. Deleting them would remove the most distinctive thing in the repo to avoid a risk that a policy handles.

### What's the maintenance commitment?

One maintainer, best effort, stated plainly. Issues get triaged; the taste snapshot evolves in-repo; peers (gstack, humanizer) update themselves from their own sources. PRs are welcome for twins, additions to the taste references, and fixes; new skills and pipeline changes start as an issue. The failure mode to avoid is implying support that doesn't exist.

### What's the relationship to gstack?

Companion, not a dependency, and the coupling is declarative only. gstack is a separate open-source bundle covering QA, browsing, and ship workflows. Nothing patches anything: when the pipeline hands off to a gstack skill, `next-step` and the CLAUDE.md block tell it to read `design-context/` and the taste references first, in plain instructions you can read. (An earlier version of this repo patched gstack's skill files via a SessionStart hook; we deleted that machinery once we noticed its entire payload was one paragraph of context, which the block now carries.) The pipeline's QA and ship steps name gstack commands because those are the versions we use; any review-and-ship process fits there.

### Why MIT?

The goal is adoption and credibility. If a moat exists anywhere, it's in using the process well, not in the text of the process. One constraint keeps the story clean: the taste snapshot keeps its Apache-2.0 NOTICE and pinned origin commit. Everything else in the repo is authored here, and the tools we compose with are peers installed from their own sources. The licensing has to be spotless for the rest of the repo's honesty to be credible.

### Do the evals block the launch?

No, but honesty about them does. "We prove they work" becomes "we measure them"; rubrics that aren't implemented stay visibly labeled; the eval app gets a README so an outsider can reproduce a run. An aspirational dashboard labeled as such is fine. One implied to be complete is not.

### What does success look like a year in?

There's no telemetry, so proxies: strangers filing install issues (evidence of real installs), outside contributors adding twins or improving the taste references, launch posts that survive the repo's own humanizer and clarity-review, zero licensing or likeness complaints. And a soft test: the maintainer links this repo from his resume without hedging.

## Launch checklist

What still has to change between this document and the launch it describes. (Already done at the time of the latest revision: the `prfaq` skill exists; the bridge is deleted and the installer's footprint is symlinks plus one block; humanizer is a peer, not a fork; the marketing skills are extracted; the README carries this positioning.)

1. Name the copyright holder in the top-level `LICENSE`; add the twins disclaimer and removal-on-request policy.
2. Community scaffolding: `CONTRIBUTING.md`, issue templates, and CI that lints the installer, the skill frontmatter, and links.
3. Evals honesty pass: relabel claims, mark unimplemented rubrics, document how to reproduce a run, and update the app's old branding.
4. Untrack the stray eval database file.
5. Publish the px-marketing-skills bundle from the extracted skills (hero-builder, landing-page-builder, social-post-designer, image-generator).
6. Rename the GitHub repo to `px-skills` (old links redirect).
7. Multi-client support: teach the installer a per-client table (skills directory + `AGENTS.md`-family memory file) for Gemini CLI, Codex, Cursor, and Copilot; add a sequential fallback to `review-panel`; claim each client in the README only after a smoke test on it.
8. Launch collateral: `social-post-designer` (px-marketing-skills) turns this PRFAQ into announcement posts, which then pass through the humanizer peer (with our house rules) and `clarity-review`.

---

*This PRFAQ is the first artifact of the launch it announces. It was edited with the humanizer peer skill (plus this repo's house rules) and the repo's own `clarity-review`.*
