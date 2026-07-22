'use client';

import type { EnglishPyramidPrizeFundSnapshot } from '@/app/lib/english-pyramid-prize-fund';

type Props = {
  prizeFund: EnglishPyramidPrizeFundSnapshot;
};

function formatGbp(value: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedGbp(value: number): string {
  const abs = formatGbp(Math.abs(value));
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

function formatSignedPercent(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `−${abs}%`;
  return `${abs}%`;
}

function formatAsOf(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/London',
  });
}

export default function EnglishPyramidPrizeFundPanel({ prizeFund }: Props) {
  const value = prizeFund.currentValueGbp;
  const change = prizeFund.changeGbp;
  const changePct = prizeFund.changePercent;
  const up = change != null && change > 0;
  const down = change != null && change < 0;
  const changeTone = up ? 'text-emerald-300' : down ? 'text-red-300' : 'text-[#e8dfc8]/70';
  const asOf = formatAsOf(prizeFund.asOf);

  return (
    <section
      className="rounded-lg border border-[#d4af37]/35 bg-[#141f38]/70 px-4 py-3 [background-image:linear-gradient(135deg,rgba(212,175,55,0.12)_0%,transparent_55%)]"
      aria-label="Prize pot"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]/80">
            Prize pot
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-[#f5f5f0] sm:text-3xl">
            {value != null ? formatGbp(value) : formatGbp(prizeFund.investedAmountGbp)}
          </p>
          {prizeFund.invested && change != null && changePct != null ? (
            <p className={`mt-1 text-sm font-semibold tabular-nums ${changeTone}`}>
              {formatSignedGbp(change)} ({formatSignedPercent(changePct)}) since invest
            </p>
          ) : (
            <p className="mt-1 text-sm text-[#e8dfc8]/70">
              £{prizeFund.investedAmountGbp.toFixed(0)} cash · awaiting investment
            </p>
          )}
        </div>

        <div className="min-w-0 max-w-full text-right text-xs text-[#e8dfc8]/65 sm:text-sm">
          <p className="font-medium text-[#e8dfc8]/85">{prizeFund.fundName}</p>
          <p className="mt-0.5 tabular-nums">
            {prizeFund.yahooSymbol}
            {prizeFund.currentPriceGbp != null
              ? ` · ${formatGbp(prizeFund.currentPriceGbp)}`
              : null}
            {prizeFund.dayChangePercent != null ? (
              <span
                className={
                  prizeFund.dayChangePercent > 0
                    ? ' text-emerald-300'
                    : prizeFund.dayChangePercent < 0
                      ? ' text-red-300'
                      : ''
                }
              >
                {' '}
                ({formatSignedPercent(prizeFund.dayChangePercent)} today)
              </span>
            ) : null}
          </p>
          {prizeFund.invested && prizeFund.units != null ? (
            <p className="mt-0.5 tabular-nums">
              {prizeFund.units.toLocaleString('en-GB', { maximumFractionDigits: 4 })} units
              {prizeFund.purchasePriceGbp != null
                ? ` @ ${formatGbp(prizeFund.purchasePriceGbp)}`
                : null}
              {prizeFund.investedAt ? ` · since ${prizeFund.investedAt}` : null}
            </p>
          ) : null}
          {asOf ? <p className="mt-0.5 text-[11px] text-[#e8dfc8]/45">As of {asOf}</p> : null}
        </div>
      </div>

      {prizeFund.error ? (
        <p className="mt-2 text-xs text-amber-300/90">
          Live price unavailable — showing cash pot. ({prizeFund.error})
        </p>
      ) : null}
      {!prizeFund.invested && prizeFund.note ? (
        <p className="mt-2 text-xs text-[#e8dfc8]/45">{prizeFund.note}</p>
      ) : null}
    </section>
  );
}
