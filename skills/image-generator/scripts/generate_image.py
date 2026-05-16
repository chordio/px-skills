#!/usr/bin/env python3
"""
Generate images via a configurable provider registry.

Currently supported providers:
  - nano-banana  Vercel AI Gateway → Gemini 3 Pro Image (Nano Banana)
  - gpt-image    OpenAI's images API (default gpt-image-1)

Usage:
    # Default model (nano-banana)
    python generate_image.py --prompt "..." --aspect "1:1" --output "out.png"

    # Specific model
    python generate_image.py --prompt "..." --aspect "1:1" --output "out.png" \
        --model gpt-image

    # Multi-model (one image per provider, each suffixed)
    python generate_image.py --prompt "..." --aspect "1:1" --output "hero.png" \
        --model nano-banana --model gpt-image

    # Reference images (supported by both providers; repeatable)
    python generate_image.py --prompt "..." --aspect "1:1" --output "out.png" \
        --reference style.png

Environment:
  AI_GATEWAY_API_KEY   required for nano-banana
                       (Vercel AI Gateway token, https://vercel.com/dashboard)
  OPENAI_API_KEY       required for gpt-image
                       (https://platform.openai.com/api-keys)
  GPT_IMAGE_MODEL      optional override for the gpt-image model id; defaults
                       to "gpt-image-1". Set to "gpt-image-2" (or future)
                       when those ship without editing this script.

The script auto-loads a `.env` file from cwd up to the home directory.

Production caveat:
  Generated images are 1024x1024 or larger and not size-optimized. Typical
  PNG output is 1–2 MB. Before shipping, convert to avif/webp and add a
  srcset; otherwise hero loads will be unnecessarily slow.

Adding a new provider:
  1. Add an aspect→size dict and a generate_<name>() function below.
  2. Register it in the PROVIDERS dict with its env var.
  3. That's it — `--model <name>` will be available in the CLI.

Reference image notes:
  - nano-banana: references go inline in the chat-style content array
    (Vercel Gateway → Gemini 3 Pro Image accepts file parts there).
  - gpt-image: references trigger the /v1/images/edits endpoint instead
    of /v1/images/generations. Edits use multipart/form-data with one
    "image" form part per reference. Mask is optional and not used by
    this skill. Field reference: OpenAI Python SDK src/openai/resources/
    images.py (paths=[["image"], ["image", "<array>"], ["mask"]]).
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import uuid
from dataclasses import dataclass
from pathlib import Path
from typing import Callable
from urllib.request import Request, urlopen
from urllib.error import HTTPError

DEBUG = False


# ──────────────────────────────────────────────────────────────────────
# .env loader
# ──────────────────────────────────────────────────────────────────────

def load_env_file() -> None:
    """Load env vars from a `.env` file in cwd or any ancestor directory."""
    current = Path.cwd()
    for directory in [current] + list(current.parents):
        env_file = directory / ".env"
        if env_file.exists():
            with open(env_file) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        os.environ.setdefault(key.strip(), value.strip())
            break


load_env_file()


# ──────────────────────────────────────────────────────────────────────
# Shared helpers
# ──────────────────────────────────────────────────────────────────────

def detect_image_mime_type(base64_data: str, file_path: str = "") -> str:
    """Detect image MIME type from base64-encoded data using magic bytes."""
    try:
        raw = base64.b64decode(base64_data[:24])
    except Exception as e:
        if DEBUG:
            print(f"[DEBUG] base64 decode failed for {file_path}: {e}", file=sys.stderr)
        return "image/png"

    if raw[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if raw[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
        return "image/webp"
    if raw[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if raw[:4] == b"<svg" or raw[:5] == b"<?xml":
        return "image/svg+xml"
    return "image/png"


def detect_mime_from_bytes(raw: bytes) -> str:
    """Detect MIME type directly from raw bytes (first 16 are plenty)."""
    if raw[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if raw[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if raw[:4] == b"RIFF" and raw[8:12] == b"WEBP":
        return "image/webp"
    if raw[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    return "application/octet-stream"


def http_post_json(url: str, headers: dict, payload: dict, timeout: int = 120) -> dict:
    """POST a JSON payload and return the parsed JSON response."""
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    try:
        with urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as e:
        body = e.read().decode("utf-8") if e.fp else "Unknown error"
        raise RuntimeError(f"API error ({e.code}): {body}")


def encode_multipart(fields: list[tuple]) -> tuple[bytes, str]:
    """
    Build a multipart/form-data body from fields.

    Each field is a tuple:
      (name: str, filename: str | None, content_type: str | None, value: str | bytes)

    If filename is None, the field is treated as a plain text part and
    content_type is ignored. If filename is set, the field is a file part
    with the given content_type (defaulting to application/octet-stream).

    Multiple fields can share the same name (e.g. multiple "image" parts).
    Returns (body_bytes, "multipart/form-data; boundary=...").
    """
    boundary = f"----imageGenBoundary{uuid.uuid4().hex}"
    crlf = b"\r\n"
    chunks: list[bytes] = []
    for name, filename, content_type, value in fields:
        chunks.append(f"--{boundary}".encode())
        if filename is None:
            chunks.append(
                f'Content-Disposition: form-data; name="{name}"'.encode()
            )
            chunks.append(b"")
            chunks.append(value.encode() if isinstance(value, str) else value)
        else:
            ct = content_type or "application/octet-stream"
            chunks.append(
                f'Content-Disposition: form-data; name="{name}"; filename="{filename}"'.encode()
            )
            chunks.append(f"Content-Type: {ct}".encode())
            chunks.append(b"")
            chunks.append(value if isinstance(value, bytes) else value.encode())
    chunks.append(f"--{boundary}--".encode())
    chunks.append(b"")
    body = crlf.join(chunks)
    return body, f"multipart/form-data; boundary={boundary}"


def http_post_multipart(
    url: str, headers: dict, fields: list[tuple], timeout: int = 180
) -> dict:
    """POST a multipart/form-data body and return the parsed JSON response."""
    body, content_type = encode_multipart(fields)
    request_headers = dict(headers)
    request_headers["Content-Type"] = content_type
    request_headers["Content-Length"] = str(len(body))
    request = Request(url, data=body, headers=request_headers, method="POST")
    try:
        with urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as e:
        err = e.read().decode("utf-8") if e.fp else "Unknown error"
        raise RuntimeError(f"API error ({e.code}): {err}")


def write_image(image_bytes: bytes, output_path: str) -> None:
    """Write bytes to output_path, creating parent dirs if needed."""
    parent = Path(output_path).parent
    if parent and str(parent) != ".":
        parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(image_bytes)


# ──────────────────────────────────────────────────────────────────────
# Provider: nano-banana (Vercel AI Gateway → Gemini 3 Pro Image)
# ──────────────────────────────────────────────────────────────────────

NANO_BANANA_DIMENSIONS = {
    "1:1": (1024, 1024),
    "16:9": (1344, 768),
    "9:16": (768, 1344),
    "4:3": (1152, 896),
    "3:4": (896, 1152),
    "3:2": (1216, 832),
    "2:3": (832, 1216),
    "1.91:1": (1344, 704),
}

NANO_BANANA_ENDPOINT = "https://ai-gateway.vercel.sh/v1/ai/language-model"
NANO_BANANA_MODEL_ID = "google/gemini-3-pro-image"


def generate_nano_banana(
    prompt: str,
    aspect: str,
    output_path: str,
    reference_paths: list | None = None,
) -> tuple:
    api_key = os.environ.get("AI_GATEWAY_API_KEY")
    if not api_key:
        raise RuntimeError(
            "nano-banana requires AI_GATEWAY_API_KEY (Vercel AI Gateway). "
            "Get one at https://vercel.com/dashboard then add to your .env."
        )

    if aspect not in NANO_BANANA_DIMENSIONS:
        raise RuntimeError(
            f"nano-banana does not support aspect '{aspect}'. "
            f"Supported: {', '.join(NANO_BANANA_DIMENSIONS.keys())}"
        )

    width, height = NANO_BANANA_DIMENSIONS[aspect]
    text_prompt = f"Generate an image with aspect ratio {aspect} ({width}x{height}): {prompt}"

    content_parts: list = []
    if reference_paths:
        for ref_path in reference_paths:
            if not os.path.exists(ref_path):
                raise RuntimeError(f"Reference image not found: {ref_path}")
            with open(ref_path, "rb") as f:
                ref_data = base64.b64encode(f.read()).decode("utf-8")
            mime_type = detect_image_mime_type(ref_data, ref_path)
            content_parts.append({"type": "file", "data": ref_data, "mediaType": mime_type})
        noun = "image" if len(reference_paths) == 1 else f"{len(reference_paths)} images"
        text_prompt = (
            f"Using the {noun} provided above, {prompt}. "
            f"Generate an image with aspect ratio {aspect} ({width}x{height})."
        )
    content_parts.append({"type": "text", "text": text_prompt})

    payload = {"prompt": [{"role": "user", "content": content_parts}]}
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "ai-gateway-protocol-version": "0.0.1",
        "ai-language-model-specification-version": "2",
        "ai-model-id": NANO_BANANA_MODEL_ID,
    }

    result = http_post_json(NANO_BANANA_ENDPOINT, headers, payload, timeout=120)

    image_data = None
    for part in result.get("content", []):
        mime_type = part.get("mimeType") or part.get("mediaType") or ""
        if part.get("type") == "file" and mime_type.startswith("image/"):
            image_data = part.get("data")
            break

    if not image_data:
        raise RuntimeError(f"No image in nano-banana response: {json.dumps(result)[:500]}")

    write_image(base64.b64decode(image_data), output_path)
    return width, height


# ──────────────────────────────────────────────────────────────────────
# Provider: gpt-image (OpenAI images API)
# ──────────────────────────────────────────────────────────────────────
#
# gpt-image-1 natively supports three sizes: 1024x1024 (1:1), 1536x1024
# (≈3:2 landscape), 1024x1536 (≈2:3 portrait). Other user-requested
# aspect ratios map to the closest supported size; the rendered framing
# is approximate. Update GPT_IMAGE_SIZES when newer models support more.
#
# Two endpoints:
#   - /v1/images/generations (JSON, no references)
#   - /v1/images/edits       (multipart, one or more "image" form parts;
#                            mask optional, not used here)

GPT_IMAGE_SIZES = {
    "1:1": "1024x1024",
    "16:9": "1536x1024",
    "9:16": "1024x1536",
    "4:3": "1536x1024",
    "3:4": "1024x1536",
    "3:2": "1536x1024",
    "2:3": "1024x1536",
    "1.91:1": "1536x1024",
}

GPT_IMAGE_GENERATIONS_ENDPOINT = "https://api.openai.com/v1/images/generations"
GPT_IMAGE_EDITS_ENDPOINT = "https://api.openai.com/v1/images/edits"
GPT_IMAGE_DEFAULT_MODEL = "gpt-image-1"
# Override via env var GPT_IMAGE_MODEL (e.g., set to "gpt-image-2" when shipped).


def generate_gpt_image(
    prompt: str,
    aspect: str,
    output_path: str,
    reference_paths: list | None = None,
) -> tuple:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "gpt-image requires OPENAI_API_KEY. "
            "Get one at https://platform.openai.com/api-keys then add to your .env."
        )

    if aspect not in GPT_IMAGE_SIZES:
        raise RuntimeError(
            f"gpt-image does not support aspect '{aspect}'. "
            f"Supported: {', '.join(GPT_IMAGE_SIZES.keys())}"
        )

    size = GPT_IMAGE_SIZES[aspect]
    width, height = (int(x) for x in size.split("x"))
    model_id = os.environ.get("GPT_IMAGE_MODEL", GPT_IMAGE_DEFAULT_MODEL)
    auth = {"Authorization": f"Bearer {api_key}"}

    if reference_paths:
        # Route via /v1/images/edits with one "image" part per reference.
        fields: list = [
            ("model", None, None, model_id),
            ("prompt", None, None, prompt),
            ("n", None, None, "1"),
            ("size", None, None, size),
        ]
        for ref_path in reference_paths:
            if not os.path.exists(ref_path):
                raise RuntimeError(f"Reference image not found: {ref_path}")
            with open(ref_path, "rb") as f:
                ref_bytes = f.read()
            mime = detect_mime_from_bytes(ref_bytes)
            if mime not in ("image/png", "image/jpeg", "image/webp"):
                raise RuntimeError(
                    f"gpt-image only accepts PNG, JPEG, or WebP references; "
                    f"got {mime} for {ref_path}."
                )
            filename = Path(ref_path).name or "reference.png"
            fields.append(("image", filename, mime, ref_bytes))

        result = http_post_multipart(
            GPT_IMAGE_EDITS_ENDPOINT, auth, fields, timeout=240
        )
    else:
        payload = {
            "model": model_id,
            "prompt": prompt,
            "n": 1,
            "size": size,
        }
        headers = {**auth, "Content-Type": "application/json"}
        result = http_post_json(
            GPT_IMAGE_GENERATIONS_ENDPOINT, headers, payload, timeout=180
        )

    items = result.get("data", [])
    if not items:
        raise RuntimeError(f"No image in gpt-image response: {json.dumps(result)[:500]}")

    item = items[0]
    image_bytes: bytes | None = None
    if item.get("b64_json"):
        image_bytes = base64.b64decode(item["b64_json"])
    elif item.get("url"):
        with urlopen(item["url"], timeout=60) as response:
            image_bytes = response.read()

    if not image_bytes:
        raise RuntimeError(f"No image data in gpt-image response: {json.dumps(item)[:500]}")

    write_image(image_bytes, output_path)
    return width, height


# ──────────────────────────────────────────────────────────────────────
# Provider registry — add new providers here
# ──────────────────────────────────────────────────────────────────────

@dataclass
class Provider:
    name: str
    env_var: str
    aspect_dimensions: dict
    generate_fn: Callable


PROVIDERS: dict = {
    "nano-banana": Provider(
        name="nano-banana",
        env_var="AI_GATEWAY_API_KEY",
        aspect_dimensions=NANO_BANANA_DIMENSIONS,
        generate_fn=generate_nano_banana,
    ),
    "gpt-image": Provider(
        name="gpt-image",
        env_var="OPENAI_API_KEY",
        aspect_dimensions={
            k: tuple(int(x) for x in v.split("x"))
            for k, v in GPT_IMAGE_SIZES.items()
        },
        generate_fn=generate_gpt_image,
    ),
}

DEFAULT_PROVIDER = "nano-banana"


# ──────────────────────────────────────────────────────────────────────
# CLI
# ──────────────────────────────────────────────────────────────────────

def suffix_output(output_path: str, suffix: str) -> str:
    """Insert -suffix before the file extension. hero.png + nano-banana -> hero-nano-banana.png"""
    p = Path(output_path)
    return str(p.with_name(f"{p.stem}-{suffix}{p.suffix}"))


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate images via configurable AI providers."
    )
    parser.add_argument("--prompt", required=True, help="Image generation prompt.")
    parser.add_argument("--aspect", required=True, help="Aspect ratio (e.g., 1:1, 16:9, 4:3).")
    parser.add_argument(
        "--output",
        required=True,
        help="Output path. With multiple --model, each run writes to <base>-<provider>.<ext>.",
    )
    parser.add_argument(
        "--model",
        action="append",
        dest="models",
        choices=list(PROVIDERS.keys()),
        help=f"Provider to use, repeatable for multi-model. Default: {DEFAULT_PROVIDER}.",
    )
    parser.add_argument(
        "--reference",
        action="append",
        dest="references",
        help="Reference image path; repeatable. Supported by both providers.",
    )
    parser.add_argument("--debug", action="store_true", help="Enable debug logging.")
    args = parser.parse_args()

    global DEBUG
    DEBUG = args.debug

    models = args.models or [DEFAULT_PROVIDER]
    multi = len(models) > 1

    successes: list = []
    failures: list = []

    for model_name in models:
        provider = PROVIDERS[model_name]
        out_path = suffix_output(args.output, model_name) if multi else args.output
        try:
            w, h = provider.generate_fn(
                prompt=args.prompt,
                aspect=args.aspect,
                output_path=out_path,
                reference_paths=args.references,
            )
            print(f"Generated ({model_name}): {out_path} ({w}x{h})")
            successes.append(out_path)
        except Exception as e:
            failures.append((model_name, str(e)))
            print(f"FAILED ({model_name}): {e}", file=sys.stderr)

    if failures and not successes:
        sys.exit(1)

    print(
        "\nProduction note: output is ~1–2 MB unoptimized PNG. "
        "Convert to avif/webp and add a srcset before shipping.",
        file=sys.stderr,
    )


if __name__ == "__main__":
    main()
