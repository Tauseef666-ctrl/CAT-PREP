"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * CAT Command brand mark.
 *
 * Concept: an ascending geometric form (progress bars rising to an
 * upward arrow) set on a subtle base plate that reads as a page/book —
 * "learning gives you upward progress".
 *
 * Props:
 *  - size: rendered width/height (px)
 *  - wordmark: render "CAT Command" beside the mark
 *  - mono: force a single color (inherits currentColor)
 *  - inverse: white-on-transparent variant for dark surfaces
 */
export function Logo({
  size = 28,
  wordmark = false,
  mono = false,
  inverse = false,
  className,
}: {
  size?: number;
  wordmark?: boolean;
  mono?: boolean;
  inverse?: boolean;
  className?: string;
}) {
  const uid = useId();
  const gid = `cg${uid.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <span className={cn("inline-flex items-center gap-2 select-none", className)}>
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" role="img">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4338ca" />
            <stop offset="0.55" stopColor="#274ee3" />
            <stop offset="1" stopColor="#0d9488" />
          </linearGradient>
        </defs>

        {!mono && !inverse && (
          <rect x="1" y="1" width="46" height="46" rx="12" fill={`url(#${gid})`} />
        )}

        <g
          fill={mono ? "currentColor" : "#ffffff"}
          fillOpacity={inverse || mono ? 1 : 0.97}
        >
          {/* base plate / page */}
          <rect x="7" y="35" width="34" height="5" rx="2.5" />
          {/* low bar */}
          <rect x="9" y="28" width="6.5" height="7" rx="2" />
          {/* mid bar */}
          <rect x="20" y="22.5" width="6.5" height="12.5" rx="2" />
          {/* arrow shaft */}
          <rect x="31.5" y="16" width="6.5" height="19" rx="2" />
          {/* arrow head */}
          <path d="M34.75 7.5 L30.75 15 L38.75 15 Z" />
        </g>
      </svg>

      {wordmark && (
        <span
          className={cn(
            "text-sm font-extrabold tracking-tight leading-none",
            inverse || mono ? (mono ? "" : "text-white") : "text-slate-900 dark:text-slate-100"
          )}
        >
          CAT{" "}
          <span
            className={
              mono ? "" : inverse ? "text-teal-300" : "text-primary dark:text-teal-400"
            }
          >
            Command
          </span>
        </span>
      )}
    </span>
  );
}