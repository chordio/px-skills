# Video Generation Prompts for Veo

Best practices and examples for creating effective video generation prompts using Veo or similar AI video generators for social media posts.

## Prompt Structure

Effective video prompts follow a structured format that provides comprehensive scene description:

```
[Scene Description] + [Subject/Action] + [Cinematography] + [Duration] + [Start/End Images] + [Audio Description] + [Style/Mood] + [Technical Specifications]
```

## Core Components

### 1. Scene Description (Setting)
Define the environment and context:
- **Location**: Specific setting, environment, context
- **Atmosphere**: Mood, feeling, energy level
- **Background**: What's visible, what's blurred
- **Time of Day**: Morning, afternoon, evening, night
- **Weather/Ambiance**: Natural elements, lighting conditions

**Examples:**
- "Modern minimalist office space with large windows, natural daylight streaming in"
- "Clean white studio setting with soft gradient background"
- "Cozy home office with plants and warm lighting"
- "Abstract digital environment with flowing particles and light"

### 2. Subject/Action (What Happens)
Specify the main subject and movement:
- **Subject**: Person, product, interface, object
- **Action**: What happens, movement, interaction, transformation
- **Pacing**: Slow, medium, fast, dynamic
- **Focus**: What draws attention, key moments

**Examples:**
- "SaaS dashboard interface animating through different screens, smooth transitions"
- "Hands typing on keyboard, then gesturing to screen showing results"
- "Product rotating slowly on pedestal, highlighting key features"
- "Person walking through workspace, interacting with elements"

### 3. Cinematography (Camera Work)
Define camera movement and framing:
- **Camera Movement**: Static, pan, tilt, dolly, zoom, orbit
- **Shot Type**: Close-up, medium, wide, extreme close-up
- **Angle**: Eye-level, high angle, low angle, bird's eye
- **Focus**: Rack focus, shallow depth of field, deep focus
- **Transitions**: Cut, fade, dissolve, wipe

**Examples:**
- "Smooth dolly forward, starting wide and ending in close-up"
- "Static camera, eye-level, medium shot with shallow depth of field"
- "Slow orbit around subject, 360-degree reveal"
- "Zoom in from wide to extreme close-up over 8 seconds"

### 4. Duration
Specify video length:
- **Platform Requirements**: Match platform optimal lengths
- **Pacing**: Fast-paced (shorter), contemplative (longer)
- **Content Type**: Tutorial (longer), teaser (shorter)

**Examples:**
- "8-second video, fast-paced, dynamic"
- "15-second video, medium pace, smooth transitions"
- "30-second video, slow and contemplative"
- "60-second video, tutorial pace with clear steps"

### 5. Start/End Images (Consistency)
Specify reference images for consistency:
- **Start Image**: First frame reference for visual consistency
- **End Image**: Final frame reference for narrative completion
- **Key Frames**: Important moments that need specific visuals
- **Style Match**: Ensure images match video style

**Examples:**
- "Start with reference image of [description], end with [description]"
- "Use provided start image as first frame, transition to [end state]"
- "Match style of reference product photo throughout video"
- "Begin with UI screenshot provided, animate through states"

### 6. Audio Description (If Applicable)
Describe sound elements:
- **Music**: Style, tempo, mood
- **Sound Effects**: Ambient, action, transitions
- **Voiceover**: Tone, pace, energy
- **Silence**: Intentional quiet moments

**Examples:**
- "Upbeat electronic music, modern and energetic"
- "Soft ambient background, subtle sound effects on transitions"
- "No audio, silent video with text overlays"
- "Calm instrumental music, slow tempo, contemplative"

### 7. Style/Mood (Aesthetic)
Define visual style and emotional tone:
- **Artistic Style**: Photorealistic, stylized, animated, cinematic
- **Mood**: Professional, playful, serious, energetic, calm
- **Brand Alignment**: Match user's brand style guide
- **Color Grading**: Warm, cool, high contrast, desaturated

**Examples:**
- "Cinematic, professional, warm color grading"
- "Modern, clean, minimalist aesthetic with cool tones"
- "Energetic, vibrant, high contrast, bold colors"
- "Soft, approachable, warm lighting, natural colors"

