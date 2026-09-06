import type { Metadata } from "next";
import Link from "next/link";
import { SECTIONS, CHAPTERS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Complete CAT Syllabus (2026) — VARC, DILR & QA",
  description:
    "The complete CAT syllabus, structured section → chapter → topic: Quantitative Ability (Arithmetic, Algebra, Number System, Geometry, Modern Math), VARC (Reading Comprehension, Verbal Ability) and DILR (Data Interpretation, Logical Reasoning).",
  openGraph: {
    title: "Complete CAT Syllabus — CAT Command",
    description:
      "Browse the full CAT syllabus with every chapter and topic, difficulty and estimated time.",
    type: "website",
  },
};

export default function PublicSyllabusPage() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0b1220]">
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
          <Link href="/" className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 text-sm">
            CAT <span className="text-primary">Command</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/learn" className="btn-ghost !py-2">Interactive Syllabus</Link>
            <Link href="/onboarding" className="btn-primary !py-2">Start Preparing</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden="true">/</span>{" "}
          <span className="text-slate-700 dark:text-slate-300">CAT Syllabus</span>
        </nav>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Complete CAT Syllabus
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          The full CAT preparation syllabus, structured exactly how CAT Command teaches it:
          <b> section → chapter → topic</b>. Every topic link opens its complete lesson in the app.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          CAT question count and weightage vary each year by slot — always confirm with the official
          brochure (iimcat.ac.in). The structure below is the stable curriculum.
        </p>

        <div className="mt-8 space-y-8">
          {(Object.keys(SECTIONS) as Array<keyof typeof SECTIONS>).map((id) => {
            const s = SECTIONS[id];
            const chapters = CHAPTERS.filter((c) => c.section === id);
            return (
              <section key={id} aria-labelledby={`sec-${id}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 id={`sec-${id}`} className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {s.shortTitle} <span className="text-slate-400 font-normal text-base">· {s.title}</span>
                  </h2>
                  <span className="chip bg-primary/10 text-primary">{chapters.reduce((n, c) => n + c.topics.length, 0)} topics</span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-2xl">{s.description}</p>

                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {chapters.map((c) => (
                    <div key={c.id} className="card p-4">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{c.title}</h3>
                      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {c.topics.map((t) => (
                          <li key={t.id} className="flex items-baseline gap-2 text-sm">
                            <span className="h-1.5 w-1.5 mt-1.5 shrink-0 rounded-full bg-primary/50" aria-hidden="true" />
                            <Link href={`/learn/${t.section}/${t.chapterId.split("-")[1]}/${t.id}`} className="text-slate-700 dark:text-slate-300 hover:text-primary">
                              {t.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 card p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Ready to start?</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CAT Command turns this syllabus into a personalized daily plan that tells you exactly what
            to study next.
          </p>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <Link href="/onboarding" className="btn-primary">Start Preparing</Link>
            <Link href="/learn" className="btn-ghost">Interactive Syllabus</Link>
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