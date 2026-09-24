"use client";

import { useId } from "react";

function scallop(cx: number, cy: number, r: number, lobes: number, depth: number) {
  const parts: string[] = [];
  for (let i = 0; i < lobes; i += 1) {
    const a0 = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / lobes) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / lobes) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + Math.cos(a0) * r;
    const y0 = cy + Math.sin(a0) * r;
    const xm = cx + Math.cos(a1) * (r + depth);
    const ym = cy + Math.sin(a1) * (r + depth);
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    if (i === 0) parts.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
    parts.push(`Q ${xm.toFixed(2)} ${ym.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`);
  }
  return `${parts.join(" ")} Z`;
}

const PASTRY = scallop(44, 40, 28, 18, 5.2);
const TIN = scallop(44, 40, 31.5, 18, 4.4);

const PALETTES = {
  plus: {
    tin: "#8d6a32",
    pastry: "#e8b24a",
    pastryDark: "#c48a28",
    icing: "#24584b",
    icingLight: "#3d7a68",
    text: "#fffaf2",
    pearl: "#f0c75e",
  },
  minus: {
    tin: "#7a3a2a",
    pastry: "#d4a05a",
    pastryDark: "#b07830",
    icing: "#c23b5a",
    icingLight: "#d45d78",
    text: "#fffaf2",
    pearl: "#f7d6dc",
  },
  even: {
    tin: "#8a7350",
    pastry: "#e6c48a",
    pastryDark: "#c4a066",
    icing: "#fff6e8",
    icingLight: "#fffaf2",
    text: "#3d2b1f",
    pearl: "#e8a0bf",
  },
} as const;

export function BakerScoreMark({ value, className = "" }: { value: number; className?: string }) {
  const rawId = useId().replace(/:/g, "");
  const icingId = `icing-${rawId}`;
  const pastryId = `pastry-${rawId}`;
  const boardId = `board-${rawId}`;
  const palette = value > 0 ? PALETTES.plus : value < 0 ? PALETTES.minus : PALETTES.even;
  const label = `${value > 0 ? "+" : ""}${value}`;
  const tight = label.length > 2;

  return (
    <svg
      viewBox="0 0 88 94"
      className={`h-[4.6rem] w-[4.35rem] shrink-0 ${className}`}
      role="img"
      aria-label={`${label} points`}
    >
      <defs>
        <radialGradient id={boardId} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#f3e6cf" />
          <stop offset="100%" stopColor="#d8c09a" />
        </radialGradient>
        <linearGradient id={pastryId} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor={palette.pastry} />
          <stop offset="100%" stopColor={palette.pastryDark} />
        </linearGradient>
        <radialGradient id={icingId} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor={palette.icingLight} />
          <stop offset="100%" stopColor={palette.icing} />
        </radialGradient>
      </defs>

      <ellipse cx="44" cy="86" rx="28" ry="5.5" fill="#3d2b1f" opacity="0.16" />
      <ellipse cx="44" cy="84" rx="26" ry="4.6" fill={`url(#${boardId})`} />

      <path d={TIN} fill={palette.tin} />
      <path d={PASTRY} fill={`url(#${pastryId})`} />
      <circle cx="44" cy="40" r="22.5" fill={`url(#${icingId})`} />
      <circle cx="44" cy="40" r="22.5" fill="none" stroke={palette.pastryDark} strokeOpacity="0.25" />

      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={index}
            cx={44 + Math.cos(angle) * 18.2}
            cy={40 + Math.sin(angle) * 18.2}
            r="1.35"
            fill={palette.pearl}
          />
        );
      })}

      {value > 0 ? (
        <path
          d="M44 24.2 45.6 28.8 50.5 29.2 46.8 32.4 48 37.2 44 34.8 40 37.2 41.2 32.4 37.5 29.2 42.4 28.8 Z"
          fill="#f0c75e"
        />
      ) : null}
      {value < 0 ? (
        <>
          <path d="M31 34c4 2 6 7 5 11" fill="none" stroke="#fffaf2" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M50 31c2 5-1 10-4 13" fill="none" stroke="#fffaf2" strokeOpacity="0.28" strokeWidth="1.1" strokeLinecap="round" />
          <circle cx="58.5" cy="28" r="3.1" fill="#8b1e38" />
          <circle cx="58.5" cy="27.2" r="1.1" fill="#f7d6dc" opacity="0.7" />
          <path d="M58.5 25c0-2 2.4-3.2 2.4-1.2" fill="none" stroke="#24584b" strokeWidth="1.1" strokeLinecap="round" />
        </>
      ) : null}

      <text
        x="44"
        y={value > 0 ? 48 : 46.5}
        textAnchor="middle"
        fill={palette.text}
        fontFamily="var(--font-fraunces), Times New Roman, serif"
        fontSize={tight ? 18 : 22}
        fontWeight="700"
      >
        {label}
      </text>
    </svg>
  );
}