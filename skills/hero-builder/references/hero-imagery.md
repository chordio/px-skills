# Hero Imagery

Hero images set the emotional tone in an instant. Get them right.

## Image Roles

| Role | Purpose | Format |
|------|---------|--------|
| **Full-bleed background** | Set mood, create atmosphere | 16:9, 1920px+ |
| **Product hero** | Show the thing | Transparent PNG or contextual |
| **Lifestyle/scene** | Show the outcome | Aspirational, relatable |
| **Abstract/texture** | Enhance brand | Subtle, non-distracting |

---

## AI Generation Prompts by Aesthetic

### Glassmorphism
```
Abstract 3D glass spheres and geometric shapes floating in space,
soft gradient lighting, frosted translucent surfaces, depth of field blur,
[brand colors] color palette, clean minimal composition,
studio lighting with soft shadows, 8K render quality
```

### Aurora / Gradient
```
Flowing silk fabric in motion, ethereal light rays,
iridescent [primary] and [secondary] gradients,
dreamy bokeh, soft focus, atmospheric haze,
painterly quality, subtle grain, cinematic color grade
```

### Neo-Brutalism
```
Bold geometric shapes on solid color background,
flat illustration style, thick black outlines,
clashing [primary] and [accent] colors,
risograph print texture, intentional grain,
raw unpolished aesthetic, high contrast
```

### Dark Academia
```
Vintage library interior with leather-bound books,
warm amber candlelight, deep shadows,
sepia and brown tones, film grain,
soft focus edges, dust particles in light,
classical architecture details, moody atmosphere
```

### Tech / Minimal
```
Abstract data visualization on dark background,
glowing [accent] lines forming network patterns,
particle system with subtle motion blur,
isometric grid, clean geometric forms,
depth of field, futuristic minimal aesthetic
```

### Premium / Luxury
```
Elegant marble texture with gold veining,
soft directional lighting, subtle reflections,
[primary] and champagne gold accents,
shallow depth of field, macro detail,
minimal composition, negative space
```

### Organic / Wellness
```
Soft morning light through foliage,
gentle gradient from [primary] to cream,
organic flowing shapes, watercolor edges,
peaceful natural atmosphere, subtle bokeh,
warm tones, mindful negative space
```

### Bold / Playful
```
Dynamic 3D shapes in bright [brand colors],
playful geometric composition, bouncing forms,
vibrant saturated colors, soft shadows,
fun energetic mood, clean render,
simple backgrounds with depth
```

---

## Prompt Formula

```
[Subject/Scene] + [Lighting] + [Colors from tokens] + [Mood/Atmosphere] + [Technical specs]
```

### Subject Suggestions by Brand Type

| Brand Type | Subjects |
|------------|----------|
| SaaS/Tech | Abstract data, networks, geometric forms |
| Creative | Flowing forms, textures, artistic renders |
| Finance | Architecture, stability, precision |
| Wellness | Nature, light, organic shapes |
| Consumer | Lifestyle scenes, product contexts |
| Gaming | Dynamic action, energy, particles |

---

## Technical Requirements

### Dimensions
| Usage | Size | Aspect |
|-------|------|--------|
| Full-bleed hero | 1920 x 1080+ | 16:9 |
| Split hero image | 1080 x 1080 | 1:1 |
| Background texture | 1920 x 1080 | 16:9 |
| Mobile hero | 750 x 1334 | 9:16 |

### Format
- WebP preferred (smaller, quality)
- PNG for transparency
- Provide srcset: 640w, 1280w, 1920w

### Performance
- Compress to < 200KB where possible
- Use blur placeholder for loading
- Consider CSS gradient fallback

---

## Output Format

When generating image prompts for the user or imagegen skill:

```
USAGE: Hero background
PURPOSE: [What story/mood this image tells]
PROMPT: [Detailed generation prompt]
STYLE NOTES: [How it connects to brand tokens]
FILENAME: hero-main.webp
DIMENSIONS: 1920 x 1080 (16:9)
DROP LOCATION: /brand/images/
```

---

## Integration Code

```tsx
import Image from 'next/image'

export function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/hero-main.webp"
        alt="" // Decorative
        fill
        priority
        sizes="100vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // Generate with plaiceholder
      />
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/40 to-dark" />
    </div>
  )
}
```

---

## Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| No overlay | Text unreadable | Add gradient overlay |
| Generic stock | Looks like everyone else | Use AI generation with brand colors |
| Too busy | Distracts from message | Simpler composition, blur edges |
| Wrong aspect | Crops badly on mobile | Provide mobile-specific version |
| Slow loading | Hurts LCP | Compress, use blur placeholder |
| Missing alt | Accessibility fail | Use `alt=""` for decorative |
