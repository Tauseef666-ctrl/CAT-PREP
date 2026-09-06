"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { buildDailyPlan } from "@/lib/engine/planner";
import { Card, Chip, ProgressBar } from "@/components/ui";
import { formatDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerPage() {
  const { state, updatePlan } = useStore();
  const router = useRouter();
  const minutes = state.plan.dailyMinutes || 60;

  const toggleDay = (d: number) => {
    const has = state.plan.daysPerWeek.includes(d);
    const days = has ? state.plan.daysPerWeek.filter((x) => x !== d) : [...state.plan.daysPerWeek, d];
    updatePlan({ daysPerWeek: days.length > 0 ? days : [d] });
  };

  const days = state.plan.daysPerWeek;
  const today = new Date().getDay();
  const weeklyAvailable = days.length * minutes;

  const todayPlan = buildDailyPlan(state, minutes);
  const doneToday = state.studyDays.find((x) => x.date === new Date().toISOString().slice(0, 10));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Weekly Planner</h1>
        <p className="text-sm text-slate-500 mt-1">
          Set your non-negotiable study window. The engine fits the smartest work into it.
        </p>
      </div>

      {/* Minutes */}
      <Card>
        <div className="label">Daily study time</div>
        <div className="flex flex-wrap gap-2">
          {[30, 45, 60, 90, 120, 180].map((m) => (
            <button key={m} onClick={() => updatePlan({ dailyMinutes: m })} className={cn("chip !px-5 !py-2.5", minutes === m ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300")}>
              {m} min
            </button>
          ))}
        </div>
      </Card>

      {/* Days */}
      <Card>
        <div className="label">Study days each week</div>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <button key={d} onClick={() => toggleDay(d)} className={cn("flex h-12 w-12 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition", days.includes(d) ? "border-primary bg-primary/10 text-primary" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/40")}>
              {DAY_LABELS[d].slice(0, 1)}{DAY_LABELS[d].toLowerCase().slice(1, 2)}
              <span className="text-[9px] text-slate-400">{d === today ? "today" : ""}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          {days.length} days/week × {minutes}min = <b>{formatDuration(weeklyAvailable)}</b>/week
        </p>
      </Card>

      {/* Today's plan */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Today's plan</h2>
          <Chip tone="green">{todayPlan.items.length} tasks</Chip>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <ProgressBar value={doneToday ? Math.min(100, Math.round((doneToday.completedMinutes / minutes) * 100)) : 0} className="flex-1" tone="green" />
          <span className="text-xs text-slate-500">{doneToday?.completedMinutes ?? 0}/{minutes} min</span>
        </div>
        <div className="space-y-2">
          {todayPlan.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.durationMin} min — {item.title}</div>
                <div className="text-xs text-slate-500">{item.reason}</div>
              </div>
              <Link href="/today" className="text-primary text-sm font-semibold whitespace-nowrap">Go →</Link>
            </div>
          ))}
          {todayPlan.items.length === 0 && (
            <p className="text-sm text-slate-500">Complete a session and the engine will rebuild a sharper plan.</p>
          )}
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => router.push("/today")}>Run today's mission →</button>
      </Card>

      {/* Week preview */}
      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Why the engine allocates this way</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Every day you study, the plan spends your minutes on: {state.plan.weakSections.length > 0 ? `weak sections (${state.plan.weakSections.map((s) => s.toUpperCase()).join(", ")})` : "your weakest detected topics"} first, high-weightage
          core topics next, revision before it decays, and one speed block to protect your exam-day clock.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={`/learn?s=${state.plan.weakSections[0] ?? "qa"}`} className="btn-ghost !py-2 text-sm">Revisit syllabus</Link>
          <Link href="/analytics" className="btn-ghost !py-2 text-sm">See what the plan reacts to</Link>
        </div>
      </Card>
    </div>
  );
}