import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({
  children,
  className = "",
  eyebrow,
  title,
  action,
}: {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`paper-card rounded-[28px] border border-[#e7d3b4] p-6 ${className}`}>
      {(eyebrow || title || action) && (
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            {eyebrow ? <p className="font-script text-2xl text-raspberry">{eyebrow}</p> : null}
            {title ? <h2 className="font-display text-3xl tracking-tight text-tent-dark">{title}</h2> : null}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function Button({
  children,
  tone = "tent",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "tent" | "raspberry" | "ghost" | "butter" }) {
  const tones = {
    tent: "bg-tent text-flour hover:bg-tent-dark",
    raspberry: "bg-raspberry text-flour hover:bg-[#a82f4b]",
    butter: "bg-butter text-chocolate hover:bg-[#e3b64a]",
    ghost: "bg-flour/70 text-chocolate border border-[#e7d3b4] hover:bg-white",
  };
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.16em] text-tent">{label}</span>
      {children}
    </label>
  );
}

export function inputClass() {
  return "w-full rounded-2xl border border-[#e7d3b4] bg-flour px-4 py-2.5 text-chocolate outline-none ring-butter/70 focus:ring-4";
}

export function Points({ value }: { value: number }) {
  const tone = value > 0 ? "text-tent" : value < 0 ? "text-raspberry" : "text-chocolate/60";
  const prefix = value > 0 ? "+" : "";
  return <span className={`font-display text-2xl ${tone}`}>{prefix}{value}</span>;
}

export function Pill({ children, tone = "cream" }: { children: ReactNode; tone?: "cream" | "tent" | "raspberry" | "butter" }) {
  const tones = {
    cream: "bg-canvas text-chocolate",
    tent: "bg-tent text-flour",
    raspberry: "bg-icing text-raspberry",
    butter: "bg-butter/70 text-chocolate",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>{children}</span>;
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#d8c09a] bg-flour/70 px-6 py-10 text-center">
      <p className="font-display text-2xl text-tent-dark">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-chocolate/70">{body}</p>
    </div>
  );
}
