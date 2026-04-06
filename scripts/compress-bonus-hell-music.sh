#!/usr/bin/env bash
# Re-encode Bonus Hell BGM (~48k AAC, 32 kHz stereo) to match other game audio.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/Audio/Bonus Round Hell.m4a"
TMP="$SRC.__compressing__.m4a"
ffmpeg -y -hide_banner -loglevel warning -i "$SRC" \
  -c:a aac -b:a 48k -ar 32000 -ac 2 -movflags +faststart \
  "$TMP"
mv "$TMP" "$SRC"
ls -la "$SRC"
