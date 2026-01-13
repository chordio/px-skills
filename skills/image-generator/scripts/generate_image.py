#!/usr/bin/env python3
"""
Generate images using Vercel AI Gateway with Nano Banana (Gemini 3 Pro Image).

Usage:
    python generate_image.py --prompt "..." --aspect "16:9" --output "image.webp"
    python generate_image.py --prompt "..." --aspect "1:1" --output "icon.webp" --reference "style.png"
    python generate_image.py --prompt "..." --aspect "4:3" --output "out.webp" --reference "img1.png" --reference "img2.png"

Supports multiple --reference images for multi-pass workflows (e.g., material + logo).

Requires AI_GATEWAY_API_KEY environment variable.
"""

import argparse
import base64
import json
import os
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# Debug mode - set via --debug flag
DEBUG = False


def load_env_file():
    """Load environment variables from .env file in project root."""
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

# Vercel AI Gateway endpoint
GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh/v1/ai"
MODEL = "google/gemini-3-pro-image"  # Gemini 3 Pro Image

# Aspect ratio mappings
ASPECT_DIMENSIONS = {
    "1:1": (1024, 1024),
    "16:9": (1344, 768),
    "9:16": (768, 1344),
    "4:3": (1152, 896),
    "3:4": (896, 1152),
    "3:2": (1216, 832),
    "2:3": (832, 1216),
    "1.91:1": (1344, 704),
}


def detect_image_mime_type(base64_data: str, file_path: str = "") -> str:
    """Detect image MIME type from base64-encoded data using magic bytes.

    Args:
        base64_data: Base64-encoded image data
        file_path: Optional file path for debug output

    Returns:
        MIME type string (e.g., "image/png", "image/jpeg")
    """
    # Decode enough bytes to check magic numbers (first 16 bytes is plenty)
    try:
        raw_bytes = base64.b64decode(base64_data[:24])  # 24 base64 chars = 18 bytes
    except Exception as e:
        if DEBUG:
            print(f"[DEBUG] Failed to decode base64 for {file_path}: {e}", file=sys.stderr)
        return "image/png"  # Fallback

    if DEBUG:
        # Show first 16 bytes as hex for debugging
        hex_bytes = ' '.join(f'{b:02x}' for b in raw_bytes[:16])
        print(f"[DEBUG] {file_path} magic bytes: {hex_bytes}", file=sys.stderr)

    # Check magic bytes for common image formats
    if raw_bytes[:8] == b'\x89PNG\r\n\x1a\n':
        mime_type = "image/png"
    elif raw_bytes[:3] == b'\xff\xd8\xff':
        mime_type = "image/jpeg"
    elif raw_bytes[:4] == b'RIFF' and raw_bytes[8:12] == b'WEBP':
        mime_type = "image/webp"
    elif raw_bytes[:6] in (b'GIF87a', b'GIF89a'):
        mime_type = "image/gif"
    elif raw_bytes[:4] == b'<svg' or raw_bytes[:5] == b'<?xml':
        mime_type = "image/svg+xml"
    else:
        # Default fallback
        mime_type = "image/png"
        if DEBUG:
            print(f"[DEBUG] {file_path}: Unknown format, defaulting to image/png", file=sys.stderr)

    if DEBUG:
        print(f"[DEBUG] {file_path} detected as: {mime_type}", file=sys.stderr)

    return mime_type


