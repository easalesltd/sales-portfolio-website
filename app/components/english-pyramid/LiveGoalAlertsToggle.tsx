'use client';

type Props = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

export default function LiveGoalAlertsToggle({ enabled, onChange }: Props) {
  return (
    <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-md border border-[#1a2744] bg-[#0a0f1a]/50 px-3 py-2.5">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#d4af37]/40 bg-[#121c33] text-[#d4af37] focus:ring-[#d4af37]/40"
      />
      <span className="text-xs leading-relaxed text-[#e8dfc8]/75">
        <span className="font-semibold text-[#e8dfc8]">Live goal alerts</span> — short ping and
        vibration when an in-play score changes (off by default).
      </span>
    </label>
  );
}
