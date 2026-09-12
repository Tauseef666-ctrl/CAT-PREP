"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { buildDailyPlan, isPlanItemDone } from "@/lib/engine/planner";
import { readinessIndex, sectionalReadiness } from "@/lib/engine/readiness";
import {
  overallMetrics,
  weakTopicAnalysis,
  strongTopicAnalysis,
  topicsDueForRevision,
  todayKey,
} from "@/lib/engine/metrics";
import { revisionStatus } from "@/lib/engine/revision";
import { Card, Chip, ProgressBar, StatCard } from "@/components/ui";
import { RadialGauge, MetricBar } from "@/components/charts";
import { cn, greeting, formatDuration } from "@/lib/utils";
import { SECTION_MAP } from "@/lib/content";

export default function DashboardPage() {
  const { state } = useStore();
  const router = useRouter();

  const all = overallMetrics(state);
  const readiness = readinessIndex(state);
  const plan = buildDailyPlan(state, state.plan.dailyMinutes || 60);
  const weak = weakTopicAnalysis(state, 4);
  const strong = strongTopicAnalysis(state, 4);
  const due = topicsDueForRevision(state, 5);
  const rev = revisionStatus(state);
  const sectionReady = sectionalReadiness(state);
  const today = todayKey();
  const todayStudy = state.studyDays.find((d) => d.date === today);
  const todayPct = todayStudy
    ? Math.min(100, Math.round((todayStudy.completedMinutes / Math.max(1, todayStudy.targetMinutes)) * 100))
    : 0;

  if (!state.profile.onboarded) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Set up your plan first</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Tell CAT Command your available time and targets so the dashboard can build your personal plan.
        </p>
        <Link href="/onboarding" className="btn-primary mt-6">
          Complete onboarding
        </Link>
      </div>
    );
  }

  const planIcon = {
    learn: "📘",
    video: "🎬",
    practice: "✏️",
    revision: "🔄",
    "dilr-set": "🧩",
    rc: "📖",
    challenge: "🎯",
    "mistake-rev": "🧠",
    speed: "⚡",
  } as const;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {greeting()}, Aspirant
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {state.plan.dailyMinutes} min available today · {state.plan.daysPerWeek.length} days/week planned
        </p>
      </div>

      {/* Today's mission */}
      <Card className="!p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-slate-900 dark:text-slate-100">Today's CAT Mission</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Planned for {plan.availableMinutes} minutes</p>
          </div>
          <Chip tone="green">{todayPct}% done</Chip>
        </div>
        <div className="p-5">
          <button
            onClick={() => router.push("/today")}
            className="btn-primary w-full !py-3.5 !text-base"
          >
            START TODAY'S PLAN
          </button>
          <div className="mt-4 grid sm:grid-cols-2 gap-2">
            {plan.items.map((item, i) => {
              const done = isPlanItemDone(state, item);
              return (
                <Link
                  key={i}
                  href={item.topicId ? `/learn/${item.section}/${item.topicId.split("-")[1]}/${item.topicId}` : "/today"}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40 transition"
                >
                  <span className="text-xl">{planIcon[item.kind]}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("text-sm font-bold", done ? "text-emerald-500" : "text-slate-200 dark:text-slate-700")}>✓</span>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {item.durationMin} min — {item.title}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.reason}</div>
                  </div>
                </Link>
              );
            })}
            {plan.items.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 col-span-full">
                Plan is empty — complete a quick mode session or practice to generate tomorrow's plan.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Why this plan */}
      {plan.rationale.length > 0 && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Why this plan?</h3>
          <ul className="space-y-1.5">
            {plan.rationale.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="text-primary">→</span> {r}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
            The plan rebalances automatically after every answer, lecture and mock you complete.
          </p>
        </Card>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Study streak" value={`${all.streak} days`} sub={`best ${all.streak} 🔥`} tone="amber" />
        <StatCard label="Syllabus" value={`${all.syllabusCompletion}%`} sub={`${all.completedTopics}/${all.totalTopics} topics`} />
        <StatCard label="Questions" value={all.questionsSolved} sub={`${all.pyqSolved} PYQs solved`} tone="blue" />
        <StatCard label="Accuracy" value={`${all.accuracy}%`} sub={`avg ${all.avgTimeSec}s/question`} tone="green" />
      </div>

      {/* Readiness + continuation */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="flex flex-col items-center text-center">
          <RadialGauge value={readiness.score} size={130} label="CAT Readiness" sublabel="internal metric" />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 max-w-xs">
            {readiness.biggestLimiter}
          </p>
          <Link href="/analytics" className="link text-xs mt-2">See component breakdown →</Link>
        </Card>

        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Continue learning</h3>
          <div className="space-y-2.5">
            {plan.items.slice(0, 3).map((item, i) => (
              <MetricBar
                key={i}
                label={`${item.title} (${item.durationMin} min)`}
                value={i === 0 ? 100 : 60}
                display=""
              />
            ))}
            {plan.items.length === 0 && <p className="text-sm text-slate-500">Start a session to create your path.</p>}
          </div>
          <div className="mt-4">
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">Sectional readiness</h4>
            <div className="space-y-2">
              {(Object.keys(sectionReady) as (keyof typeof sectionReady)[]).map((k) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-10 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">{k}</span>
                  <ProgressBar value={sectionReady[k]} className="flex-1" tone={sectionReady[k] >= 60 ? "green" : "amber"} />
                  <span className="w-8 text-right text-xs text-slate-500">{sectionReady[k]}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Weak + strong */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Current weak areas</h3>
          {weak.length === 0 ? (
            <p className="text-sm text-slate-500">No weak-topic pattern yet. Accuracy data will surface them.</p>
          ) : (
            <ul className="space-y-2">
              {weak.map((w) => (
                <li key={w.topic.id} className="flex items-center justify-between gap-2">
                  <Link href={`/learn/${w.topic.section}/${w.topic.chapterId.split("-")[1]}/${w.topic.id}`} className="text-sm text-slate-700 dark:text-slate-300 hover:text-primary truncate">
                    {w.topic.title}
                  </Link>
                  <Chip tone="red">{w.accuracy}%</Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Strong areas</h3>
          {strong.length === 0 ? (
            <p className="text-sm text-slate-500">Solve more questions to surface your strengths.</p>
          ) : (
            <ul className="space-y-2">
              {strong.map((s) => (
                <li key={s.topic.id} className="flex items-center justify-between gap-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{s.topic.title}</span>
                  <Chip tone="green">{s.accuracy}%</Chip>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Revision */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">Topics due for revision</h3>
          <Link href="/revision" className="link text-xs">Revision center →</Link>
        </div>
        {due.length === 0 ? (
          <p className="text-sm text-slate-500">Nothing due right now. {rev.overdue > 0 ? `${rev.overdue} overdue.` : "Keep up the pace."}</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-2">
            {due.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}?revise=1`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.title}</span>
                  <Chip tone="amber">Revise</Chip>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Next recommended test */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-primary/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Next recommended test</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            {all.testsTaken === 0
              ? "Finish a topic or two, then try your first Mini Mock to establish a baseline."
              : all.accuracy >= 65
                ? "Your accuracy supports a sectional mock — take the QA Mock this week."
                : "Accuracy is below 65%. Practice concept questions before the next mock."}
          </p>
          <Link href="/tests" className="btn-ghost mt-4 !py-2 text-sm">
            Open test center →
          </Link>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Quick mode</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            Only have 30–90 minutes? Get an optimized session instead of a chopped-up plan.
          </p>
          <Link href="/quick" className="btn-ghost mt-4 !py-2 text-sm">
            I HAVE LIMITED TIME →
          </Link>
        </Card>
      </div>

      {/* Mini weekly? */}
      <Card>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">This week at a glance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {formatDuration(all.studyMinutes)} total study time · {all.testsTaken} mock(s) · {all.mistakes} mistake(s) logged
        </p>
        <Link href="/analytics" className="link inline-block mt-2 text-sm">Full analytics →</Link>
      </Card>
    </div>
  );
}