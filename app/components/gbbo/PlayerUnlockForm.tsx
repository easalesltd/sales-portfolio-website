"use client";

import { useState } from "react";
import { useGbboSession } from "@/app/lib/gbbo/session";
import { Button, Field, inputClass } from "./ui";

export function PlayerUnlockForm({
  slug,
  name,
  onUnlocked,
}: {
  slug: string;
  name?: string;
  onUnlocked?: () => void;
}) {
  const { unlockPlayer } = useGbboSession();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="max-w-md space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setBusy(true);
        void unlockPlayer(slug, pin).then((message) => {
          setBusy(false);
          if (message) setError(message);
          else onUnlocked?.();
        });
      }}
    >
      <p className="text-sm leading-6 text-chocolate/75">
        {name
          ? `Enter the player key Dave sent you for ${name}. It stays on this phone or laptop until you lock your peg.`
          : "Enter the player key Dave sent you."}
      </p>
      <Field label="Player key">
        <input
          className={inputClass()}
          type="password"
          autoComplete="off"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
        />
      </Field>
      {error ? <p className="text-sm text-raspberry">{error}</p> : null}
      <Button type="submit" disabled={busy || !pin.trim()}>
        {busy ? "Checking…" : "Unlock my peg"}
      </Button>
    </form>
  );
}
