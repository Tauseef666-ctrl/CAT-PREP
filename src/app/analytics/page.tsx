"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { readinessIndex, sectionalReadiness } from "@/lib/engine/readiness";
import { overallMetrics, sectionMetrics, topicsDueForRevision } from "@/lib/engine/metrics";
import { Card, Chip, ProgressBar, EmptyState } from "@/components/ui";
import { RadialGauge, MetricBar, MiniBars, DonutRow } from "@/components/charts";
import { formatDuration } from "@/lib/utils";

const COMPONENT_LABELS: Record<string, { label: string; key: string }> = {
  conceptStrength: { label: "Concept coverage", key: "conceptStrength" },
  practiceStrength: { label: "Practice volume", key: "practiceStrength" },
  accuracy: { label: "Accuracy", key: "accuracy" },
  speed: { label: "Speed", key: "speed" },
  mockReadiness: { label: "Mock readiness", key: "mockReadiness" },
  revisionConsistency: { label: "Revision consistency", key: "revisionConsistency" },
  weakTopicCoverage: { label: "Weak-topic coverage", key: "weakTopicCoverage" },
};

export default function AnalyticsPage() {
  const { state } = useStore();
  const readiness = readinessIndex(state);
  const all = overallMetrics(state);
  const sectionReady = sectionalReadiness(state);
  const due = topicsDueForRevision(state, 6);

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
    return { date: d, day: ["S", "M", "T", "W", "T", "F", "S"][new Date(d + "T00:00:00").getDay()] };
  });
  const weekMinutes = last7.map((x) => state.studyDays.find((s) => s.date === x.date)?.completedMinutes ?? 0);
  const weekAcc = last7.map((x) => {
    const dayResults = state.questionResults.filter((r) => r.attemptedAt.slice(0, 10) === x.date && (r.yourAnswer !== undefined && r.yourAnswer !== null));
    if (dayResults.length === 0) return 0;
    return Math.round((dayResults.filter((r) => r.correct).length / dayResults.length) * 100);
  });

  const topicStrengths = ["qa", "varc", "dilr"].map((s) => {
    const m = sectionMetrics(state, s as "qa");
    return { s, ...m };
  });

  const attempts = state.testAttempts.filter((a) => a.submittedAt).slice(0, 5);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Honest, computed-from-your-data metrics. No inflated numbers.</p>
      </div>

      {/* Readiness */}
      <Card className="!p-6 flex flex-col items-center text-center">
        <RadialGauge value={readiness.score} size={140} label="CAT Readiness" />
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 max-w-md">{readiness.biggestLimiter}</p>
      </Card>

      {/* Components */}
      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Readiness components</h2>
        <div className="space-y-3">
          {Object.values(COMPONENT_LABELS).map((c) => (
            <MetricBar
              key={c.key}
              label={c.label}
              value={readiness.components[c.key as keyof typeof readiness.components]}
            />
          ))}
        </div>
      </Card>

      {/* Weekly activity */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Study minutes (7 days)</h3>
          <MiniBars data={weekMinutes} labels={last7.map((x) => x.day)} color="var(--primary)" />
          <p className="text-xs text-slate-500 mt-2">{formatDuration(weekMinutes.reduce((a, b) => a + b, 0))} this week</p>
        </Card>
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Daily accuracy (7 days)</h3>
          <MiniBars data={weekAcc} labels={last7.map((x) => x.day)} color="#10b981" />
          <p className="text-xs text-slate-500 mt-2">Only days with answers count</p>
        </Card>
      </div>

      {/* Sections */}
      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Section profile</h2>
        <div className="space-y-3">
          {topicStrengths.map((s) => (
            <div key={s.s} className="flex items-center gap-3">
              <span className="w-10 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">{s.s}</span>
              <DonutRow value={s.accuracy} size={44} color={s.accuracy >= 65 ? "#10b981" : "#f59e0b"} />
              <ProgressBar value={sectionReady[s.s as "qa"]} className="flex-1" tone={s.accuracy >= 65 ? "green" : "amber"} />
              <span className="text-xs text-slate-500 w-28 text-right">
                {s.questionsSolved} solved · {s.accuracy}% acc
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Test history */}
      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Mock history</h2>
        {attempts.length === 0 ? (
          <EmptyState title="No mocks yet" description="Take your first mini mock to establish a baseline." />
        ) : (
          <div className="space-y-2">
            {attempts.map((a) => {
              const acc = Math.round((a.correct / Math.max(1, a.correct + a.incorrect)) * 100);
              return (
                <Link key={a.attemptId} href={`/tests/${a.testId}/analysis?attempt=${a.attemptId}`} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.correct}✓ · {a.incorrect}✗ · {a.skipped}—</div>
                  </div>
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{a.score}/{a.maxScore} <span className={acc >= 65 ? "text-emerald-600" : "text-red-500"}>({acc}%)</span></div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* Revision + weak */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Due for revision</h3>
          {due.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing due — schedule trending healthy.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {due.map((t) => (
                <li key={t.id}>
                  <Link href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}`} className="text-slate-700 dark:text-slate-300 hover:text-primary">{t.title}</Link>
                  <Chip tone="amber" className="ml-2">due</Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">All-time stats</h3>
          <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <p>🔥 Streak: <b>{all.streak} days</b> (longest {all.streak})</p>
            <p>⚡ XP: <b>{all.xp}</b></p>
            <p>✏️ Questions: <b>{all.questionsSolved}</b> ({all.pyqSolved} PYQs)</p>
            <p>📋 Syllabus: <b>{all.syllabusCompletion}%</b> ({all.completedTopics}/{all.totalTopics})</p>
            <p>🧠 Mistakes logged: <b>{all.mistakes}</b></p>
            <p>⏱ Avg time/question: <b>{all.avgTimeSec}s</b></p>
          </div>
        </Card>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Analytics reflect only what you've actually recorded — total solutions complete topics honestly.
      </p>
    </div>
  );
}