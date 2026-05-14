#!/usr/bin/env bash
# refresh-impeccable.sh — pull the latest design-taste references from
# pbakaus/impeccable and report what changed.
#
# Run periodically (e.g. quarterly) to incorporate upstream refinements.
# Diffs are printed but NOT auto-committed — review and commit yourself.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$SCRIPT_DIR/shared/design-taste"
UPSTREAM="https://raw.githubusercontent.com/pbakaus/impeccable/main"

[[ -d "$DEST" ]] || { echo "Error: $DEST does not exist" >&2; exit 1; }

OLD_COMMIT="$(cat "$DEST/.impeccable-commit" 2>/dev/null || echo "(unknown)")"
NEW_COMMIT="$(gh api repos/pbakaus/impeccable/commits/main --jq '.sha' 2>/dev/null || echo "")"

if [[ -z "$NEW_COMMIT" ]]; then
  echo "Could not fetch upstream commit SHA. Is gh CLI authenticated?" >&2
  exit 1
fi

REFS=(typography color-and-contrast spatial-design motion-design interaction-design responsive-design ux-writing heuristics-scoring)

# Self-heal: even if commits match, refetch when any expected file is missing locally
MISSING=0
for f in "${REFS[@]}"; do
  [[ -f "$DEST/${f}.md" ]] || MISSING=$((MISSING+1))
done

if [[ "$OLD_COMMIT" == "$NEW_COMMIT" && "$MISSING" -eq 0 ]]; then
  echo "Already at upstream commit $NEW_COMMIT. Nothing to do."
  exit 0
fi

echo "Refreshing impeccable references"
echo "  was: $OLD_COMMIT"
echo "  now: $NEW_COMMIT"
[[ "$MISSING" -gt 0 ]] && echo "  $MISSING expected file(s) missing locally — will re-fetch"
echo ""

changed=0
failed=0
tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT

for f in "${REFS[@]}"; do
  if curl -fsSL "$UPSTREAM/skill/reference/${f}.md" -o "$tmpdir/${f}.md"; then
    echo "  fetched: ${f}.md"
  else
    echo "  FAIL:    ${f}.md"
    failed=$((failed+1))
  fi
done

if [[ "$failed" -gt 0 ]]; then
  echo ""
  echo "Aborting: $failed reference file(s) failed to download."
  echo "No reference files were updated."
  echo "Pinned commit left unchanged at $OLD_COMMIT."
  exit 1
fi

for f in "${REFS[@]}"; do
  if ! cmp -s "$tmpdir/${f}.md" "$DEST/${f}.md"; then
    echo "  changed: ${f}.md"
    mv "$tmpdir/${f}.md" "$DEST/${f}.md"
    changed=$((changed+1))
  else
    echo "  same:    ${f}.md"
  fi
done

echo "$NEW_COMMIT" > "$DEST/.impeccable-commit"
echo ""
echo "Files changed: $changed"
echo "Review with: git -C \"$SCRIPT_DIR\" diff shared/design-taste/"
echo ""
echo "Note: anti-patterns.md is curated, not auto-fetched. Re-derive manually"
echo "if upstream's SKILL.md 'Absolute bans' section has evolved:"
echo "  curl -fsSL $UPSTREAM/skill/SKILL.md | less"
