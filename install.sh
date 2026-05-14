#!/usr/bin/env bash
# install.sh — symlink-install claude-design-skills into ~/.claude/skills/
#                + register the gstack-bridge SessionStart hook
#
# Mirrors gstack's user-scope install pattern. Source dir defaults to the
# directory containing this script, so running it from a worktree swaps
# the live symlinks to that worktree. Re-run safely from any checkout.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
SKILLS_DEST="$HOME/.claude/skills"
BRIDGE_BIN="$SCRIPT_DIR/bin/chordio-bridge"
SETTINGS_FILE="${CLAUDE_SETTINGS_FILE:-$HOME/.claude/settings.json}"
HOOK_MATCHER='chordio-bridge'   # substring used to find/remove our hook entries

usage() {
  cat <<'EOF'
Usage: bash install.sh [--check | --force | --uninstall] [--no-bridge]

Symlinks every skill in ./skills/ into ~/.claude/skills/ so Claude Code
loads them at user scope. Also registers a SessionStart hook that keeps
gstack's design skills patched with chordio's taste references (skipped
if gstack is not installed).

Source path defaults to the directory containing this script — so running
it from a worktree swaps the live symlinks to that worktree.

Options:
  (no flag)     Install symlinks + register bridge hook + run an initial bridge pass
  --force       Overwrite existing symlinks
  --check       Print symlink status + bridge hook status + bridge state
  --uninstall   Remove symlinks and the bridge hook
  --no-bridge   Skip bridge hook registration (skills-only install)
EOF
}

MODE="install"
FORCE=0
NO_BRIDGE=0
for arg in "$@"; do
  case "$arg" in
    --check)      MODE="check" ;;
    --force)      FORCE=1 ;;
    --uninstall)  MODE="uninstall" ;;
    --no-bridge)  NO_BRIDGE=1 ;;
    -h|--help)    usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage; exit 1 ;;
  esac
done

[[ -d "$SKILLS_SRC" ]] || { echo "Error: $SKILLS_SRC does not exist" >&2; exit 1; }
mkdir -p "$SKILLS_DEST"

# ─── Bridge hook helpers (settings.json manipulation via jq) ────────────

has_jq() { command -v jq >/dev/null 2>&1; }

gstack_installed() {
  [[ -d "${GSTACK_SKILLS_ROOT:-$HOME/.claude/skills/gstack}" ]]
}

# Idempotent: adds a SessionStart hook entry pointing at chordio-bridge if
# one isn't already present. Writes settings.json atomically.
bridge_hook_install() {
  if ! has_jq; then
    echo "  bridge: jq not found — cannot register hook automatically." >&2
    echo "          install jq (brew install jq), then re-run install.sh" >&2
    return 1
  fi
  [[ -f "$BRIDGE_BIN" ]] || { echo "  bridge: $BRIDGE_BIN not found, skipping" >&2; return 1; }

  mkdir -p "$(dirname "$SETTINGS_FILE")"
  [[ -f "$SETTINGS_FILE" ]] || echo '{}' > "$SETTINGS_FILE"

  if bridge_hook_present; then
    echo "  bridge: SessionStart hook already registered"
    return 0
  fi

  local hook_cmd="$BRIDGE_BIN --quiet"
  local tmp="$SETTINGS_FILE.tmp.$$"

  if ! jq --arg cmd "$hook_cmd" --arg match "$HOOK_MATCHER" '
    .hooks //= {}
    | .hooks.SessionStart //= []
    | .hooks.SessionStart += [{ "hooks": [{ "type": "command", "command": $cmd }] }]
  ' "$SETTINGS_FILE" > "$tmp"; then
    rm -f "$tmp"
    echo "  bridge: failed to parse $SETTINGS_FILE" >&2
    return 1
  fi

  if ! mv "$tmp" "$SETTINGS_FILE"; then
    rm -f "$tmp"
    echo "  bridge: failed to update $SETTINGS_FILE" >&2
    return 1
  fi

  echo "  bridge: SessionStart hook registered in $SETTINGS_FILE"
}

bridge_hook_uninstall() {
  has_jq || { echo "  bridge: jq not found — cannot edit settings.json" >&2; return 1; }
  [[ -f "$SETTINGS_FILE" ]] || { echo "  bridge: no settings.json — nothing to remove"; return 0; }

  local tmp="$SETTINGS_FILE.tmp.$$"
  if ! jq --arg match "$HOOK_MATCHER" '
    if .hooks.SessionStart then
      .hooks.SessionStart |= map(
        select(
          any(.hooks[]?; (.command // "") | test($match)) | not
        )
      )
      | if .hooks.SessionStart == [] then del(.hooks.SessionStart) else . end
      | if (.hooks // {}) == {} then del(.hooks) else . end
    else . end
  ' "$SETTINGS_FILE" > "$tmp"; then
    rm -f "$tmp"
    echo "  bridge: failed to parse $SETTINGS_FILE" >&2
    return 1
  fi

  if ! mv "$tmp" "$SETTINGS_FILE"; then
    rm -f "$tmp"
    echo "  bridge: failed to update $SETTINGS_FILE" >&2
    return 1
  fi

  echo "  bridge: SessionStart hook removed"
}

bridge_hook_present() {
  has_jq || return 1
  [[ -f "$SETTINGS_FILE" ]] || return 1
  jq -e --arg match "$HOOK_MATCHER" '
    (.hooks.SessionStart // [])
    | any(.[]?; any(.hooks[]?; (.command // "") | test($match)))
  ' "$SETTINGS_FILE" > /dev/null 2>&1
}

# ─── Mode dispatch ──────────────────────────────────────────────────────

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

    echo
    echo "Bridge:"
    if bridge_hook_present; then
      echo "  SessionStart hook: registered in $SETTINGS_FILE"
    else
      echo "  SessionStart hook: not registered"
    fi
    if [[ -x "$BRIDGE_BIN" ]]; then
      echo "  bridge state:"
      "$BRIDGE_BIN" --check 2>&1 | sed 's/^/    /'
    else
      echo "  bridge binary: $BRIDGE_BIN (missing or not executable)"
    fi
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
    echo "Symlinks:  installed $installed  overwrote $overwrote  skipped $skipped"

    if [[ "$NO_BRIDGE" -eq 0 ]]; then
      echo
      echo "Bridge:"
      if ! gstack_installed; then
        echo "  bridge: gstack not installed — skipping hook registration"
      elif bridge_hook_install; then
        echo "  running initial bridge pass..."
        "$BRIDGE_BIN" 2>&1 | sed 's/^/    /' || true
      fi
    fi

    echo
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
    echo "Symlinks: removed $removed"

    if [[ "$NO_BRIDGE" -eq 0 ]]; then
      echo
      echo "Bridge:"
      bridge_hook_uninstall || true
      echo "  (gstack SKILL.md.tmpl patches left in place — they'll fall through harmlessly without chordio's refs)"
      echo "  (bridge state file at \$CHORDIO_ROOT/.bridge-state left in place)"
    fi
    ;;
esac
