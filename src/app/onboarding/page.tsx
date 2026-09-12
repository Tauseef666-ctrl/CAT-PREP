"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import type { SectionId, StudyPlan } from "@/lib/types";
import { PERCENTILE_TARGETS, percentileLabel } from "@/lib/data/exam";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const steps = ["You", "Time", "Subjects", "Style", "Roadmap"];

const LEVELS: { v: StudyPlan["prepLevel"]; l: string; s: string }[] = [
  { v: "beginner", l: "Beginner", s: "New to CAT" },
  { v: "intermediate", l: "Intermediate", s: "Some practice done" },
  { v: "advanced", l: "Advanced", s: "Mock-ready" },
  { v: "repeater", l: "Repeater", s: "Attempted CAT before" },
  { v: "returning", l: "Returning", s: "Coming back after a break" },
];

const STYLES: { v: StudyPlan["prepStyle"]; l: string; s: string }[] = [
  { v: "self-study", l: "Self-study", s: "Full control, on my own" },
  { v: "coaching", l: "Coaching + self", s: "Coaching alongside this platform" },
  { v: "video-first", l: "Mostly video", s: "Prefer learning from lectures" },
  { v: "practice-first", l: "Mostly practice", s: "Learn by solving" },
  { v: "balanced", l: "Balanced", s: "Learn + practice equally" },
];

const TIME_PRESETS: { v: string; l: string; minutes: number }[] = [
  { v: "30", l: "30 min", minutes: 30 },
  { v: "45", l: "45 min", minutes: 45 },
  { v: "60", l: "1 hour", minutes: 60 },
  { v: "90", l: "1–2 hours", minutes: 90 },
  { v: "180", l: "2–4 hours", minutes: 180 },
  { v: "270", l: "4+ hours", minutes: 270 },
];

