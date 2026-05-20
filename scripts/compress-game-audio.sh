#!/usr/bin/env bash
# Re-encode all Sales Agent Dash game audio for 8-bit / low-fi playback:
# - SFX (death, order): mono 22.05 kHz AAC ~24k
# - BGM loops: mono 22.05 kHz AAC ~32k (trim Bonus loop to 72s)
# - Disco / hell one-shots: mono 22.05 kHz AAC ~32k, full length
# Requires ffmpeg. Run from repo root: npm run compress:game-audio
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
AUDIO="$ROOT/public/Audio"

compress_one() {
  local src="$1"
  shift
  local base
  base="$(basename "$src")"
  local tmp="$AUDIO/.compressing__$base"
  ffmpeg -y -hide_banner -loglevel warning -i "$src" "$@" \
    -c:a aac -b:a "$BITRATE" -ar 22050 -ac 1 -movflags +faststart \
    "$tmp"
  mv "$tmp" "$src"
  ls -la "$src"
}

BITRATE=24k
for f in \
  "Death 1.m4a" "Death 2.m4a" "Death 3.m4a" "Death 4.m4a" "Death 5.m4a" \
  "Order 1.m4a" "Order 2.m4a"
do
  compress_one "$AUDIO/$f"
done

BITRATE=32k
for f in \
  "Game Audio.m4a" "Spring Fair Music.m4a" "Xmas Music.m4a" \
  "Disco Mode.m4a" "NEC Disco Music.m4a" "Xmas Disco Mode.m4a" \
  "Bonus Round Hell.m4a"
do
  compress_one "$AUDIO/$f"
done

# Bonus BGM loops in-game — cap length so decode/memory stay bounded.
compress_one "$AUDIO/Bonus Round Music.m4a" -t 72

echo "--- durations (update SalesAgentDash fallbacks if these change) ---"
for f in "$AUDIO"/*.m4a; do
  dur="$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f" 2>/dev/null | head -1)"
  echo "$(basename "$f"): ${dur}s"
done
