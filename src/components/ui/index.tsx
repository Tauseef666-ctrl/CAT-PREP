"use client";

import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn("card p-4 sm:p-5", onClick && "cursor-pointer transition hover:border-primary/40", className)}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  action,
}: {
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      {action}
    </div>
  );
}

export function Chip({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "primary" | "green" | "amber" | "red" | "blue" | "teal";
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary: "bg-primary/10 text-primary dark:bg-primary/20",
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  };
  return <span className={cn("chip", tones[tone], className)}>{children}</span>;
}

export function ProgressBar({
  value,
  className,
  tone,
}: {
  value: number;
  className?: string;
  tone?: "primary" | "green" | "amber";
}) {
  const colors = {
    primary: "bg-primary",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  return (
    <div className={cn("h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700/60", className)}>
      <div
        className={cn("h-full rounded-full transition-all", colors[tone ?? "primary"])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function DifficultyBadge({ level }: { level: number }) {
  const labels = ["", "Beginner", "Easy", "Medium", "Hard", "CAT Level", "Challenge"];
  const toneMap: Record<number, string> = {
    1: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    3: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    4: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    5: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    6: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };
  return <Chip className={toneMap[level] ?? ""}>{labels[level] ?? "Medium"}</Chip>;
}

export function PriorityChip({ priority }: { priority: 1 | 2 | 3 }) {
  if (priority === 1) return <Chip tone="red">High priority</Chip>;
  if (priority === 2) return <Chip tone="amber">Medium</Chip>;
  return <Chip tone="neutral">Low</Chip>;
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };
  return (
    <Link href={href} className={cn(variants[variant], className)}>
      {children}
    </Link>
  );
}

export const Skeleton = forwardRef<HTMLDivElement, { className?: string }>(
  function Skeleton({ className }, ref) {
    return <div ref={ref} className={cn("skeleton", className)} />;
  }
);

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 py-12 px-4 text-center">
      {icon ? <div className="text-3xl">{icon}</div> : <div className="text-3xl">🗂️</div>}
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">{title}</p>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "primary" | "green" | "amber" | "red" | "blue";
}) {
  const dot: Record<string, string> = {
    primary: "bg-primary",
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    red: "bg-red-500",
    blue: "bg-sky-500",
  };
  return (
    <Card className="!p-3.5">
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot[tone])} />
        {label}
      </div>
      <div className="text-xl font-bold mt-1.5 text-slate-900 dark:text-slate-100">{value}</div>
      {sub && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>}
    </Card>
  );
}