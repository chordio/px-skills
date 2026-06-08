#!/usr/bin/env python3
"""Build a clarity-review payload from a publication markdown file.

Splits frontmatter (title / dek / excerpt) from body, produces the three
reveal-level slices a cold reader sees, and dumps heuristic candidate
"must-stand-alone" entities for the agent to curate. Pure stdlib; prints JSON
to stdout; writes nothing.

Reveal levels (what a reader has when they hit a given entity):
  L0  title + dek + excerpt          — what most readers ever see (link preview)
  L1  L0 + the intro (to first ##)   — the "started reading" reader
  L2  L0 + full body                 — the "committed" reader

The script does the mechanical, deterministic part (frontmatter split, slicing,
a rough entity dump). Judgment — which candidates actually must stand alone, and
whether each resolves — is the cold-reader panel's job, not the script's.

Usage:
  python3 build-clarity-payload.py --file path/to/article.md
  cat draft.md | python3 build-clarity-payload.py --stdin
"""
import argparse
import json
import re
import sys
from pathlib import Path

FM_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_frontmatter(text):
    """Return (frontmatter dict, body). Minimal one-line `key: value` YAML."""
    m = FM_RE.match(text)
    if not m:
        return {}, text
    fm = {}
    for line in m.group(1).splitlines():
        mm = re.match(r"^([A-Za-z0-9_]+):\s*(.*)$", line)
        if not mm:
            continue
        key, val = mm.group(1), mm.group(2).strip()
        if len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'":
            val = val[1:-1]
        fm[key] = val
    return fm, text[m.end():]


def first_section(body):
    """Body up to the first level-2+ heading — the lede / intro."""
    out = []
    for ln in body.splitlines():
        if re.match(r"^#{2,}\s", ln):
            break
        out.append(ln)
    return "\n".join(out).strip()


def paragraphs(text):
    return [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]


def candidate_entities(intro, dek):
    """Heuristic dump of things that often must stand alone. Noisy by design —
    the agent curates. We flag: emphasized/quoted coinages, and definite noun
    phrases ('the X') in the intro, the classic curse-of-knowledge suspects."""
    found = {}

    def add(term, kind):
        term = term.strip()
        key = term.lower()
        if not key:
            return
        found.setdefault(key, {"term": term, "kinds": set()})["kinds"].add(kind)

    blob = dek + "\n" + intro
    for m in re.finditer(r"\*([^*\n]{2,40})\*", blob):
        add(m.group(1), "emphasis")
    for m in re.finditer(r"[\"“]([^\"“”\n]{2,40})[\"”]", blob):
        add(m.group(1), "quoted")
    # definite NP head noun ('the X') across dek + intro — the classic
    # curse-of-knowledge suspect. Head noun only; multi-word verb spillover
    # ("the agent decides where") is more noise than signal, and the curator
    # adds genuine compound terms by hand. Dek included: it's L0.
    # Skip the word after 'the' when it's an adjective/ordinal, not a noun head.
    nonhead = {
        "right", "wrong", "first", "second", "third", "other", "same",
        "finished", "only", "whole", "next", "last", "best", "worst", "two",
    }
    for m in re.finditer(r"\b[Tt]he ([a-z][a-z-]{2,})\b", blob):
        head = m.group(1).lower()
        if head not in nonhead:
            add("the " + head, "definite-NP")

    return sorted(
        ({"term": v["term"], "kinds": sorted(v["kinds"])} for v in found.values()),
        key=lambda d: d["term"].lower(),
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--file", help="path to a publication markdown file")
    ap.add_argument("--stdin", action="store_true", help="read draft from stdin")
    args = ap.parse_args()

    if args.stdin:
        raw, src = sys.stdin.read(), "<stdin>"
    elif args.file:
        raw, src = Path(args.file).read_text(encoding="utf-8"), args.file
    else:
        ap.error("pass --file <path> or --stdin")

    fm, body = parse_frontmatter(raw)
    title, dek, excerpt = fm.get("title", ""), fm.get("dek", ""), fm.get("excerpt", "")
    intro = first_section(body)

    l0 = "\n".join(
        x for x in (
            f"TITLE: {title}" if title else "",
            f"DEK: {dek}" if dek else "",
            f"EXCERPT: {excerpt}" if excerpt else "",
        ) if x
    )
    l1 = (l0 + "\n\n" + intro).strip()
    l2 = (l0 + "\n\n" + body).strip()

    payload = {
        "source": src,
        "title": title,
        "dek": dek,
        "excerpt": excerpt,
        "reveal_levels": {
            "L0_dek_only": l0,
            "L1_plus_intro": l1,
            "L2_full": l2,
        },
        "intro_paragraph_count": len(paragraphs(intro)),
        "candidate_entities": candidate_entities(intro, dek),
        "note": (
            "candidate_entities are heuristic — curate before probing. "
            "L0 is what most readers ever see; weight L0 defects highest."
        ),
    }
    json.dump(payload, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
