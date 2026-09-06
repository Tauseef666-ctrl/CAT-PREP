"use client";

import { useState } from "react";
import { VIDEOS, TOPIC_MAP } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function VideosPage() {
  const [section, setSection] = useState<SectionId | "all">("all");

  const list = VIDEOS.filter((v) => {
    if (section !== "all" && v.topicId && !v.topicId.startsWith(section)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Videos</h1>
        <p className="text-sm text-slate-500 mt-1">
          Curated lecture/one-shot/problem-solving content. We only link what exists; unverified picks give you a search instead.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["all", "qa", "varc", "dilr"] as const).map((s) => (
          <button key={s} onClick={() => setSection(s)} className={cn("chip shrink-0", section === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
            {s === "all" ? "ALL" : s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <EmptyState title="No videos yet" description="Resources are verified one-by-one before listing." />
        ) : (
          list.map((v) => {
            const topic = v.topicId ? TOPIC_MAP[v.topicId] : undefined;
            return (
              <Card key={v.id} className="!p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <a
                      href={v.url ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(v.title + " CAT")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-primary truncate block"
                    >
                      ▶️ {v.title}
                    </a>
                    <div className="text-xs text-slate-500 mt-1">
                      {v.channel} · {v.duration} · {v.language} ·{" "}
                      <Chip tone="neutral">{v.type}</Chip>{" "}
                      {!v.verified && <Chip tone="amber" className="ml-1">unverified link</Chip>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{v.whyRecommended}</p>
                  </div>
                  {topic && (
                    <a href={`/learn/${topic.section}/${topic.chapterId.split("-")[1]}/${topic.id}`} className="text-xs text-primary hover:underline whitespace-nowrap">
                      to topic →
                    </a>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {list.filter((v) => v.verified).length === 0 && (
        <p className="text-xs text-slate-400 text-center">
          Watching is support, not progress — the dashboard only counts what you record as learned.
        </p>
      )}
    </div>
  );
}