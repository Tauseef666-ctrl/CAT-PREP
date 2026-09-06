"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { QUESTION_MAP, TOPIC_MAP } from "@/lib/content";
import { performanceBand } from "@/lib/engine/testBuilder";
import { Card, Chip, DifficultyBadge, EmptyState } from "@/components/ui";
import { RadialGauge, MetricBar } from "@/components/charts";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

function AnalysisContent() {
  const { id } = useParams<{ id: string }>();
  const params = useSearchParams();
  const { state, recordMistake } = useStore();
  const attemptId = params.get("attempt");
  const attempt = state.testAttempts.find((a) => a.attemptId === attemptId);
  const [filter, setFilter] = useState<"all" | "wrong" | "skipped">("all");

  if (!attempt) {
    return (
      <div className="max-w-md mx-auto py-16">
        <EmptyState title="Analysis not found" description="This attempt isn't in your record anymore." />
        <Link href="/tests" className="btn-primary mt-4">Back to test center</Link>
      </div>
    );
  }

  const band = performanceBand(attempt.correct, attempt.correct + attempt.incorrect);
  const answeredCount = attempt.correct + attempt.incorrect;
  const accuracy = answeredCount === 0 ? 0 : Math.round((attempt.correct / answeredCount) * 100);
  const timePerQ = Math.round(attempt.timeUsedSec / Math.max(1, attempt.answersRecord.length));

  const sections = (["qa", "varc", "dilr"] as const).map((s) => {
    const sc = attempt.sectionScores[s];
    const total = sc.correct + sc.incorrect + sc.skipped;
    return { s, ...sc, total, acc: total === 0 ? 0 : Math.round((sc.correct / Math.max(1, sc.correct + sc.incorrect)) * 100) };
  }).filter((x) => x.total > 0);

  const reviewQs = attempt.answersRecord.filter((r) => {
    if (filter === "wrong") return !r.correct;
    if (filter === "skipped") return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card className="!p-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Analysis</h1>
          <Chip tone={band.color}>{band.label}</Chip>
        </div>
        <p className="text-xs text-slate-500">{attempt.title} · {formatDate(attempt.submittedAt ?? attempt.startedAt)}</p>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
          <RadialGauge value={accuracy} size={130} label="Accuracy" />
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-center">
              <div className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{attempt.score}</div>
              <div className="text-xs text-slate-500">score /{attempt.maxScore}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
              <div className="text-xl font-extrabold text-emerald-600">{attempt.correct}</div>
              <div className="text-xs text-slate-500">correct</div>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3 text-center">
              <div className="text-xl font-extrabold text-red-500">{attempt.incorrect}</div>
              <div className="text-xs text-slate-500">wrong</div>
            </div>
            <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-center">
              <div className="text-xl font-extrabold text-slate-500 dark:text-slate-300">{attempt.skipped}</div>
              <div className="text-xs text-slate-500">skipped</div>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
          {band.guidance}
          {timePerQ > 90 && answeredCount > 0 && " You're averaging over 90s/question — work on time discipline next."}
        </p>
      </Card>

      {/* Sectional */}
      {sections.length > 0 && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Sectional view</h3>
          <div className="space-y-3">
            {sections.map((x) => (
              <div key={x.s} className="flex items-center gap-3">
                <span className="w-10 text-xs font-semibold uppercase text-slate-600 dark:text-slate-300">{x.s}</span>
                <MetricBar label="" value={x.acc} display={`${x.correct}✓ ${x.incorrect}✗ ${x.skipped}—`} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Topic breakdown */}
      {Object.keys(attempt.topicScores).length > 0 && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Topic breakdown</h3>
          <div className="space-y-2">
            {Object.entries(attempt.topicScores)
              .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))
              .map(([t, sc]) => {
                const topic = TOPIC_MAP[t];
                const acc = Math.round((sc.correct / sc.total) * 100);
                return (
                  <div key={t} className="flex items-center gap-3">
                    <Link href={`/learn/${topic?.section}/${topic?.chapterId?.split("-")[1] ?? ""}/${t}`} className="text-sm text-slate-700 dark:text-slate-300 hover:text-primary truncate flex-1">
                      {topic?.title ?? t}
                    </Link>
                    <Chip tone={acc >= 60 ? "green" : "red"}>{acc}%</Chip>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Train weak areas */}
      <Card className="border-primary/30">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Train weak areas</h3>
        <p className="text-sm text-slate-500 mb-3">Convert this mock into targeted practice.</p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/practice?section=${(Object.entries(attempt.sectionScores).sort((a, b) => (a[1].correct / Math.max(1, a[1].correct + a[1].incorrect)) - (b[1].correct / Math.max(1, b[1].correct + b[1].incorrect)))[0][0])}`} className="btn-primary !py-2 text-sm">
            Practice weakest section →
          </Link>
          <Link href="/mistakes" className="btn-ghost !py-2 text-sm">Open mistake book</Link>
        </div>
      </Card>

      {/* Review */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title !mb-0">Review answers</h2>
          <div className="flex gap-1.5">
            {(["all", "wrong"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={cn("chip", filter === f ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {reviewQs.map((r) => {
            const q = QUESTION_MAP[r.questionId];
            if (!q) return null;
            return (
              <Card key={r.questionId} className={cn("!p-4", !r.correct && "border-red-300 dark:border-red-800/60")}>
                <div className="flex items-center gap-2 mb-2">
                  <Chip tone={r.correct ? "green" : "red"}>{r.correct ? "Correct" : "Wrong"}</Chip>
                  {r.topicId && TOPIC_MAP[r.topicId] && <Chip tone="neutral">{TOPIC_MAP[r.topicId].title}</Chip>}
                  <DifficultyBadge level={r.difficulty} />
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{q.prompt}</p>
                <div className="mt-2 text-sm space-y-1">
                  {(q.options ?? []).map((o, i) => (
                    <p key={i} className={cn(
                      "text-slate-600 dark:text-slate-300",
                      i === q.correctIndex && "font-semibold text-emerald-600 dark:text-emerald-400",
                      i === r.yourAnswer && i !== q.correctIndex && "font-semibold text-red-500"
                    )}>
                      {String.fromCharCode(65 + i)}. {o} {i === r.yourAnswer && "← your answer"}
                    </p>
                  ))}
                </div>
                <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300">
                  {q.explanation}
                </div>
                {!r.correct && (
                  <button
                    className="text-xs text-red-500 font-semibold mt-2"
                    onClick={() => recordMistake({ questionId: q.id, topicId: q.topicId, mistakeType: "Silly mistake", correctMethod: q.explanation, yourAnswer: r.yourAnswer, correctIndex: q.correctIndex })}
                  >
                    ✓ Log to mistake book
                  </button>
                )}
              </Card>
            );
          })}
          {attempt.answersRecord.length === 0 && (
            <EmptyState title="Nothing to review" description="You answered nothing in this attempt." />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <div className="pb-10">
      <Suspense fallback={<div className="card h-32 skeleton" />}>
        <AnalysisContent />
      </Suspense>
    </div>
  );
}