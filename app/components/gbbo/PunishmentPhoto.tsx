export function PunishmentPhoto({
  src,
  label,
}: {
  src: string | null;
  label: string;
}) {
  if (!src) return null;
  return (
    <figure className="mt-3 w-full max-w-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="max-h-80 w-full rounded-2xl bg-chocolate object-cover" />
      <figcaption className="mt-1 text-xs text-chocolate/65">{label}</figcaption>
    </figure>
  );
}
