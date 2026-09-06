"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { Card, Chip, EmptyState } from "@/components/ui";
import { buildTest, TEST_PRESETS, setDraftTest, nextTestSuggestion, type TestSpec } from "@/lib/engine/testBuilder";
import type { SectionId, TestDefinition } from "@/lib/types";
import { formatTime, formatDate } from "@/lib/utils";

function TestsContent() {
  const { state } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const topicFilter = params.get("topic");
  const [draftTopic, setDraftTopic] = useState<TestDefinition | null>(null);

  const suggestion = nextTestSuggestion(state);

  useEffect(() => {
    const topic = params.get("topic");
    if (topic) {
      const def = buildTest({ title: "Topic Test", type: "topic", topicId: topic, questionCount: 8, durationMin: 15 });
      setDraftTopic(def);
    }
  }, [params]);

  const startTest = (spec: TestSpec) => {
    const def = buildTest(spec);
    if (!def) return;
    setDraftTest(def);
    router.push(`/tests/${def.id}`);
  };

  const attempts = state.testAttempts.filter((t) => t.submittedAt);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Test Center</h1>
        <p className="text-sm text-slate-500 mt-1">Mocks built from the verified question bank — honest scoring, no fake percentiles.</p>
      </div>

      {/* Suggestion */}
      {!topicFilter && (
        <Card className="border-primary/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧠</span>
            <h2 className="font-bold text-slate-900 dark:text-slate-100">Next recommended test</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">{suggestion.reason}</p>
          <button className="btn-primary mt-3" onClick={() => {
            const pre = TEST_PRESETS.find((p) => p.spec.title === suggestion.title);
            if (pre) startTest({ ...pre.spec, questionCount: pre.count, durationMin: pre.minutes });
            else router.push(suggestion.href);
          }}>
            Start {suggestion.title} →
          </button>
        </Card>
      )}

      {/* Topic test */}
      {draftTopic && (
        <Card className="border-amber-400/40">
          <h2 className="font-bold text-slate-900 dark:text-slate-100">Topic test ready</h2>
          <p className="text-sm text-slate-500 mt-1">{draftTopic.title} · {draftTopic.questionIds.length} questions · {draftTopic.durationMin} min</p>
          <button className="btn-primary mt-3" onClick={() => { setDraftTest(draftTopic); router.push(`/tests/${draftTopic.id}`); }}>
            Start topic test →
          </button>
        </Card>
      )}

      {/* Presets */}
      <div className="grid sm:grid-cols-2 gap-3">
        {TEST_PRESETS.map((p) => (
          <Card key={p.spec.title} className="!p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{p.spec.type === "mini" ? "⚡" : p.spec.section === "qa" ? "🔢" : p.spec.section === "varc" ? "📚" : "🧩"}</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{p.spec.title}</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
            <button className="btn-ghost mt-3 !py-2 text-sm" onClick={() => router.push(`/tests?topic=${p.spec.section ?? "qa"}`)}>
              Go to topic test →
            </button>
            <button className="btn-primary mt-2 !py-2 text-sm" onClick={() => startTest({ ...p.spec, questionCount: p.count, durationMin: p.minutes })}>
              Start  →
            </button>
          </Card>
        ))}
      </div>

      {/* History */}
      <div>
        <h2 className="section-title">Past attempts <Chip tone="neutral">{attempts.length}</Chip></h2>
        {attempts.length === 0 ? (
          <EmptyState title="No mock taken yet" description="Your first attempt establishes the baseline everything else adapts to." />
        ) : (
          <div className="space-y-3">
            {attempts.map((a) => {
              const acc = Math.round((a.correct / Math.max(1, a.correct + a.incorrect)) * 100);
              return (
                <Link key={a.attemptId} href={`/tests/${a.testId}/analysis?attempt=${a.attemptId}`} className="block">
                  <Card className="!p-4 hover:border-primary/40">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{a.title}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {formatDate(a.submittedAt ?? a.startedAt)} · {a.correct}✓ / {a.incorrect}✗ / {a.skipped}—
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={acc >= 65 ? "text-emerald-600 font-extrabold" : "text-red-500 font-extrabold"}>{acc}%</div>
                          <div className="text-xs text-slate-500">accuracy</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-800 dark:text-slate-200 font-bold">{a.score}/{a.maxScore}</div>
                          <div className="text-xs text-slate-500">score</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <Suspense fallback={<div className="card h-32 skeleton" />}>
      <TestsContent />
    </Suspense>
  );
}