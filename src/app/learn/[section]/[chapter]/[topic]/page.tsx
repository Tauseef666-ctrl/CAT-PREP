"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import {
  TOPIC_MAP,
  CHAPTER_MAP,
  QUESTIONS_BY_TOPIC,
  VIDEOS,
  FORMULAS,
  PYQ_BY_TOPIC,
  RC_BY_TOPIC,
  DILR_BY_TOPIC,
} from "@/lib/content";
import { isTopicDueForRevision, topicStrength } from "@/lib/engine/metrics";
import { Card, Chip, DifficultyBadge, PriorityChip, EmptyState } from "@/components/ui";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

function ExampleCard({ q, defaultOpen }: { q: Question; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          <span className="text-slate-400 mr-1">Q.</span> {q.prompt}
        </p>
        <DifficultyBadge level={q.difficulty} />
      </div>
      {(q.options ?? []).length > 0 && (
        <ul className="mt-2 space-y-1 text-sm">
          {(q.options ?? []).map((o, i) => (
            <li
              key={i}
              className={cn(
                "text-slate-600 dark:text-slate-300",
                q.correctIndex === i && "font-semibold text-emerald-600 dark:text-emerald-400"
              )}
            >
              {String.fromCharCode(65 + i)}. {o}
            </li>
          ))}
        </ul>
      )}
      <button className="mt-3 text-xs text-primary font-semibold" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide solution ▲" : "Show solution ▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-900 dark:text-emerald-100 whitespace-pre-wrap">
          <span className="font-bold">Answer: {String.fromCharCode(65 + (q.correctIndex ?? 0))}</span>
          {q.explanation && <div className="mt-1">{q.explanation}</div>}
          {q.fasterApproach && (
            <div className="mt-2 border-t border-emerald-200/60 dark:border-emerald-700/40 pt-2">
              <span className="font-semibold">⚡ Faster approach:</span> {q.fasterApproach}
            </div>
          )}
          {q.commonTrap && (
            <div className="mt-2 border-t border-amber-200/60 dark:border-amber-700/40 pt-2 text-amber-800 dark:text-amber-200">
              <span className="font-semibold">⚠ Common trap:</span> {q.commonTrap}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TopicPage() {
  const { topic } = useParams<{ topic: string }>();
  const { state, completeTopic, markTopicInProgress, setConceptLearned, setExamplesDone, setVideoWatched, recordRevision } = useStore();

  const t = TOPIC_MAP[topic];
  const [revising, setRevising] = useState(false);

  const examples = useMemo(() => {
    const raw = QUESTIONS_BY_TOPIC[topic] ?? [];
    const order = [1, 2, 3, 4, 5, 6];
    return [...raw].sort(
      (a, b) => (order.indexOf(a.difficulty) - order.indexOf(b.difficulty)) || (b.difficulty - a.difficulty)
    );
  }, [topic]);

  if (!t) {
    return (
      <div className="max-w-md mx-auto py-16">
        <EmptyState title="Topic not found" description="This topic doesn't exist in the syllabus." />
        <Link href="/learn" className="btn-primary mt-4">Back to syllabus</Link>
      </div>
    );
  }

  const ch = CHAPTER_MAP[t.chapterId];
  const p = state.topicProgress[t.id];
  const status = p?.status ?? "not-started";
  const due = isTopicDueForRevision(state, t.id);
  const strength = topicStrength(state, t);
  const qs = QUESTIONS_BY_TOPIC[t.id] ?? [];
  const pyts = PYQ_BY_TOPIC[t.id] ?? [];
  const videos = VIDEOS.filter((v) => v.topicId === t.id);
  const formulas = FORMULAS.filter((f) => f.topicId === t.id);

  const toggleComplete = () => {
    if (status === "completed") markTopicInProgress(t.id);
    else completeTopic(t.id);
  };

  const doRevision = (perfGood: boolean) => {
    setRevising(true);
    recordRevision(t.id, perfGood);
    setTimeout(() => setRevising(false), 400);
  };

  const stashHref = (mode: "practice" | "timed" | "pyq" | "test") =>
    mode === "practice"
      ? `/practice?topic=${t.id}`
      : mode === "timed"
        ? `/practice?topic=${t.id}&timed=1`
        : mode === "pyq"
          ? `/pyq?topic=${t.id}`
          : `/tests?topic=${t.id}`;

  const steps = [
    { label: "Learn", desc: "Concepts, rules, shortcuts", ready: true },
    { label: "Watch", desc: `${videos.length} verified video${videos.length === 1 ? "" : "s"}`, ready: true },
    { label: "Examples", desc: `${examples.length} solved example${examples.length === 1 ? "" : "s"}`, ready: true },
    { label: "Practice", desc: `Adaptive question set`, ready: strength.attempts > 0 },
    { label: "Timed", desc: "Build solving speed", ready: strength.attempts >= 3 },
    { label: "PYQs", desc: `${pyts.length} past-paper-tagged Qs`, ready: pyts.length > 0 && strength.attempts >= 5 },
    { label: "Topic Test", desc: "Mini mock", ready: strength.attempts >= 5 },
    { label: "Revision", desc: due ? "Due today" : "Spaced repetition", ready: status === "completed" },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/learn" className="hover:text-primary">Learn</Link>
        <span>/</span>
        <Link href={`/learn?s=${t.section}`} className="hover:text-primary uppercase">{t.section}</Link>
        <span>/</span>
        <Link href={`/learn?s=${t.section}`} className="hover:text-primary">{ch.title}</Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[160px]">{t.title}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">{t.title}</h1>
          <DifficultyBadge level={t.difficulty} />
          <PriorityChip priority={t.priority} />
          {due && <Chip tone="amber">Revision due</Chip>}
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {t.estimatedMinutes} min · {t.section.toUpperCase()} ·{" "}
          {status === "completed" ? "completed" : status === "in-progress" ? "in progress" : "not started"}
        </p>
        {t.prerequisites.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Prerequisites:</span>
            {t.prerequisites.map((id) => {
              const ptop = TOPIC_MAP[id];
              const pState = state.topicProgress[id];
              const done = pState?.status === "completed" || pState?.conceptLearned;
              const started = pState && pState.status !== "not-started";
              return (
                <Link
                  key={id}
                  href={`/learn/${ptop.section}/${ptop.chapterId.split("-")[1]}/${id}`}
                  className={cn(
                    "chip border transition hover:border-primary/50",
                    done
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700/50 dark:text-emerald-300"
                      : started
                        ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700/50 dark:text-amber-300"
                        : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                  )}
                >
                  {done ? "✓" : started ? "▶" : "○"} {ptop.title}
                </Link>
              );
            })}
            {t.prerequisites.some((id) => !state.topicProgress[id] || state.topicProgress[id]?.status === "not-started") && (
              <Chip tone="amber">Recommended: finish prerequisites first — but you're never blocked from trying</Chip>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <Card className="flex items-center gap-4 flex-wrap">
        <Chip tone={status === "completed" ? "green" : status === "in-progress" ? "blue" : "neutral"}>
          {status === "completed" ? "Completed" : status === "in-progress" ? "In progress" : "Not started"}
        </Chip>
        <span className="text-xs text-slate-500">{strength.attempts} solved · {strength.accuracy}% accuracy</span>
        <button className={cn("btn-primary !px-4 !py-2 text-xs ml-auto", status === "completed" && "!bg-slate-200 !text-slate-700 dark:!bg-slate-700 dark:!text-slate-200")} onClick={toggleComplete}>
          {status === "completed" ? "Undo" : "Mark as done"}
        </button>
      </Card>

      {/* Learning path */}
      <Card>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Your path through this topic</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "rounded-xl border p-3",
                s.ready ? "border-slate-200 dark:border-slate-700/60" : "border-dashed border-slate-300 dark:border-slate-700 opacity-50"
              )}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                s.ready ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                {i + 1}
              </span>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 mt-1.5">{s.label}</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-3">A guide, not a gate — skip ahead if you already know a step.</p>
      </Card>

      {/* 1. Learn */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="step-num">1</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Learn</h2>
          </div>
          <button
            className={cn("btn-ghost !py-1.5 text-xs", p?.conceptLearned && "!text-emerald-600 dark:!text-emerald-400")}
            onClick={() => setConceptLearned(t.id)}
          >
            {p?.conceptLearned ? "✓ Concept marked" : "Mark concept learned"}
          </button>
        </div>
        <p className="text-sm text-slate-400 text-xs leading-relaxed">{t.description}</p>
        <div className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{t.concept}</div>

        {t.coreRules.length > 0 && (
          <>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">Core rules</h4>
            <ul className="space-y-1.5">
              {t.coreRules.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-primary font-bold">·</span> {r}
                </li>
              ))}
            </ul>
          </>
        )}

        {t.formulas.length > 0 && (
          <>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">Key formulas</h4>
            <div className="space-y-2">
              {t.formulas.map((f, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
                  <code className="block text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-2 text-primary">{f}</code>
                </div>
              ))}
            </div>
          </>
        )}

        {formulas.length > 0 && (
          <>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">Formula cards</h4>
            <div className="space-y-2">
              {formulas.map((f) => (
                <div key={f.id} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.name}</div>
                  <code className="block text-sm bg-slate-50 dark:bg-slate-800 rounded-lg p-2 mt-1.5 text-primary">{f.formula}</code>
                  <p className="text-xs text-slate-500 mt-1.5">Example: {f.example}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {t.commonMistakes.length > 0 && (
          <>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">Common mistakes</h4>
            <ul className="space-y-1.5">
              {t.commonMistakes.map((m, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-red-500">✕</span> {m}
                </li>
              ))}
            </ul>
          </>
        )}

        {t.shortcuts.length > 0 && (
          <>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2">Shortcuts</h4>
            <ul className="space-y-1.5">
              {t.shortcuts.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <span className="text-emerald-500">⚡</span> {s}
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>

      {/* 2. Video */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="step-num">2</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Video</h2>
          </div>
          <button
            className={cn("btn-ghost !py-1.5 text-xs", p?.videoWatched && "!text-emerald-600 dark:!text-emerald-400")}
            onClick={() => setVideoWatched(t.id)}
          >
            {p?.videoWatched ? "✓ Watched" : "Mark watched"}
          </button>
        </div>
        <p className="text-xs text-slate-500">
          We only link videos we've verified exist — otherwise you get a direct search so you never land on a dead link.
        </p>
        <div className="mt-3 space-y-2">
          {videos.map((v) => (
            <a
              key={v.id}
              href={v.url ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(v.title + " CAT preparation")}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40"
            >
              <span className="text-xl">▶️</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {v.title} {v.verified ? "" : <Chip tone="neutral" className="ml-1">unverified link</Chip>}
                </div>
                <div className="text-xs text-slate-500">
                  {v.channel} · {v.duration} · {v.language} · <Chip tone="neutral">{v.type}</Chip>
                </div>
                <p className="text-xs text-slate-400 mt-1">{v.whyRecommended}</p>
              </div>
            </a>
          ))}
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t.title + " CAT preparation")}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 p-3 hover:border-primary/40"
          >
            <span className="text-xl">🔎</span>
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Search YouTube for more on this topic
              <span className="block text-xs text-slate-400">Fresh options, always working links.</span>
            </div>
          </a>
        </div>
      </Card>

      {/* 3. Examples */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="step-num">3</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Solved examples</h2>
          </div>
          <button
            className={cn("btn-ghost !py-1.5 text-xs", p?.examplesDone && "!text-emerald-600 dark:!text-emerald-400")}
            onClick={() => setExamplesDone(t.id)}
          >
            {p?.examplesDone ? "✓ Examples done" : "Mark examples done"}
          </button>
        </div>

        {t.examples.length > 0 && (
          <>
            <h4 className="text-xs font-semibold text-slate-500 mb-2">Textbook examples</h4>
            {t.examples.map((ex, i) => (
              <details key={i} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 mb-2">
                <summary className="text-sm font-semibold text-slate-800 dark:text-slate-100 cursor-pointer">
                  <Chip tone="neutral" className="mr-2">{ex.level}</Chip>
                  {ex.title}
                </summary>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">{ex.question}</p>
                <ul className="mt-2 space-y-1.5">
                  {ex.solution.map((s, j) => (
                    <li key={j} className="text-sm text-slate-600 dark:text-slate-300 flex gap-2">
                      <span className="text-primary">→</span> {s}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </>
        )}

        {examples.length === 0 && t.examples.length === 0 ? (
          <p className="text-sm text-slate-500">Example bank for this topic is being expanded. Try a related topic meanwhile.</p>
        ) : (
          examples.length > 0 && (
            <>
              <h4 className="text-xs font-semibold text-slate-500 mb-2 mt-4">Practice-style examples</h4>
              <div className="space-y-3">
                {examples.map((q, i) => <ExampleCard key={q.id} q={q} defaultOpen={i === 0} />)}
              </div>
            </>
          )
        )}
      </Card>

      {/* 4-6. Practice / Timed / PYQs */}
      <div className="grid sm:grid-cols-3 gap-3">
        <Link href={stashHref("practice")} className="rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition">
          <span className="step-num">4</span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-2">Practice</h3>
          <p className="text-xs text-slate-500 mt-1">Adaptive questions that scale with your answers.</p>
          <span className="text-primary text-xs font-semibold mt-2 inline-block">Start</span>
        </Link>
        <Link href={stashHref("timed")} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 hover:border-primary/40 transition">
          <span className="step-num">5</span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-2">Timed practice</h3>
          <p className="text-xs text-slate-500 mt-1">CAT-style per-question discipline.</p>
          <span className="text-primary text-xs font-semibold mt-2 inline-block">Start</span>
        </Link>
        <Link href={stashHref("pyq")} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 hover:border-primary/40 transition">
          <span className="step-num">6</span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-2">PYQs</h3>
          <p className="text-xs text-slate-500 mt-1">{pyts.length} past-paper-tagged questions.</p>
          <span className="text-primary text-xs font-semibold mt-2 inline-block">Start</span>
        </Link>
      </div>

      {/* 7. Topic test */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <span className="step-num">7</span>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Topic test</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A short mini mock targeting {t.title}. Feeds your {t.section.toUpperCase()} readiness and analytics.
        </p>
        <Link href={stashHref("test")} className="btn-ghost mt-3 !py-2 text-sm">Take topic test</Link>
      </Card>

      {/* 8. Revision */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <span className="step-num">8</span>
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Revision</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Spaced repetition: 1 day → 3 → 7 → 14 → 30.{" "}
          {p?.nextRevisionAt ? (
            <span className="text-slate-500">Next review: <b>{p.nextRevisionAt}</b></span>
          ) : (
            <span className="text-slate-500">Complete the topic to start the schedule.</span>
          )}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-primary !px-3 !py-1.5 text-xs" onClick={() => doRevision(true)} disabled={revising}>
            ✓ Confident (advance schedule)
          </button>
          <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => doRevision(false)} disabled={revising}>
            Still shaky (reset)
          </button>
        </div>
        {due && status !== "completed" && (
          <p className="text-xs text-amber-600 mt-2">Due for revision — a quick review now will lock it in.</p>
        )}
      </Card>

      {/* Related RC/DILR */}
      {(RC_BY_TOPIC[t.id]?.length > 0 || DILR_BY_TOPIC[t.id]?.length > 0) && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Related passages & sets</h3>
          <div className="space-y-2">
            {(RC_BY_TOPIC[t.id] ?? []).map((r) => (
              <Link key={r.id} href={`/reading?id=${r.id}&mode=rc`} className="block text-sm text-primary hover:underline">
                📖 {r.title}
              </Link>
            ))}
            {(DILR_BY_TOPIC[t.id] ?? []).map((s) => (
              <Link key={s.id} href={`/practice?mode=set&set=${s.id}`} className="block text-sm text-primary hover:underline">
                🧩 {s.title}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <p className="text-xs text-slate-400 text-center">
        Next topic in {ch.title}:{" "}
        {ch.topics.find((x) => x.order === t.order + 1)?.title ?? "you're at the end — check the syllabus"}
      </p>
    </div>
  );
}