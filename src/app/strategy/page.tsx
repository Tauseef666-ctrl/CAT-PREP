import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CAT Attempt Strategy: Mocks, Time Management, RC & DILR Tactics",
  description:
    "A practical attempt strategy for CAT: mock-taking routines, section-order planning, RC and DILR tactics, accepting blind spots, and building 90-minute stamina — all wired into the CAT Command app.",
  openGraph: {
    title: "CAT Attempt Strategy — CAT Command",
    description: "Convert percentile theory into daily habits: mocks, time blocks, RC & DILR discipline.",
    type: "website",
  },
};

export default function StrategyPage() {
  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#0b1220]">
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 h-14">
          <Link href="/" className="font-extrabold tracking-tight text-slate-900 dark:text-slate-100 text-sm">
            CAT <span className="text-primary">Command</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/cat-exam" className="btn-ghost !py-2">Exam Pattern</Link>
            <Link href="/onboarding" className="btn-primary !py-2">Start Preparing</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden="true">/</span>{" "}
          <span className="text-slate-700 dark:text-slate-300">Attempt Strategy</span>
        </nav>

        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          CAT Attempt Strategy
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300 text-sm sm:text-base">
          Percentile thinking in practice: you are not chasing a fixed raw score, you are trying to
          out-perform the slot. These are the tactics CAT Command is built around — every one of them
          maps to a section of the app.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <StrategyCard
            title="Try lots of 'last 15 minutes' practice"
            body="Speed under pressure is a craft. Regular short sprints — last-questions-of-the-slot drills — train your brain to stay sharp when tired. Use the app's Quick Mode with its mini time-blocks."
            href="/quick"
            cta="Try Quick Mode"
          />
          <StrategyCard
            title="Time-pressure 'games' to practice racing"
            body="Playing the clock is a skill. Simulate tight mental states intentionally so real-exam pressure feels familiar. The Time Pressure mode is exactly that drill."
            href="/time-pressure"
            cta="Practice Under Pressure"
          />
          <StrategyCard
            title="Do bigger, deeper mock-SET-negotiating"
            body="High scorers don't just practice; they practice negotiating whole question sets — choosing which DILR set to attempt and cutting their losses inside it. The DILR section in Learn and the Tests mode build this skill."
            href="/tests"
            cta="Browse Tests"
          />
          <StrategyCard
            title="Situational awareness exercises"
            body="Decision-making in a 90-minute exam is rarely optimal at moment one. Rehearse the scenario: which section first, how to react when a set refuses to solve. Rehearsal is what the Dashboard's daily plan keeps scheduling."
            href="/planner"
            cta="Open the Planner"
          />
          <StrategyCard
            title="Developing a personal blind-spot list"
            body="Everyone has question types that silently eat time. Keep a living list of your personal traps, and retrain them deliberately. The Mistake Book is exactly that list."
            href="/mistakes"
            cta="Open Mistake Book"
          />
          <StrategyCard
            title="There are MANY side-events at CAT… the paper is the thing"
            body="Documents, exam-center logistics, nerves, other candidates — noise. What moves your score is what happens inside the 90 minutes: reading well, attempting well, clearing your head between sections."
            href="/onboarding"
            cta="Focus, Set Up Your Plan"
          />
        </div>

        <div className="mt-8 card p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">RC strategy</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Build daily reading volume, then practice précis-style summarization so comprehension becomes
            automatic. The app's Reading lab and RC Lab both push this. Always read the question-options
            before the passage — that turns an open-ended read into a targeted hunt.
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Link href="/reading" className="btn-ghost !py-2">Daily Reading</Link>
            <Link href="/rc-lab" className="btn-ghost !py-2">RC Lab</Link>
          </div>
        </div>

        <div className="mt-4 card p-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">DILR & QA tactics</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            In DILR, spend the first minutes surveying all sets, pick the most readable one, attempt it fully,
            and be ruthless about abandoning a stuck set. In QA, no question deserves more than ~2 minutes in a
            slot — if the path isn't visible, mark, move, return. Both sections reward <b>attempted accuracy</b>{" "}
            over completion. Practice these trade-offs in the PYQ bank and mocks.
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Link href="/pyq" className="btn-ghost !py-2">PYQ Practice</Link>
            <Link href="/tests" className="btn-ghost !py-2">Mock & Section Tests</Link>
          </div>
        </div>

        <div className="mt-12 card p-6 text-center">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Strategy is a system, not a trick</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            CAT Command schedules all of the above into one daily plan, personalized to your time and target.
          </p>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <Link href="/onboarding" className="btn-primary">Build My Strategy</Link>
            <Link href="/cat-exam" className="btn-ghost">Review the Exam Pattern</Link>
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

function StrategyCard({ title, body, href, cta }: { title: string; body: string; href: string; cta: string }) {
  return (
    <div className="card p-5 flex flex-col">
      <h3 className="font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 flex-1">{body}</p>
      <Link href={href} className="btn-ghost !py-2 mt-4 !w-full text-center">{cta}</Link>
    </div>
  );
}