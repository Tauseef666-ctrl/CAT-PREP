"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { overallMetrics } from "@/lib/engine/metrics";
import { evaluateAchievements } from "@/lib/engine/achievements";
import { Card, Chip, ProgressBar, EmptyState } from "@/components/ui";

export default function ProfilePage() {
  const { state, resetAll } = useStore();
  const all = overallMetrics(state);
  const achievements = evaluateAchievements(state);
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="space-y-5">
      <Card className="!p-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-extrabold text-primary">
          {state.profile.name[0]?.toUpperCase() ?? "A"}
        </div>
        <h1 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-slate-100">{state.profile.name}</h1>
        <p className="text-sm text-slate-500">{state.profile.course} · {state.profile.board}</p>
        <div className="mt-3 flex justify-center gap-2 flex-wrap">
          <Chip tone="blue">CAT {state.plan.targetExamYear}</Chip>
          <Chip tone="neutral">{state.plan.prepLevel} level</Chip>
          <Chip tone="neutral">{all.xp} XP</Chip>
        </div>
        <Link href="/settings" className="btn-ghost mt-4 !py-2 text-sm">Edit plan & settings →</Link>
      </Card>

      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Study plan</h2>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p>⏰ <b>{state.plan.dailyMinutes} min/day</b> · {state.plan.daysPerWeek.length} days/week</p>
          <p>🎯 Focus: <b>{state.plan.focusMode}</b> · Language: <b>{state.plan.language}</b></p>
          <p>💪 Strong: {state.plan.strongSections.map((s) => s.toUpperCase()).join(", ") || "—"}</p>
          <p>🎗 Weak: {state.plan.weakSections.map((s) => s.toUpperCase()).join(", ") || "none flagged"}</p>
          <p>📚 Study load (diploma): level {state.plan.diplomaLoad}/3</p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Achievements</h2>
          <Chip tone={unlocked.length > 0 ? "green" : "neutral"}>{unlocked.length}/{achievements.length}</Chip>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {unlocked.map((a) => (
            <div key={a.id} className="rounded-xl border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50/60 dark:bg-emerald-900/10 p-3">
              <div className="text-lg">🏅</div>
              <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{a.title}</div>
              <div className="text-[11px] text-emerald-700/70 dark:text-emerald-300/60">{a.description}</div>
            </div>
          ))}
          {locked.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 opacity-55">
              <div className="text-lg grayscale">🔒</div>
              <div className="text-sm font-bold text-slate-600 dark:text-slate-300">{a.title}</div>
              <div className="text-[11px] text-slate-500">{a.description}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Danger zone</h2>
        <p className="text-xs text-slate-500 mb-3">Resets all recorded progress, plan and streaks. Keeps your name.</p>
        <button
          className="btn-ghost !py-2 text-sm !border-red-300 !text-red-500"
          onClick={() => { if (confirm("Reset ALL progress? This cannot be undone.")) resetAll(); }}
        >
          Reset all data
        </button>
      </Card>
    </div>
  );
}