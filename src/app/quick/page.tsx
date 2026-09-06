"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import { quickMode, type PlanItemType } from "@/lib/engine/planner";
import { Card, Chip } from "@/components/ui";
import { cn } from "@/lib/utils";

const WINDOWS = [30, 45, 60, 90, 120];

const KIND_META: Record<PlanItemType, { emoji: string; href: string; desc: string }> = {
  revision: { emoji: "🔄", href: "/revision", desc: "Lock in what's about to fade." },
  learn: { emoji: "📘", href: "/learn?s=qa&", desc: "Highest-priority concept." },
  video: { emoji: "🎬", href: "/videos", desc: "Watch — don't binge. Take one note." },
  practice: { emoji: "✏️", href: "/practice", desc: "Answer focused questions." },
  speed: { emoji: "⚡", href: "/time-pressure", desc: "Build solving speed." },
  "dilr-set": { emoji: "🧩", href: "/practice?mode=set", desc: "Solve one DILR set." },
  rc: { emoji: "📖", href: "/rc-lab", desc: "One RC passage." },
  challenge: { emoji: "🎯", href: "/challenge", desc: "Daily challenge attempt." },
  "mistake-rev": { emoji: "🧠", href: "/mistakes", desc: "Re-solve recorded mistakes." },
};

export default function QuickModePage() {
  const { state } = useStore();
  const [minutes, setMinutes] = useState(45);
  const plan = quickMode(minutes);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Quick mode</h1>
        <p className="text-sm text-slate-500 mt-1">
          A complete, prioritized session for exactly the time you have — no planning overhead.
        </p>
      </div>

      <Card>
        <div className="label">How much time do you have right now?</div>
        <div className="flex flex-wrap gap-2">
          {WINDOWS.map((m) => (
            <button key={m} onClick={() => setMinutes(m)} className={cn("chip !px-5 !py-2.5 !text-base", minutes === m ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300")}>
              {m} min
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Your {minutes}-minute session</h2>
          <Chip tone="blue">{plan.time} min planned</Chip>
        </div>
        <div className="space-y-3">
          {plan.blocks.map((b, i) => {
            const meta = KIND_META[b.kind];
            return (
              <Link key={i} href={meta.href} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3.5 hover:border-primary/40 hover:bg-primary/5 transition">
                <span className="text-xl">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{b.name}</div>
                  <div className="text-xs text-slate-500">{meta.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{b.minutes} min</div>
                  <div className="text-[11px] text-slate-400">start →</div>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Ordering is engineered for the best ROI-per-minute: revision first (if due), then concept, watch, practice, speed.
        </p>
      </Card>

      <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-700/40">
        <p className="text-xs text-amber-800 dark:text-amber-300">
          Quick mode is a {state.plan.dailyMinutes} min/day habit, done consistently, that beats occasional 3-hour sessions.
          The dashboard plan adapts to whatever you actually finish here.
        </p>
      </Card>
    </div>
  );
}