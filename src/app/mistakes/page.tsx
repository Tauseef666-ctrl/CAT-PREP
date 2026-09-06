"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import { QUESTION_MAP, TOPIC_MAP } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { MistakeType } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPES: MistakeType[] = ["Conceptual", "Calculation", "Misread", "Wrong approach", "Time management", "Guess", "Silly mistake"];

export default function MistakesPage() {
  const { state, updateMistakeRetry } = useStore();
  const [filter, setFilter] = useState<MistakeType | "all">("all");

  const mistakes = state.mistakes.filter((m) => filter === "all" || m.mistakeType === filter);
  const counts = state.mistakes.reduce<Record<string, number>>((acc, m) => {
    acc[m.mistakeType] = (acc[m.mistakeType] ?? 0) + 1;
    return acc;
  }, {});

  const pending = mistakes.filter((m) => m.retryStatus === "pending").length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Mistake Book</h1>
        <p className="text-sm text-slate-500 mt-1">
          The highest-ROI study material. Patterns, not just problems.
        </p>
      </div>

      {/* Pattern summary */}
      <div className="grid grid-cols-4 gap-2">
        {TYPES.map((t) => (
          <button key={t} onClick={() => setFilter(filter === t ? "all" : t)} className={cn("rounded-xl border p-3 text-center transition", filter === t ? "border-primary bg-primary/10" : "border-slate-200 dark:border-slate-700/60", counts[t] === 0 && "opacity-40")}>
            <div className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{counts[t] ?? 0}</div>
            <div className="text-[10px] leading-tight text-slate-500">{t}</div>
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-500">
        {pending > 0
          ? `${pending} mistake${pending > 1 ? "s" : ""} pending retry — retry before re-reading solutions.`
          : state.mistakes.length > 0
            ? "All logged mistakes have been retried. Add new ones as you solve."
            : "No mistakes logged yet — they only appear when you actually solve something wrong."}
      </p>

      {state.mistakes.length === 0 ? (
        <EmptyState title="Mistake book is empty" description="Wrong answers during practice get logged here automatically." />
      ) : (
        <div className="space-y-3">
          {mistakes.map((m) => {
            const q = QUESTION_MAP[m.questionId];
            const topic = m.topicId ? TOPIC_MAP[m.topicId] : undefined;
            if (!q) return null;
            return (
              <Card key={m.id} className={cn("!p-4", m.retryStatus === "mastered" && "opacity-60")}>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Chip tone={m.retryStatus === "mastered" ? "green" : m.retryStatus === "retried" ? "amber" : "red"}>
                    {m.retryStatus}
                  </Chip>
                  <Chip tone="neutral">{m.mistakeType}</Chip>
                  {topic && <Chip tone="neutral">{topic.title}</Chip>}
                  <span className="text-xs text-slate-400 ml-auto">{formatDate(m.date)}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{q.prompt}</p>
                <div className="mt-2 rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-600 dark:text-slate-300">
                  <b>Correct method:</b> {m.correctMethod}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className={cn("btn-ghost !px-3 !py-1.5 text-xs", m.retryStatus === "mastered" && "!text-emerald-600")}
                    onClick={() => updateMistakeRetry(m.id, "mastered")}
                  >
                    ✓ Mastered
                  </button>
                  <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => updateMistakeRetry(m.id, "retried")}>
                    Retried
                  </button>
                  {topic && (
                    <a href={`/practice?topic=${topic.id}`} className="btn-primary !px-3 !py-1.5 text-xs">
                      Retrain topic →
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}