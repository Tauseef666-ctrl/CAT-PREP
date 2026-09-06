"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import { QuestionRun, type RunResult } from "@/components/practice/QuestionRun";
import {
  QUESTION_BANK,
  QUESTIONS_BY_TOPIC,
  SECTION_MAP,
  TOPIC_MAP,
  DILR_SETS,
  DILR_SET_MAP,
} from "@/lib/content";
import { adaptiveProfile, pickAdaptiveQuestion } from "@/lib/engine/adaptivity";
import { Card, Chip, EmptyState } from "@/components/ui";
import type { Question, SectionId } from "@/lib/types";
import { cn } from "@/lib/utils";

function PracticeContent() {
  const { state } = useStore();
  const params = useSearchParams();
  const topicId = params.get("topic");
  const setParam = params.get("set");
  const timed = params.get("timed") === "1";
  const sectionParam = params.get("section") as SectionId | null;

  const [session, setSession] = useState<QuestionRunReady | null>(null);
  const [done, setDone] = useState(false);

  const profile = adaptiveProfile(state);

  const setQuestions = useMemo(() => {
    if (!setParam) return null;
    const set = DILR_SET_MAP[setParam];
    return set;
  }, [setParam]);

  const pool = useMemo<Question[]>(() => {
    if (topicId) return QUESTION_BANK.filter((q) => q.topicId === topicId);
    if (sectionParam) return QUESTION_BANK.filter((q) => q.section === sectionParam);
    return QUESTION_BANK.filter((q) => !q.set);
  }, [topicId, sectionParam]);

  interface QuestionRunReady {
    questions: Question[];
    setData?: (typeof DILR_SETS)[number];
    timed: boolean;
    title: string;
    subtitle: string;
  }

  const buildSession = (cfg: {
    questions: Question[];
    setData?: (typeof DILR_SETS)[number];
    timed?: boolean;
    title?: string;
  }) => {
    const qs = cfg.questions.slice(0, 10);
    if (qs.length === 0) return;
    setSession({
      questions: qs,
      setData: cfg.setData,
      timed: cfg.timed ?? timed,
      title: cfg.title ?? (topicId ? TOPIC_MAP[topicId]?.title ?? "Topic" : "Practice"),
      subtitle: cfg.setData ? "DILR set — solve all related questions" : `${qs.length} questions · adaptive`,
    });
  };

  const mixes: { label: string; emoji: string; desc: string; onClick: () => void; badged?: string }[] = [
    {
      label: "Quick mix",
      emoji: "🎲",
      desc: "Across sections at your adaptive level",
      onClick: () => buildSession({ questions: pool.filter((q) => !q.set), title: "Quick mix" }),
      badged: `${profile.recommendedDifficulty >= 3 ? `Level ${profile.recommendedDifficulty}` : "Baseline"}`,
    },
    {
      label: "Timed drill",
      emoji: "⚡",
      desc: "CAT-style per-question countdown",
      onClick: () => buildSession({ questions: pool.filter((q) => !q.set), timed: true, title: "Timed drill" }),
    },
    {
      label: "Only new",
      emoji: "🆕",
      desc: "Skip everything you've solved",
      onClick: () => {
        const doneIds = new Set(state.questionResults.map((r) => r.questionId));
        buildSession({ questions: pool.filter((q) => !doneIds.has(q.id) && !q.set), title: "Fresh questions" });
      },
    },
    {
      label: "Mistake retry",
      emoji: "🧠",
      desc: "Re-attempt your recorded mistakes",
      onClick: () => {
        const m = state.mistakes.map((x) => QUESTION_BANK.find((q) => q.id === x.questionId)).filter(Boolean) as Question[];
        buildSession({ questions: m, title: "Mistake retry" });
      },
    },
    {
      label: "PYQ focus",
      emoji: "📜",
      desc: "Past-paper-tagged questions",
      onClick: () => buildSession({ questions: pool.filter((q) => q.isPYQ), title: "PYQ focus" }),
    },
    {
      label: "Challenge mode",
      emoji: "🔥",
      desc: "Hardest available questions",
      onClick: () => {
        const hard = pool.filter((q) => q.difficulty >= 4 && !q.set).sort((a, b) => b.difficulty - a.difficulty);
        buildSession({ questions: hard, title: "Challenge mode" });
      },
    },
  ];

  if (session) {
    return (
      <div className="max-w-2xl mx-auto">
        <button className="text-xs text-slate-500 hover:text-primary mb-3" onClick={() => { setSession(null); setDone(() => { return false; }); }}>← Exit practice</button>
        <QuestionRun
          questions={session.questions}
          setData={session.setData}
          timed={session.timed}
          onFinish={() => { setSession(null); setDone(true); }}
        />
      </div>
    );
  }

  const recommended = pickAdaptiveQuestion(state, { section: sectionParam ?? undefined, topicId: topicId ?? undefined }, []);
  const pending = pool.filter((q) => !state.questionResults.some((r) => r.questionId === q.id));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">Practice</h1>
        <p className="text-sm text-slate-500 mt-1">
          {topicId
            ? `Focused practice: ${TOPIC_MAP[topicId]?.title}`
            : sectionParam
              ? `Section: ${SECTION_MAP[sectionParam]?.title}`
              : "Adaptive practice that matches your level"}
        </p>
      </div>

      {/* Adaptive readout */}
      <Card className={cn("!p-4", profile.mode === "challenge" ? "border-primary/40" : "")}>
        <div className="flex items-center gap-2">
          <Chip tone={profile.mode === "fresh" ? "neutral" : profile.mode === "concept-rebuild" ? "red" : profile.mode === "challenge" ? "amber" : "blue"}>
            {profile.mode === "fresh"
              ? "First session"
              : profile.mode === "concept-rebuild"
                ? "Concept rebuild"
                : profile.mode === "speed-drill"
                  ? "Speed drill"
                  : profile.mode === "challenge"
                    ? "Challenge"
                    : "Steady"}
          </Chip>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recommended level: {profile.recommendedDifficulty}/6</span>
        </div>
        <p className="text-sm text-slate-500 mt-2">{profile.reason}</p>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mixes.map((m) => (
          <button key={m.label} onClick={m.onClick} className="rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition relative">
            {m.badged && (
              <span className="absolute top-2 right-2 text-[10px] font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">{m.badged}</span>
            )}
            <div className="text-2xl">{m.emoji}</div>
            <div className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">{m.label}</div>
            <div className="text-xs text-slate-500 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Topic/section routing */}
      {!topicId && !setParam && !sectionParam && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Or practice by section</h3>
          <div className="flex flex-wrap gap-2">
            {["qa", "varc", "dilr"].map((s) => (
              <Link key={s} href={`/practice?section=${s}`} className="chip bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary/10">
                {SECTION_MAP[s]?.title}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* DILR sets browser */}
      {!setParam && (
        <Card>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">DILR sets</h3>
          <div className="space-y-2">
            {DILR_SETS.map((s) => (
              <Link
                key={s.id}
                href={`/practice?mode=set&set=${s.id}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700/60 p-3 hover:border-primary/40"
              >
                <span className="text-xl">🧩</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.domain} · {s.questions.length} Qs · ~{s.estimatedMinutes} min</div>
                </div>
                <Chip tone="neutral">{s.questions.length}</Chip>
              </Link>
            ))}
          </div>
          {DILR_SETS.length === 0 && <p className="text-sm text-slate-500">DILR sets are being authored carefully — more coming.</p>}
        </Card>
      )}

      {done && (
        <Card className="!p-5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Session saved. Want to keep going?</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button className="btn-primary" onClick={() => buildSession({ questions: pool.filter((q) => !q.set) })}>Practice more →</button>
            <Link href="/mistakes" className="btn-ghost">Review mistakes</Link>
            <Link href="/analytics" className="btn-ghost">See analytics</Link>
          </div>
        </Card>
      )}

      {pool.length === 0 && !setParam && (
        <EmptyState title="No questions in this pool yet" description="The original question bank is still growing — try another section or topic." />
      )}
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="card h-32 skeleton" />}>
      <PracticeContent />
    </Suspense>
  );
}