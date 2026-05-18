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

APIKEY_BIN_SRC="$SCRIPT_DIR/bin/apikey"
APIKEY_BIN_DEST="$HOME/.local/bin/apikey"
APIKEY_CONFIG_SRC="$SCRIPT_DIR/config/apikey/services.yaml"
APIKEY_CONFIG_DEST="$HOME/.config/apikey/services.yaml"

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
  (no flag)     Install symlinks + register bridge hook + install apikey CLI
  --force       Overwrite existing symlinks
  --check       Print symlink status + bridge hook status + apikey status
  --uninstall   Remove symlinks, bridge hook, and apikey symlink (config preserved)
  --no-bridge   Skip bridge hook registration
  --no-apikey   Skip apikey CLI install
EOF
}

MODE="install"
FORCE=0
NO_BRIDGE=0
NO_APIKEY=0
for arg in "$@"; do
  case "$arg" in
    --check)      MODE="check" ;;
    --force)      FORCE=1 ;;
    --uninstall)  MODE="uninstall" ;;
    --no-bridge)  NO_BRIDGE=1 ;;
    --no-apikey)  NO_APIKEY=1 ;;
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

# ─── apikey CLI helpers ────────────────────────────────────────────────

apikey_install() {
  [[ -f "$APIKEY_BIN_SRC" ]] || { echo "  apikey: $APIKEY_BIN_SRC not found, skipping" >&2; return 1; }

  mkdir -p "$(dirname "$APIKEY_BIN_DEST")"

  # Symlink the CLI so repo updates flow through
  if [[ -L "$APIKEY_BIN_DEST" && "$(readlink "$APIKEY_BIN_DEST")" == "$APIKEY_BIN_SRC" ]]; then
    echo "  apikey: CLI symlink already in place"
  else
    if [[ -e "$APIKEY_BIN_DEST" || -L "$APIKEY_BIN_DEST" ]]; then
      if [[ "$FORCE" -eq 1 ]]; then
        rm -f "$APIKEY_BIN_DEST"
      else
        echo "  apikey: $APIKEY_BIN_DEST exists; use --force to overwrite"
        return 0
      fi
    fi
    ln -s "$APIKEY_BIN_SRC" "$APIKEY_BIN_DEST"
    chmod +x "$APIKEY_BIN_SRC"
    echo "  apikey: linked $APIKEY_BIN_DEST -> $APIKEY_BIN_SRC"
  fi

  # Seed the config IFF it doesn't exist (never overwrite user edits)
  mkdir -p "$(dirname "$APIKEY_CONFIG_DEST")"
  if [[ -f "$APIKEY_CONFIG_DEST" ]]; then
    echo "  apikey: config already exists at $APIKEY_CONFIG_DEST (preserved)"
  else
    cp "$APIKEY_CONFIG_SRC" "$APIKEY_CONFIG_DEST"
    chmod 600 "$APIKEY_CONFIG_DEST"
    echo "  apikey: seeded $APIKEY_CONFIG_DEST"
  fi

  # PATH warning
  case ":$PATH:" in
    *":$HOME/.local/bin:"*) ;;
    *) echo "  apikey: warning — $HOME/.local/bin is not in your PATH" >&2
       echo "          add: export PATH=\"\$HOME/.local/bin:\$PATH\" to your shell rc" >&2 ;;
  esac
}

apikey_uninstall() {
  if [[ -L "$APIKEY_BIN_DEST" ]]; then
    rm -f "$APIKEY_BIN_DEST"
    echo "  apikey: removed symlink $APIKEY_BIN_DEST"
  else
    echo "  apikey: no symlink at $APIKEY_BIN_DEST"
  fi
  if [[ -f "$APIKEY_CONFIG_DEST" ]]; then
    echo "  apikey: config preserved at $APIKEY_CONFIG_DEST (may contain custom services)"
  fi
}

apikey_check() {
  if [[ -L "$APIKEY_BIN_DEST" ]]; then
    target="$(readlink "$APIKEY_BIN_DEST")"
    if [[ "$target" == "$APIKEY_BIN_SRC" ]]; then
      echo "  apikey CLI:     $APIKEY_BIN_DEST -> $target  [ok]"
    else
      echo "  apikey CLI:     $APIKEY_BIN_DEST -> $target  [points elsewhere]"
    fi
  elif [[ -f "$APIKEY_BIN_DEST" ]]; then
    echo "  apikey CLI:     $APIKEY_BIN_DEST  (real file, not a symlink)"
  else
    echo "  apikey CLI:     not installed"
  fi
  if [[ -f "$APIKEY_CONFIG_DEST" ]]; then
    echo "  apikey config:  $APIKEY_CONFIG_DEST  [present]"
  else
    echo "  apikey config:  not present (would be seeded on install)"
  fi
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

    echo
    echo "apikey:"
    apikey_check
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

    if [[ "$NO_APIKEY" -eq 0 ]]; then
      echo
      echo "apikey:"
      apikey_install || true
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

    if [[ "$NO_APIKEY" -eq 0 ]]; then
      echo
      echo "apikey:"
      apikey_uninstall || true
    fi
    ;;
esac
