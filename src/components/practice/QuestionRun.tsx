"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import type { DILRSet, Question, QuestionResult, SectionId } from "@/lib/types";
import { DifficultyBadge, Chip } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const MISTAKE_TYPES = [
  "Conceptual",
  "Calculation",
  "Misread",
  "Wrong approach",
  "Time management",
  "Guess",
  "Silly mistake",
] as const;

export interface RunResult {
  results: QuestionResult[];
  durationMin: number;
}

export function QuestionRun({
  questions,
  setData,
  timed = false,
  onFinish,
}: {
  questions: Question[];
  setData?: DILRSet;
  timed?: boolean;
  onFinish: (r: RunResult) => void;
}) {
  const { state, recordSession, recordMistake } = useStore();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [mistakeType, setMistakeType] = useState<string | null>(null);
  const [flagList, setFlagList] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(timed ? 120 : null);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState<{ correct: number; wrong: number; skipped: number } | null>(null);

  const resultsRef = useRef<QuestionResult[]>([]);
  const pushedRef = useRef<Set<string>>(new Set());
  const submittedRef = useRef(false);
  const qStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());
  const section = (questions[0]?.section ?? "qa") as SectionId;

  const q = questions[index];

  const timerSec = useMemo(() => {
    // per-question budget by difficulty (CAT-style)
    switch (q?.difficulty) {
      case 1: return 90;
      case 2: return 100;
      case 3: return 115;
      case 4: return 135;
      case 5: return 165;
      case 6: return 180;
      default: return 120;
    }
  }, [q?.difficulty]);

  useEffect(() => {
    if (!timed || finished || !q) return;
    setTimeLeft(timerSec);
    submittedRef.current = false;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t === null) return null;
        if (t <= 1) {
          clearInterval(id);
          if (!submittedRef.current) forceTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, timed, finished, timerSec]);

  const pushResult = (correct: boolean, yourAnswer: number | null) => {
    if (pushedRef.current.has(q.id)) return; // never record a question twice
    pushedRef.current.add(q.id);
    const elapsed = Math.round((Date.now() - qStartRef.current) / 1000);
    resultsRef.current.push({
      questionId: q.id,
      topicId: q.topicId,
      section: q.section,
      correct,
      timeSec: Math.max(1, elapsed),
      attemptedAt: new Date().toISOString(),
      difficulty: q.difficulty,
      isPYQ: q.isPYQ,
      source: q.source,
      mistakeType:
        correct ? undefined : (mistakeType as QuestionResult["mistakeType"]) ?? "Silly mistake",
      yourAnswer: yourAnswer ?? undefined,
      correctIndex: q.correctIndex ?? undefined,
    });
    if (!correct && !q.isPYQ) {
      recordMistake({
        questionId: q.id,
        topicId: q.topicId,
        mistakeType: (mistakeType as QuestionResult["mistakeType"]) ?? "Silly mistake",
        correctMethod: q.explanation,
        yourAnswer: yourAnswer ?? undefined,
        correctIndex: q.correctIndex ?? undefined,
      });
    }
    setMistakeType(null);
  };

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const correct = selected !== null && selected === q.correctIndex;
    pushResult(correct, selected);
    setAnswerSubmitted(true);
  };

  const forceTimeout = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    pushResult(false, null);
    setSelected(null);
    setAnswerSubmitted(true);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      finish();
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswerSubmitted(false);
      qStartRef.current = Date.now();
    }
  };

  const finish = () => {
    const made = resultsRef.current;
    const correct = made.filter((r) => r.correct).length;
    const wrong = made.filter((r) => !r.correct && r.yourAnswer !== undefined && r.yourAnswer !== null).length;
    const skipped = made.length - correct - wrong;
    setSummary({ correct, wrong, skipped });
    setFinished(true);
    recordSession(
      {
        type: "practice",
        topicId: q?.topicId,
        durationMin: Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000)),
        itemsCompleted: made.length,
      },
      made
    );
  };

  if (finished) {
    const totalSec = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-4 animate-fadeIn">
        <div className="text-5xl">🏁</div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Session complete</h2>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3">
            <div className="text-2xl font-extrabold text-emerald-600">{summary?.correct ?? 0}</div>
            <div className="text-xs text-slate-500">Correct</div>
          </div>
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-3">
            <div className="text-2xl font-extrabold text-red-500">{summary?.wrong ?? 0}</div>
            <div className="text-xs text-slate-500">Wrong</div>
          </div>
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3">
            <div className="text-2xl font-extrabold text-slate-600 dark:text-slate-200">{summary?.skipped ?? 0}</div>
            <div className="text-xs text-slate-500">Skipped</div>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          {formatTime(totalSec)} total · 10 XP per correct answer. Progress saved to your analytics and plan.
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button className="btn-primary" onClick={() => onFinish({ results: resultsRef.current, durationMin: 1 })}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="max-w-md mx-auto py-10 text-center">
        <p className="text-sm text-slate-500">Nothing to practice here yet — question bank is expanding.</p>
        <button className="btn-primary mt-4" onClick={() => onFinish({ results: [], durationMin: 0 })}>Back</button>
      </div>
    );
  }

  const answerState = !answerSubmitted
    ? "selecting"
    : selected === q.correctIndex
      ? "correct"
      : "incorrect";

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500">
          Question {index + 1} of {questions.length}
        </span>
        {timed && (
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md", (timeLeft ?? timerSec) <= 15 ? "bg-red-100 text-red-600" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
            ⏱ {formatTime(timeLeft ?? 0)}
          </span>
        )}
        <div className="ml-auto flex gap-1">
          {questions.map((_, i) => (
            <span key={i} className={cn("h-1.5 w-4 rounded-full", i === index ? "bg-primary" : "bg-slate-200 dark:bg-slate-700")} />
          ))}
        </div>
        <button
          className="text-xs text-amber-600 dark:text-amber-400 font-semibold"
          onClick={() => setFlagList((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))}
        >
          {flagList.includes(q.id) ? "★ Flagged" : "☆ Flag"}
        </button>
      </div>

      {/* DILR set context */}
      {setData && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-700/50 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 text-sm">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>🧩</span> {setData.title} <Chip tone="neutral">{setData.domain}</Chip>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{setData.statement}</p>
          {setData.dataBlocks.map((b, i) => (
            <pre key={i} className="mt-2 bg-white dark:bg-slate-900/60 rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap">
              {b}
            </pre>
          ))}
        </div>
      )}

      {/* Question */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <DifficultyBadge level={q.difficulty} />
          <Chip tone="neutral">{q.section.toUpperCase()}</Chip>
          {q.isPYQ && q.year && <Chip tone="blue">PYQ {q.year}</Chip>}
        </div>
        <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100">{q.prompt}</p>

        {q.type === "integer" ? (
          <input
            type="number"
            className="input mt-4 w-32"
            placeholder="Type your answer"
            value={selected ?? ""}
            onChange={(e) => setSelected(Number(e.target.value))}
            disabled={answerSubmitted}
          />
        ) : (
          <div className="mt-4 space-y-2">
            {(q.options ?? ["A", "B", "C", "D"]).map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isCorrectOption = answerSubmitted && i === q.correctIndex;
              const isSelectedWrong = answerSubmitted && i === selected && i !== q.correctIndex;
              return (
                <button
                  key={i}
                  disabled={answerSubmitted}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3",
                    !answerSubmitted && selected === i && "border-primary bg-primary/5",
                    !answerSubmitted && selected !== i && "border-slate-200 dark:border-slate-700/60 hover:border-primary/40",
                    answerSubmitted && isCorrectOption && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                    answerSubmitted && isSelectedWrong && "border-red-400 bg-red-50 dark:bg-red-900/20",
                    answerSubmitted && !isCorrectOption && !isSelectedWrong && "opacity-50 border-slate-200 dark:border-slate-700/60"
                  )}
                >
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                    answerSubmitted && isCorrectOption ? "border-emerald-500 bg-emerald-500 text-white" :
                    answerSubmitted && isSelectedWrong ? "border-red-400 bg-red-400 text-white" :
                    selected === i ? "border-primary text-primary" : "border-slate-300 dark:border-slate-600 text-slate-500")}>
                    {letter}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback */}
        {answerSubmitted ? (
          <div className={cn("mt-4 rounded-xl p-4 text-sm", answerState === "correct" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200")}>
            {answerState === "correct" ? "✅ Correct — " + "10 XP earned." : "❌ Incorrect."}
            <div className="mt-2 bg-white/70 dark:bg-black/20 rounded-lg p-3 text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
              {q.explanation}
            </div>
            {q.fasterApproach && (
              <div className="mt-2 bg-white/70 dark:bg-black/20 rounded-lg p-3 text-slate-700 dark:text-slate-300">
                ⚡ Faster approach: {q.fasterApproach}
              </div>
            )}
          </div>
        ) : (
          !timed && (
            <button className="btn-primary mt-4 w-full" onClick={handleSubmit} disabled={selected === null}>
              Submit answer
            </button>
          )
        )}

        {/* Wrong → mistake diagnosis */}
        {answerSubmitted && answerState === "incorrect" && !mistakeType && !q.isPYQ && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Why did you get it wrong? (feeds your mistake log)</p>
            <div className="flex flex-wrap gap-1.5">
              {MISTAKE_TYPES.map((m) => (
                <button key={m} className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" onClick={() => setMistakeType(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Next */}
      {answerSubmitted && (
        <button className="btn-primary w-full !py-3.5" onClick={next}>
          {index + 1 >= questions.length ? "Finish session" : "Next →"}
        </button>
      )}
      {timed && !answerSubmitted && (
        <button className="btn-ghost w-full" onClick={forceTimeout}>Submit anyway</button>
      )}
    </div>
  );
}