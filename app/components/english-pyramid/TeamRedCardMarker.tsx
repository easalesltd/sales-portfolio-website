type Props = {
  count: number;
  className?: string;
};

export default function TeamRedCardMarker({ count, className = '' }: Props) {
  if (count <= 0) return null;

  const label = count === 1 ? '1 red card' : `${count} red cards`;

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 text-red-500 ${className}`}
      title={label}
      aria-label={label}
    >
      {Array.from({ length: Math.min(count, 3) }, (_, index) => (
        <span
          key={index}
          className="inline-flex h-2.5 w-2.5 shrink-0 items-center justify-center text-[11px] leading-none sm:h-2 sm:w-2 sm:text-[9px]"
          aria-hidden
        >
          ●
        </span>
      ))}
    </span>
  );
}
