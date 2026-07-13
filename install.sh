#!/usr/bin/env bash
# install.sh — symlink-install px-skills into ~/.claude/skills/
#
# The install footprint is exactly two things:
#   1. Symlinks: every skill in ./skills/ -> ~/.claude/skills/<name>
#   2. One marker-fenced block in ~/.claude/CLAUDE.md describing the bundle
#
# No hooks, no settings.json edits, nothing patched in other tools.
#
# Source dir defaults to the directory containing this script, so running it
# from a worktree swaps the live symlinks to that worktree. Re-run safely from
# any checkout. Keep the canonical checkout at ~/.px-skills — skills reference
# shared files there by absolute path.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"
SKILLS_DEST="$HOME/.claude/skills"
CLAUDE_MD_FILE="${CLAUDE_MD_FILE:-$HOME/.claude/CLAUDE.md}"
BLOCK_FILE="$SCRIPT_DIR/agent-instructions/px-block.md"
BARE_CLAUDEMD="$SCRIPT_DIR/agent-instructions/CLAUDE.md"
BLOCK_BEGIN_PREFIX='<!-- BEGIN px-skills' # any version
BLOCK_END='<!-- END px-skills -->'

# ─── Legacy footprint (pre-rename "chordio-design-skills" installs) ─────
# Older versions of this repo installed a CLAUDE.md block under a different
# marker, registered a SessionStart hook (chordio-bridge), patched gstack's
# design skills with a marker-fenced block, and shipped skills that have
# since moved out (marketing skills -> px-marketing-skills) or become peers
# (humanizer). migrate_legacy() removes all of it, idempotently.
LEGACY_BLOCK_BEGIN_PREFIX='<!-- BEGIN chordio-design-skills'
LEGACY_BLOCK_END='<!-- END chordio-design-skills -->'
LEGACY_HOOK_MATCHER='chordio-bridge'
LEGACY_TASTE_BEGIN='<!-- BEGIN chordio-taste'
LEGACY_TASTE_END='<!-- END chordio-taste -->'
LEGACY_CHECKOUT="$HOME/.claude-design-skills"
LEGACY_REMOVED_SKILLS=(hero-builder landing-page-builder social-post-designer image-generator humanizer)
SETTINGS_FILE="${CLAUDE_SETTINGS_FILE:-$HOME/.claude/settings.json}"
GSTACK_SKILLS_ROOT="${GSTACK_SKILLS_ROOT:-$HOME/.claude/skills/gstack}"
GSTACK_BRIDGED_SKILLS=(design-review plan-design-review design-consultation design-shotgun design-html)

usage() {
  cat <<'EOF'
Usage: bash install.sh [--check | --force | --uninstall]
                       [--no-claudemd] [--init-claudemd]

Symlinks every skill in ./skills/ into ~/.claude/skills/ so Claude Code loads
them at user scope, and keeps one marker-fenced block in ~/.claude/CLAUDE.md
describing the bundle. That is the entire install footprint: no hooks, no
settings.json edits, nothing patched in other tools.

Also migrates away any legacy "chordio-design-skills" footprint (old CLAUDE.md
block, SessionStart bridge hook, patched gstack skill files, stale symlinks).

Options:
  (no flag)         Install symlinks + CLAUDE.md block + legacy migration
  --force           Overwrite existing symlinks
  --check           Print symlink + CLAUDE.md block + peer status
  --uninstall       Remove symlinks and the CLAUDE.md block
  --no-claudemd     Skip the ~/.claude/CLAUDE.md block install/refresh
  --init-claudemd   Seed ~/.claude/CLAUDE.md if missing (no prompt). Otherwise
                    a missing file triggers an interactive prompt; non-interactive
                    runs skip with a notice.
EOF
}

MODE="install"
FORCE=0
NO_CLAUDEMD=0
INIT_CLAUDEMD=""   # empty = ask if TTY (else skip); "yes" = seed without prompting
for arg in "$@"; do
  case "$arg" in
    --check)            MODE="check" ;;
    --force)            FORCE=1 ;;
    --uninstall)        MODE="uninstall" ;;
    --no-claudemd)      NO_CLAUDEMD=1 ;;
    --init-claudemd)    INIT_CLAUDEMD="yes" ;;
    -h|--help)          usage; exit 0 ;;
    *) echo "Unknown argument: $arg" >&2; usage; exit 1 ;;
  esac
