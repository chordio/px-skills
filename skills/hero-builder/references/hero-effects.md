# Hero Effects Directory

Curated effects for hero sections. Choose ONE primary category, adapt to brand.

## Atmospheric Backgrounds

Create mood and set the visual tone.

| Effect | Source | Character | Best For |
|--------|--------|-----------|----------|
| Aurora Background | Aceternity UI | Dreamy, flowing | Aspirational brands, wellness, creative |
| Vanta Birds | Vanta.js | Organic, alive | Nature, community, movement |
| Vanta Fog | Vanta.js | Mysterious, depth | Premium, luxury, contemplative |
| Vanta Waves | Vanta.js | Fluid, calming | Finance, wellness, professional |
| Vanta Net | Vanta.js | Connected, technical | SaaS, platforms, networks |
| Particles | Magic UI | Ambient, tech | Startups, AI, data |
| Gradient Animation | Aceternity UI | Modern, energetic | SaaS, modern brands |
| Noise Background | Aceternity UI | Textured, artistic | Creative, editorial |

**Adaptation Notes:**
- Adjust color to brand palette (never default colors)
- Reduce density/speed for luxury, increase for energy
- Consider transparency to layer with content

---

## Typographic Effects

When the message IS the visual.

| Effect | Source | Character | Best For |
|--------|--------|-----------|----------|
| Text Generate | Aceternity UI | Deliberate reveal | Important announcements |
| Flip Words | Aceternity UI | Dynamic, rotating | Multiple value props |
| Typewriter | Magic UI | Technical, focused | Developer tools, precision |
| Gradient Text | Magic UI | Brand expression | Hero headlines |
| Glitch Text | React Bits | Edgy, disruptive | Gaming, creative tech |
| Letter Pullup | Magic UI | Elegant entrance | Premium, luxury |
| Blur In | Magic UI | Soft reveal | Elegant, subtle |

**Adaptation Notes:**
- Match font weight/family to brand typography
- Timing should reflect brand personality (snappy vs. measured)
- Use sparingly—one text effect maximum

---

## Interactive Effects

Reward engagement, create memorable moments.

| Effect | Source | Character | Best For |
|--------|--------|-----------|----------|
| Splash Cursor | React Bits | Playful, immersive | Creative, consumer |
| Spotlight | Aceternity UI | Focus, attention | CTAs, key elements |
| Magnetic Buttons | Custom | Satisfying, modern | Premium interactions |
| Tilt/3D Card | Aceternity UI | Depth, engagement | Product showcases |
| Parallax Mouse | Custom | Subtle depth | Layered compositions |

**Adaptation Notes:**
- Keep interactions subtle on mobile
- Ensure keyboard/touch alternatives exist
- Don't compete with primary CTA

---

## Cinematic Reveals

Orchestrated entrances that tell a story.

| Effect | Source | Character | Best For |
|--------|--------|-----------|----------|
| Stagger Reveal | Framer Motion | Orchestrated, polished | Multi-element heroes |
| Scroll Zoom | GSAP | Immersive, dramatic | Product launches |
| Container Morph | Framer Motion | Transformative | Before/after concepts |
| Clip Path Reveal | CSS/GSAP | Dramatic, precise | Bold statements |
| Background Beams | Aceternity UI | Energy, direction | CTAs, momentum |

**Adaptation Notes:**
- Time reveals to reading pace
- Don't delay critical content >2s
- Provide skip option for long sequences

---

## Product Showcases

When the product is the star.

| Effect | Source | Character | Best For |
|--------|--------|-----------|----------|
| Device Mockups | Magic UI | Professional, contextual | Apps, SaaS |
| Macbook Scroll | Aceternity UI | Premium, Apple-esque | Mac apps, websites |
| Browser Frame | Custom | Authentic, trustworthy | Web products |
| Floating UI | Framer Motion | Dynamic, modern | Feature highlights |
| 3D Rotation | Three.js | Premium, technical | Physical products |

**Adaptation Notes:**
- Use real product screenshots, never placeholders
- Ensure mockup style matches brand aesthetic
- Consider accessibility of animated content

---

## Composition Patterns

How elements are arranged.

### Centered
```
[        Nav        ]
[                   ]
[      Headline     ]
[      Subhead      ]
[       [CTA]       ]
[                   ]
[    Proof/Logos    ]
```
Best for: Statement heroes, brand-first

### Split
```
[Nav                ]
[                   ]
[Text     |   Image ]
[Subhead  |   or    ]
[[CTA]    |  Visual ]
[                   ]
```
Best for: Product showcases, dual focus

### Asymmetric
```
[Nav                ]
[          Headline ]
[Text               ]
[    [CTA]          ]
[           Floating]
[           Elements]
```
Best for: Dynamic brands, editorial

### Layered
```
[Nav                ]
[     Deep BG       ]
[   Mid Layer       ]
[ Content Layer     ]
[Foreground Accents ]
```
Best for: Immersive, parallax-driven

---

## Effect Combinations

Tested pairings that work together.

| Primary | Secondary | Mood |
|---------|-----------|------|
| Aurora BG | Text Generate | Dreamy, aspirational |
| Particles | Gradient Text | Tech, modern |
| Vanta Fog | Letter Pullup | Premium, mysterious |
| Gradient Animation | Flip Words | Energetic, dynamic |
| Noise BG | Glitch Text | Edgy, creative |
| Dark solid | Spotlight CTA | Focused, conversion |
| Product Float | Stagger Reveal | Professional, polished |

---

## Performance Tiers

Choose based on context and audience.

| Tier | Effects | LCP Target | Use When |
|------|---------|------------|----------|
| **Light** | CSS animations, Framer Motion | <1.5s | Mobile-first, global audience |
| **Medium** | + Particles, component libraries | <2.5s | Standard marketing |
| **Heavy** | + Vanta, Three.js, WebGL | <3.5s | Desktop-focused, hero impact critical |

Always:
- Lazy load WebGL effects
- Provide fallback for `prefers-reduced-motion`
- Test on throttled connections