export default function OnboardingPage() {
  const { onBoard, state } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [course, setCourse] = useState(state.profile.course || "");
  const [board, setBoard] = useState(state.profile.board || "");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 1);
  const [level, setLevel] = useState<StudyPlan["prepLevel"]>("beginner");
  const [targetPercentile, setTargetPercentile] = useState<number | undefined>(undefined);

  const [timeMode, setTimeMode] = useState("60");
  const [customMinutes, setCustomMinutes] = useState(75);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const [strong, setStrong] = useState<SectionId[]>([]);
  const [weak, setWeak] = useState<SectionId[]>([]);

  const [prepStyle, setPrepStyle] = useState<StudyPlan["prepStyle"]>("balanced");
  const [focusMode, setFocusMode] = useState<StudyPlan["focusMode"]>("balanced");
  const [language, setLanguage] = useState<StudyPlan["language"]>("hinglish");

  const toggle = (arr: SectionId[], set: (v: SectionId[]) => void, v: SectionId) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const minutesFor = (mode: string): number => {
    const hit = TIME_PRESETS.find((t) => t.v === mode);
    if (hit) return hit.minutes;
    if (mode === "custom") return customMinutes;
    return 60;
  };

  const finish = () => {
    const plan: StudyPlan = {
      dailyMinutes: minutesFor(timeMode),
      daysPerWeek: days,
      targetExamYear: targetYear,
      prepLevel: level,
      prepStyle,
      targetPercentile,
      focusMode,
      strongSections: strong,
      weakSections: weak,
      language,
      diplomaLoad: 2,
      holidays: [],
      weakTopics: [],
      strongTopics: [],
    };
    onBoard(
      { name: "CAT Aspirant", course: course.trim(), board: board.trim(), targetExamYear: targetYear },
      plan
    );
    router.push("/dashboard");
  };

  const sections: { id: SectionId; label: string; sub: string }[] = [
    { id: "qa", label: "Quantitative Ability", sub: "Arithmetic, Algebra, Number System, Geometry" },
    { id: "varc", label: "VARC", sub: "Reading & Verbal Ability" },
    { id: "dilr", label: "DILR", sub: "Data Interpretation & Logical Reasoning" },
  ];

  const OptionChip = ({
    active,
    onClick,
    children,
    className,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition active:scale-[0.98]",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
        className
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="flex items-center justify-center gap-2 mb-8">
        <Logo wordmark size={30} />
      </div>

      {/* progress */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className={cn(
                "h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors",
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              )}
            >
              {i + 1}
            </div>
            <span className={cn("text-xs hidden sm:block", i === step ? "text-primary font-semibold" : "text-slate-500")}>{s}</span>
            {i < steps.length - 1 && <div className={cn("h-0.5 flex-1 transition-colors", i < step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800")} />}
          </div>
        ))}
      </div>

      {/* STEP 0 — you */}
      {step === 0 && (
        <div className="card p-6 animate-in">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">About you</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tell us about your background so the plan fits you. Nothing is assumed — the
            system only uses what you tell it.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div>
              <label className="label">Course / College <span className="text-slate-400 font-normal">(optional)</span></label>
              <input className="input" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. B.Com, Engineering…" />
            </div>
            <div>
              <label className="label">City / Board <span className="text-slate-400 font-normal">(optional)</span></label>
              <input className="input" value={board} onChange={(e) => setBoard(e.target.value)} placeholder="e.g. Delhi" />
            </div>
          </div>
          <label className="label mt-4">Which CAT are you targeting?</label>
          <div className="grid grid-cols-3 gap-2">
            {[new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map((y) => (
              <OptionChip key={y} active={targetYear === y} onClick={() => setTargetYear(y)} className="text-center">
                {y}
              </OptionChip>
            ))}
          </div>
          <label className="label mt-4">I am</label>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((lv) => (
              <OptionChip key={lv.v} active={level === lv.v} onClick={() => setLevel(lv.v)}>
                <div className="font-semibold">{lv.l}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{lv.s}</div>
              </OptionChip>
            ))}
          </div>
          <label className="label mt-4">Target percentile</label>
          <div className="grid grid-cols-2 gap-2">
            {PERCENTILE_TARGETS.map((p) => (
              <OptionChip key={p.label} active={targetPercentile === p.percentile} onClick={() => setTargetPercentile(p.percentile)}>
                {p.label}
              </OptionChip>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — time */}
      {step === 1 && (
        <div className="card p-6 animate-in">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your study time</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Being honest here means the planner never overloads you.
          </p>
          <label className="label mt-5">How much time per day can you give?</label>
          <div className="grid grid-cols-2 gap-2">
            {TIME_PRESETS.map((t) => (
              <OptionChip key={t.v} active={timeMode === t.v} onClick={() => setTimeMode(t.v)} className="text-center">
                {t.l}
              </OptionChip>
            ))}
          </div>
          <OptionChip active={timeMode === "custom"} onClick={() => setTimeMode("custom")} className="mt-2 w-full text-center">
            Custom
          </OptionChip>
          {timeMode === "custom" && (
            <input
              type="number"
              className="input mt-3"
              value={customMinutes}
              min={15}
              max={600}
              onChange={(e) => setCustomMinutes(Number(e.target.value))}
              aria-label="Custom minutes per day"
            />
          )}
          <label className="label mt-5">Which days per week can you study?</label>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((d) => {
              const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
              return (
                <OptionChip
                  key={d}
                  active={days.includes(d)}
                  onClick={() =>
                    setDays(days.includes(d) ? days.filter((x) => x !== d) : [...days, d])
                  }
                  className="px-3 py-2 text-center"
                >
                  {labels[d]}
                </OptionChip>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2 — subjects */}
      {step === 2 && (
        <div className="card p-6 animate-in">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your subjects</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Honest strength picks adjust what the planner prioritizes.
          </p>
          <label className="label mt-5">Strong sections (you&apos;re comfortable)</label>
          <div className="space-y-2">
            {sections.map((s) => (
              <OptionChip key={s.id} active={strong.includes(s.id)} onClick={() => toggle(strong, setStrong, s.id)} className="w-full">
                <div className="font-semibold">{s.label}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{s.sub}</div>
              </OptionChip>
            ))}
          </div>
          <label className="label mt-5">Weak sections (need the most work)</label>
          <div className="space-y-2">
            {sections.map((s) => (
              <OptionChip key={s.id} active={weak.includes(s.id)} onClick={() => toggle(weak, setWeak, s.id)} className="w-full">
                <div className="font-semibold">{s.label}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{s.sub}</div>
              </OptionChip>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 — style */}
      {step === 3 && (
        <div className="card p-6 animate-in">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Study style</h1>
          <label className="label mt-5">How do you prefer to prepare?</label>
          <div className="space-y-2">
            {STYLES.map((st) => (
              <OptionChip key={st.v} active={prepStyle === st.v} onClick={() => setPrepStyle(st.v)} className="w-full">
                <div className="font-semibold">{st.l}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{st.s}</div>
              </OptionChip>
            ))}
          </div>
          <label className="label mt-5">Emphasis</label>
          <div className="space-y-2">
            {([
              ["concept", "Concept-first", "Learn topics deeply before heavy practice."],
              ["balanced", "Balanced", "Learn + practice in equal measure."],
              ["practice", "Practice-first", "Do lots of questions with quick learning."],
            ] as const).map(([v, l, d]) => (
              <OptionChip key={v} active={focusMode === v} onClick={() => setFocusMode(v)} className="w-full">
                <div className="font-semibold">{l}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{d}</div>
              </OptionChip>
            ))}
          </div>
          <label className="label mt-5">Explanation language</label>
          <div className="grid grid-cols-3 gap-2">
            {(["english", "hinglish", "hindi"] as const).map((l) => (
              <OptionChip key={l} active={language === l} onClick={() => setLanguage(l)} className="text-center capitalize">
                {l}
              </OptionChip>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4 — roadmap */}
      {step === 4 && (
        <div className="card p-6 animate-in">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your initial roadmap</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Based on your input, the system creates a plan that starts with:
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="chip bg-primary/10 text-primary shrink-0">High priority</span>
              <span>High-weightage topics first, starting with core Arithmetic.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="chip bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shrink-0">Daily habit</span>
              <span>{Math.round(minutesFor(timeMode))} min/day across {days.length} days/week, balanced across QA · VARC · DILR.</span>
            </div>
            {weak.length > 0 && (
              <div className="flex items-start gap-3">
                <span className="chip bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 shrink-0">Weak boosted</span>
                <span>{weak.map((w) => w.toUpperCase()).join(", ")} gets extra practice slots until accuracy recovers.</span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <span className="chip bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 shrink-0">Goal</span>
              <span>{percentileLabel(targetPercentile)} · {LEVELS.find((l) => l.v === level)?.l} · {STYLES.find((s) => s.v === prepStyle)?.l}.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="chip bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 shrink-0">Adaptive</span>
              <span>Every answer updates the plan, readiness score and revision schedule.</span>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 p-3 text-xs text-amber-800 dark:text-amber-300">
            A target percentile is used for planning, not as a guarantee of results. This roadmap
            only reflects what you told us — it doesn&apos;t claim progress you haven&apos;t made.
          </div>
        </div>
      )}

      {/* nav buttons */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button className="btn-ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </button>
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        ) : (
          <button className="btn-primary !px-8" onClick={finish}>
            Create my roadmap →
          </button>
        )}
      </div>
    </div>
  );
}