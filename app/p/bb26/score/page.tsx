"use client";

import { useEffect, useMemo, useState } from "react";
import { ChiefOnly } from "@/app/components/gbbo/ChiefOnly";
import { Button, Card, Empty, Field, Pill, Points, inputClass } from "@/app/components/gbbo/ui";
import { uid } from "@/app/lib/gbbo/ids";
import {
  activeBakersAtWeek,
  bakerName,
  companionName,
  companionsOwningBaker,
  lowestTechnicalBaker,
  neededAutoDrops,
  scoreCompanionWeek,
} from "@/app/lib/gbbo/league";
import { parseRecap } from "@/app/lib/gbbo/recap";
import { useLeague } from "@/app/lib/gbbo/store";
import type { RecapSuggestion } from "@/app/lib/gbbo/types";

export default function ScorePage() {
  const { league, update } = useLeague();
  const [viewWeek, setViewWeek] = useState(league.currentWeek);
  const week = viewWeek;

  useEffect(() => {
    setViewWeek(league.currentWeek);
  }, [league.currentWeek]);
  const episode = league.episodes.find((item) => item.week === week);
  const bakers = activeBakersAtWeek(league, week);
  const [recap, setRecap] = useState("");
  const [recapUrl, setRecapUrl] = useState("");
  const [suggestion, setSuggestion] = useState<RecapSuggestion | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const preview = useMemo(
    () => league.companions.map((companion) => scoreCompanionWeek(league, companion.id, week)),
    [league, week],
  );

  if (!episode) {
    return (
      <ChiefOnly>
        <Empty title="No episode for this week" body="Increase the number of weeks in Setup." />
      </ChiefOnly>
    );
  }

  function patch(recipe: (current: NonNullable<typeof episode>) => void) {
    update((draft) => {
      const row = draft.episodes.find((item) => item.week === week);
      if (row) recipe(row);
    });
  }

  function applySuggestion(next: RecapSuggestion) {
    patch((row) => {
      row.starBakerId = next.starBakerId;
      row.eliminatedBakerId = next.eliminatedBakerId;
      row.technical = next.technical;
      row.handshakes = next.handshakes;
      row.innuendos = next.innuendos;
      row.drops = next.drops;
      row.cries = next.cries;
      row.recapNotes = next.notes.join(" ");
    });
    setSuggestion(next);
  }

  async function fetchRecap() {
    setFetching(true);
    setError("");
    try {
      const response = await fetch("/api/gbbo-recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: recapUrl }),
      });
      const data = (await response.json()) as { text?: string; source?: string; error?: string };
      if (!response.ok || !data.text) throw new Error(data.error ?? "Could not read that recap.");
      setRecap(data.text);
      patch((row) => { row.recapSource = data.source ?? recapUrl; });
      applySuggestion(parseRecap(data.text, league.bakers, bakers.length));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that recap.");
    } finally {
      setFetching(false);
    }
  }

  function publish() {
    update((draft) => {
      const row = draft.episodes.find((item) => item.week === week);
      if (!row) return;
      row.published = true;
      if (row.eliminatedBakerId) {
        const baker = draft.bakers.find((item) => item.id === row.eliminatedBakerId);
        if (baker) baker.eliminatedInWeek = week;
      }
      draft.jokers = draft.jokers.filter((joker) => joker.week !== week || !joker.autoApplied);
      if (week === 4) {
        for (const companion of draft.companions) {
          if (!draft.jokers.some((joker) => joker.companionId === companion.id)) {
            draft.jokers.push({ companionId: companion.id, week: 4, autoApplied: true });
          }
        }
      }
      const last = lowestTechnicalBaker(row);
      const owners = last ? companionsOwningBaker(draft, last, week) : [];
      draft.penalties = draft.penalties.filter((penalty) => penalty.week !== week);
      if (last) {
        for (const owner of owners) {
          draft.penalties.push({
            id: uid("pen"),
            week,
            companionId: owner.id,
            bakerId: last,
            kind: "technical",
            deadline: row.deadline,
            completed: false,
            note: `${owner.name} must bake this week's technical because ${bakerName(draft, last)} came last.`,
          });
        }
      }
      for (const drop of neededAutoDrops(draft, Math.min(week + 1, draft.totalWeeks))) {
        if (!draft.substitutions.some((sub) => sub.companionId === drop.companionId && sub.week === drop.week)) {
          draft.substitutions.push(drop);
        }
      }
      draft.currentWeek = Math.min(week + 1, draft.totalWeeks);
    });
  }

  function toggleList(list: "handshakes" | "innuendos", bakerId: string) {
    patch((row) => {
      row[list] = row[list].includes(bakerId)
        ? row[list].filter((id) => id !== bakerId)
        : [...row[list], bakerId];
    });
  }

  return (
    <ChiefOnly>
    <div className="space-y-6">
      <Card
        eyebrow="Episode ledger"
        title={`${episode.title} · ${episode.theme}`}
        action={episode.published ? <Pill tone="tent">Published</Pill> : <Pill tone="butter">Draft scores</Pill>}
      >
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Scoring week">
            <select className={inputClass()} value={week} onChange={(event) => setViewWeek(Number(event.target.value))}>
              {league.episodes.map((item) => (
                <option key={item.week} value={item.week}>
                  Week {item.week}{item.published ? " · published" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Theme">
            <input className={inputClass()} value={episode.theme} onChange={(event) => patch((row) => { row.theme = event.target.value; })} />
          </Field>
          <Field label="Penalty deadline">
            <input className={inputClass()} type="datetime-local" value={episode.deadline} onChange={(event) => patch((row) => { row.deadline = event.target.value; })} />
          </Field>
          <Field label="Recap source">
            <input className={inputClass()} value={episode.recapSource} onChange={(event) => patch((row) => { row.recapSource = event.target.value; })} placeholder="Guardian, Radio Times, Independent…" />
          </Field>
        </div>
      </Card>

      <Card eyebrow="Read the room" title="Score from a recap">
        <p className="mb-4 max-w-3xl text-sm leading-7 text-chocolate/75">
          Paste a detailed review, or fetch one from a public URL. Star Baker, elimination and technical
          mentions are usually trustworthy. Drops, tears and Nigella innuendos are suggestions only —
          confirm them if you watched, or ask me after the episode and I will mark the ledger myself.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className={inputClass()} value={recapUrl} onChange={(event) => setRecapUrl(event.target.value)} placeholder="https://… episode recap" />
          <Button tone="ghost" disabled={fetching || !recapUrl} onClick={() => void fetchRecap()}>
            {fetching ? "Fetching…" : "Fetch recap"}
          </Button>
        </div>
        <textarea
          className={`${inputClass()} mt-3 min-h-40`}
          value={recap}
          onChange={(event) => setRecap(event.target.value)}
          placeholder="Paste the recap here. Names need to match your baker list."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => applySuggestion(parseRecap(recap, league.bakers, bakers.length))} disabled={!recap.trim()}>
            Suggest scores
          </Button>
          {error ? <p className="text-sm text-raspberry">{error}</p> : null}
        </div>
        {suggestion ? (
          <ul className="mt-4 space-y-1 text-sm text-chocolate/70">
            {suggestion.notes.map((note) => <li key={note}>• {note}</li>)}
          </ul>
        ) : null}
      </Card>

      <Card title="Official results">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Star Baker">
            <select className={inputClass()} value={episode.starBakerId ?? ""} onChange={(event) => patch((row) => { row.starBakerId = event.target.value || null; })}>
              <option value="">Not awarded</option>
              {bakers.map((baker) => <option key={baker.id} value={baker.id}>{baker.name}</option>)}
            </select>
          </Field>
          <Field label="Eliminated">
            <select className={inputClass()} value={episode.eliminatedBakerId ?? ""} onChange={(event) => patch((row) => { row.eliminatedBakerId = event.target.value || null; })}>
              <option value="">No elimination</option>
              {bakers.map((baker) => <option key={baker.id} value={baker.id}>{baker.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-tent">Technical order, first to last</p>
          <div className="grid gap-2">
            {bakers.map((baker) => {
              const place = episode.technical.find((entry) => entry.bakerId === baker.id)?.place ?? "";
              return (
                <div key={baker.id} className="grid grid-cols-[1fr_110px] items-center gap-3">
                  <span>{baker.name}</span>
                  <input
                    className={inputClass()}
                    type="number"
                    min={1}
                    max={bakers.length}
                    value={place}
                    onChange={(event) => patch((row) => {
                      const nextPlace = Number(event.target.value);
                      row.technical = [
                        ...row.technical.filter((entry) => entry.bakerId !== baker.id),
                        ...(event.target.value ? [{ bakerId: baker.id, place: nextPlace }] : []),
                      ].sort((a, b) => a.place - b.place);
                    })}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card title="Flavour events">
        <div className="grid gap-3">
          {bakers.map((baker) => (
            <div key={baker.id} className="grid items-center gap-3 rounded-[20px] bg-flour/80 px-4 py-3 md:grid-cols-[1fr_auto_auto_90px_90px]">
              <p className="font-bold">{baker.name}</p>
              <label className="text-sm"><input type="checkbox" className="mr-2" checked={episode.handshakes.includes(baker.id)} onChange={() => toggleList("handshakes", baker.id)} />Handshake</label>
              <label className="text-sm"><input type="checkbox" className="mr-2" checked={episode.innuendos.includes(baker.id)} onChange={() => toggleList("innuendos", baker.id)} />Nigella innuendo</label>
              <Field label="Drops">
                <input className={inputClass()} type="number" min={0} value={episode.drops[baker.id] ?? 0} onChange={(event) => patch((row) => { row.drops[baker.id] = Number(event.target.value); })} />
              </Field>
              <Field label="Cries">
                <input className={inputClass()} type="number" min={0} value={episode.cries[baker.id] ?? 0} onChange={(event) => patch((row) => { row.cries[baker.id] = Number(event.target.value); })} />
              </Field>
            </div>
          ))}
        </div>
      </Card>

      {league.adHocRules.filter((rule) => rule.week === week).length > 0 ? (
        <Card title="Ad hoc awards">
          <div className="space-y-3">
            {league.adHocRules.filter((rule) => rule.week === week).map((rule) => (
              <div key={rule.id} className="rounded-[20px] bg-flour/80 p-4">
                <p className="font-bold">{rule.description} ({rule.points > 0 ? "+" : ""}{rule.points})</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {bakers.map((baker) => {
                    const awarded = episode.adHoc.some((award) => award.ruleId === rule.id && award.bakerId === baker.id);
                    return (
                      <button
                        key={baker.id}
                        className={`rounded-full px-3 py-1 text-sm font-bold ${awarded ? "bg-tent text-flour" : "bg-canvas"}`}
                        onClick={() => patch((row) => {
                          row.adHoc = awarded
                            ? row.adHoc.filter((award) => !(award.ruleId === rule.id && award.bakerId === baker.id))
                            : [...row.adHoc, { bakerId: baker.id, ruleId: rule.id }];
                        })}
                      >
                        {baker.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      <Card title="Weekend preview">
        <div className="grid gap-3 md:grid-cols-2">
          {preview.map((row) => (
            <div key={row.companionId} className="rounded-[20px] bg-flour/80 p-4">
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl">{companionName(league, row.companionId)}</p>
                <div className="flex items-center gap-2">
                  {row.joker ? <Pill tone="butter">Joker</Pill> : null}
                  <Points value={row.points} />
                </div>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-chocolate/70">
                {row.lines.map((line, index) => (
                  <li key={`${line.label}-${index}`}>{line.label} ({line.points > 0 ? "+" : ""}{line.points})</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button className="mt-5" tone="raspberry" onClick={publish}>
          Publish week {week} and lock the ledger
        </Button>
      </Card>
    </div>
    </ChiefOnly>
  );
}
