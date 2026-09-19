"use client";

import { useEffect, useState } from "react";

export function CompanionPhoto({
  name,
  photo,
  size = "sm",
}: {
  name: string;
  photo?: string;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = useState(false);
  const box = size === "md" ? "h-14 w-14" : "h-11 w-11";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const face = photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={photo} alt="" className="h-full w-full object-cover object-[center_18%]" />
  ) : (
    <span className="font-display text-lg text-flour">{name.slice(0, 1)}</span>
  );

  if (!photo) {
    return (
      <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-tent ${box}`}>
        {face}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        className={`relative shrink-0 overflow-hidden rounded-full bg-[#efe2c8] ring-2 ring-white ${box}`}
        onClick={() => setOpen(true)}
        aria-label={`See ${name}'s photo`}
      >
        {face}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b2118]/75 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={name}
        >
          <figure
            className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-[28px] bg-flour shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={name} className="max-h-[78vh] w-full object-cover object-[center_15%]" />
            <figcaption className="px-4 py-3 font-display text-2xl text-tent-dark">{name}</figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
