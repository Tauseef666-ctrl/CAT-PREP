"use client";

import Link from "next/link";
import { useState } from "react";
import { ALL_TOPICS, QUESTION_BANK, FORMULAS } from "@/lib/content";
import { Card, Chip, EmptyState, DifficultyBadge } from "@/components/ui";

export default function SearchPage() {
  const [q, setQ] = useState("");

  const term = q.trim().toLowerCase();
  const topicHits = term ? ALL_TOPICS.filter((t) => `${t.title} ${t.description} ${t.shortcuts.join(" ")} ${t.coreRules.join(" ")}`.toLowerCase().includes(term)).slice(0, 12) : [];
  const qHits = term ? QUESTION_BANK.filter((x) => `${x.prompt} ${(x.options ?? []).join(" ")}`.toLowerCase().includes(term)).slice(0, 8) : [];
  const formulaHits = term ? FORMULAS.filter((f) => `${f.name} ${f.formula} ${f.category}`.toLowerCase().includes(term)).slice(0, 6) : [];

  const total = topicHits.length + qHits.length + formulaHits.length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Search</h1>
        <p className="text-sm text-slate-500 mt-1">Find topics, questions and formulas across the whole syllabus.</p>
      </div>

      <input
        autoFocus
        className="input !py-3 text-base"
        placeholder="e.g. percentages, average, interest, 75%…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {term.length === 0 ? (
        <p className="text-sm text-slate-400">Type more than 2 characters to search.</p>
      ) : total === 0 ? (
        <EmptyState title="No results" description={`Nothing matched "${q}". Try a different word.`} />
      ) : (
        <>
          {topicHits.length > 0 && (
            <section>
              <h2 className="section-title">Topics <Chip tone="neutral">{topicHits.length}</Chip></h2>
              <div className="space-y-2">
                {topicHits.map((t) => (
                  <Link key={t.id} href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40 hover:bg-primary/5">
                    <span className="text-lg">{t.section === "qa" ? "🔢" : t.section === "varc" ? "📚" : "🧩"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{t.title}</div>
                      <div className="text-xs text-slate-500">{t.section.toUpperCase()} · {t.estimatedMinutes} min</div>
                    </div>
                    <Chip tone="neutral">{t.difficulty}/6</Chip>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {qHits.length > 0 && (
            <section>
              <h2 className="section-title">Questions <Chip tone="neutral">{qHits.length}</Chip></h2>
              <div className="space-y-2">
                {qHits.map((x) => (
                  <Card key={x.id} className="!p-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <Chip tone="neutral">{x.section.toUpperCase()}</Chip>
                      <DifficultyBadge level={x.difficulty} />
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-100">{x.prompt}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {formulaHits.length > 0 && (
            <section>
              <h2 className="section-title">Formulas <Chip tone="neutral">{formulaHits.length}</Chip></h2>
              <div className="space-y-2">
                {formulaHits.map((f) => (
                  <Card key={f.id} className="!p-4">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.name}</div>
                    <code className="text-primary text-xs mt-1 block">{f.formula}</code>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}