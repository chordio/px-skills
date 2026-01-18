---
name: social-post-designer
description: Create high-converting social media posts across multiple formats (text-only, image, carousel, video) using proven copywriting techniques and AI-generated visuals. Accepts minimal input (e.g., product/feature description) or detailed briefs. Generates compelling copy with headlines, hooks, and CTAs optimized for social engagement. Creates detailed prompts for image generators (nano-banana) and video generators (Veo) with brand-aligned visual specifications. Use when users need: (1) Social media content creation from product/feature descriptions, (2) Post copywriting with conversion optimization, (3) Visual content strategy and AI generation prompts, (4) Multi-format social campaigns, (5) Brand-consistent social media assets.
---

# Social Post Designer

Create high-converting social media posts that combine proven copywriting techniques with AI-generated visuals. This skill generates complete post packages including copy, visual specifications, and generation prompts for multiple social media formats.

## Core Principles

### Social-First Copywriting

Social media posts require different copywriting approaches than landing pages:
- **Hook-driven**: First 3 words must stop the scroll
- **Visual-text synergy**: Copy and visuals work together, not independently
- **Platform-native**: Adapts to each platform's culture and constraints
- **Engagement-focused**: Designed for comments, shares, and saves
- **Mobile-optimized**: Readable and impactful on small screens

### Visual-Text Integration

For media posts, copy and visuals must be planned together:
- Copy should reference or complement the visual
- Visuals should amplify the message, not just decorate
- Both elements should work independently but stronger together

## Input Examples

Users can provide input in various formats:

### Minimal Input (Most Common)
```
"Create 3 social posts for our new feature: AI-powered email scheduling 
that learns your team's communication patterns"
```
**Response**: Generate posts, infer audience/platform, ask 1-2 clarifying questions if needed.

### Detailed Input
```
"Create LinkedIn and Instagram posts for our new feature launch:
- Feature: AI email scheduling
- Audience: Busy executives and managers
- Goal: Drive signups for free trial
- Tone: Professional but approachable
- Platforms: LinkedIn (professional), Instagram (visual showcase)"
```
**Response**: Use all provided context, generate comprehensive post packages.

### With Visual Assets
```
"Create an Instagram carousel post for our new dashboard feature. 
Here's a screenshot of the UI: [image]"
```
**Response**: Generate copy + detailed image generation prompts using the screenshot as reference.

### Multiple Formats Request
```
"Create posts for our product update announcement:
- 1 text-only post for Twitter
- 1 image post for LinkedIn  
- 1 carousel for Instagram
- 1 video post for TikTok"
```
**Response**: Generate all requested formats with platform-optimized copy and visual prompts.

## Post Format Types

This skill supports four post formats:

1. **Text-Only Posts**: Pure copy, optimized for engagement
2. **Image Posts**: Single image with caption
3. **Image Carousel Posts**: Multiple images with unified narrative
4. **Video Posts**: Short-form video with caption

See `references/post-formats.md` for detailed specifications for each format.

## Workflow

### Step 1: Gather Context

**User Input Flexibility**: Users can start with minimal input (e.g., "Create posts for our new feature: [description]") or provide comprehensive context. Adapt to what's provided.

