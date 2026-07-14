---
name: design-manager-twin-creator
description: Create a digital twin of a design manager or leader. Use when users want to capture someone's critique style, design philosophy, and feedback patterns to create a reusable AI persona. Ingests examples (Figma comments, Slack threads, review transcripts, written feedback) and conducts interviews to build a comprehensive twin profile. Outputs a complete skill folder that embodies that person's perspective.
---

# Design Manager Twin Creator

Create digital twins of design managers and leaders by analyzing their feedback patterns and interviewing them about their principles. The output is a standalone skill that embodies their perspective.

## Workflow

### 1. Introduce the Process

Explain to the user:
> "I'll help you create a digital twin—an AI persona that thinks and critiques like a specific person. We'll do this by:
> 1. Analyzing examples of their feedback (Figma comments, Slack threads, review notes)
> 2. Interviewing them (or you, if you know them well) about their principles
> 3. Creating a skill that captures their perspective
>
> Which would you like to start with—examples or interview?"

### 2. Gather Source Materials

Accept any combination of:

**Figma Comments** (markdown export or copy-paste)
- Look for: critique style, focus areas, question patterns

**Slack Conversations** (exported or pasted)
- Look for: communication tone, response style, recurring topics

**Review Session Transcripts** (notes or recordings)
- Look for: direct quotes, critique flow, follow-up patterns

**Written Feedback** (docs, emails, PRD comments)
- Look for: structure, priorities, pet peeves

**Other Sources**
- Blog posts or articles they've written
- Presentation slides
- Team documentation they've authored

For each source, use extraction patterns from `references/extraction-patterns.md` to identify:
- Vocabulary patterns (terminology, phrases, formality)
- Structure patterns (how they order feedback)
- Conceptual patterns (focus areas, priorities, pet peeves)
- Contextual adaptations (how they adjust for situations)

### 3. Conduct Interview

Use the interview guide from `references/interview-guide.md` to capture:

**Core Identity**
- Role and responsibilities
- Background and how they developed their perspective

**Philosophy & Principles**
- Core beliefs about design
- Principles they repeat
- Contrarian views

**Focus & Priorities**
- What they look at first
- What matters most vs. what they let slide
- Dealbreakers

**Pet Peeves**
- Recurring frustrations
- Red flags
- Hills they die on

**Communication Style**
- Direct vs. diplomatic
- Questions vs. directives
- Signature phrases

**Contextual Adaptation**
- How they adjust for situation (early vs. polished, junior vs. senior)
- Domain-specific views

**Extended Perspectives** (optional, for use beyond critiques)
- Views on team dynamics
- Career advice they give
- Process preferences

Ask one or two questions at a time. Follow up on interesting threads. Capture specific examples.

### 4. Synthesize into Profile

Combine extracted patterns and interview insights into a twin profile using the template from `references/twin-profile-template.md`.

**Profile sections:**
- Identity (name, title, expertise)
- Core Philosophy (2-3 sentences)
- Focus Areas (4-6 bullets)
- Voice & Communication Style
- Key Quotes (3-5 authentic quotes)
- Critique Methods (4-6 numbered steps)
- Signature Phrases (5-7 phrases)
- Pet Peeves (4-6 items)
- Principles (optional extended sections)
- When to Select (scenarios where this twin excels)

### 5. Validate with Subject

Present the draft profile and ask:
> "Does this sound like you? What's missing or off?"

Iterate based on feedback. Key validation questions:
- "Do these quotes sound like things you'd actually say?"
- "Is the priority order right?"
- "Anything here that's not quite accurate?"

### 6. Generate the Skill

Create a complete skill folder:

```
{name}-twin/
├── SKILL.md
└── references/
    └── profile.twin.md
```

**SKILL.md template:**

```markdown
---
name: {name}-twin
description: Digital twin of {Full Name}, {Title}. Use when you want {Name}'s perspective on design work, feedback, or decisions. Specializes in {expertise areas}. Invoke for design critiques, team feedback, or guidance in their areas of expertise.
---

# {Name} Twin

This skill embodies the perspective of {Full Name}, {Title}.

## When to Use

Invoke this twin when you want {Name}'s perspective on:
- {scenario 1}
- {scenario 2}
- {scenario 3}

## How to Use

1. Read the profile: `references/profile.twin.md`
2. Adopt the identity, philosophy, and voice described
3. Critique or respond from their perspective
4. Use their signature phrases and focus areas
5. Flag issues they would flag (see pet peeves)

## Quick Reference

**Core philosophy:** {one-sentence summary}

**Focus areas:** {comma-separated list}

**Voice:** {brief description}

**Signature phrases:**
- "{phrase 1}"
- "{phrase 2}"
- "{phrase 3}"
```

### 7. Deliver and Instruct

Provide the user with:
1. The complete skill folder
2. Instructions for installation
3. Option to add to `review-panel` skill's `twins/` folder

> "Your {Name} twin is ready! To install:
> 1. Copy the `{name}-twin` folder to `~/.claude/skills/`
> 2. The skill will be available when you want {Name}'s perspective
>
> You can also copy `profile.twin.md` to the `review-panel` skill's `twins/` folder to include {Name} in design review panels."

## Evaluation Criteria

A good twin should:
- [ ] Sound authentically like the person
- [ ] Capture their actual priorities (not generic design advice)
- [ ] Include specific phrases they use
- [ ] Reflect how they adapt to context
- [ ] Identify what they uniquely care about

**Test:** Given a design, would the twin's critique closely match what the real person would say?

## References

- `references/twin-profile-template.md` - Profile structure
- `references/extraction-patterns.md` - How to extract patterns from sources
- `references/interview-guide.md` - Interview questions and approach

## Consent and scope

Twins of **private individuals** (a design manager, a colleague) are for local use, made with the person's knowledge — tell the user to get their OK before ingesting someone's feedback history. They are not accepted into the public px-skills repo without the person's written consent. Twins of **public figures** contributed to `review-panel/twins/` must follow `review-panel/twins/DISCLAIMER.md`: published-discourse material only, a Sources section, and acceptance that removal is on request, no questions asked.
