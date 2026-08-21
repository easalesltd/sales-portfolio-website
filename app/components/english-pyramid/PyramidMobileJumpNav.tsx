'use client';

type JumpTarget = {
  id: string;
  label: string;
};

const TARGETS: JumpTarget[] = [
  { id: 'pyramid-standings', label: 'Standings' },
  { id: 'pyramid-matchday', label: 'Matchday' },
  { id: 'pyramid-progress', label: 'Progress' },
  { id: 'pyramid-awards', label: 'Awards' },
  { id: 'pyramid-squads', label: 'Squads' },
];

export default function PyramidMobileJumpNav() {
  const jump = (id: string) => {
    window.dispatchEvent(new CustomEvent('pyramid-jump', { detail: id }));
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className="relative z-20 shrink-0 border-b border-[#d4af37]/35 bg-[#0a0f1a] px-3 py-2 sm:px-5 sm:py-2.5"
      aria-label="Jump to section"
    >
      <div className="mx-auto flex max-w-5xl gap-1.5 sm:gap-2">
        {TARGETS.map((target) => (
          <button
            key={target.id}
            type="button"
            onClick={() => jump(target.id)}
            className="min-h-10 flex-1 rounded-md border border-[#d4af37]/45 bg-[#1a2744] px-2 text-[11px] font-bold text-[#f5e2a3] transition hover:bg-[#d4af37]/20 active:bg-[#d4af37]/20 sm:min-h-11 sm:text-sm"
          >
            {target.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
