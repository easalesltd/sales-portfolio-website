"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Field, inputClass } from "@/app/components/gbbo/ui";
import { GBBO_LEAGUE_PATH } from "@/app/lib/gbbo-league-path";
import { useGbboSession } from "@/app/lib/gbbo/session";

export default function ChiefDoorPage() {
  const router = useRouter();
  const { isChief, unlockChief } = useGbboSession();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  return (
    <Card eyebrow="Steward's door" title="Chief Companion only">
      <p className="mb-4 max-w-xl text-sm leading-7 text-chocolate/75">
        Companions use the public tent link to pick a name and submit their weekly side.
        Scoring, Setup and the draft stay behind this door.
      </p>
      {isChief ? (
        <p className="text-sm font-bold text-tent">You are already at the steward's desk.</p>
      ) : (
        <form
          className="max-w-md space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            void unlockChief(pin).then((message) => {
              if (message) setError(message);
              else router.push(GBBO_LEAGUE_PATH);
            });
          }}
        >
          <Field label="Chief key">
            <input className={inputClass()} type="password" value={pin} onChange={(event) => setPin(event.target.value)} />
          </Field>
          {error ? <p className="text-sm text-raspberry">{error}</p> : null}
          <Button type="submit">Unlock the ledger</Button>
        </form>
      )}
    </Card>
  );
}
