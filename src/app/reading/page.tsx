"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { RC_PASSAGES, READING_ITEMS } from "@/lib/content";
import { RCRunner } from "@/components/rc/RCRunner";
import { Card, Chip, EmptyState } from "@/components/ui";
import type { ReadingItem } from "@/lib/types";

function ArticleReader({ item }: { item: ReadingItem }) {
  const { toggleReadingCompleted } = useStore();
  const [started, setStarted] = useState(false);
  const [qOpen, setQOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [render, setRender] = useState(false);

  const start = () => {
    setStarted(true);
    setRender(true);
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s >= item.readingMinutes * 60) { clearInterval(id); return s; }
        return s + 1;
      });
    }, 1000);
    window.setTimeout(() => setQOpen(true), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button className="hover:text-primary" onClick={() => window.history.pushState({}, "", "/reading")}>← Exit reading</button>
        <Chip tone="neutral">{item.category}</Chip>
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{item.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{item.source} · ~{item.readingMinutes} min · ~{Math.round(item.readingMinutes * 210)} words</p>
        {!started && (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
              Read the article in the new tab, then come back here and self-check your comprehension. This builds the
              active-reading habit real CAT RC demands.
            </p>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-4">Open article ↗</a>
            <button className="btn-primary mt-2" onClick={start}>I'm reading it — start timer</button>
          </>
        )}
        {started && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl">⏱</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} / {item.readingMinutes}:00
              </span>
            </div>
            {qOpen && (
              <div className="mt-5 rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold text-slate-800 dark:text-slate-100">Self-check comprehension</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Q. {item.comprehension[0]?.question}</p>
                <details className="mt-3">
                  <summary className="text-xs text-primary font-semibold cursor-pointer">Reveal answer</summary>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 bg-white/70 dark:bg-black/20 rounded-lg p-3">
                    {item.comprehension[0]?.answer}
                  </p>
                </details>
                <button
                  className={item.completed ? "btn-secondary mt-4" : "btn-primary mt-4"}
                  onClick={() => {
                    toggleReadingCompleted(item.id);
                    window.history.pushState({}, "", "/reading");
                  }}
                >
                  {item.completed ? "Marked complete ✓" : "Mark as read"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Comprehension self-check is honest by design — you decide whether you actually got it.
      </p>
    </div>
  );
}

function ReadingContent() {
  const { state } = useStore();
  const params = useSearchParams();
  const id = params.get("id");
  const [activeRc, setActiveRc] = useState(false);

  if (id) {
    const rc = RC_PASSAGES.find((p) => p.id === id);
    const item = READING_ITEMS.find((r) => r.id === id);
    if (rc) return (<div className="max-w-2xl mx-auto"><RCRunner passage={rc} onExit={() => window.history.pushState({}, "", "/reading")} /></div>);
    if (item) return <ArticleReader item={item} />;
    return <EmptyState title="Reading item not found" description="It may have moved. Browse below instead." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Reading Center</h1>
        <p className="text-sm text-slate-500 mt-1">Long-form reading practice for VARC acceleration.</p>
      </div>

      {/* RC passages */}
      <div>
        <h2 className="section-title">RC passages <Chip tone="blue">{RC_PASSAGES.length}</Chip></h2>
        <div className="space-y-3">
          {RC_PASSAGES.map((p) => (
            <Link key={p.id} href={`/reading?id=${p.id}`} className="block rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 hover:border-primary/40">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100">{p.title}</span>
                <Chip tone="neutral">{p.domain}</Chip>
                <Chip tone="neutral">{p.length}</Chip>
              </div>
              <p className="text-xs text-slate-500 mt-2">{p.questions.length} questions · ~{p.estimatedMinutes} min</p>
            </Link>
          ))}
        </div>
      </div>

      {/* External articles */}
      <div>
        <h2 className="section-title">Articles to read <Chip tone="green">{READING_ITEMS.length}</Chip></h2>
        <div className="space-y-3">
          {READING_ITEMS.map((it) => (
            <Link key={it.id} href={`/reading?id=${it.id}`} className="block rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 hover:border-primary/40">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100">{it.title}</span>
                {it.completed && <Chip tone="green">read ✓</Chip>}
              </div>
              <p className="text-xs text-slate-500 mt-2">{it.source} · {it.category} · ~{it.readingMinutes} min</p>
            </Link>
          ))}
        </div>
        {READING_ITEMS.length === 0 && (
          <EmptyState title="Reading list loading" description="We only list articles that exist and are worth the time." />
        )}
      </div>
    </div>
  );
}

export default function ReadingPage() {
  return (
    <Suspense fallback={<div className="card h-32 skeleton" />}>
      <ReadingContent />
    </Suspense>
  );
}