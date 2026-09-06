"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { getDraftTest, setDraftTest, buildTestAttempt } from "@/lib/engine/testBuilder";
import { QUESTION_MAP } from "@/lib/content";
import { DifficultyBadge, Chip } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function ExamPage() {
  const { id } = useParams<{ id: string }>();
  const { recordTestAttempt } = useStore();
  const router = useRouter();
  const [def, setDef] = useState(getDraftTest());
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(def ? def.durationMin * 60 : 0);
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startedRef = useRef(new Date().toISOString());

  useEffect(() => {
    if (submitted) return;
    const t = setInterval(() => setTimeLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!def) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-500">No active test — pick one from the test center.</p>
        <button className="btn-primary mt-4" onClick={() => router.push("/tests")}>Go to test center</button>
      </div>
    );
  }

  const q = QUESTION_MAP[def.questionIds[qIndex]];
  const answeredCount = def.questionIds.filter((qid) => answers[qid] !== undefined && answers[qid] !== -1).length;

  const choose = (option: number) => {
    setAnswers((a) => ({ ...a, [q.id]: option }));
  };

  const toggleFlag = () => {
    setFlagged((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]));
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    const timeUsedSec = Math.max(1, def.durationMin * 60 - timeLeft);
    const attempt = buildTestAttempt(def, answers, timeUsedSec, startedRef.current);
    recordTestAttempt(attempt);
    setDraftTest(null);
    router.push(`/tests/${def.id}/analysis?attempt=${attempt.attemptId}`);
  };

  const optKeys = Object.keys(answers).filter((k) => answers[k] !== -1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Exam top bar */}
      <header className="sticky top-0 z-20 glass border-b border-slate-200 dark:border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{def.title}</div>
            <div className="text-xs text-slate-500">
              Q {qIndex + 1}/{def.questionIds.length} · {answeredCount} answered
            </div>
          </div>
          <div className={cn("text-sm font-extrabold px-3 py-1 rounded-lg", timeLeft <= 60 ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200")}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-28">
        {q && (
          <div className="space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <DifficultyBadge level={q.difficulty} />
                <Chip tone="neutral">{q.section.toUpperCase()}</Chip>
                {q.isPYQ && <Chip tone="blue">PYQ</Chip>}
              </div>
              <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100">{q.prompt}</p>

              {(q.options ?? []).length > 0 && (
                <div className="mt-4 space-y-2">
                  {(q.options ?? []).map((opt, i) => {
                    const sel = answers[q.id] === i;
                    const letter = String.fromCharCode(65 + i);
                    return (
                      <button
                        key={i}
                        onClick={() => choose(i)}
                        className={cn(
                          "w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3",
                          sel ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700/60 hover:border-primary/40"
                        )}
                      >
                        <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                          sel ? "border-primary text-primary" : "border-slate-300 dark:border-slate-600 text-slate-500")}>
                          {letter}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card p-4 flex items-center justify-between flex-wrap gap-3">
              <button className="btn-ghost !py-2 text-sm" onClick={() => setQIndex((i) => Math.max(0, i - 1))} disabled={qIndex === 0}>
                ← Prev
              </button>
              <button className={cn("btn-ghost !py-2 text-sm", flagged.includes(q.id) && "!border-amber-400 !text-amber-600")} onClick={toggleFlag}>
                {flagged.includes(q.id) ? "★ Flagged" : "☆ Flag"}
              </button>
              {qIndex + 1 < def.questionIds.length ? (
                <button className="btn-primary !py-2" onClick={() => setQIndex((i) => i + 1)}>Next →</button>
              ) : (
                <button className="btn-primary !py-2" onClick={() => setConfirm(true)}>Submit test</button>
              )}
            </div>
          </div>
        )}

        {/* Palette */}
        <div className="card mt-5 p-4">
          <div className="text-xs font-semibold text-slate-500 mb-2">Question palette</div>
          <div className="grid grid-cols-8 gap-1.5">
            {def.questionIds.map((qid, i) => {
              const a = answers[qid];
              const state = a === undefined || a === -1
                ? (flagged.includes(qid) ? "flagged" : "unanswered")
                : "answered";
              const isCurrent = i === qIndex;
              return (
                <button
                  key={qid}
                  onClick={() => setQIndex(i)}
                  className={cn(
                    "h-8 rounded-md text-xs font-bold flex items-center justify-center transition",
                    state === "answered" && "bg-emerald-500 text-white",
                    state === "unanswered" && "bg-slate-200 dark:bg-slate-800 text-slate-500",
                    state === "flagged" && "bg-amber-400 text-slate-900",
                    isCurrent && "ring-2 ring-primary"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-3 text-[11px] text-slate-500">
              <span><span className="inline-block h-2.5 w-2.5 rounded bg-emerald-500 mr-1" />Answered</span>
              <span><span className="inline-block h-2.5 w-2.5 rounded bg-amber-400 mr-1" />Flagged</span>
              <span><span className="inline-block h-2.5 w-2.5 rounded bg-slate-300 dark:bg-slate-700 mr-1" />Unanswered</span>
            </div>
            <button className="btn-primary !py-2" onClick={() => setConfirm(true)}>Submit test</button>
          </div>
        </div>
      </main>

      {/* Confirm modal */}
      {confirm && !submitted && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Submit test?</h3>
            <p className="text-sm text-slate-500 mt-1">
              {answeredCount} of {def.questionIds.length} answered · {flagged.length} flagged.
              {answeredCount < def.questionIds.length && " Unanswered questions count as skipped."}
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn-ghost flex-1" onClick={() => setConfirm(false)}>Keep solving</button>
              <button className="btn-primary flex-1" onClick={handleSubmit}>Submit now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}