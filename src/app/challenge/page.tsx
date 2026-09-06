"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import { QUESTION_BANK } from "@/lib/content";
import { Card, Chip, DifficultyBadge } from "@/components/ui";
import { formatDate, cn } from "@/lib/utils";
import type { Question } from "@/lib/types";

export default function ChallengePage() {
  const { state, completeDailyChallenge } = useStore();
  const [q, setQ] = useState<Question | null>(() => pickQuestion());
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function pickQuestion(): Question | null {
    const hard = QUESTION_BANK.filter((x) => x.difficulty >= 4 && !x.set);
    if (hard.length === 0) return QUESTION_BANK[0] ?? null;
    return hard[Math.floor(Math.random() * hard.length)];
  }

  const today = new Date().toISOString().slice(0, 10);
  const done = state.dailyChallenges[today];
  const streak = state.streak.current;

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === q?.correctIndex) {
      completeDailyChallenge(q.difficulty * 10);
    }
  };

  if (done?.solved) {
    return (
      <div className="max-w-md mx-auto py-10 text-center space-y-4">
        <div className="text-5xl">🥇</div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Today's challenge done</h1>
        <p className="text-sm text-slate-500">You scored {done.score} points today. Come back tomorrow for a fresh one.</p>
        <p className="text-sm text-slate-500">🔥 {streak}-day streak</p>
        <div className="flex justify-center gap-3">
          <button className="btn-ghost" onClick={() => { setQ(pickQuestion()); setSelected(null); setSubmitted(false); }}>Practice anyway</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Daily Challenge</h1>
          <p className="text-sm text-slate-500 mt-1">One hard question a day — the reps that build elite problem-solving.</p>
        </div>
        <Chip tone="amber">🔥 {streak} day streak</Chip>
      </div>

      {!submitted && q && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <Chip tone="blue">Today's challenge · {formatDate(today)}</Chip>
            <DifficultyBadge level={q.difficulty} />
          </div>
          <p className="text-base font-medium leading-relaxed text-slate-800 dark:text-slate-100">{q.prompt}</p>
          <div className="mt-4 space-y-2">
            {(q.options ?? []).map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3",
                  selected === i ? "border-primary bg-primary/5" : "border-slate-200 dark:border-slate-700/60 hover:border-primary/40"
                )}
              >
                <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border", selected === i ? "border-primary text-primary" : "border-slate-300 dark:border-slate-600 text-slate-500")}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-slate-700 dark:text-slate-300">{opt}</span>
              </button>
            ))}
          </div>
          <button className="btn-primary mt-4 w-full" onClick={submit} disabled={selected === null}>
            Submit challenge
          </button>
        </div>
      )}

      {submitted && q && (
        <Card className="!p-5">
          <h2 className={cn("font-extrabold text-lg", selected === q.correctIndex ? "text-emerald-600" : "text-red-500")}>
            {selected === q.correctIndex ? "✅ Solved it — " + q.difficulty * 10 + " XP" : "❌ Not this time"}
          </h2>
          <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-600 dark:text-slate-300">
            <b>Answer: {String.fromCharCode(65 + (q.correctIndex ?? 0))}</b> — {q.explanation}
          </div>
          <button className="btn-ghost mt-4" onClick={() => { setQ(pickQuestion()); setSelected(null); setSubmitted(false); }}>
            Next question
          </button>
        </Card>
      )}
    </div>
  );
}