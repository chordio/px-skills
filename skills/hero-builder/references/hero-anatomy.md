# Hero Anatomy

Every hero has layers. Build from bottom to top.

## Layer Stack

```
┌─────────────────────────────────────────┐
│  Navigation (z-50)                      │  Floating or integrated
├─────────────────────────────────────────┤
│  Accents Layer (z-30)                   │  Floating elements, decorative
├─────────────────────────────────────────┤
│  Content Layer (z-20)                   │  Headline, subhead, CTA
├─────────────────────────────────────────┤
│  Overlay (z-10)                         │  Gradient for contrast
├─────────────────────────────────────────┤
│  Background (z-0)                       │  Effect, image, or color
└─────────────────────────────────────────┘
```

---

## 1. Background Layer

The foundation. Sets mood before anyone reads a word.

### Types
| Type | Implementation | When |
|------|----------------|------|
| Solid Color | `bg-[token]` | Minimal, typography-focused |
| Gradient | `bg-gradient-to-*` | Modern, energetic |
| Image | `next/image` with `fill` | Product, lifestyle |
| Video | `<video>` with poster | Immersive, premium |
| WebGL Effect | Vanta, Three.js | Maximum impact |

### Code Pattern: Image Background
```tsx
<div className="relative min-h-screen">
  <Image
    src="/images/hero-bg.webp"
    alt=""
    fill
    priority
    className="object-cover"
  />
  {/* Overlay goes here */}
</div>
```

### Code Pattern: WebGL Background
```tsx
'use client'
import { lazy, Suspense } from 'react'

const VantaBackground = lazy(() => import('./VantaBackground'))

export function HeroBackground() {
  return (
    <div className="absolute inset-0">
      <Suspense fallback={<div className="bg-dark" />}>
        <VantaBackground />
      </Suspense>
    </div>
  )
}
```

---

## 2. Overlay Layer

Creates contrast for readable text. Never skip this with image/video backgrounds.

### Patterns
| Pattern | Tailwind | Effect |
|---------|----------|--------|
| Full dark | `bg-dark/60` | Maximum contrast |
| Top fade | `bg-gradient-to-b from-dark/80 to-transparent` | Text at top |
| Bottom fade | `bg-gradient-to-t from-dark/80 to-transparent` | Text at bottom |
| Radial | `bg-[radial-gradient(...)]` | Vignette effect |
| Noise | `mix-blend-overlay` + noise | Texture |

### Code Pattern
```tsx
{/* Over image, under content */}
<div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark/80" />
```

---

## 3. Content Layer

The message. This is why they're here.

### Hierarchy
1. **Headline** — `h1`, largest text, outcome-first
2. **Subhead** — `p`, supporting context, one sentence
3. **CTA** — Primary button, single action
4. **Proof hint** — Optional: logos, stat, trust signal

### Spacing
```tsx
<div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
    {headline}
  </h1>
  <p className="text-lg md:text-xl text-muted max-w-2xl">
    {subhead}
  </p>
  <Button size="lg">{cta}</Button>
  <LogoBar logos={trustedBy} />
</div>
```

### Typography Scale
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Headline | 2.25rem (text-4xl) | 3.75rem (text-6xl) | 4.5rem (text-7xl) |
| Subhead | 1.125rem (text-lg) | 1.25rem (text-xl) | 1.25rem (text-xl) |
| CTA | Default button | Large button | Large button |

---

## 4. Accents Layer

Decorative elements that add depth and delight.

### Types
| Accent | Purpose | Placement |
|--------|---------|-----------|
| Floating shapes | Depth, motion | Corners, edges |
| Gradient blurs | Glow, warmth | Behind content |
| Particles | Ambient movement | Full hero |
| Grid lines | Structure, tech | Background |
| Light beams | Direction, energy | Radiating from center |

### Code Pattern: Floating Elements
```tsx
<motion.div
  className="absolute -right-20 top-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl"
  animate={{
    y: [0, -20, 0],
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
```

---

## 5. Navigation Layer

Always accessible, never distracting.

### Patterns
| Pattern | When | Implementation |
|---------|------|----------------|
| Transparent | Hero is the star | `bg-transparent`, blend with hero |
| Solid on scroll | Long pages | `useScroll` + conditional bg |
| Floating pill | Modern, minimal | Centered, rounded, backdrop-blur |
| Hidden initially | Immersive | Appear after scroll threshold |

### Code Pattern: Scroll-Reactive Nav
```tsx
const { scrollY } = useScroll()
const hasScrolled = useTransform(scrollY, [0, 100], [0, 1])

return (
  <motion.nav
    className="fixed top-0 inset-x-0 z-50"
    style={{
      backgroundColor: useTransform(hasScrolled, [0, 1], ['transparent', 'rgba(0,0,0,0.9)']),
    }}
  >
    {/* Nav content */}
  </motion.nav>
)
```

---

## Responsive Behavior

### Mobile (< 640px)
- Full-width content with horizontal padding
- Stack all elements vertically
- Reduce background effect intensity
- Ensure minimum 44px touch targets
- Consider reducing hero height if needed

### Tablet (640px - 1024px)
- Maintain centered layout or begin split
- Scale typography appropriately
- Effects at 75% intensity

### Desktop (> 1024px)
- Full design expression
- Consider horizontal layouts
- Maximum effect intensity

---

## Accessibility Checklist

- [ ] Headline is `h1`, proper hierarchy below
- [ ] Color contrast minimum 4.5:1 for body, 3:1 for large text
- [ ] CTA has focus states visible
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Background images have empty `alt=""` (decorative)
- [ ] Content is visible without JavaScript
- [ ] No auto-playing video with sound

---

## Performance Checklist

- [ ] Hero images use `priority` in next/image
- [ ] WebGL effects are lazy-loaded
- [ ] Fonts are preloaded in layout
- [ ] CSS animations over JS where possible
- [ ] Test LCP < 2.5s on throttled connection
- [ ] Background has appropriate placeholder/blur
