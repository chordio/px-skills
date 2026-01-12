# Image Generation Prompts for nano-banana

Best practices and examples for creating effective image generation prompts using nano-banana or similar AI image generators for social media posts.

## Prompt Structure

Effective prompts follow a structured format that provides maximum specificity:

```
[Subject] + [Setting/Environment] + [Style/Aesthetic] + [Composition] + [Lighting] + [Color Palette] + [Technical Specifications] + [Negative Prompts]
```

## Core Components

### 1. Subject (What)
Be hyper-specific about the main subject:
- **Product**: Exact product name, model, or type
- **Person**: Demographics, expression, pose, clothing
- **Scene**: Specific location, environment, context
- **Action**: What's happening, movement, interaction

**Examples:**
- "Modern SaaS dashboard interface on a MacBook Pro screen"
- "Professional woman in business casual, confident smile, holding tablet"
- "Minimalist workspace with laptop, notebook, and coffee cup"
- "Close-up of hands typing on mechanical keyboard"

### 2. Setting/Environment (Where)
Define the context and background:
- **Location**: Office, home, outdoor, abstract
- **Atmosphere**: Clean, cluttered, minimalist, cozy
- **Background**: Solid color, gradient, texture, blurred
- **Depth**: Foreground, midground, background elements

**Examples:**
- "Clean white desk in modern office, natural light from large window"
- "Abstract gradient background, soft pastel colors"
- "Cozy home office with plants and bookshelf in background, bokeh effect"
- "Minimalist studio setting, white seamless background"

### 3. Style/Aesthetic (How It Looks)
Define the visual style and mood:
- **Artistic Style**: Photorealistic, illustration, 3D render, flat design
- **Mood**: Professional, playful, serious, energetic, calm
- **Brand Alignment**: Match user's brand style guide
- **Platform Fit**: Instagram aesthetic, LinkedIn professional, etc.

**Examples:**
- "Photorealistic, professional product photography style"
- "Modern flat design, clean vector illustration"
- "Soft, warm, approachable aesthetic with subtle textures"
- "Bold, vibrant, energetic style with high contrast"

### 4. Composition (Framing)
Specify camera angle and framing:
- **Angle**: Eye-level, bird's eye, low angle, isometric
- **Framing**: Close-up, medium shot, wide shot, extreme close-up
- **Rule of Thirds**: Subject placement, negative space
- **Focus**: What's in sharp focus, what's blurred

**Examples:**
- "Eye-level angle, rule of thirds composition, subject on left third"
- "Close-up shot, centered composition, shallow depth of field"
- "Isometric view, 45-degree angle, top-down perspective"
- "Wide shot, subject in center, negative space on sides"

### 5. Lighting (Illumination)
Define light quality and direction:
- **Type**: Natural, studio, ambient, dramatic
- **Direction**: Front, side, back, top, rim lighting
- **Quality**: Soft, hard, diffused, directional
- **Color**: Warm, cool, neutral, colored

**Examples:**
- "Soft natural daylight from left, gentle shadows, warm tone"
- "Studio lighting, even illumination, no harsh shadows"
- "Dramatic side lighting, high contrast, cinematic feel"
- "Warm golden hour lighting, soft and flattering"

### 6. Color Palette (Colors)
Specify brand-aligned colors:
- **Primary Colors**: Exact hex codes from brand guide
- **Accent Colors**: Supporting brand colors
- **Neutral Colors**: Grays, whites, blacks
- **Color Harmony**: Monochromatic, complementary, analogous

**Examples:**
- "Primary color #2E86AB (blue), accent #A23B72 (purple), white background"
- "Brand colors: #FF6B6B (coral), #4ECDC4 (teal), #FFE66D (yellow)"
- "Monochromatic blue palette, various shades of #1E3A8A"
- "Warm earth tones: #D4A574, #8B6F47, #F5E6D3"

### 7. Technical Specifications
Platform and quality requirements:
- **Dimensions**: Exact pixel dimensions for platform
- **Aspect Ratio**: Square (1:1), landscape (16:9), portrait (9:16)
- **Resolution**: High resolution for quality
- **Format**: JPG, PNG, with transparency if needed

**Examples:**
- "1080x1080px square format, high resolution, Instagram feed optimized"
- "1200x627px landscape, LinkedIn post dimensions"
- "1080x1920px portrait, Instagram Story format"
- "4K resolution, suitable for print and digital"

### 8. Negative Prompts (What to Avoid)
Specify what should NOT appear:
- **Unwanted Elements**: Text, watermarks, logos (unless specified)
- **Style Avoidances**: Overly stylized, cartoonish, low quality
- **Technical Issues**: Blurry, distorted, pixelated
- **Brand Conflicts**: Colors or styles that conflict with brand

**Examples:**
- "No text, no watermarks, no logos, no people"
- "Avoid cartoon style, avoid low quality, avoid blur"
- "No cluttered backgrounds, no distracting elements"
- "Not overly stylized, not vintage, not retro"

## Brand Alignment Strategies

### Using Reference Images
When users provide visual assets:

1. **Extract Key Elements**:
   - Color palette from brand assets
   - Style characteristics from existing visuals
   - Composition preferences from brand guidelines
   - Typography style (if text included)

2. **Translate to Prompt**:
   - "Match the color palette from reference image: [describe colors]"
   - "Use similar lighting style as reference: [describe lighting]"
   - "Maintain brand aesthetic: [describe style from reference]"
   - "Composition similar to reference: [describe composition]"

