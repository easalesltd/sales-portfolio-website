type Props = {
  count: number;
  className?: string;
};

export default function TeamRedCardMarker({ count, className = '' }: Props) {
  if (count <= 0) return null;

  const label = count === 1 ? '1 red card' : `${count} red cards`;

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      title={label}
      aria-label={label}
    >
      {Array.from({ length: Math.min(count, 3) }, (_, index) => (
        <span
          key={index}
          className="inline-block size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.85)] ring-1 ring-red-200/70"
          aria-hidden
        />
      ))}
    </span>
  );
}
