"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { TOPIC_MAP, QUESTION_MAP, FORMULAS, RESOURCES } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";

export default function BookmarksPage() {
  const { state, toggleBookmark } = useStore();
  const b = state.bookmarks;

  const topics = b.topics.map((id) => TOPIC_MAP[id]).filter(Boolean);
  const questions = b.questions.map((id) => QUESTION_MAP[id]).filter(Boolean);
  const pyqs = b.pyqs.map((id) => QUESTION_MAP[id]).filter(Boolean);
  const formulas = b.formulas.flatMap((id) => {
    const f = FORMULAS.find((x) => x.id === id);
    return f ? [f] : [];
  });
  const resources = b.resources.flatMap((id) => {
    const r = RESOURCES.find((x) => x.id === id);
    return r ? [r] : [];
  });
  const notes = state.notes.filter((n) => n.bookmarked);
  const videos = b.videos.map((id) => state.readingItems.find((r) => r.id === id) as never).filter(Boolean);

  const total = topics.length + questions.length + pyqs.length + formulas.length + resources.length + notes.length + videos.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Bookmarks</h1>
        <p className="text-sm text-slate-500 mt-1">{total} saved item{total === 1 ? "" : "s"}.</p>
      </div>

      {total === 0 && (
        <EmptyState title="Nothing saved yet" description="Star questions, topics, formulas and notes as you study." />
      )}

      {topics.length > 0 && (
        <section>
          <h2 className="section-title">Topics <Chip tone="neutral">{topics.length}</Chip></h2>
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
                <Link href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}`} className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-primary truncate">
                  {t.title}
                </Link>
                <button className="text-xs text-amber-500" onClick={() => toggleBookmark("topics", t.id)}>★</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {questions.length > 0 && (
        <section>
          <h2 className="section-title">Questions <Chip tone="neutral">{questions.length}</Chip></h2>
          <div className="space-y-2">
            {questions.map((q) => (
              <Card key={q.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">{q.prompt}</p>
                  <button className="text-xs text-amber-500 shrink-0" onClick={() => toggleBookmark("questions", q.id)}>★</button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {pyqs.length > 0 && (
        <section>
          <h2 className="section-title">Saved PYQs <Chip tone="neutral">{pyqs.length}</Chip></h2>
          <div className="space-y-2">
            {pyqs.map((q) => (
              <Card key={q.id} className="!p-4">
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-sm text-slate-800 dark:text-slate-100">{q.prompt}</p>
                  <button className="text-xs text-amber-500 shrink-0" onClick={() => toggleBookmark("pyqs", q.id)}>★</button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {formulas.length > 0 && (
        <section>
          <h2 className="section-title">Formulas <Chip tone="neutral">{formulas.length}</Chip></h2>
          <div className="space-y-2">
            {formulas.map((f) => (
              <Card key={f.id} className="!p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.name}</div>
                    <code className="text-xs text-primary mt-1 block">{f.formula}</code>
                  </div>
                  <button className="text-xs text-amber-500 shrink-0" onClick={() => toggleBookmark("formulas", f.id)}>★</button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {notes.length > 0 && (
        <section>
          <h2 className="section-title">Notes <Chip tone="neutral">{notes.length}</Chip></h2>
          <div className="space-y-2">
            {notes.map((n) => (
              <Card key={n.id} className="!p-4">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{n.title}</div>
                <p className="text-sm text-slate-500 mt-1">{n.content}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {resources.length > 0 && (
        <section>
          <h2 className="section-title">Resources <Chip tone="neutral">{resources.length}</Chip></h2>
          <div className="space-y-2">
            {resources.map((r) => (
              <Card key={r.id} className="!p-4">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{r.name}</div>
                <p className="text-xs text-slate-500 mt-1">{r.note}</p>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-semibold mt-2 inline-block">Visit ↗</a>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}