3. **Maintain Consistency**:
   - Use same color codes across all generated images
   - Apply consistent style descriptors
   - Reference brand guidelines in each prompt

### Product-Specific Prompts

**For SaaS Products:**
- Use actual UI screenshots as reference
- Specify exact interface elements
- Match brand colors from product
- Maintain UI consistency

**Example:**
"Modern SaaS dashboard interface showing analytics charts and data visualizations. Clean, professional design with brand colors #2E86AB (primary blue) and #F5F5F5 (light gray background). MacBook Pro screen, soft natural lighting, shallow depth of field. 1080x1080px, high resolution. Style matches reference UI screenshot provided. No text overlays, no watermarks."

**For Physical Products:**
- Use product photos as reference
- Specify product details accurately
- Match brand photography style
- Include brand colors in environment

**Example:**
"Professional product photography of [product name] on clean white background. Soft studio lighting from top-left, subtle shadows. Brand colors #FF6B6B (coral) and #4ECDC4 (teal) visible in product or environment. Eye-level angle, centered composition, rule of thirds. 1200x1200px, high resolution. Style matches reference product photos provided. No text, no watermarks, no people."

## Prompt Examples by Post Type

### Product Showcase Post
```
Professional product photography of [product name] in minimalist studio setting. 
Clean white seamless background, soft diffused studio lighting from top-left creating gentle shadows. 
Eye-level angle, centered composition with product on rule of thirds. 
Brand colors #2E86AB (primary blue) and #F5F5F5 (light gray) visible in product design. 
1080x1080px square format, high resolution, Instagram feed optimized. 
Photorealistic style, sharp focus on product, shallow depth of field. 
No text overlays, no watermarks, no people, no distracting elements.
```

### Infographic Post
```
Modern infographic design with clean layout and data visualization elements. 
Flat design style, minimalist aesthetic, professional and approachable. 
Brand color palette: primary #2E86AB (blue), accent #A23B72 (purple), neutral #F5F5F5 (light gray). 
White background with subtle texture, even lighting, no shadows. 
Centered composition, balanced negative space. 
1080x1080px square format, high resolution. 
Vector illustration style, clean lines, modern typography space reserved. 
No text in image (text will be added separately), no watermarks.
```

### Behind-the-Scenes Post
```
Authentic behind-the-scenes workspace scene showing modern office setup. 
Natural daylight from large window on left, warm and inviting atmosphere. 
Desk with laptop, notebook, coffee cup, plants in background with bokeh effect. 
Cozy, lived-in aesthetic, professional but approachable. 
Eye-level angle, rule of thirds composition, subject on left third. 
Brand colors subtly integrated: #2E86AB (blue) in laptop, #F5F5F5 (light gray) in background. 
1080x1080px square format, high resolution. 
Photorealistic style, soft focus on background, sharp focus on foreground. 
No text, no watermarks, authentic and unposed feeling.
```

### Quote Graphic Post
```
Minimalist quote graphic design with ample white space. 
Clean, modern aesthetic, professional and elegant. 
Brand colors: primary #2E86AB (blue) for accent elements, neutral #F5F5F5 (light gray) background. 
Centered composition, balanced typography space reserved in center. 
Even, soft lighting, no shadows, flat design style. 
1080x1080px square format, high resolution. 
Modern typography space clearly defined, subtle geometric accent elements. 
No text in image (quote text will be added separately), no watermarks, no distracting elements.
```

### UI Showcase Post (SaaS)
```
Modern SaaS application interface displayed on MacBook Pro screen. 
Clean, professional dashboard design with analytics charts and data visualizations. 
Brand UI colors: #2E86AB (primary blue), #F5F5F5 (light gray background), #A23B72 (accent purple). 
Soft natural lighting, shallow depth of field, laptop screen in sharp focus. 
Eye-level angle, laptop centered with slight rule of thirds offset. 
1080x1080px square format, high resolution. 
Photorealistic style, matches reference UI screenshot provided. 
No text overlays on image, no watermarks, no people, UI elements clearly visible.
```

## Advanced Techniques

### Style Transfer
Reference specific artistic styles or photographers:
- "In the style of [photographer/artist name]"
- "Aesthetic similar to [brand/style reference]"
- "Mood and tone matching [reference image description]"

### Consistency Across Series
For carousel posts or campaign series:
- Use identical style descriptors
- Maintain same color palette
- Apply consistent composition rules
- Reference previous images for continuity

### Platform Optimization
Adjust prompts for platform requirements:
- **Instagram**: Vibrant, aspirational, high contrast
- **LinkedIn**: Professional, clean, trustworthy
- **Twitter**: Bold, attention-grabbing, readable at small size
- **Facebook**: Community-focused, relatable, shareable

## Prompt Refinement Process

1. **Start Broad**: Initial prompt with core elements
2. **Add Specificity**: Include brand colors, style, composition
3. **Reference Assets**: Incorporate details from user's visual assets
4. **Test and Iterate**: Refine based on generated results
5. **Document**: Save final prompt for consistency

## Critical Reminders

**Always:**
- Request user's visual assets (product photos, brand guidelines, reference images)
- Extract brand colors and style from provided assets
- Specify exact dimensions for target platform
- Include negative prompts to avoid unwanted elements
- Maintain brand consistency across all generated images

**Never:**
- Generate images without brand color specifications
- Use generic prompts that ignore brand identity
- Skip reference to user's visual assets when available
- Forget platform-specific dimension requirements
- Create visuals that conflict with brand guidelines