def generate_image(
    prompt: str,
    aspect: str,
    output_path: str,
    reference_paths: list[str] | None = None,
) -> None:
    """Generate an image using Vercel AI Gateway.

    Args:
        prompt: The image generation prompt
        aspect: Aspect ratio (e.g., "16:9", "4:3", "1:1")
        output_path: Where to save the generated image
        reference_paths: Optional list of reference image paths for style/composition guidance
    """

    api_key = os.environ.get("AI_GATEWAY_API_KEY")
    if not api_key:
        print("Error: AI_GATEWAY_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    if aspect not in ASPECT_DIMENSIONS:
        print(f"Error: Unknown aspect ratio '{aspect}'", file=sys.stderr)
        print(f"Supported: {', '.join(ASPECT_DIMENSIONS.keys())}", file=sys.stderr)
        sys.exit(1)

    # Build request payload for the language-model endpoint (Gemini 3 Pro Image uses text generation)
    width, height = ASPECT_DIMENSIONS[aspect]
    image_prompt = f"Generate an image with aspect ratio {aspect} ({width}x{height}): {prompt}"

    # Build content parts - start with any reference images, then text prompt
    content_parts = []

    if reference_paths:
        for ref_path in reference_paths:
            if not os.path.exists(ref_path):
                print(f"Error: Reference image not found: {ref_path}", file=sys.stderr)
                sys.exit(1)

            # Read and encode the reference image
            with open(ref_path, "rb") as f:
                ref_image_data = base64.b64encode(f.read()).decode("utf-8")

            # Determine mime type from actual file content (magic bytes)
            mime_type = detect_image_mime_type(ref_image_data, ref_path)

            # Add reference image to content
            content_parts.append({
                "type": "file",
                "data": ref_image_data,
                "mediaType": mime_type,
            })

        # Modify prompt to reference the images
        if len(reference_paths) == 1:
            image_prompt = f"Using the image provided above, {prompt}. Generate an image with aspect ratio {aspect} ({width}x{height})."
        else:
            image_prompt = f"Using the {len(reference_paths)} images provided above, {prompt}. Generate an image with aspect ratio {aspect} ({width}x{height})."

    # Add text prompt
    content_parts.append({"type": "text", "text": image_prompt})

    payload = {
        "prompt": [
            {"role": "user", "content": content_parts}
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "ai-gateway-protocol-version": "0.0.1",
        "ai-language-model-specification-version": "2",
        "ai-model-id": MODEL,
    }

    url = f"{GATEWAY_BASE_URL}/language-model"

    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlopen(request, timeout=120) as response:
            result = json.loads(response.read().decode("utf-8"))
    except HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else "Unknown error"
        print(f"API Error ({e.code}): {error_body}", file=sys.stderr)
        sys.exit(1)

    # Extract image from response - Gemini 3 returns images inline in content parts
    # Response format: { content: [{ type: "text", text: "..." }, { type: "file", data: "base64...", mimeType: "image/png" }] }
    content = result.get("content", [])
    image_data = None

    for part in content:
        mime_type = part.get("mimeType") or part.get("mediaType") or ""
        if part.get("type") == "file" and mime_type.startswith("image/"):
            image_data = part.get("data")
            break

    if not image_data:
        print("Error: No image generated", file=sys.stderr)
        print(f"Response: {json.dumps(result, indent=2)}", file=sys.stderr)
        sys.exit(1)

    # Decode base64 image
    image_bytes = base64.b64decode(image_data)

    # Ensure output directory exists
    output_dir = Path(output_path).parent
    if output_dir and str(output_dir) != ".":
        output_dir.mkdir(parents=True, exist_ok=True)

    # Save image
    with open(output_path, "wb") as f:
        f.write(image_bytes)

    print(f"Generated: {output_path} ({width}x{height})")


def main():
    parser = argparse.ArgumentParser(
        description="Generate images using Vercel AI Gateway (Nano Banana)"
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Detailed image description",
    )
    parser.add_argument(
        "--aspect",
        required=True,
        help=f"Aspect ratio: {', '.join(ASPECT_DIMENSIONS.keys())}",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Output file path",
    )
    parser.add_argument(
        "--reference",
        action="append",
        dest="references",
        help="Reference image(s) for style/composition guidance. Can be specified multiple times.",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Enable debug output showing mime type detection details.",
    )

    args = parser.parse_args()

    # Set global debug flag
    global DEBUG
    DEBUG = args.debug

    generate_image(
        prompt=args.prompt,
        aspect=args.aspect,
        output_path=args.output,
        reference_paths=args.references,
    )


if __name__ == "__main__":
    main()
