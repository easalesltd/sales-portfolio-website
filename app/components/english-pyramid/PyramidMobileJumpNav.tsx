'use client';

type JumpTarget = {
  id: string;
  label: string;
};

const TARGETS: JumpTarget[] = [
  { id: 'pyramid-standings', label: 'Standings' },
  { id: 'pyramid-matchday', label: 'Matchday' },
  { id: 'pyramid-squads', label: 'Squads' },
];

export default function PyramidMobileJumpNav() {
  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="sticky top-0 z-30 -mx-4 mb-1 border-b border-[#d4af37]/20 bg-[#121c33] px-4 py-2 shadow-[0_10px_16px_#121c33] sm:hidden"
      aria-label="Jump to section"
    >
      <div className="flex gap-1.5">
        {TARGETS.map((target) => (
          <button
            key={target.id}
            type="button"
            onClick={() => jump(target.id)}
            className="min-h-10 flex-1 rounded-md border border-[#d4af37]/35 bg-[#1a2744]/80 px-2 text-xs font-bold text-[#e8dfc8] transition active:bg-[#d4af37]/20"
          >
            {target.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
