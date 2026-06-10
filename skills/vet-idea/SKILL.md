---
name: vet-idea
version: 1.0.0
description: |
  Pressure-test a business, product, feature, requirement, or process step using
  Elon Musk's five-step first-principles algorithm — in strict order: question the
  requirements, try to delete it, optimize/simplify, speed it up, automate. The
  order is the whole point: you never optimize, speed up, or automate something
  before trying to delete it, because "the most common mistake of smart engineers
  is to optimize a thing that should not exist." Use when the user is vetting or
  brainstorming a business or product idea, scoping a new feature, reviewing a spec
  or requirement, or whenever something is about to be built, optimized, or
  automated and nobody has asked whether it should exist at all. Trigger on "vet
  this idea", "should we build", "first principles", "question the requirements",
  "Elon's algorithm", "delete before optimizing", "make the requirements less dumb".
license: MIT
compatibility: claude-code opencode
allowed-tools:
  - Read
  - Grep
  - Glob
  - AskUserQuestion
---

# Vet Idea — Elon's First-Principles Algorithm

Pressure-test whatever the user is about to build, optimize, or automate by running it through Musk's five-step algorithm. Apply this to a whole product idea, a single feature, a requirement, or a process step — anything that is about to consume effort.

> "The most common mistake of smart engineers is to optimize a thing that should not exist."

## When to use

- The user is vetting or brainstorming a business or product idea.
- A feature, requirement, or process step is about to be built, optimized, or automated and nobody has asked whether it should exist.
- A spec or roadmap "feels bloated" and you need a disciplined way to cut.
- The user explicitly invokes first-principles thinking or "Elon's algorithm."

This skill is the upstream gut-check that runs *before* research and design. If the idea survives, hand off to `product-researcher` (validation + landscape) and `product-architect` (decomposition). If a step gets deleted here, you save all of that downstream work.

## Why the order matters — non-negotiable

Run the steps strictly in order. Musk codified the order because he kept doing the expensive steps first and paying for it:

> "I've gone backwards so many times where I've automated something, sped it up, simplified it, and then deleted it. I got tired of doing that. So that's why I have this mantra."

Never jump ahead. Do not optimize, speed up, or automate anything until you have tried to delete it. Optimizing, accelerating, or automating a thing that should not exist is pure waste, and it is the default failure mode of capable people.

## The five steps

Walk the user through each step in turn. Be concrete: name the actual requirements, parts, and steps in *their* idea — do not lecture in the abstract.

**Step 1 — Question the requirements.**
> "Make the requirements less dumb. The requirements are always dumb to some degree, no matter how smart the person who gave you those requirements. You have to start there, because otherwise you could get the perfect answer to the wrong question."

For each requirement, ask: who gave it, and why? A requirement should come with a name attached, not "the system" or "best practice" — a requirement from a department is far less reliable than one from a named person you can question. Treat every requirement as guilty until proven necessary. Surface the dumbest-looking ones first.

**Step 2 — Try to delete it.**
> "Try to delete the part or the process step entirely. If you're not forced to put back at least 10% of what you delete, you're not deleting enough. Most people feel like they've succeeded if they haven't been forced to put things back in. But actually they haven't, they've been overly conservative and left things in that shouldn't be there."

Go through the parts/features/steps and try to remove each one. The success metric is *inverted*: if you are never forced to add something back, you did not cut hard enough. Aim to delete enough that you have to restore at least ~10%. List what you would delete, then note which deletions you'd expect to reverse and why.

**Step 3 — Optimize or simplify.**
> "The most common mistake of smart engineers is to optimize a thing that should not exist. So you don't optimize until after you've tried to delete."

Only now — on what survived deletion — look for simplification and optimization. If you skipped Step 2, stop and go back.

**Step 4 — Speed it up.**
> "Any given thing can be done faster than you think. But you shouldn't speed things up until you've tried to delete it and optimize it — otherwise, you're speeding up something that shouldn't exist."

Accelerate the simplified thing. Assume it can be faster than the user thinks.

**Step 5 — Automate.**
> "And then the fifth thing is to automate it."

Automate last, once the thing has been questioned, cut, simplified, and sped up. Automating first locks in waste.

## How to deliver it

- Run the steps in order, out loud, against the user's specific idea. Don't just recite the framework.
- At Step 2, push hard enough to be uncomfortable, then report the ~10% you expect to restore — that is the evidence you cut deep enough.
- If the user resists deleting something, ask for the named person and concrete reason behind that requirement (Step 1). "We've always done it" is not a reason.
- End with a short verdict: what should not exist (delete), what survives and in what simplified form, and only then what to optimize / speed up / automate. If the whole idea fails Step 1 or 2, say so plainly — a deleted idea is a successful run of this skill.
