"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import { QuestionRun } from "@/components/practice/QuestionRun";
import { QUESTION_BANK } from "@/lib/content";
import { Card, Chip, DifficultyBadge } from "@/components/ui";
import type { Question } from "@/lib/types";

export default function TimePressurePage() {
  const { state } = useStore();
  const [session, setSession] = useState<{ questions: Question[]; timed: boolean } | null>(null);

  const buildFor = (level: "hard" | "mixed", count: number) => {
    const pool = QUESTION_BANK.filter((q) => {
      if (q.set || q.type !== "mcq") return false;
      if (level === "hard") return q.difficulty >= 3;
      return true;
    });
    const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    setSession({ questions: chosen, timed: true });
  };

  if (session) {
    return (
      <div className="max-w-2xl mx-auto">
        <button className="text-xs text-slate-500 hover:text-primary mb-3" onClick={() => setSession(null)}>← Back to trainer</button>
        <QuestionRun questions={session.questions} timed={session.timed} onFinish={() => setSession(null)} />
      </div>
    );
  }

  const hardCount = QUESTION_BANK.filter((q) => q.difficulty >= 3 && !q.set).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Time-Pressure Trainer</h1>
        <p className="text-sm text-slate-500 mt-1">
          CAT punishes slow solving. Train under a countdown so the clock stops being your enemy.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {([
          { l: "Speed set", em: "⚡", d: "10 questions, per-question countdown, mixed difficulty", count: 10, level: "mixed" },
          { l: "Hard set", em: "🔥", d: `10 questions at difficulty 3+ (${hardCount} available)`, count: 10, level: "hard" },
          { l: "Full focus", em: "🎯", d: "15 questions — the exam-day clock drill", count: 15, level: "mixed" },
        ] as const).map((p) => (
          <button key={p.l} onClick={() => buildFor(p.level as "mixed" | "hard", p.count)} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition">
            <div className="text-2xl">{p.em}</div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">{p.l}</div>
            <div className="text-xs text-slate-500 mt-0.5">{p.d}</div>
          </button>
        ))}
      </div>

      <Card>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">What the trainer corrects</h3>
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
          <li>• Re-reading — every extra read costs the next question</li>
          <li>• No-plan starts — spend the first 10s choosing an approach</li>
          <li>• Over-checking — an average solution is a completed solution</li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">10–15 min, 3× per week, and your per-question average drops steadily.</p>
      </Card>
    </div>
  );
}