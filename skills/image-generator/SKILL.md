# Image Generation

Generate publication-quality images via a configurable provider registry.
Two providers are supported today; new ones are a one-dataclass addition.

## Providers

| Name | Backend | Env var | Default model id | Reference images |
|------|---------|---------|------------------|------------------|
| `nano-banana` (default) | Vercel AI Gateway | `AI_GATEWAY_API_KEY` | `google/gemini-3-pro-image` (Nano Banana) | yes (inline in content array) |
| `gpt-image` | OpenAI Images API | `OPENAI_API_KEY` | `gpt-image-1` (override with `GPT_IMAGE_MODEL`) | yes (routes to `/v1/images/edits`) |

Set whichever env var(s) you need. A `.env` file in the project root (or
any ancestor up to home) is auto-loaded by the script.

## Usage

```bash
# Default model (nano-banana)
python scripts/generate_image.py \
  --prompt "Your detailed prompt" \
  --aspect "1:1" \
  --output "/path/to/output.png"

# Specific model
python scripts/generate_image.py \
  --prompt "..." --aspect "1:1" --output "/path/to/out.png" \
  --model gpt-image

# Multi-model: generate one image per provider for side-by-side comparison.
# Output naming auto-suffixes: hero.png becomes hero-nano-banana.png and
# hero-gpt-image.png.
python scripts/generate_image.py \
  --prompt "..." --aspect "1:1" --output "/path/to/hero.png" \
  --model nano-banana --model gpt-image

# Reference images for style/composition guidance.
# Both providers accept --reference (repeatable). nano-banana embeds inline,
# gpt-image routes to /v1/images/edits with one "image" form part per file.
# Mask is not used by this skill.
python scripts/generate_image.py \
  --prompt "..." --aspect "1:1" --output "/path/to/out.png" \
  --reference style.png --reference logo.png
```

**Options:**
- `--prompt` (required): detailed image description.
- `--aspect` (required): aspect ratio (e.g., `1:1`, `16:9`, `4:3`).
  See "Aspect ratios" below for what each provider supports.
- `--output` (required): single-model writes here; multi-model writes
  to `<base>-<provider>.<ext>` derived from this path.
- `--model` (optional, repeatable): one of `nano-banana` (default) or
  `gpt-image`. Repeat the flag to run multiple providers.
- `--reference` (optional, repeatable): path to a reference image.
  Accepted by both providers. PNG, JPEG, and WebP supported by `gpt-image`;
  nano-banana additionally accepts GIF and SVG.
- `--debug` (optional): verbose MIME detection logging.

## Aspect ratios

Both providers accept the same `--aspect` strings. Each renders at a
provider-specific pixel size:

| `--aspect` | nano-banana px | gpt-image px |
|------------|----------------|--------------|
| `1:1` | 1024×1024 | 1024×1024 |
| `16:9` | 1344×768 | 1536×1024 (approx; gpt-image landscape) |
| `9:16` | 768×1344 | 1024×1536 (approx; gpt-image portrait) |
| `4:3` | 1152×896 | 1536×1024 (approx) |
| `3:4` | 896×1152 | 1024×1536 (approx) |
| `3:2` | 1216×832 | 1536×1024 |
| `2:3` | 832×1216 | 1024×1536 |
| `1.91:1` | 1344×704 | 1536×1024 (approx) |

`gpt-image-1` natively supports only the three sizes 1024×1024, 1536×1024,
and 1024×1536. Other user-requested aspects map to the closest supported
size, so the rendered framing is approximate. When OpenAI ships a model
with more flexible sizing (e.g., `gpt-image-2`), update `GPT_IMAGE_SIZES`
in the script.

## Production caveat (read this before shipping)

**Generated images are not optimized for production.** Each output is a
1024×1024 (or larger) PNG, typically 1–2 MB on disk. Shipping these
unmodified will tank your page-load performance — a single 1.5 MB hero
PNG is roughly 30× larger than the same image as a properly tuned WebP
or AVIF.

Before shipping any generated image:
1. Convert to `.avif` (best) or `.webp` (broadest compatibility).
   `cwebp -q 82 -m 6 hero.png -o hero.webp` or
   `avifenc --speed 4 --min 25 --max 35 hero.png hero.avif`.
2. Generate at least two sizes (e.g., 1024 and 2048) and use `<img srcset>`
   so retina screens get the larger asset and others don't.
3. Strip any incidental EXIF/metadata if you care.

This skill outputs the raw artifact. Optimization is a deliberate step
downstream; treat it as required, not optional.

## Prompt crafting

Write prompts like an expert photographer briefing a peer. See
`references/prompt-craft.md` for the full guide.

### Core Principles

1. **Be decisive.** No options. Not "brown or grey hair" — pick one.
2. **Be specific.** "Soft morning light through floor-to-ceiling windows"
   not "natural lighting."
3. **Be technical.** Include camera, lens behavior, depth of field,
   color grading.

### Prompt structure

```
[Subject & Action] + [Environment] + [Style/Mood] + [Technical camera notes]
```

### Quick examples

**Hero background:**
```
Abstract flowing silk ribbons in deep purple and teal, caught mid-motion
against pure black. Soft studio lighting from above, shallow depth of
field, slight motion blur at ribbon edges. High-end cosmetics campaign
aesthetic.
```

**Product mockup environment:**
```
Minimal Scandinavian desk setup, matte white surface, single monstera
leaf in ceramic vase, soft diffused daylight from left. Shot on medium
format, f/2.8, subtle film grain, slightly desaturated warm tones.
```

**Team/person photo:**
```
Professional woman in her 30s, confident posture, wearing navy blazer,
standing in modern glass-walled office. Natural window light, shallow
focus on face, background bokeh showing city skyline. Editorial portrait
style, 85mm equivalent.
```

## Common aspect ratios by use case

| Use case | Recommended `--aspect` |
|----------|------------------------|
| Hero banner | `16:9` |
| Social card | `1.91:1` |
| Feature card | `4:3` |
| Mobile hero | `9:16` |
| Square icon | `1:1` |
| Portrait | `3:4` |

## Adding a new provider

The provider abstraction lives at the bottom of
`scripts/generate_image.py`. To add a third provider (e.g., Midjourney,
Stability, Flux):

1. Add an aspect→size dict near the existing `*_DIMENSIONS` constants
   (or `*_SIZES` if the API takes string sizes).
2. Add a `generate_<provider>()` function that takes
   `(prompt, aspect, output_path, reference_paths)` and writes the bytes
   to `output_path`. Use `http_post_json`, `http_post_multipart`, and
   `write_image` helpers as appropriate.
3. Register the provider in the `PROVIDERS` dict with its env var, the
   aspect-dimensions dict, and the generate function.

The CLI picks up the new name automatically (`--model` choices are
derived from the registry).

## Integration with other skills

Called by `homepage-builder` and `design-shotgun` for section imagery:

```python
# Example: generate a hero image
generate_image(
    prompt="...",
    aspect="16:9",
    output="/brand/images/hero-main.png",
    model="nano-banana",  # or "gpt-image"
)
```