done

[[ -d "$SKILLS_SRC" ]] || { echo "Error: $SKILLS_SRC does not exist" >&2; exit 1; }
mkdir -p "$SKILLS_DEST"

has_jq() { command -v jq >/dev/null 2>&1; }

# ─── CLAUDE.md block helpers (plain markdown, no jq needed) ─────────────

claudemd_block_present() {
  [[ -f "$CLAUDE_MD_FILE" ]] || return 1
  grep -q "^$BLOCK_BEGIN_PREFIX" "$CLAUDE_MD_FILE"
}

# Strip a marker-fenced block (given begin-prefix and end line) from $1 into $2.
# Prints "had_block" if a block was removed, "no_block" otherwise.
strip_marker_block() {
  local src="$1" dst="$2" begin="$3" end="$4"
  : > "$dst"
  awk -v begin="$begin" -v end="$end" -v outfile="$dst" '
    BEGIN { in_block=0; had_block=0 }
    {
      if (!in_block && index($0, begin) == 1) { in_block=1; had_block=1; next }
      if (in_block && $0 == end)              { in_block=0; next }
      if (!in_block)                          { print > outfile }
    }
    END { print (had_block ? "had_block" : "no_block") }
  ' "$src"
}

# Idempotent: replaces an existing px-skills block in place, or appends one.
# Seeds ~/.claude/CLAUDE.md from the bare template if it doesn't exist.
claudemd_block_install() {
  [[ -f "$BLOCK_FILE" ]]    || { echo "  CLAUDE.md: $BLOCK_FILE not found, skipping" >&2; return 1; }
  [[ -f "$BARE_CLAUDEMD" ]] || { echo "  CLAUDE.md: $BARE_CLAUDEMD not found, skipping" >&2; return 1; }

  if [[ ! -f "$CLAUDE_MD_FILE" ]]; then
    local do_seed=0
    if [[ "$INIT_CLAUDEMD" == "yes" ]]; then
      do_seed=1
    elif [[ -t 0 ]]; then
      echo "  CLAUDE.md: $CLAUDE_MD_FILE does not exist."
      echo "             px-skills can seed it from $BARE_CLAUDEMD"
      echo "             plus the marker-fenced px-skills block. Existing files are never overwritten."
      printf "             Create %s? [y/N] " "$CLAUDE_MD_FILE"
      local answer=""
      read -r answer || answer=""
      case "$answer" in
        y|Y|yes|YES) do_seed=1 ;;
      esac
    fi

    if [[ "$do_seed" -ne 1 ]]; then
      echo "  CLAUDE.md: $CLAUDE_MD_FILE not found — skipping (pass --init-claudemd to seed)"
      return 0
    fi

    mkdir -p "$(dirname "$CLAUDE_MD_FILE")"
    cp "$BARE_CLAUDEMD" "$CLAUDE_MD_FILE"
    printf '\n' >> "$CLAUDE_MD_FILE"
    cat "$BLOCK_FILE" >> "$CLAUDE_MD_FILE"
    echo "  CLAUDE.md: seeded $CLAUDE_MD_FILE with baseline + px-skills block"
    return 0
  fi

  local tmp="$CLAUDE_MD_FILE.tmp.$$"
  local status
  status="$(strip_marker_block "$CLAUDE_MD_FILE" "$tmp" "$BLOCK_BEGIN_PREFIX" "$BLOCK_END")"

  # Normalize: drop trailing blank lines, then add exactly one blank line
  # before the appended block. Keeps the file from growing on each refresh.
  local norm="$tmp.norm"
  awk '
    { lines[NR]=$0; if ($0 != "") last=NR }
    END { for (i=1; i<=last; i++) print lines[i] }
  ' "$tmp" > "$norm"
  mv "$norm" "$tmp"

  if [[ -s "$tmp" ]]; then
    printf '\n' >> "$tmp"
  fi
  cat "$BLOCK_FILE" >> "$tmp"

  if ! mv "$tmp" "$CLAUDE_MD_FILE"; then
    rm -f "$tmp"
    echo "  CLAUDE.md: failed to update $CLAUDE_MD_FILE" >&2
    return 1
  fi

  if [[ "$status" == "had_block" ]]; then
    echo "  CLAUDE.md: px-skills block refreshed in $CLAUDE_MD_FILE"
  else
    echo "  CLAUDE.md: px-skills block appended to $CLAUDE_MD_FILE"
  fi
}