### 8. Technical Specifications
Platform and quality requirements:
- **Dimensions**: Exact pixel dimensions for platform
- **Aspect Ratio**: Square (1:1), landscape (16:9), portrait (9:16)
- **Frame Rate**: 24fps, 30fps, 60fps
- **Resolution**: HD, Full HD, 4K
- **Format**: MP4, MOV, with specific codec if needed

**Examples:**
- "1080x1920px portrait, 30fps, Instagram Reels format"
- "1920x1080px landscape, 24fps, cinematic, LinkedIn optimized"
- "1080x1080px square, 30fps, Instagram feed format"
- "720x1280px portrait, 60fps, TikTok format"

## Brand Alignment Strategies

### Using Reference Images
When users provide visual assets:

1. **Extract Key Elements**:
   - Visual style from brand assets
   - Color palette from brand guidelines
   - Composition preferences from existing videos
   - Product details from photos/screenshots

2. **Translate to Prompt**:
   - "Match the visual style of reference image: [describe style]"
   - "Use brand colors from reference: [describe colors]"
   - "Maintain consistency with provided product photos"
   - "Start frame should match reference UI screenshot"

3. **Maintain Consistency**:
   - Use same color codes throughout video
   - Apply consistent style descriptors
   - Reference brand guidelines in prompt
   - Ensure start/end images align with brand

### Product-Specific Prompts

**For SaaS Products:**
- Use actual UI screenshots as start/end frames
- Specify exact interface elements and animations
- Match brand colors from product
- Maintain UI consistency throughout

**Example:**
"8-second video showing SaaS dashboard interface transitioning through different screens. Start with reference UI screenshot of analytics dashboard, smoothly animate to settings screen, then to user profile. Clean, professional UI design with brand colors #2E86AB (primary blue) and #F5F5F5 (light gray background). Smooth transitions, modern animation style. Static camera, eye-level, full screen view. 1080x1920px portrait, 30fps, Instagram Reels format. Cinematic, professional style matching reference UI provided."

**For Physical Products:**
- Use product photos as start/end frames
- Specify product details accurately
- Match brand photography style
- Include brand colors in environment

**Example:**
"15-second product showcase video. Start with reference product photo on white background, slowly rotate product 360 degrees, then zoom in to highlight key features. Soft studio lighting, professional product photography style. Brand colors #FF6B6B (coral) and #4ECDC4 (teal) visible in product or subtle background elements. Smooth camera orbit, ending in close-up. 1080x1080px square, 30fps. Photorealistic style matching reference product photos. No text overlays, no watermarks."

## Prompt Examples by Video Type

### Product Demonstration
```
15-second product demonstration video. 
Start with reference product photo showing [product] on clean white background. 
Smooth camera orbit around product, 360-degree rotation, highlighting key features. 
Then zoom in to extreme close-up of [specific feature], then pull back to full product view. 
Soft studio lighting, professional product photography style. 
Brand colors #2E86AB (primary blue) subtly integrated in environment. 
Smooth, cinematic camera movement, slow and deliberate pace. 
1080x1080px square format, 30fps, Instagram feed optimized. 
Photorealistic style matching reference product photos provided. 
No text overlays, no watermarks, focus on product details.
```

### UI Tutorial/Showcase
```
30-second SaaS interface tutorial video. 
Start with reference UI screenshot of [specific screen], then smoothly transition through key features: [feature 1], [feature 2], [feature 3]. 
Clean, modern dashboard design with brand UI colors #2E86AB (primary blue), #F5F5F5 (light gray background), #A23B72 (accent purple). 
Smooth screen transitions, subtle zoom effects on important elements. 
Static camera, full screen interface view, professional UI animation style. 
1080x1920px portrait, 30fps, Instagram Reels format. 
Modern, clean aesthetic matching reference UI screenshots. 
Text overlays space reserved for step labels (text added separately).
```

