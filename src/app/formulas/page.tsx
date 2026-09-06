"use client";

import { useState } from "react";
import { FORMULAS, TOPIC_MAP } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";
import type { SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function FormulasPage() {
  const [section, setSection] = useState<SectionId | "all">("all");
  const [q, setQ] = useState("");

  const list = FORMULAS.filter((f) => {
    if (section !== "all" && f.section !== section) return false;
    if (q && !`${f.name} ${f.formula} ${f.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const categories = Array.from(new Set(list.map((f) => f.category)));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Formula Sheet</h1>
        <p className="text-sm text-slate-500 mt-1">Every formula tagged to its topic, so it links back to the concept.</p>
      </div>

      <input className="input" placeholder="Search formulas (e.g. percentage, interest, average)…" value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["all", "qa", "varc", "dilr"] as const).map((s) => (
          <button key={s} onClick={() => setSection(s)} className={cn("chip shrink-0", section === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
            {s === "all" ? "ALL" : s.toUpperCase()}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title="No formulas match" description="Try a different section or search term." />
      ) : (
        categories.map((cat) => (
          <div key={cat}>
            <h2 className="section-title">{cat} <Chip tone="neutral">{list.filter((f) => f.category === cat).length}</Chip></h2>
            <div className="space-y-3">
              {list.filter((f) => f.category === cat).map((f) => {
                const topic = f.topicId ? TOPIC_MAP[f.topicId] : undefined;
                return (
                  <Card key={f.id} className="!p-4">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{f.name}</h3>
                      <div className="flex gap-1.5 flex-wrap">
                        {topic ? (
                          <a href={`/learn/${topic.section}/${topic.chapterId.split("-")[1]}/${f.topicId}`} className="text-xs text-primary hover:underline">
                            {topic.title}
                          </a>
                        ) : (
                          <Chip tone="neutral">{f.section.toUpperCase()}</Chip>
                        )}
                      </div>
                    </div>
                    <code className="block bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5 text-sm text-primary">{f.formula}</code>
                    <p className="text-xs text-slate-500 mt-2">Example: {f.example}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}