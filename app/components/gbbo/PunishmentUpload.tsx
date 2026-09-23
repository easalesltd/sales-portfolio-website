"use client";

import { useRef, useState } from "react";
import { Button } from "./ui";

const CHUNK_BYTES = 400_000;

export function PunishmentUpload({
  kind,
  companionId,
  week,
  penaltyId,
  label,
  onUploaded,
}: {
  kind: "slut_drop" | "beer_baguette" | "technical";
  companionId: string;
  week: number;
  penaltyId?: string;
  label: string;
  onUploaded: (league: unknown) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const photo = kind === "technical";

  async function sendFile(file: File) {
    if (photo && file.type && !file.type.startsWith("image/")) {
      setError("That file is not a photo of the bake.");
      return;
    }
    if (!photo && !file.type.startsWith("video/")) {
      setError("That file is not a video.");
      return;
    }
    setBusy(true);
    setError("");
    const total = Math.max(1, Math.ceil(file.size / CHUNK_BYTES));
    const uploadId = `vid_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
    try {
      for (let index = 0; index < total; index += 1) {
        const chunk = file.slice(index * CHUNK_BYTES, (index + 1) * CHUNK_BYTES);
        const form = new FormData();
        form.set("kind", kind);
        form.set("companionId", companionId);
        form.set("week", String(week));
        if (penaltyId) form.set("penaltyId", penaltyId);
        form.set("uploadId", uploadId);
        form.set("index", String(index));
        form.set("total", String(total));
        form.set("mime", file.type || (photo ? "image/jpeg" : "video/mp4"));
        form.set("chunk", chunk, file.name || (photo ? "bake.jpg" : "punishment.mp4"));
        const response = await fetch("/api/gbbo-league/video", {
          method: "POST",
          credentials: "include",
          body: form,
        });
        const data = (await response.json()) as { error?: string; complete?: boolean; league?: unknown };
        if (!response.ok) {
          setError(data.error ?? (photo ? "That photo could not be uploaded." : "That video could not be uploaded."));
          return;
        }
        if (data.complete && data.league) {
          onUploaded(data.league);
          return;
        }
      }
      setError(photo ? "The tent did not finish saving that photo." : "The tent did not finish saving that video. Try a shorter clip.");
    } catch {
      setError(photo ? "The tent could not take that photo." : "The tent could not take that video.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <span className="inline-flex min-w-0 flex-col items-start gap-1">
      <input
        ref={inputRef}
        type="file"
        accept={photo ? "image/*" : "video/*"}
        capture="environment"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void sendFile(file);
        }}
      />
      <Button
        type="button"
        tone="raspberry"
        disabled={busy}
        className="px-3 py-1 text-xs uppercase tracking-[0.12em]"
        onClick={() => inputRef.current?.click()}
      >
        {busy ? "Uploading…" : label}
      </Button>
      {error ? <span className="max-w-[16rem] text-xs text-raspberry">{error}</span> : null}
    </span>
  );
}
