"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { buildWeeklyReport } from "@/lib/engine/report";
import { Card, Chip, EmptyState } from "@/components/ui";

export default function ReportPage() {
  const { state } = useStore();
  const r = buildWeeklyReport(state);

  const hasData = state.sessions.length + state.questionResults.length + state.testAttempts.length + state.studyDays.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Your Week</h1>
          <p className="text-sm text-slate-500 mt-1">
            This week · {r.weekStart} → {r.weekEnd}
          </p>
        </div>
        <Chip tone="blue">🔥 {r.streakChange}-day streak</Chip>
      </div>

      {!hasData ? (
        <EmptyState
          title="No study activity yet"
          description="Once you learn, practice, revise and take tests, your weekly report appears here automatically."
          action={<Link href="/today" className="btn-primary mt-2">Start today's plan</Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l: "Study time", v: `${(r.studyMinutes / 60).toFixed(1)}h`, sub: `${r.daysActive} active day${r.daysActive === 1 ? "" : "s"}` },
              { l: "Questions", v: r.questionsSolved, sub: r.accuracy != null ? `${r.accuracy}% accuracy` : "no practice yet" },
              { l: "Topics studied", v: r.topicsStudied, sub: `${r.revisionsDone} revisions done` },
              { l: "Tests taken", v: r.testsTaken, sub: `${r.mistakesNew} new mistakes logged` },
            ].map((s) => (
              <Card key={s.l} className="!p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.l}</div>
                <div className="text-2xl font-extrabold mt-1 text-slate-900 dark:text-slate-100">{s.v}</div>
                <div className="text-xs text-slate-500 mt-1">{s.sub}</div>
              </Card>
            ))}
          </div>

          <Card>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Section coverage</h2>
            <div className="flex flex-wrap gap-2">
              {(["qa", "varc", "dilr"] as const).map((s) => (
                <Chip key={s} tone={r.sectionCoverage[s] ? "primary" : "neutral"}>
                  {s.toUpperCase()}: {r.sectionCoverage[s] ?? 0} questions
                </Chip>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">✅ What improved</h2>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {r.improved.length === 0 && <li className="text-slate-400">Data is still building — next week's report will compare weeks.</li>}
              {r.improved.map((x, i) => <li key={i}>• {x}</li>)}
            </ul>
          </Card>

          <Card>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">⚠️ What needs attention</h2>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {r.attention.length === 0 && <li className="text-slate-400">Nothing obvious — keep going.</li>}
              {r.attention.map((x, i) => <li key={i}>• {x}</li>)}
            </ul>
          </Card>

          <Card>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-2">🎯 Next week</h2>
            <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {r.nextWeek.map((x, i) => <li key={i}>• {x}</li>)}
            </ul>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Link href="/today" className="btn-primary">Start today's plan</Link>
              <Link href="/analytics" className="btn-ghost">Full analytics</Link>
            </div>
          </Card>
</>
    )}
  </div>
);
}