"use client";

import { useState } from "react";
import { useStore } from "@/lib/store/AppProvider";
import { TOPIC_MAP } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const NOTE_TYPES = ["concept", "formula", "shortcut", "mistake", "custom"] as const;

export default function NotesPage() {
  const { state, addNote, toggleNoteBookmark, update } = useStore();
  const [filter, setFilter] = useState<(typeof NOTE_TYPES)[number] | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<(typeof NOTE_TYPES)[number]>("concept");
  const [topicId, setTopicId] = useState("");

  const notes = state.notes.filter((n) => filter === "all" || n.type === filter);

  const save = () => {
    if (!title.trim() || !content.trim()) return;
    addNote({ title: title.trim(), content: content.trim(), type, topicId: topicId || undefined });
    setTitle("");
    setContent("");
    setType("concept");
    setTopicId("");
    setShowForm(false);
  };

  const removeNote = (id: string) => {
    update((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Notes</h1>
          <p className="text-sm text-slate-500 mt-1">Your own revision layer — concepts, formulas, shortcuts, mistakes.</p>
        </div>
        <button className="btn-primary !py-2" onClick={() => setShowForm((v) => !v)}>{showForm ? "Close" : "+ New note"}</button>
      </div>

      {showForm && (
        <Card className="!p-5">
          <div className="label">Title</div>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Percentages — quick fraction table" />
          <div className="label mt-3">Topic (optional)</div>
          <input className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)} placeholder="Paste a topic id, e.g. qa-arithmetic-percentages" />
          <div className="label mt-3">Type</div>
          <div className="flex flex-wrap gap-1.5">
            {NOTE_TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} className={cn("chip", type === t ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
                {t}
              </button>
            ))}
          </div>
          <div className="label mt-3">Content</div>
          <textarea className="input min-h-28" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note…" />
          <button className="btn-primary mt-3" onClick={save}>Save note</button>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {(["all", ...NOTE_TYPES] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("chip shrink-0", filter === f ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
            {f} · {f === "all" ? state.notes.length : state.notes.filter((n) => n.type === f).length}
          </button>
        ))}
      </div>

      {notes.length === 0 ? (
        <EmptyState title="No notes here" description="Capture what you correct in mistakes and formulas you keep forgetting." />
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <Card key={n.id} className="!p-4">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Chip tone="blue">{n.type}</Chip>
                {n.topicId && TOPIC_MAP[n.topicId] && <Chip tone="neutral">{TOPIC_MAP[n.topicId].title}</Chip>}
                <button className={cn("ml-auto text-xs", n.bookmarked ? "text-amber-500" : "text-slate-400")} onClick={() => toggleNoteBookmark(n.id)}>
                  {n.bookmarked ? "★" : "☆"}
                </button>
                <button className="text-xs text-red-400" onClick={() => removeNote(n.id)}>✕</button>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{n.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 whitespace-pre-wrap">{n.content}</p>
              <p className="text-xs text-slate-400 mt-2">{formatDate(n.createdAt.slice(0, 10))}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}