"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { state, updatePlan, resetAll } = useStore();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Preferences & data live only in this browser until server sync arrives.</p>
      </div>

      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Plan preferences</h2>
        <div className="label">Daily minutes</div>
        <div className="flex flex-wrap gap-1.5">
          {[30, 45, 60, 90, 120, 180].map((m) => (
            <button key={m} onClick={() => updatePlan({ dailyMinutes: m })} className={cn("chip", state.plan.dailyMinutes === m ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
              {m}
            </button>
          ))}
        </div>
        <div className="label mt-4">Focus mode</div>
        <div className="flex flex-wrap gap-1.5">
          {(["concept", "balanced", "practice"] as const).map((f) => (
            <button key={f} onClick={() => updatePlan({ focusMode: f })} className={cn("chip", state.plan.focusMode === f ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
              {f}
            </button>
          ))}
        </div>
        <div className="label mt-4">Explanation language</div>
        <div className="flex flex-wrap gap-1.5">
          {(["english", "hinglish", "hindi"] as const).map((l) => (
            <button key={l} onClick={() => updatePlan({ language: l })} className={cn("chip capitalize", state.plan.language === l ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300")}>
              {l}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Data & privacy</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          All progress is stored locally in this browser (localStorage). Nothing is uploaded anywhere.
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          <button className="btn-ghost !py-2 text-sm" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(state)).catch(() => {}); }}>
            Export data (JSON)
          </button>
          <button
            className="btn-ghost !py-2 text-sm !border-red-300 !text-red-500"
            onClick={() => { if (confirm("Erase ALL app data on this device?")) resetAll(); }}
          >
            Erase data
          </button>
        </div>
      </Card>

      <Card>
        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">About</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          CAT Command — a complete CAT preparation system for every aspirant. v1.0 · non-commercial.
          Built on Next.js with honest, integrity-checked content.
        </p>
        <Link href="/" className="link text-sm inline-block mt-2">Landing page →</Link>
      </Card>
    </div>
  );
}