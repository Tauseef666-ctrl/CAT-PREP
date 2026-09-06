import type { Metadata } from "next";
import Link from "next/link";
import { EXAM_PATTERN } from "@/lib/data/exam";

export const metadata: Metadata = {
  title: "CAT Exam Pattern, Sections & Marking (VARC, DILR, QA)",
  description:
    "Understand the CAT exam: three sections (VARC, DILR, QA), computer-based format, section time limits, question sets, and marking scheme. Verify the current year's official pattern from the CAT brochure.",
  openGraph: {
    title: "CAT Exam Pattern — CAT Command",
    description: "The structure of the CAT exam explained, mapped to how CAT Command prepares you section by section.",
    type: "website",
  },
};

export default function CatExamPage() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0b1220]">
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
          <Link href="/" className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 text-sm">
            CAT <span className="text-primary">Command</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/syllabus" className="btn-ghost !py-2">Full Syllabus</Link>
            <Link href="/onboarding" className="btn-primary !py-2">Start Preparing</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden="true">/</span>{" "}
          <span className="text-slate-700 dark:text-slate-300">CAT Exam Pattern</span>
        </nav>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          The CAT Exam, Explained
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          CAT is a <b>computer-based test</b> conducted by the IIMs for admission to their MBA and
          some other PGDM programs. You are scored on a national percentile across all test-takers —
          so your job is not just accuracy, but <b>relative speed</b> and <b>percentile-focused strategy</b>.
        </p>

        <div className="mt-8 card p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pattern summary</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{EXAM_PATTERN.patternSummary}</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { l: "Sections", v: String(EXAM_PATTERN.totalSections) },
              { l: "Slot time (last released)", v: `${EXAM_PATTERN.sections[0].slotTimeMin ?? "?"} min` },
              { l: "Format", v: "Computer-based" },
              { l: "Mode", v: "Offline (test centres)" },
            ].map((x) => (
              <div key={x.l} className="rounded-xl bg-slate-100 dark:bg-slate-800/60 p-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">{x.l}</div>
                <div className="mt-0.5 font-bold text-slate-900 dark:text-slate-100">{x.v}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
            ⚠ Timings, question counts and mark values change between years and slots. Verify the current
            year's official brochure on <span className="font-semibold">iimcat.ac.in</span>. Last verified by CAT Command: {EXAM_PATTERN.lastVerified}.
          </p>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {EXAM_PATTERN.sections.map((s) => (
            <div key={s.id} className="card p-5">
              <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                <span className="chip bg-primary/10 text-primary">{s.short}</span>
                {s.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{s.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                {s.slotTimeMin != null && <li>⏱ {s.slotTimeMin} min slot (last released)</li>}
                {s.slotQuestions != null && <li>📝 {s.slotQuestions} questions (last released)</li>}
                <li>
                  🔢 Marks: {s.sectionMarks[0]} per correct · {s.sectionMarks[1]} per wrong · {s.sectionMarks[2]} if unanswered
                </li>
                <li>🔎 {s.officialNote}</li>
              </ul>
              <Link href={`/learn?s=${s.id}`} className="btn-ghost !py-2 mt-4 !w-full text-center">
                Study {s.short} in the app
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">How percentile scoring changes your strategy</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
            <li>• A percentile is <b>your rank relative to others</b>, not your raw score — it varies with every slot's difficulty.</li>
            <li>• Negative marking means <b>guess only when you can eliminate</b> options confidently.</li>
            <li>• CAT rewards <b>attempted, accurate questions</b> more than perfect papers. Leaving a section blank costs far more than a few wrong answers.</li>
            <li>• Targeting 90th vs 99th percentile changes which question difficulties you should chase — set your goal in{" "}
              <Link href="/onboarding" className="text-primary hover:underline">onboarding</Link>.</li>
          </ul>
        </div>

        <div className="mt-12 card p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Turn this pattern into a plan</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CAT Command builds a daily plan around all three sections, calibrated to the time you actually have.
          </p>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <Link href="/onboarding" className="btn-primary">Set Up My Plan</Link>
            <Link href="/syllabus" className="btn-ghost">Browse the Syllabus</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CAT Command · An independent CAT preparation system</span>
          <span>Not affiliated with the IIMs. Verify official pattern at iimcat.ac.in.</span>
        </div>
      </footer>
    </div>
  );
}