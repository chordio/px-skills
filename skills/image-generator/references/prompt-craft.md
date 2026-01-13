# Prompt Crafting Guide

Write prompts like an expert photographer briefing a peer. Be decisive, specific, and technical.

## Core Rules

### 1. No Options
The skill makes decisions. The image AI executes.

❌ `"person with brown or blonde hair"`
✅ `"person with warm chestnut hair, subtle highlights"`

❌ `"modern or traditional office"`
✅ `"glass-walled corner office, floor-to-ceiling windows, midcentury modern furniture"`

### 2. Specific Over Generic

❌ `"natural lighting"`
✅ `"soft morning light through sheer curtains, warm color temperature, subtle lens flare"`

❌ `"professional setting"`
✅ `"white oak conference table, single orchid in concrete pot, blurred city skyline through rain-streaked window"`

### 3. Include Technical Camera Language

Add realism and control with photography terms:
- **Focal length:** "85mm portrait lens", "35mm wide angle", "telephoto compression"
- **Depth of field:** "shallow focus on subject", "f/1.8 bokeh", "deep focus throughout"
- **Film/sensor:** "medium format film grain", "clean digital sensor", "Kodak Portra tones"
- **Lighting:** "Rembrandt lighting", "rim light from behind", "soft diffused key light"

## Prompt Structure

```
[Subject & Action] + [Environment & Context] + [Style & Mood] + [Technical Notes]
```

## Templates by Image Type

### Hero Backgrounds

Abstract, mood-setting, non-distracting.

```
[Abstract forms/textures] in [brand colors], [movement/stillness], against [background].
[Lighting setup], [depth treatment]. [Style reference] aesthetic.
```

**Example:**
```
Flowing liquid chrome ribbons twisting through deep navy space, frozen mid-motion 
with caustic light reflections. Single soft light source from upper left, extreme 
shallow depth of field with foreground blur. High-end automotive commercial aesthetic.
```

### Product Mockups

Device in environment, screenshot integrated.

```
Remove browser UI and place the website screenshot on [device]. 
Environment: [interior style], [profession hint], [mood], [time of day].
Camera: [style], [focal length], [depth], [color treatment].
```

**Example:**
```
Remove browser UI and place the website screenshot on a MacBook Pro 16".
Environment: architect's home studio, concrete walls, single task lamp, curated 
books and models on floating shelves, night with city glow through window.
Camera: editorial interiors photography, 45mm tilt-shift, sharp product with 
environment fall-off, slightly cool shadows with warm accent lighting.
```

### Person/Team Photos

Professional but not stock-feeling.

```
[Demographics], [expression/posture], wearing [specific clothing], in [environment].
[Lighting], [camera position], [focus], [background treatment]. [Style reference].
```

**Example:**
```
East Asian man in his early 40s, relaxed confident expression, wearing charcoal 
wool coat over black turtleneck, standing in industrial loft with exposed brick.
Large window providing soft sidelight, shot at eye level, sharp focus on eyes 
with gentle background blur, visible grain. Documentary portrait style.
```

### Feature/Benefit Illustrations

Conceptual but grounded.

```
[Concept visualization] representing [abstract idea]. [Visual metaphor].
[Style], [color palette from tokens], [rendering approach].
```

**Example:**
```
Isometric 3D render of data streams flowing between connected nodes, representing 
seamless integration. Streams are translucent glass tubes with glowing particles 
inside. Clean white background, accent colors in teal and coral, soft shadows, 
slightly matte materials. Technical illustration meets editorial infographic.
```

### Infographics

Data visualization with real-world grounding.

```
[Orientation] [viewpoint] [infographic type] of [subject], combining [base imagery] 
with [overlay style]. Include [specific data elements]. Style as [reference] with 
[line treatment] and [typography approach].
```

**Example:**
```
Produce a 3:4 vertical bird's-eye infographic of the Golden Gate Bridge, combining 
the real photograph with layered white HUD engineering annotations. Insert a 
hand-drawn box in the lower-left corner naming the structure. Overlay complex 
technical notes: cable tension data, span dimensions, material quantities, truss 
and tower section diagrams. Style as a HUD display with clean white linework and 
educational infographic clarity.
```

## Mood Vocabulary

### Energy Level
- Calm: "still", "quiet", "restful", "meditative"
- Active: "dynamic", "energetic", "in motion", "vibrant"
- Intense: "dramatic", "bold", "striking", "powerful"

### Temperature
- Cool: "crisp", "blue-shifted", "morning light", "clinical"
- Neutral: "balanced", "daylight white", "natural"
- Warm: "golden hour", "amber tones", "cozy", "inviting"

### Polish Level
- Raw: "unretouched", "documentary", "authentic", "grain visible"
- Editorial: "subtle retouch", "refined but natural", "magazine quality"
- Commercial: "flawless", "highly polished", "aspirational", "luxury"

## Color Direction

Reference brand tokens directly:
```
Primary accent in [exact hex or token name], secondary touches of [token], 
neutral background in [token]. Avoid [conflicting colors].
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Vague subject | Be specific: who, what, where |
| Multiple options | Pick one, commit |
| Missing lighting | Always specify light source and quality |
| No camera notes | Add focal length, depth of field |
| Generic style | Reference specific photographers, campaigns, or genres |
| Ignoring brand | Pull colors and mood from tokens |
