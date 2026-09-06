"use client";

import { useState } from "react";
import { RC_PASSAGES } from "@/lib/content";
import { RCRunner } from "@/components/rc/RCRunner";
import { Card, Chip, DifficultyBadge, EmptyState } from "@/components/ui";
import type { RCPassage } from "@/lib/types";

export default function RCLabPage() {
  const [active, setActive] = useState<RCPassage | null>(null);

  if (active) {
    return (
      <div className="max-w-2xl mx-auto">
        <RCRunner passage={active} onExit={() => setActive(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">RC Lab</h1>
        <p className="text-sm text-slate-500 mt-1">
          Build reading speed (180–220 wpm) and comprehension accuracy — the two levers that win VARC.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-4 text-center">
          <div className="text-xl font-extrabold text-primary">1. Read</div>
          <div className="text-xs text-slate-500 mt-1">Track your words-per-minute live.</div>
        </Card>
        <Card className="!p-4 text-center">
          <div className="text-xl font-extrabold text-emerald-600">2. Answer</div>
          <div className="text-xs text-slate-500 mt-1">Inference, main idea, tone questions.</div>
        </Card>
        <Card className="!p-4 text-center">
          <div className="text-xl font-extrabold text-amber-600">3. Improve</div>
          <div className="text-xs text-slate-500 mt-1">Speed and accuracy feed your VARC readiness.</div>
        </Card>
      </div>

      <div className="space-y-3">
        {RC_PASSAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p)}
            className="w-full text-left rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 hover:border-primary/40 hover:bg-primary/5 transition"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-slate-100">{p.title}</span>
              <Chip tone="neutral">{p.domain}</Chip>
              <Chip tone="neutral">{p.length}</Chip>
              <DifficultyBadge level={p.difficulty} />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              ~{p.passage.split(/\s+/).length} words · {p.questions.length} questions · ~{p.estimatedMinutes} min
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 line-clamp-2">{p.passage}</p>
            <span className="text-primary text-xs font-semibold mt-3 inline-block">Start passage →</span>
          </button>
        ))}
        {RC_PASSAGES.length === 0 && (
          <EmptyState title="Passages loading" description="Original RC passages are being authored — check back soon." />
        )}
      </div>
    </div>
  );
}