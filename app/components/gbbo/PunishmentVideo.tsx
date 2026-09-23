export function PunishmentVideo({
  src,
  label,
  compact = false,
}: {
  src: string | null;
  label: string;
  compact?: boolean;
}) {
  if (!src) return null;
  return (
    <figure className={compact ? "w-40 max-w-full" : "w-full max-w-md"}>
      <video
        className="aspect-[9/16] w-full rounded-2xl bg-chocolate object-cover"
        src={src}
        controls
        playsInline
        preload="metadata"
      />
      <figcaption className="mt-1 text-xs text-chocolate/65">{label}</figcaption>
    </figure>
  );
}
