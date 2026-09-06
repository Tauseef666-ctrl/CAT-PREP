"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { buildDailyPlan, type PlanItem } from "@/lib/engine/planner";
import { Card, Chip, ProgressBar } from "@/components/ui";
import { formatDuration } from "@/lib/utils";

export default function TodayPlanPage() {
  const { state, recordSession, addStudyTime } = useStore();
  const router = useRouter();
  const plan = buildDailyPlan(state, state.plan.dailyMinutes || 60);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [running, setRunning] = useState(-1);

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

  const doneCount = Object.values(done).filter(Boolean).length;
  const pct = plan.items.length === 0 ? 0 : Math.round((doneCount / plan.items.length) * 100);

  const completeAll = () => {
    const total = plan.items.reduce((s, i) => s + i.durationMin, 0);
    // record the whole session as a study session
    const results = state.questionResults.slice(0, 0); // no new answers here
    recordSession(
      { type: "learn", durationMin: total || state.plan.dailyMinutes, itemsCompleted: plan.items.length },
      []
    );
    addStudyTime(0);
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
          const isDone = !!done[i];
          const isRunning = running === i;
          return (
            <Card key={i} className={isDone ? "opacity-60" : ""}>
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={itemHref(item)} className="btn-primary !px-3 !py-1.5 text-xs">
                      {isRunning ? "Resume →" : "Start →"}
                    </Link>
                    <button
                      className="btn-ghost !px-3 !py-1.5 text-xs"
                      onClick={() => setRunning(i)}
                    >
                      Timer {formatDuration(item.durationMin)}
                    </button>
                    <button
                      className={`btn-ghost !px-3 !py-1.5 text-xs ${isDone ? "!text-emerald-600 dark:!text-emerald-400" : ""}`}
                      onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                    >
                      {isDone ? "✓ Marked done" : "Mark complete"}
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