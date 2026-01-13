---
name: imagegen
description: Generate high-quality images using Nano Banana Pro 3 via Vercel AI Gateway. Use when creating hero images, product shots, illustrations, or any visual assets. Requires VERCEL_API_KEY environment variable. Accepts aspect ratio and outputs to specified path.
---

# Image Generation

Generate publication-quality images using Nano Banana Pro 3.

## Requirements

Set `VERCEL_API_KEY` environment variable before use.

## Usage

```bash
python scripts/generate_image.py \
  --prompt "Your detailed prompt" \
  --aspect "16:9" \
  --output "/path/to/output.webp"
```

**Options:**
- `--prompt` (required): Detailed image description
- `--aspect` (required): Aspect ratio (e.g., "16:9", "1:1", "4:3", "3:4", "9:16")
- `--output` (required): Output file path
- `--reference` (optional): Path to reference image for style/composition guidance

## Prompt Crafting

Write prompts like an expert photographer briefing a peer. See `references/prompt-craft.md` for the full guide.

### Core Principles

1. **Be decisive.** No options. Not "brown or grey hair"—pick one.
2. **Be specific.** "Soft morning light through floor-to-ceiling windows" not "natural lighting"
3. **Be technical.** Include camera, lens behavior, depth of field, color grading.

### Prompt Structure

```
[Subject & Action] + [Environment] + [Style/Mood] + [Technical Camera Notes]
```

### Quick Examples

**Hero background:**
```
Abstract flowing silk ribbons in deep purple and teal, caught mid-motion against 
pure black. Soft studio lighting from above, shallow depth of field, slight motion 
blur at ribbon edges. High-end cosmetics campaign aesthetic.
```

**Product mockup environment:**
```
Minimal Scandinavian desk setup, matte white surface, single monstera leaf in 
ceramic vase, soft diffused daylight from left. Shot on medium format, f/2.8, 
subtle film grain, slightly desaturated warm tones.
```

**Team/person photo:**
```
Professional woman in her 30s, confident posture, wearing navy blazer, standing 
in modern glass-walled office. Natural window light, shallow focus on face, 
background bokeh showing city skyline. Editorial portrait style, 85mm equivalent.
```

## Common Aspect Ratios

| Use Case | Ratio |
|----------|-------|
| Hero banner | 16:9 |
| Social card | 1.91:1 |
| Feature card | 4:3 |
| Mobile hero | 9:16 |
| Square icon | 1:1 |
| Portrait | 3:4 |

## Integration with Other Skills

Called by `homepage-builder` for section imagery:

```python
# Example: Generate hero image
generate_image(
    prompt="...",  # From homepage-builder imagery requirements
    aspect="16:9",
    output="/brand/images/hero-main.webp"
)
```
