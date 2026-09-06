"use client";

import { useEffect, useState } from "react";

/**
 * Short (≈1.1s) boot animation shown once per session on app load.
 * The brand mark's elements assemble upward, then the overlay fades.
 * Respects `prefers-reduced-motion` (static logo, quick fade through
 * the global reduced-motion CSS) and never blocks interaction long.
 */
export function BootSplash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let shown = false;
    try {
      shown = sessionStorage.getItem("catcommand:booted") === "1";
    } catch {
      /* ignore */
    }
    if (shown) return;
    setMounted(true);
    setVisible(true);
    try {
      sessionStorage.setItem("catcommand:booted", "1");
    } catch {
      /* ignore */
    }
    const t1 = window.setTimeout(() => setLeaving(true), 1150);
    const t2 = window.setTimeout(() => setVisible(false), 1400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (!visible || !mounted) return null;

  const reduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      aria-hidden="true"
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center",
        "bg-white dark:bg-[#0b1220]",
        leaving ? "opacity-0 transition-opacity duration-300" : "opacity-100",
      ].join(" ")}
    >
      <svg width="64" height="64" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="boot-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="0.55" stopColor="#274ee3" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#boot-g)" />
        <g fill="#ffffff">
          <rect
            x="7"
            y="35"
            width="34"
            height="5"
            rx="2.5"
            className={reduced ? "" : "boot-rise"}
            style={{ animationDelay: "0.55s" }}
          />
          <rect
            x="9"
            y="28"
            width="6.5"
            height="7"
            rx="2"
            className={reduced ? "" : "boot-rise"}
            style={{ animationDelay: "0.1s" }}
          />
          <rect
            x="20"
            y="22.5"
            width="6.5"
            height="12.5"
            rx="2"
            className={reduced ? "" : "boot-rise"}
            style={{ animationDelay: "0.25s" }}
          />
          <rect
            x="31.5"
            y="16"
            width="6.5"
            height="19"
            rx="2"
            className={reduced ? "" : "boot-rise"}
            style={{ animationDelay: "0.4s" }}
          />
          <path
            d="M34.75 7.5 L30.75 15 L38.75 15 Z"
            className={reduced ? "" : "boot-rise"}
            style={{ animationDelay: "0.55s" }}
          />
        </g>
      </svg>
    </div>
  );
}