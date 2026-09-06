"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import type { Question, RCPassage } from "@/lib/types";
import { DifficultyBadge, Chip, Card } from "@/components/ui";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Phase = "intro" | "reading" | "questions" | "summary";

export function RCRunner({ passage, onExit }: { passage: RCPassage; onExit: () => void }) {
  const { recordAnswer, recordSession } = useStore();
  const [phase, setPhase] = useState<Phase>("intro");
  const [readStart, setReadStart] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState<Record<string, { chosen: number; correct: boolean }>>({});
  const [highlight, setHighlight] = useState<string[]>([]);
  const resultsRef = useRef<{ timeSec: number; topicId?: string }[]>([]);
  const qStartRef = useRef(Date.now());

  const words = passage.passage.split(/\s+/).length;

  useEffect(() => {
    if (phase !== "reading") return;
    setReadStart(Date.now());
    const id = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const wpm = readStart ? Math.round((words / Math.max(1, elapsed / 60))) : 0;

  const q = passage.questions[qIndex];

  const submit = () => {
    if (submitted || selected === null) return;
    setSubmitted(true);
    const correct = selected === q.correctIndex;
    setAttempted((a) => ({ ...a, [q.id]: { chosen: selected, correct } }));
    recordAnswer({
      questionId: q.id,
      topicId: q.topicId,
      section: "varc",
      correct,
      timeSec: Math.max(1, Math.round((Date.now() - qStartRef.current) / 1000)),
      attemptedAt: new Date().toISOString(),
      difficulty: q.difficulty,
      yourAnswer: selected,
      correctIndex: q.correctIndex,
    });
    resultsRef.current.push({ timeSec: Math.max(1, Math.round((Date.now() - qStartRef.current) / 1000)), topicId: q.topicId });
  };

  const next = () => {
    if (qIndex + 1 >= passage.questions.length) {
      recordSession(
        {
          type: "reading",
          durationMin: Math.max(1, Math.round(((Date.now() - (readStart ?? Date.now())) / 60000) + passage.questions.length * 1)),
          itemsCompleted: passage.questions.length,
        },
        []
      );
      setPhase("summary");
      return;
    }
    setQIndex((i) => i + 1);
    setSelected(null);
    setSubmitted(false);
    qStartRef.current = Date.now();
  };

  const toggleSel = (i: number) => {
    if (!highlight.includes(String(i))) {
      setHighlight([...highlight, String(i)]);
    } else {
      setHighlight(highlight.filter((h) => h !== String(i)));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button className="hover:text-primary" onClick={onExit}>← Exit passage</button>
        <span className="flex items-center gap-2">
          <Chip tone="neutral">{passage.domain}</Chip>
          <Chip tone="neutral">{passage.length}</Chip>
          <DifficultyBadge level={passage.difficulty} />
        </span>
      </div>

      {phase === "intro" && (
        <Card className="p-6 text-center">
          <div className="text-4xl mb-3">📖</div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{passage.title}</h2>
          <p className="text-sm text-slate-500 mt-1">
            ~{words} words · {passage.estimatedMinutes} min expected · {passage.questions.length} questions
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-left">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Goal WPM</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">180–220</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Read time</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">1–2 min</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Accuracy goal</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">75%+</div>
            </div>
          </div>
          <button className="btn-primary mt-5" onClick={() => setPhase("reading")}>Start reading →</button>
        </Card>
      )}

      {phase === "reading" && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100">{passage.title}</span>
            <span className="text-slate-500">⏱ {formatTime(elapsed)} · {wpm > 0 ? `${wpm} wpm` : "reading…"}</span>
          </div>
          <p className="text-base leading-8 text-slate-800 dark:text-slate-200">{passage.passage}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {highlight.map((h) => (
              <Chip key={h} tone="amber">Line {h}</Chip>
            ))}
            <button className="btn-ghost !py-1.5 text-xs" onClick={() => toggleSel(0)}>Mark highlight</button>
          </div>
          <button className="btn-primary mt-4 w-full" onClick={() => setPhase("questions")}>
            I've read it — start questions →
          </button>
        </div>
      )}

      {phase === "questions" && q && (
        <div className="space-y-4">
          <div className="max-h-64 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
            {passage.passage}
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">Question {qIndex + 1} of {passage.questions.length}</span>
              <DifficultyBadge level={q.difficulty} />
            </div>
            <p className="text-base font-medium text-slate-800 dark:text-slate-100">{q.prompt}</p>
            <div className="mt-4 space-y-2">
              {(q.options ?? []).map((opt, i) => {
                const isCorrectOpt = submitted && i === q.correctIndex;
                const isWrongSel = submitted && i === selected && i !== q.correctIndex;
                return (
                  <button
                    key={i}
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={cn(
                      "w-full text-left rounded-xl border px-4 py-3 text-sm transition flex items-center gap-3",
                      !submitted && selected === i && "border-primary bg-primary/5",
                      !submitted && selected !== i && "border-slate-200 dark:border-slate-700/60 hover:border-primary/40",
                      submitted && isCorrectOpt && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                      submitted && isWrongSel && "border-red-400 bg-red-50 dark:bg-red-900/20",
                      submitted && !isCorrectOpt && !isWrongSel && "opacity-50 border-slate-200 dark:border-slate-700/60"
                    )}
                  >
                    <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border",
                      submitted && isCorrectOpt ? "border-emerald-500 bg-emerald-500 text-white" :
                      submitted && isWrongSel ? "border-red-400 bg-red-400 text-white" :
                      selected === i ? "border-primary text-primary" : "border-slate-300 dark:border-slate-600 text-slate-500")}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className={cn("mt-4 rounded-xl p-4 text-sm", attempted[q.id]?.correct ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200" : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200")}>
                {attempted[q.id]?.correct ? "✅ Correct" : "❌ Incorrect"}
                <div className="mt-2 bg-white/70 dark:bg-black/20 rounded-lg p-3 text-slate-700 dark:text-slate-300">{q.explanation}</div>
              </div>
            )}
            {submitted ? (
              <button className="btn-primary mt-4 w-full" onClick={next}>
                {qIndex + 1 >= passage.questions.length ? "Finish passage" : "Next →"}
              </button>
            ) : (
              <button className="btn-primary mt-4 w-full" onClick={submit} disabled={selected === null}>
                Submit answer
              </button>
            )}
          </div>
        </div>
      )}

      {phase === "summary" && (
        <Card className="p-6 text-center">
          <div className="text-5xl mb-3">✅</div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Passage complete</h2>
          <p className="text-sm text-slate-500 mt-2">
            Read at ~{wpm} wpm · {passage.questions.filter((qq) => attempted[qq.id]?.correct).length}/{passage.questions.length} correct
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-left">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Reading speed</div>
              <div className={cn("font-bold", wpm >= 180 ? "text-emerald-600" : wpm >= 120 ? "text-amber-600" : "text-red-500")}>
                {wpm} wpm
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Time used</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{formatTime(elapsed)}</div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="text-xs text-slate-500">Accuracy</div>
              <div className={cn("font-bold", 100 * (passage.questions.filter((qq) => attempted[qq.id]?.correct).length / passage.questions.length) >= 75 ? "text-emerald-600" : "text-red-500")}>
                {Math.round(100 * (passage.questions.filter((qq) => attempted[qq.id]?.correct).length / passage.questions.length))}%
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-3">
            <button className="btn-primary" onClick={onExit}>Back to RC Lab</button>
            <button className="btn-ghost" onClick={() => { setPhase("reading"); setElapsed(0); setQIndex(0); setAttempted({}); }}>Redo passage</button>
          </div>
        </Card>
      )}
    </div>
  );
}