#!/usr/bin/env bash
# Re-encode Bonus Round BGM to match other game loops (~48k AAC, 32 kHz stereo, faststart).
# Requires ffmpeg. Run after replacing `public/Audio/Bonus Round Music.m4a` with a heavier master.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/public/Audio/Bonus Round Music.m4a"
TMP="$SRC.__compressing__.m4a"
ffmpeg -y -hide_banner -loglevel warning -i "$SRC" \
  -c:a aac -b:a 48k -ar 32000 -ac 2 -movflags +faststart \
  "$TMP"
mv "$TMP" "$SRC"
ls -la "$SRC"
