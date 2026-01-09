# Logo Usage Guidelines

## Logo Variations

| Variation | File | Usage |
|-----------|------|-------|
| Primary | `logos/logo-primary.svg` | Default usage, light backgrounds |
| Dark | `logos/logo-dark.svg` | Dark backgrounds |
| Mark Only | `logos/logo-mark.svg` | Small spaces, favicons, app icons |
| Wordmark | `logos/logo-wordmark.svg` | Text-only contexts |

## Minimum Sizes

| Variation | Minimum Width |
|-----------|---------------|
| Full logo | 120px |
| Mark only | 24px |
| Favicon | 16px |

## Clear Space

Maintain minimum clear space around the logo equal to the height of the mark.

```
     ┌─────────────────────┐
     │                     │
     │   [MARK] TaskFlow   │
     │                     │
     └─────────────────────┘
     ← clear space = mark height →
```

## Color Usage

| Background | Logo Variation |
|------------|----------------|
| White/light | Primary (blue mark, dark text) |
| Dark/black | Dark (white mark, white text) |
| Primary blue | White mark only |

## Don'ts

- Don't stretch or distort the logo
- Don't change the logo colors
- Don't add effects (shadows, gradients)
- Don't place on busy backgrounds
- Don't rotate the logo
- Don't use low-resolution versions

## File Formats

| Format | Usage |
|--------|-------|
| SVG | Web, scalable contexts |
| PNG | Fallback, email signatures |
| ICO | Favicon only |

## Logo Files Location

```
design-context/
└── logos/
    ├── logo-primary.svg
    ├── logo-dark.svg
    ├── logo-mark.svg
    ├── logo-wordmark.svg
    ├── logo-primary.png (1x, 2x)
    └── favicon.ico
```
