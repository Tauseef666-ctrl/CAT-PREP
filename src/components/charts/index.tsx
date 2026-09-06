"use client";

import { cn } from "@/lib/utils";

// Radial gauge for readiness score
export function RadialGauge({
  value,
  size = 120,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const r = size / 2 - 8;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  const color =
    value >= 70 ? "#10b981" : value >= 45 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="9" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold" style={{ color }}>
          {value}
        </span>
        {label && <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>}
        {sublabel && <span className="text-[9px] text-slate-400 dark:text-slate-500">{sublabel}</span>}
      </div>
    </div>
  );
}

// Horizontal bar with label + value
export function MetricBar({
  label,
  value,
  max = 100,
  display,
  color,
}: {
  label: string;
  value: number;
  max?: number;
  display?: string;
  color?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>
        <span className="text-slate-400 dark:text-slate-500">{display ?? `${value}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color ?? "var(--primary)" }}
        />
      </div>
    </div>
  );
}

// Mini bar chart for weekly data
export function MiniBars({
  data,
  labels,
  color,
  height = 90,
}: {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md" style={{ height: `${(v / max) * (height - 20)}px`, background: color ?? "var(--primary)", opacity: v > 0 ? 1 : 0.15 }} />
          <span className="text-[10px] text-slate-400 dark:text-slate-500">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Section split visual — 3 segments
export function SectionSplit({ values }: { values: Record<string, number> }) {
  const total = Math.max(Object.values(values).reduce((a, b) => a + b, 0), 1);
  const colors = ["#274ee3", "#10b981", "#f59e0b"];
  const keys = Object.keys(values);
  return (
    <div className="h-3 w-full rounded-full overflow-hidden flex">
      {keys.map((k, i) => (
        <div
          key={k}
          title={k.toUpperCase()}
          style={{ width: `${(values[k] / total) * 100}%`, background: colors[i % 3] }}
          className="first:rounded-l-full last:rounded-r-full"
        />
      ))}
    </div>
  );
}

export function DonutRow({
  value,
  size = 40,
  color = "#274ee3",
}: {
  value: number;
  size?: number;
  color?: string;
}) {
  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.min(100, value) / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="4" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="4" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-800 dark:text-slate-200")}>
        {value}%
      </span>
    </div>
  );
}