**Ideal Context** (gather what's available, infer or ask for the rest):

1. **Product/Feature Description**: Core message, key benefits, what it does
2. **Objective**: What's the goal? (Awareness, engagement, conversion, education) - *infer if not provided*
3. **Audience**: Who are we speaking to? (Demographics, pain points, desires) - *infer from product if not provided*
4. **Platform**: Which platform(s) will this run on? - *ask if not specified, suggest based on content type*
5. **Brand Voice**: Tone, style, and personality guidelines - *infer from product/company if not provided*
6. **Visual Assets** (if available): Product screenshots, brand assets, reference images - *always request for media posts*

**When user provides just a product/feature description:**
- Extract key benefits and value propositions
- Infer likely audience from product type
- Suggest appropriate platforms based on content
- Ask 1-2 clarifying questions if critical context is missing (e.g., "Is this for existing customers or new prospects?")
- Proceed with best assumptions, noting what was inferred

### Step 2: Select Post Format

Choose format based on:
- **Text-only**: Quick tips, quotes, questions, announcements
- **Image**: Product showcases, infographics, behind-the-scenes
- **Carousel**: Step-by-step guides, multiple features, storytelling sequences
- **Video**: Demonstrations, tutorials, testimonials, dynamic content

### Step 3: Craft Copy

Apply social-specific copywriting techniques from `references/social-copywriting.md`:
- Hook formulas optimized for social feeds
- Platform-specific best practices
- Engagement-driving elements
- Clear CTAs

Also reference `../landing-page-critique/references/copywriting-techniques.md` for:
- Headline formulas
- Power words
- Storytelling frameworks
- Persuasion techniques

### Step 4: Generate Visual Specifications (Media Posts Only)

For image and carousel posts:
- Create detailed image generation prompts using nano-banana best practices
- See `references/image-generation-prompts.md` for prompt structure and examples
- Request user's visual assets as reference for brand consistency

For video posts:
- Create structured video generation prompts for Veo or similar AI video generators
- See `references/video-generation-prompts.md` for prompt structure and examples
- Specify start/end images if needed for consistency

### Step 4b: Generate Images (Optional)

If the user wants images generated (not just prompts), spawn a sub-agent to generate images in parallel while continuing with copy refinement:

```
Generate social post images using the image-generator skill. Create:

1. [post-name]-[platform].webp ([dimensions]) - [detailed prompt from Step 4]
2. [carousel-slide-1].webp ([dimensions]) - [detailed prompt]
...

Save to /social-posts/images/
Report back the list of generated files when complete.
```

If sub-agent spawning is unavailable, generate images sequentially before proceeding.

### Step 5: Deliver Complete Package

Provide:
- **Final Copy**: Platform-ready post text with hashtags (if applicable)
- **Visual Prompt**: Detailed generation prompt for AI tools
- **Specifications**: Dimensions, style notes, brand alignment requirements
- **Usage Notes**: Platform-specific recommendations

## Copywriting Techniques

### Social-Specific Hooks

Social feeds require immediate attention. Use hooks from `references/social-copywriting.md`:
- Question hooks that create curiosity
- Number hooks that promise value
- Story hooks that create connection
- Controversy hooks (ethical) that spark discussion

### Engagement Drivers

Every post should include:
- **Hook**: First line that stops scrolling
- **Value**: Clear benefit or insight
- **Proof**: Social proof, data, or credibility
- **CTA**: Specific action (comment, share, save, click)

### Platform Optimization

Adapt copy for platform culture:
- **LinkedIn**: Professional, value-driven, thought leadership
- **Twitter/X**: Concise, timely, conversational
- **Instagram**: Visual-first, aspirational, authentic
- **TikTok**: Trend-aware, entertaining, relatable
- **Facebook**: Community-focused, shareable, informative

## Visual Generation

### Image Generation (nano-banana)

When creating image generation prompts:
- Be hyper-specific about subject, setting, style, composition, lighting
- Reference user's brand assets for color, style, and mood consistency
- Specify dimensions based on platform requirements
- Include negative prompts to avoid unwanted elements

See `references/image-generation-prompts.md` for:
- Prompt structure and best practices
- Style specification techniques
- Brand alignment strategies
- Example prompts for different post types

**Critical**: Always ask users to provide visual assets (product screenshots, brand colors, reference images) to ensure generated visuals are on-brand and use actual product footage when relevant (e.g., SaaS product UI).

### Video Generation (Veo)

When creating video generation prompts:
- Structure prompts with scene description, cinematography, action, and duration
- Specify start and/or end images for consistency
- Define camera movements and transitions
- Include audio description if relevant

See `references/video-generation-prompts.md` for:
- Prompt structure and best practices
- Start/end image specifications
- Cinematography techniques
- Example prompts for different video types

**Critical**: Request user's visual assets as reference images to ensure brand consistency and accurate product representation.

## Output Format

For each post, provide:

```
## Post Format: [Text/Image/Carousel/Video]

### Copy
[Complete post text with formatting]

### Visual Specifications (if applicable)
**Dimensions**: [Platform-specific dimensions]
**Style**: [Visual style description]
**Brand Alignment**: [How it matches brand]

### Generation Prompt
[Detailed prompt for AI image/video generator]

### Platform Recommendations
- [Platform]: [Specific notes]
- [Platform]: [Specific notes]

### Engagement Strategy
- Hook type: [Type and why it works]
- CTA: [Call-to-action and placement]
- Engagement drivers: [What will make people interact]
```

## Best Practices

### Copywriting
- Lead with the hook, not the brand name
- Use "you" language, not "we" language
- Include specific numbers and details
- End with clear, specific CTAs
- Test different hook variations

### Visuals
- Ensure visuals add value, not just decoration
- Maintain brand consistency across all visuals
- Use actual product imagery when possible
- Optimize for mobile viewing
- Consider accessibility (alt text, contrast)

### Multi-Format Campaigns
- Create variations for different formats
- Maintain message consistency across formats
- Adapt visuals for each format's strengths
- Test which format performs best

## References

- **Post Formats**: `references/post-formats.md` - Detailed specifications for each format type
- **Social Copywriting**: `references/social-copywriting.md` - Social-specific copywriting techniques
- **Image Generation**: `references/image-generation-prompts.md` - nano-banana prompt best practices
- **Video Generation**: `references/video-generation-prompts.md` - Veo prompt best practices
- **Copywriting Techniques**: `../landing-page-critique/references/copywriting-techniques.md` - Core copywriting principles
