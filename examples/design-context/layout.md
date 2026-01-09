# Layout & Spacing System

## Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, inline elements |
| `space-2` | 8px | Related elements, button padding |
| `space-3` | 12px | Form field gaps |
| `space-4` | 16px | Default component padding |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Large section spacing |
| `space-10` | 40px | Major section dividers |
| `space-12` | 48px | Page section spacing |
| `space-16` | 64px | Hero spacing |

## Grid System

**Container Max Width:** 1280px
**Columns:** 12-column grid
**Gutter:** 24px (space-6)
**Margin:** 16px mobile, 24px tablet, 32px desktop

## Responsive Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Small tablets, large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large desktops |

## Common Layouts

### Single Column (Content)
- Max width: 680px
- Centered horizontally
- Used for: Articles, forms, focused content

### Two Column (Sidebar + Content)
- Sidebar: 280px fixed
- Content: Flexible
- Collapse sidebar to drawer on mobile

### Grid (Cards)
- 1 column on mobile
- 2 columns on tablet
- 3-4 columns on desktop
- Gap: space-6 (24px)

## Component Spacing

| Component | Internal Padding | External Margin |
|-----------|-----------------|-----------------|
| Card | space-5 (20px) | space-4 (16px) |
| Button | space-2 space-4 | - |
| Input | space-3 space-4 | space-4 (16px) bottom |
| Modal | space-6 (24px) | - |
| Section | space-12 (48px) | space-8 (32px) |

## Touch Targets

**Minimum:** 44px × 44px
**Recommended:** 48px × 48px

All clickable elements must meet minimum touch target size on mobile.
