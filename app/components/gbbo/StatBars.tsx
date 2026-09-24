import { Points } from "./ui";

export function SignedBar({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  const width = max === 0 ? 0 : Math.min(100, (Math.abs(value) / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-end justify-between gap-3">
        <span className="text-sm font-bold text-chocolate">{label}</span>
        <Points value={value} />
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-[#efe2c8]">
        <div
          className={`h-full rounded-full ${value < 0 ? "bg-raspberry" : value > 0 ? "bg-tent" : "bg-[#d8c4a4]"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function FormBars({
  weeks,
}: {
  weeks: { week: number; theme?: string; points: number }[];
}) {
  if (weeks.length === 0) {
    return <p className="text-sm text-chocolate/60">No published weeks yet.</p>;
  }
  const max = Math.max(1, ...weeks.map((week) => Math.abs(week.points)));
  return (
    <div className="flex h-28 items-end gap-2">
      {weeks.map((week) => {
        const height = (Math.abs(week.points) / max) * 100;
        return (
          <div key={week.week} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className={`text-xs font-bold ${week.points < 0 ? "text-raspberry" : "text-tent"}`}>
              {week.points > 0 ? "+" : ""}
              {week.points}
            </span>
            <div className="flex h-16 w-full items-end">
              <div
                className={`w-full rounded-t-lg ${week.points < 0 ? "bg-raspberry" : week.points > 0 ? "bg-tent" : "bg-[#d8c4a4]"}`}
                style={{ height: `${Math.max(height, week.points === 0 ? 8 : 12)}%` }}
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-chocolate/50">
              W{week.week}
            </span>
          </div>
        );
      })}
    </div>
  );
}