"use client";

import Link from "next/link";
import { useStore } from "@/lib/store/AppProvider";
import { SECTION_LIST } from "@/lib/content";

export default function LandingPage() {
  const { state } = useStore();
  const onboarded = state.profile.onboarded;
  const home = onboarded ? "/dashboard" : "/onboarding";

  const philosophy = [
    { n: "1", t: "Concept", d: "Learn the idea from beginner level." },
    { n: "2", t: "Practice", d: "Solve questions from easy to CAT level." },
    { n: "3", t: "Analysis", d: "Understand exactly why you erred." },
    { n: "4", t: "Revision", d: "Spaced repetition keeps it in memory." },
    { n: "5", t: "Test", d: "Mocks reveal the real score." },
  ];

  return (
    <div className="min-h-dvh">
      {/* Nav */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 h-14">
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">C</span>
            <span className="text-slate-900 dark:text-slate-100">
              CAT <span className="text-primary">Command</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/learn" className="btn-ghost hidden sm:inline-flex">
              View CAT Roadmap
            </Link>
            <Link href={home} className="btn-primary">
              {onboarded ? "Open Dashboard" : "Start Preparation"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Aditya's personal CAT preparation system
          </div>
          <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            One system that tells Aditya{" "}
            <span className="text-primary">exactly what to do next.</span>
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            CAT Command combines learning, practice, mistake analysis, spaced revision, mock tests
            and an intelligent planner — built for students preparing alongside college and Diploma
            studies.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={home} className="btn-primary !px-6 !py-3">
              {onboarded ? "Resume Preparation" : "Start Preparation"}
            </Link>
            <Link href="/learn" className="btn-ghost !px-6 !py-3">
              View CAT Roadmap
            </Link>
            <Link href={onboarded ? "/tests" : "/onboarding"} className="btn-ghost !px-6 !py-3">
              Take Diagnostic Test
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-500 dark:text-slate-400">
            Demo data is used locally on this device. Your progress is private and stored only in your browser.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-5xl px-4 pb-14">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
          The preparation philosophy
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {philosophy.map((p, i) => (
            <div key={p.n} className="card p-4 text-center">
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

      {/* Sections */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
          The three CAT sections
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {SECTION_LIST.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-extrabold text-primary uppercase">{s.shortTitle}</span>
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

      {/* Built for busy students */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="card p-6 sm:p-8 grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Designed for preparation alongside your Diploma
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              You set the daily time available. The planner compresses the highest-impact activities
              into short sessions and expands them when you have more time. Semester exams coming?
              Tell the planner and it lightens your CAT load automatically.
            </p>
            <Link href={home} className="btn-primary mt-5">
              Start today's plan →
            </Link>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-5 text-sm space-y-3">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> 15 min — Learn Percentages</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 20 min — Practice QA</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> 15 min — DILR set</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-sky-500" /> 10 min — RC</div>
            <div className="pt-1 text-xs text-slate-500 dark:text-slate-400">
              A sample of what "You have 60 minutes today" builds for you.
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>CAT Command · Built for Aditya · Personal study system</span>
          <span>CAT is an exam conducted by the IIMs; CAT Command is an independent study tool.</span>
        </div>
      </footer>
    </div>
  );
}