### Behind-the-Scenes
```
20-second behind-the-scenes workspace video. 
Start with wide shot of modern office, then slowly dolly forward through workspace. 
Natural daylight from large window, warm and inviting atmosphere. 
Desk with laptop, plants, coffee cup, subtle movement (coffee steam, plant leaves). 
Cozy, lived-in aesthetic, professional but approachable. 
Eye-level camera, smooth forward movement, shallow depth of field. 
Brand colors #2E86AB (blue) visible in laptop, #F5F5F5 (light gray) in background. 
1080x1080px square, 30fps. 
Photorealistic style, authentic and unposed feeling. 
No text, no watermarks, natural and organic movement.
```

### Animated Explanation
```
15-second animated explanation video. 
Abstract digital environment with flowing particles and light effects. 
Start with simple shape, gradually build complexity showing [concept visualization]. 
Smooth animations, modern motion graphics style. 
Brand colors #2E86AB (primary blue) and #A23B72 (accent purple) as primary palette. 
Dynamic camera movement, orbiting around animated elements. 
1080x1920px portrait, 30fps, Instagram Reels format. 
Modern, clean, professional animation style. 
Text overlay space reserved for key points (text added separately).
```

### Testimonial/Case Study
```
30-second testimonial video setup. 
Start with reference image of person in professional setting, then transition to [product/results visualization]. 
Warm, authentic lighting, professional but approachable. 
Smooth transitions between person and product/interface shots. 
Brand colors subtly integrated: #2E86AB (blue) in background elements. 
Static camera with subtle push-ins on key moments. 
1080x1080px square, 30fps. 
Photorealistic, cinematic style. 
Text overlay space for quote (text added separately), no watermarks.
```

## Start/End Image Specifications

### When to Use Start Images
- **Brand Consistency**: Ensure first frame matches brand visuals
- **Product Accuracy**: Start with actual product photo
- **UI Accuracy**: Begin with real interface screenshot
- **Narrative Setup**: Establish scene or context

### When to Use End Images
- **Narrative Completion**: Show final state or result
- **Product Showcase**: End with best product angle
- **Call-to-Action**: Final frame that supports CTA
- **Brand Reinforcement**: End with brand-aligned visual

### How to Specify
- **Detailed Description**: "Start with image showing [detailed description]"
- **Reference Provided**: "Use provided start image as first frame"
- **Style Match**: "Start frame should match style of [reference]"
- **Transition**: "Transition from start image to [end state description]"

**Example:**
"Start with reference UI screenshot of analytics dashboard (provided), smoothly animate through feature screens, end with reference image of results screen (provided). Maintain visual consistency with provided screenshots throughout."

## Advanced Techniques

### Multi-Shot Sequences
Break down complex videos into shot sequences:
- "Shot 1: [description], Shot 2: [description], Shot 3: [description]"
- Specify transitions between shots
- Define pacing for each shot

### Dynamic Camera Movements
Specify complex camera work:
- "Slow dolly forward while simultaneously tilting up"
- "Orbit around subject while zooming in"
- "Rack focus from background to foreground"

### Style Consistency
For series or campaigns:
- Use identical style descriptors across videos
- Maintain same color palette
- Apply consistent cinematography rules
- Reference previous videos for continuity

### Platform Optimization
Adjust prompts for platform requirements:
- **Instagram Reels**: Vertical, fast-paced, attention-grabbing
- **LinkedIn**: Professional, informative, value-driven
- **TikTok**: Trend-aware, entertaining, relatable
- **YouTube Shorts**: Engaging, educational, shareable

## Prompt Refinement Process

1. **Start with Core**: Basic scene, subject, action
2. **Add Cinematography**: Camera movement, shot type, transitions
3. **Specify Duration**: Match platform requirements
4. **Include References**: Start/end images, brand assets
5. **Refine Style**: Match brand guidelines and platform
6. **Test and Iterate**: Refine based on generated results
7. **Document**: Save final prompt for consistency

## Critical Reminders

**Always:**
- Request user's visual assets (product photos, UI screenshots, brand guidelines)
- Specify start and/or end images for consistency
- Extract brand colors and style from provided assets
- Match exact dimensions for target platform
- Include duration and frame rate specifications
- Maintain brand consistency throughout video

**Never:**
- Generate videos without brand specifications
- Skip start/end image references when available
- Use generic prompts that ignore brand identity
- Forget platform-specific dimension and duration requirements
- Create visuals that conflict with brand guidelines
- Overlook frame rate and technical specifications