claudemd_block_uninstall() {
  [[ -f "$CLAUDE_MD_FILE" ]] || { echo "  CLAUDE.md: $CLAUDE_MD_FILE not found — nothing to remove"; return 0; }
  if ! claudemd_block_present; then
    echo "  CLAUDE.md: no px-skills block found in $CLAUDE_MD_FILE — nothing to remove"
    return 0
  fi

  local tmp="$CLAUDE_MD_FILE.tmp.$$"
  strip_marker_block "$CLAUDE_MD_FILE" "$tmp" "$BLOCK_BEGIN_PREFIX" "$BLOCK_END" >/dev/null

  if ! mv "$tmp" "$CLAUDE_MD_FILE"; then
    rm -f "$tmp"
    echo "  CLAUDE.md: failed to update $CLAUDE_MD_FILE" >&2
    return 1
  fi
  echo "  CLAUDE.md: px-skills block removed from $CLAUDE_MD_FILE"
}

# ─── Legacy migration (one-time cleanup, idempotent, all steps optional) ─

migrate_legacy() {
  local did_anything=0

  # 1. Old CLAUDE.md block (chordio-design-skills markers)
  if [[ -f "$CLAUDE_MD_FILE" ]] && grep -q "^$LEGACY_BLOCK_BEGIN_PREFIX" "$CLAUDE_MD_FILE"; then
    local tmp="$CLAUDE_MD_FILE.tmp.$$"
    strip_marker_block "$CLAUDE_MD_FILE" "$tmp" "$LEGACY_BLOCK_BEGIN_PREFIX" "$LEGACY_BLOCK_END" >/dev/null
    mv "$tmp" "$CLAUDE_MD_FILE"
    echo "  migrate: removed legacy chordio-design-skills block from $CLAUDE_MD_FILE"
    did_anything=1
  fi

  # 2. Old SessionStart bridge hook in settings.json
  if [[ -f "$SETTINGS_FILE" ]] && has_jq && \
     jq -e --arg match "$LEGACY_HOOK_MATCHER" '
       (.hooks.SessionStart // [])
       | any(.[]?; any(.hooks[]?; (.command // "") | test($match)))
     ' "$SETTINGS_FILE" >/dev/null 2>&1; then
    local tmp="$SETTINGS_FILE.tmp.$$"
    if jq --arg match "$LEGACY_HOOK_MATCHER" '
      if .hooks.SessionStart then
        .hooks.SessionStart |= map(
          select(any(.hooks[]?; (.command // "") | test($match)) | not)
        )
        | if .hooks.SessionStart == [] then del(.hooks.SessionStart) else . end
        | if (.hooks // {}) == {} then del(.hooks) else . end
      else . end
    ' "$SETTINGS_FILE" > "$tmp"; then
      mv "$tmp" "$SETTINGS_FILE"
      echo "  migrate: removed legacy chordio-bridge SessionStart hook from $SETTINGS_FILE"
      did_anything=1
    else
      rm -f "$tmp"
      echo "  migrate: could not parse $SETTINGS_FILE — remove the chordio-bridge hook manually" >&2
    fi
  elif [[ -f "$SETTINGS_FILE" ]] && ! has_jq && grep -q "$LEGACY_HOOK_MATCHER" "$SETTINGS_FILE" 2>/dev/null; then
    echo "  migrate: legacy chordio-bridge hook found in $SETTINGS_FILE but jq is missing —"
    echo "           remove the SessionStart entry containing 'chordio-bridge' manually"
  fi

  # 3. Old taste blocks patched into gstack skill files
  if [[ -d "$GSTACK_SKILLS_ROOT" ]]; then
    for name in "${GSTACK_BRIDGED_SKILLS[@]}"; do
      for f in "$GSTACK_SKILLS_ROOT/$name/SKILL.md.tmpl" "$GSTACK_SKILLS_ROOT/$name/SKILL.md"; do
        [[ -f "$f" ]] || continue
        grep -q "$LEGACY_TASTE_BEGIN" "$f" || continue
        local tmp="$f.tmp.$$"
        strip_marker_block "$f" "$tmp" "$LEGACY_TASTE_BEGIN" "$LEGACY_TASTE_END" >/dev/null
        mv "$tmp" "$f"
        echo "  migrate: removed legacy chordio-taste block from $f"
        did_anything=1
      done
    done
  fi

  # 4. Old bridge state files
  for state in "$LEGACY_CHECKOUT/.bridge-state" "$SCRIPT_DIR/.bridge-state"; do
    if [[ -f "$state" ]]; then
      rm -f "$state"
      echo "  migrate: removed $state"
      did_anything=1
    fi
  done

  # 5. Symlinks for skills this repo no longer ships (moved to
  #    px-marketing-skills, or now peers). Only removes symlinks that point
  #    into a px-skills / claude-design-skills checkout or dangle.
  for name in "${LEGACY_REMOVED_SKILLS[@]}"; do
    local dest="$SKILLS_DEST/$name"
    [[ -L "$dest" ]] || continue
    local target
    target="$(readlink "$dest")"
    if [[ ! -e "$dest" || "$target" == *"px-skills"* || "$target" == *"claude-design-skills"* ]]; then
      rm "$dest"
      echo "  migrate: removed stale symlink $name -> $target"
      did_anything=1
    fi
  done

  # 6. Old canonical checkout location
  if [[ -d "$LEGACY_CHECKOUT" && "$SCRIPT_DIR" != "$LEGACY_CHECKOUT"* ]]; then
    echo "  migrate: legacy checkout still exists at $LEGACY_CHECKOUT —"
    echo "           after verifying this install, remove it or: mv $LEGACY_CHECKOUT ~/.px-skills"
  fi

  [[ "$did_anything" -eq 0 ]] && echo "  migrate: no legacy footprint found"
}

# ─── Peer status (informational only — nothing is installed for you) ────

peer_status() {
  echo "Peers (optional — install from their own sources):"
  if [[ -d "$GSTACK_SKILLS_ROOT" ]]; then
    echo "  gstack:    installed ($GSTACK_SKILLS_ROOT)"
  else
    echo "  gstack:    not found — idea-vetting (/office-hours) and QA/ship (/qa, /design-review, /ship)"
    echo "             hand-offs will be skipped; install: https://github.com/gstack/gstack"
  fi
  if [[ -d "$SKILLS_DEST/humanizer" || -n "$(ls -d "$HOME/.claude/plugins/"*humanizer* 2>/dev/null || true)" ]]; then
    echo "  humanizer: installed"
  else
    echo "  humanizer: not found — prose de-slop passes will be manual;"
    echo "             install from https://github.com/blader/humanizer (ships as a Claude Code plugin)."
    echo "             Our extra rules live at shared/writing/humanizer-house-rules.md either way."
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
    echo "CLAUDE.md:"
    if [[ ! -f "$CLAUDE_MD_FILE" ]]; then
      echo "  $CLAUDE_MD_FILE: not found"
    elif claudemd_block_present; then
      echo "  px-skills block: registered in $CLAUDE_MD_FILE"
    else
      echo "  px-skills block: not registered in $CLAUDE_MD_FILE"
    fi

    echo
    peer_status
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

    echo
    echo "Migration:"
    migrate_legacy

    if [[ "$NO_CLAUDEMD" -eq 0 ]]; then
      echo
      echo "CLAUDE.md:"
      claudemd_block_install || true
    fi

    echo
    peer_status

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

    if [[ "$NO_CLAUDEMD" -eq 0 ]]; then
      echo
      echo "CLAUDE.md:"
      claudemd_block_uninstall || true
    fi

    echo
    echo "Migration cleanup (legacy chordio footprint, if any):"
    migrate_legacy
    ;;
esac
