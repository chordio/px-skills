#!/usr/bin/env bash
# install.sh — symlink-install claude-design-skills into ~/.claude/skills/
#
# Mirrors gstack's user-scope install pattern. Source dir defaults to the
# directory containing this script, so running it from a worktree swaps
# the live symlinks to that worktree. Re-run safely from any checkout.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
SKILLS_DEST="$HOME/.claude/skills"

usage() {
  cat <<'EOF'
Usage: bash install.sh [--check | --force | --uninstall]

Symlinks every skill in ./skills/ into ~/.claude/skills/ so Claude Code
loads them at user scope. Source path defaults to the directory containing
this script — so running it from a worktree swaps the live symlinks to
that worktree.

Options:
  (no flag)     Install (skip entries that already exist)
  --force       Overwrite existing entries
  --check       Print where each symlink currently points
  --uninstall   Remove symlinks created by this script
EOF
}

MODE="install"
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --check)     MODE="check" ;;
    --force)     FORCE=1 ;;
    --uninstall) MODE="uninstall" ;;
    -h|--help)   usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage; exit 1 ;;
  esac
done

[[ -d "$SKILLS_SRC" ]] || { echo "Error: $SKILLS_SRC does not exist" >&2; exit 1; }
mkdir -p "$SKILLS_DEST"

case "$MODE" in
  check)
    printf "%-32s  %s\n" "SKILL" "TARGET"
    printf "%-32s  %s\n" "-----" "------"
    for src in "$SKILLS_SRC"/*/; do
      [[ -d "$src" ]] || continue
      name="$(basename "$src")"
      dest="$SKILLS_DEST/$name"
      src_abs="${src%/}"
      if [[ -L "$dest" ]]; then
        target="$(readlink "$dest")"
        if [[ "$target" == "$src_abs" ]]; then
          printf "%-32s  %s  [ok]\n" "$name" "$target"
        else
          printf "%-32s  %s  [points elsewhere]\n" "$name" "$target"
        fi
      elif [[ -d "$dest" ]]; then
        printf "%-32s  (real directory, not a symlink)\n" "$name"
      else
        printf "%-32s  (not installed)\n" "$name"
      fi
    done
    ;;
  install)
    installed=0; skipped=0; overwrote=0
    for src in "$SKILLS_SRC"/*/; do
      [[ -d "$src" ]] || continue
      name="$(basename "$src")"
      dest="$SKILLS_DEST/$name"
      src_abs="${src%/}"
      if [[ -L "$dest" && "$(readlink "$dest")" == "$src_abs" ]]; then
        echo "  ok      $name"
        skipped=$((skipped+1))
        continue
      fi
      if [[ -e "$dest" || -L "$dest" ]]; then
        if [[ "$FORCE" -eq 1 ]]; then
          rm -rf "$dest"
          overwrote=$((overwrote+1))
        else
          echo "  skip    $name (exists; use --force to overwrite)"
          skipped=$((skipped+1))
          continue
        fi
      fi
      ln -s "$src_abs" "$dest"
      echo "  linked  $name -> $src_abs"
      installed=$((installed+1))
    done
    echo
    echo "Installed: $installed  Overwrote: $overwrote  Skipped: $skipped"
    echo "Verify:    bash install.sh --check"
    ;;
  uninstall)
    removed=0
    for src in "$SKILLS_SRC"/*/; do
      [[ -d "$src" ]] || continue
      name="$(basename "$src")"
      dest="$SKILLS_DEST/$name"
      if [[ -L "$dest" ]]; then
        rm "$dest"
        echo "  removed $name"
        removed=$((removed+1))
      fi
    done
    echo
    echo "Removed: $removed symlink(s)"
    ;;
esac
