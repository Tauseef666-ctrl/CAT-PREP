"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { buildDailyPlan, isPlanItemDone, type PlanItem } from "@/lib/engine/planner";
import { todayKey } from "@/lib/engine/metrics";
import { Card, Chip, ProgressBar } from "@/components/ui";
import { cn, formatDuration, formatTime } from "@/lib/utils";

const TODOS_KEY = "catcommand:todos:v1";

function ItemTimer({ minutes, onDone }: { minutes: number; onDone: () => void }) {
  const [left, setLeft] = useState<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    if (left !== null && left <= 0) {
      setActive(false);
      setLeft(null);
      onDone();
      return;
    }
    const id = setTimeout(() => setLeft((s) => (s ?? minutes * 60) - 1), 1000);
    return () => clearTimeout(id);
  }, [active, left]); // eslint-disable-line react-hooks/exhaustive-deps

  if (left === null) {
    return (
      <button className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => { setLeft(minutes * 60); setActive(true); }}>
        ⏱ Timer {formatDuration(minutes)}
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("text-xs font-bold px-2 py-1 rounded-md", left <= 15 ? "bg-red-100 text-red-600" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200")}>
        {formatTime(left)}
      </span>
      <button className="btn-ghost !px-2 !py-1 text-xs" onClick={() => setActive((a) => !a)}>
        {active ? "Pause" : "Resume"}
      </button>
      <button className="btn-ghost !px-2 !py-1 text-xs" onClick={() => { setActive(false); setLeft(null); }}>
        ✕
      </button>
    </span>
  );
}

export default function TodayPlanPage() {
  const { state, recordSession } = useStore();
  const router = useRouter();
  const plan = buildDailyPlan(state, state.plan.dailyMinutes || 60);
  const today = todayKey();

  // Persistent manual overrides per day. Anything you actually do is auto-checked;
  // manual marks survive navigation and are held in localStorage.
  const [manual, setManual] = useState<Record<number, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const all = JSON.parse(localStorage.getItem(TODOS_KEY) ?? "{}");
      return (all[today] as Record<number, boolean>) ?? {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(TODOS_KEY) ?? "{}");
      all[today] = manual;
      localStorage.setItem(TODOS_KEY, JSON.stringify(all));
    } catch {
      /* storage unavailable */
    }
  }, [manual, today]);

  const itemHref = (item: PlanItem) => {
    if (item.kind === "learn" || item.kind === "video" || item.kind === "revision") {
      return item.topicId ? `/learn/${item.section}/${item.topicId.split("-")[1]}/${item.topicId}` : "/learn";
    }
    if (item.kind === "practice") return "/practice";
    if (item.kind === "dilr-set") return "/practice?mode=set";
    if (item.kind === "rc") return "/rc-lab";
    if (item.kind === "speed") return "/time-pressure";
    if (item.kind === "mistake-rev") return "/mistakes";
    if (item.kind === "challenge") return "/challenge";
    return "/practice";
  };

  const isDone = (i: number) => {
    const item = plan.items[i];
    return manual[i] !== undefined ? manual[i] : isPlanItemDone(state, item);
  };

  const doneCount = plan.items.filter((_, i) => isDone(i)).length;
  const pct = plan.items.length === 0 ? 0 : Math.round((doneCount / plan.items.length) * 100);

  const completeAll = () => {
    const total = plan.items.reduce((s, i) => s + i.durationMin, 0);
    recordSession(
      { type: "learn", durationMin: total || state.plan.dailyMinutes, itemsCompleted: plan.items.length },
      []
    );
    router.push("/dashboard");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Today's Plan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Available: {plan.availableMinutes} min · {doneCount}/{plan.items.length} completed
        </p>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={pct} className="flex-1" tone="green" />
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{pct}%</span>
        </div>
      </div>

      {plan.items.length === 0 && (
        <Card>
          <p className="text-sm text-slate-500">
            No plan items to show. You have likely covered today's syllabus push.
            Solve a few practice questions or take a mini mock to generate fresh recommendations.
          </p>
          <Link href="/practice" className="btn-primary mt-4">Go to Practice →</Link>
        </Card>
      )}

      <div className="space-y-3">
        {plan.items.map((item, i) => {
          const isChecked = isDone(i);
          return (
            <Card key={i} className={isChecked ? "opacity-60" : ""}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {item.kind === "learn" ? "📘" : item.kind === "video" ? "🎬" : item.kind === "practice" ? "✏️" : item.kind === "revision" ? "🔄" : item.kind === "dilr-set" ? "🧩" : item.kind === "rc" ? "📖" : item.kind === "speed" ? "⚡" : item.kind === "mistake-rev" ? "🧠" : "🎯"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {item.durationMin} min — {item.title}
                    </h3>
                    <Chip tone="neutral">{item.section.toUpperCase()}</Chip>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.reason}</p>
                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    <Link href={itemHref(item)} className="btn-primary !px-3 !py-1.5 text-xs">
                      {isChecked ? "Revisit →" : "Start →"}
                    </Link>
                    <ItemTimer minutes={item.durationMin} onDone={() => setManual((m) => ({ ...m, [i]: true }))} />
                    <button
                      className={`btn-ghost !px-3 !py-1.5 text-xs ${isChecked ? "!text-emerald-600 dark:!text-emerald-400" : ""}`}
                      onClick={() => setManual((m) => ({ ...m, [i]: !m[i] }))}
                    >
                      {isChecked ? "✓ Done" : "Mark complete"}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {plan.items.length > 0 && (
        <div className="sticky bottom-16 lg:bottom-4 z-10">
          <button className="btn-primary w-full shadow-lg" onClick={completeAll} disabled={pct < 100 && !doneCount}>
            {pct === 100 ? "Finish session · save progress" : "Save partial progress"}
          </button>
        </div>
      )}
    </div>
  );
}