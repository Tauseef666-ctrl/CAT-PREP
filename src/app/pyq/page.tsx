"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { QUESTION_BANK, TOPIC_MAP } from "@/lib/content";
import { Chip, DifficultyBadge, Card, EmptyState } from "@/components/ui";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

function PyqContent() {
  const { state, toggleBookmark, recordMistake } = useStore();
  const params = useSearchParams();
  const topicFilter = params.get("topic");
  const [section, setSection] = useState<SectionId | undefined>(undefined);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [years, setYears] = useState<Record<string, boolean>>({});

  const bank = QUESTION_BANK.filter((q) => q.isPYQ).filter((q) => {
    if (section && q.section !== section) return false;
    if (topicFilter && q.topicId !== topicFilter) return false;
    if (q.year && years[q.year]) return false;
    return true;
  });
  const allYears = Array.from(new Set(QUESTION_BANK.filter((q) => q.isPYQ && q.year).map((q) => q.year!))).sort().reverse();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Past Paper Questions</h1>
        <p className="text-sm text-slate-500 mt-1">
          Recognized past-paper patterns, rewritten so we never reproduce copyrighted passages verbatim.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {([undefined, "qa", "varc", "dilr"] as const).map((s) => (
          <button
            key={s ?? "all"}
            onClick={() => setSection(s)}
            className={cn("chip shrink-0", section === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}
          >
            {s ? s.toUpperCase() : "ALL SECTIONS"}
          </button>
        ))}
      </div>
      {allYears.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {allYears.map((y) => (
            <button key={y} onClick={() => setYears((v) => ({ ...v, [y]: !v[y] }))}
              className={cn("chip", years[y] ? "bg-slate-200 dark:bg-slate-700 text-slate-500 line-through" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
              {y}
            </button>
          ))}
        </div>
      )}

      {topicFilter && (
        <p className="text-sm text-slate-500">
          Showing PYQs for <b className="text-slate-800 dark:text-slate-200">{TOPIC_MAP[topicFilter]?.title}</b> ·{" "}
          <Link href="/pyq" className="text-primary hover:underline">clear topic filter</Link>
        </p>
      )}

      <div className="space-y-3">
        {bank.map((q) => {
          const isBookmarked = state.bookmarks.pyqs.includes(q.id);
          const isOpen = revealed.includes(q.id);
          const topic = q.topicId ? TOPIC_MAP[q.topicId] : undefined;
          return (
            <Card key={q.id} className="!p-4">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Chip tone="blue">{q.section.toUpperCase()}</Chip>
                <Chip tone="neutral">{q.difficulty}/6 difficulty</Chip>
                {q.year && <Chip tone="amber">CAT {q.year}</Chip>}
                {q.source && <Chip tone="neutral">{q.source}</Chip>}
                {topic && (
                  <Link href={`/learn/${topic.section}/${topic.chapterId.split("-")[1]}/${topic.id}`} className="text-xs text-primary hover:underline">
                    {topic.title}
                  </Link>
                )}
                <button
                  className={cn("ml-auto text-xs font-semibold", isBookmarked ? "text-amber-600 dark:text-amber-400" : "text-slate-400")}
                  onClick={() => toggleBookmark("pyqs", q.id)}
                >
                  {isBookmarked ? "★ Saved" : "☆ Save"}
                </button>
              </div>
              <p className="text-[15px] font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{q.prompt}</p>
              {(q.options ?? []).length > 0 && (
                <ul className={cn("mt-3 space-y-1.5 text-sm transition", isOpen ? "" : "blur-[3px] select-none")}>
                  {(q.options ?? []).map((o, i) => (
                    <li key={i} className={cn("text-slate-600 dark:text-slate-300", q.correctIndex === i && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                      {String.fromCharCode(65 + i)}. {o}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={cn("btn-ghost !py-1.5 text-xs", isOpen && "!border-transparent !bg-slate-100 dark:!bg-slate-800")} onClick={() => setRevealed((r) => isOpen ? r.filter((x) => x !== q.id) : [...r, q.id])}>
                  {isOpen ? "Hide answer" : "Show answer + explanation"}
                </button>
                {!isOpen && <span className="text-xs text-slate-400 self-center">Tap to reveal</span>}
              </div>
              {isOpen && (
                <div className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-900 dark:text-emerald-100">
                  <span className="font-bold">Answer: {String.fromCharCode(65 + (q.correctIndex ?? 0))}</span>
                  <div className="mt-1 whitespace-pre-wrap">{q.explanation}</div>
                  {q.fasterApproach && (
                    <div className="mt-2 border-t border-emerald-200/60 dark:border-emerald-700/40 pt-2">
                      ⚡ <b>Faster approach:</b> {q.fasterApproach}
                    </div>
                  )}
                  <button
                    className="text-xs text-red-500 font-semibold mt-2 block"
                    onClick={() => recordMistake({ questionId: q.id, topicId: q.topicId, mistakeType: "Misread", correctMethod: q.explanation, correctIndex: q.correctIndex })}
                  >
                    ✓ Add to mistake book
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        {bank.length === 0 && (
          <EmptyState title="No PYQs match" description="Adjust the filters, or try the full practice bank." />
        )}
      </div>

      <p className="text-xs text-slate-400">
        Integrity note: questions tagged as PYQ reproduce the pattern, not the verbatim text of any official paper. Never claim familiarity with past-paper text you haven't actually seen.
      </p>
    </div>
  );
}

export default function PyqPage() {
  return (
    <Suspense fallback={<div className="card h-32 skeleton" />}>
      <PyqContent />
    </Suspense>
  );
}