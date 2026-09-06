"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { Logo } from "@/components/brand/Logo";
import { SECTION_LIST } from "@/lib/content";
import { EXAM_PATTERN } from "@/lib/data/exam";

export default function LandingPage() {
  const { state } = useStore();
  const onboarded = state.profile.onboarded;
  const home = onboarded ? "/dashboard" : "/onboarding";

  const cycle = [
    { n: "1", t: "Learn", d: "Beginner-friendly notes, formulas, examples and verified videos for every topic." },
    { n: "2", t: "Practice", d: "Adaptive questions from easy to CAT level, with hints and explanations." },
    { n: "3", t: "Analyze", d: "Every mistake is captured and classified so it stops repeating." },
    { n: "4", t: "Revise", d: "Spaced revision keeps topics in memory at the right intervals." },
    { n: "5", t: "Test", d: "Topic tests, sectionals and full mocks reveal your real score." },
  ];

  const features: { emoji: string; title: string; desc: string }[] = [
    { emoji: "📘", title: "Complete Notes", desc: "Structured, exam-oriented notes for every topic." },
    { emoji: "▶️", title: "Curated YouTube", desc: "Verified videos mapped to each topic." },
    { emoji: "✏️", title: "Practice Questions", desc: "Q-bank with difficulty, traps and faster methods." },
    { emoji: "🗓️", title: "PYQs", desc: "Past-year questions sourced with integrity." },
    { emoji: "🧪", title: "Mock Tests", desc: "Realistic CAT-style computer-based interface." },
    { emoji: "📔", title: "Mistake Notebook", desc: "Auto-captured, classified and retried." },
    { emoji: "🔁", title: "Revision System", desc: "Day 1 / 3 / 7 / 14 / 30 spaced scheduling." },
    { emoji: "📊", title: "Analytics", desc: "Readiness score, accuracy, speed, weak topics." },
    { emoji: "🗺️", title: "Study Planner", desc: "Tells you exactly what to do next, each day." },
  ];

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0b1220]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
          <Logo wordmark size={26} />
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#sections" className="hover:text-primary">Sections</a>
            <a href="#cycle" className="hover:text-primary">Method</a>
            <a href="#features" className="hover:text-primary">Features</a>
            <Link href="/syllabus" className="hover:text-primary">Syllabus</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/learn" className="btn-ghost hidden sm:inline-flex">
              Explore CAT Syllabus
            </Link>
            <Link href={home} className="btn-primary">
              {onboarded ? "Open Dashboard" : "Start Preparing"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.10),transparent_70%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center animate-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> The complete CAT prep system, in one place
          </div>
          <h1 className="mt-5 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto">
            Your Complete{" "}
            <span className="text-primary">CAT Preparation</span> System
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Learn concepts, watch curated lectures, practice questions, solve PYQs, take mocks,
            analyze mistakes and build your preparation plan — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={home} className="btn-primary !px-7 !py-3.5 !text-base">
              {onboarded ? "Resume Preparation" : "Start Preparing"}
            </Link>
            <Link href="/learn" className="btn-ghost !px-7 !py-3.5 !text-base">
              Explore CAT Syllabus
            </Link>
          </div>
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            Free forever · works offline after install · your data stays in your browser
          </p>
        </div>
      </section>

      {/* Three sections */}
      <section id="sections" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2">
          Built around the three CAT sections
        </h2>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xl mx-auto">
          {EXAM_PATTERN.patternSummary}
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {SECTION_LIST.map((s) => (
            <div key={s.id} className="card p-5 hover:border-primary/40 transition">
              <div className="flex items-center justify-between">
                <span
                  className={
                    s.id === "qa"
                      ? "text-2xl font-extrabold text-primary uppercase"
                      : s.id === "varc"
                        ? "text-2xl font-extrabold text-secondary-600 uppercase"
                        : "text-2xl font-extrabold text-slate-800 dark:text-slate-200 uppercase"
                  }
                >
                  {s.shortTitle}
                </span>
                <span className="chip bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {s.weightage}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{s.description}</p>
              <Link href={`/learn?s=${s.id}`} className="link inline-flex items-center gap-1 mt-4 text-sm">
                Explore {s.title} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Preparation cycle */}
      <section id="cycle" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
          The preparation method
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {cycle.map((p, i) => (
            <div key={p.n} className="card p-4 text-center animate-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {p.n}
              </div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{p.t}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.d}</div>
              {i < 4 && <div className="hidden sm:block mt-2 text-primary">↓</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Your CAT Command Center
          </div>
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Today's plan adapts to the time you have
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Tell it you have 30 minutes — it builds a focused session. Tell it 3 hours — it
                expands into concepts, practice and a mock analysis. The planner always knows what
                to recommend next.
              </p>
              <Link href={home} className="btn-primary mt-5">
                Start today's plan →
              </Link>
            </div>
            <div className="rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-5 text-sm space-y-3">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> 15 min — Learn Percentages</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-secondary-500" /> 20 min — QA practice</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> 15 min — DILR set</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> 10 min — RC passage</div>
              <div className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                A live preview of what "You have 60 minutes today" builds for you.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
          Everything a serious aspirant needs
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <div key={f.title} className="card p-4 hover:border-primary/40 transition animate-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="text-xl">{f.emoji}</div>
              <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-2">{f.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="card p-8 text-center bg-gradient-to-br from-primary/5 via-transparent to-teal-500/5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Stop searching for what to study next.
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CAT Command already organized your entire preparation. Concept → notes → videos →
            practice → PYQs → test → revision → next topic.
          </p>
          <Link href={home} className="btn-primary !px-8 !py-3.5 mt-6 !text-base">
            {onboarded ? "Open Dashboard" : "Start Preparing — It's Free"}
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span>CAT Command · An independent CAT preparation system</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/syllabus" className="hover:text-primary">Syllabus</Link>
            <span aria-hidden="true">·</span>
            <Link href="/cat-exam" className="hover:text-primary">Exam Pattern</Link>
            <span aria-hidden="true">·</span>
            <Link href="/strategy" className="hover:text-primary">Strategy</Link>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-6 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          CAT is an exam conducted by the IIMs. CAT Command is an independent study tool and not affiliated with the IIMs. Verify official pattern at iimcat.ac.in.
        </div>
      </footer>
    </div>
  );
}