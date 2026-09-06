"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { CHAPTERS, TOPIC_MAP } from "@/lib/content";
import type { SectionId } from "@/lib/types";
import { isTopicDueForRevision } from "@/lib/engine/metrics";
import { Card, Chip, DifficultyBadge, PriorityChip, ProgressBar, EmptyState } from "@/components/ui";
import { cn } from "@/lib/utils";

const FILTERS = [
  "All",
  "Not Started",
  "In Progress",
  "Completed",
  "Weak",
  "Revision Due",
  "High Priority",
] as const;
type Filter = (typeof FILTERS)[number];

function LearnContent() {
  const { state } = useStore();
  const params = useSearchParams();
  const section = (params.get("s") as SectionId) || undefined;
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<string | null>(
    section ? CHAPTERS.find((c) => c.section === section)?.id ?? null : null
  );

  const chapters = CHAPTERS.filter((c) => (section ? c.section === section : true));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">CAT Syllabus</h1>
        <p className="text-sm text-slate-500 mt-1">
          Every topic has concept notes, examples, practice and revision built in.
        </p>
      </div>

      {/* Section filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {([undefined, "qa", "varc", "dilr"] as const).map((s) => (
          <button
            key={s ?? "all"}
            onClick={() => setOpen(null)}
            className={cn(
              "chip !px-4 !py-2 shrink-0",
              section === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            )}
          >
            {s ? s.toUpperCase() : "ALL"}
          </button>
        ))}
      </div>

      {/* Topic status filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "chip shrink-0",
              filter === f
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chapters */}
      <div className="space-y-3">
        {chapters.map((ch) => {
          const topics = ch.topics.filter((t) => {
            const p = state.topicProgress[t.id];
            const status = p?.status ?? "not-started";
            const weak = p && p.practiced ? false : false;
            if (filter === "Not Started") return status === "not-started";
            if (filter === "In Progress") return status === "in-progress";
            if (filter === "Completed") return status === "completed";
            if (filter === "Weak") {
              const attempts = state.questionResults.filter((r) => r.topicId === t.id);
              return attempts.length >= 2 && attempts.filter((r) => r.correct).length / attempts.length < 0.6;
            }
            if (filter === "Revision Due")
              return isTopicDueForRevision(state, t.id);
            if (filter === "High Priority") return t.priority === 1;
            return true;
          });

          const done = ch.topics.filter((t) => state.topicProgress[t.id]?.status === "completed").length;
          const progress = Math.round((done / ch.topics.length) * 100);
          const isOpen = open === ch.id;

          return (
            <Card key={ch.id} className="!p-0 overflow-hidden">
              <button
                className="w-full text-left p-4 flex items-center gap-3"
                onClick={() => setOpen(isOpen ? null : ch.id)}
                aria-expanded={isOpen}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{ch.title}</span>
                    <Chip tone="neutral">{ch.section.toUpperCase()}</Chip>
                    <Chip tone={progress === 100 ? "green" : "neutral"}>{done}/{ch.topics.length} topics</Chip>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <ProgressBar value={progress} className="flex-1 max-w-[200px]" tone={progress === 100 ? "green" : "primary"} />
                    <span className="text-xs text-slate-500">{progress}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ~{ch.topics.reduce((s, t) => s + t.estimatedMinutes, 0)} min total · {topics.length} shown
                  </p>
                </div>
                <span className={cn("text-slate-400 transition", isOpen && "rotate-180")}>▾</span>
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 dark:border-slate-800">
                  {topics.length === 0 && (
                    <div className="p-4">
                      <EmptyState title="No topics match this filter" description="Adjust the status or priority filter above." />
                    </div>
                  )}
                  {topics.map((t) => {
                    const p = state.topicProgress[t.id];
                    const status = p?.status ?? "not-started";
                    const attempts = state.questionResults.filter((r) => r.topicId === t.id);
                    const acc = attempts.length ? Math.round((attempts.filter((r) => r.correct).length / attempts.length) * 100) : 0;
                    const due = isTopicDueForRevision(state, t.id);
                    return (
                      <Link
                        key={t.id}
                        href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-t border-slate-50 dark:border-slate-800/50 first:border-t-0"
                      >
                        <span
                          className={cn(
                            "shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                            status === "completed" ? "bg-emerald-500 text-white" : status === "in-progress" ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                          )}
                        >
                          {status === "completed" ? "✓" : status === "in-progress" ? "▶" : ""}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{t.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>{t.estimatedMinutes} min</span>
                            <DifficultyBadge level={t.difficulty} />
                            {attempts.length > 0 && <span className={acc >= 60 ? "text-emerald-600" : "text-red-500"}>{acc}% acc</span>}
                            {due && <Chip tone="amber">Revise</Chip>}
                            {status === "not-started" && <Chip tone="neutral">New</Chip>}
                            {t.prerequisites.length > 0 && <span className="text-slate-400">prereq: {t.prerequisites.map((x) => TOPIC_MAP[x]?.title.split(" ")[0] ?? "").join(", ")}</span>}
                          </div>
                        </div>
                        <div className="shrink-0 hidden sm:block">
                          <PriorityChip priority={t.priority} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="card h-24 skeleton" />)}</div>}>
      <LearnContent />
    </Suspense>
  );
}