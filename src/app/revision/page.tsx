"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { overallMetrics, todayKey } from "@/lib/engine/metrics";
import { ALL_TOPICS } from "@/lib/content";
import { Card, Chip, EmptyState } from "@/components/ui";

export default function RevisionPage() {
  const { state, recordRevision } = useStore();
  const all = overallMetrics(state);
  const today = todayKey();

  const due = ALL_TOPICS
    .map((t) => ({ t, next: state.topicProgress[t.id]?.nextRevisionAt }))
    .filter((x) => x.next && x.next <= today)
    .sort((a, b) => a.next!.localeCompare(b.next!));
  const later = ALL_TOPICS
    .map((t) => ({ t, next: state.topicProgress[t.id]?.nextRevisionAt }))
    .filter((x) => x.next && x.next > today)
    .sort((a, b) => a.next!.localeCompare(b.next!));

  const revisionQueue = [...due.map((d) => d.t), ...later.map((d) => d.t)];

  const stale = revisionQueue.length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Revision Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          Spaced repetition: 1 → 3 → 7 → 14 → 30 days after each review. Memory fades; this schedule beats it.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-4 text-center">
          <div className="text-2xl font-extrabold text-red-500">{due.length}</div>
          <div className="text-xs text-slate-500">due today</div>
        </Card>
        <Card className="!p-4 text-center">
          <div className="text-2xl font-extrabold text-amber-600">{later.length}</div>
          <div className="text-xs text-slate-500">scheduled</div>
        </Card>
        <Card className="!p-4 text-center">
          <div className="text-2xl font-extrabold text-primary">{all.completedTopics}</div>
          <div className="text-xs text-slate-500">topics completed</div>
        </Card>
      </div>

      {due.length > 0 && (
        <Card className="border-amber-300 dark:border-amber-700/60">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Due today — knock these out first</h2>
          <div className="space-y-2">
            {due.map(({ t, next }) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
                <span className="text-lg">🔄</span>
                <div className="flex-1 min-w-0">
                  <Link href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}?revise=1`} className="text-sm font-semibold text-slate-800 dark:text-slate-100 hover:text-primary truncate block">
                    {t.title}
                  </Link>
                  <span className="text-xs text-slate-500">review by {next}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    className="btn-ghost !px-3 !py-1.5 text-xs"
                    onClick={() => { recordRevision(t.id, true); }}
                  >
                    ✓ Confident
                  </button>
                  <Link href={`/practice?topic=${t.id}`} className="btn-ghost !px-3 !py-1.5 text-xs">
                    Retrain
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {stale === 0 && (
        <EmptyState title="Nothing in the queue" description="Complete more topics to start your spaced-revision schedule." />
      )}

      {later.length > 0 && (
        <Card>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Upcoming (not due yet)</h2>
          <div className="space-y-2">
            {later.map(({ t, next }) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700/60 p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-slate-400">🗓</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{t.title}</span>
                </div>
                <Chip tone="neutral">due {next}</Chip>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">How spacing works here</h3>
        <div className="flex items-center gap-1.5 mb-4">
          {[1, 3, 7, 14, 30].map((d, i) => (
            <div key={d} className="flex-1 text-center">
              <div className="text-xs font-bold text-primary">D+{d}</div>
              <div className={i === 0 ? "text-slate-400" : "text-slate-300 dark:text-slate-600"}>·{i === 0 ? "now" : ""}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          «Confident» advances the next review date. «Still shaky» resets the clock so the same topic returns sooner.{" "}
          <b>5 focused reviews of a topic beat 20 blind re-reads.</b>
        </p>
        <Link href="/learn?s=qa" className="link text-sm inline-block mt-3">Browse syllabus to add topics →</Link>
      </Card>
    </div>
  );
}