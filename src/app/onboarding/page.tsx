"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store/AppProvider";
import type { SectionId, StudyPlan } from "@/lib/types";
import { cn } from "@/lib/utils";

const steps = ["You", "Time", "Subjects", "Style", "Roadmap"];

export default function OnboardingPage() {
  const { onBoard, state } = useStore();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [name, setName] = useState(state.profile.name || "Aditya");
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 1);
  const [level, setLevel] = useState<StudyPlan["prepLevel"]>("beginner");

  const [timeMode, setTimeMode] = useState("60-90");
  const [customMinutes, setCustomMinutes] = useState(75);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const [strong, setStrong] = useState<SectionId[]>([]);
  const [weak, setWeak] = useState<SectionId[]>([]);

  const [focusMode, setFocusMode] = useState<StudyPlan["focusMode"]>("balanced");
  const [language, setLanguage] = useState<StudyPlan["language"]>("hinglish");

  const toggle = (arr: SectionId[], set: (v: SectionId[]) => void, v: SectionId) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const minutesFor = (mode: string): number => {
    switch (mode) {
      case "30-45": return 45;
      case "60-90": return 90;
      case "2-4": return 180;
      case "4+": return 270;
      case "custom": return customMinutes;
      default: return 60;
    }
  };

  const finish = () => {
    const plan: StudyPlan = {
      dailyMinutes: minutesFor(timeMode),
      daysPerWeek: days,
      targetExamYear: targetYear,
      prepLevel: level,
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
      { name: name || "Aditya", course: "Diploma Mechanical Engineering (Production)", board: "BTEUP", targetExamYear: targetYear },
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
        "rounded-xl border px-3.5 py-2.5 text-sm font-medium text-left transition",
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
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-bold">C</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          CAT <span className="text-primary">Command</span>
        </span>
      </div>

      {/* progress */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div
              className={cn(
                "h-8 w-8 rounded-full text-xs font-bold flex items-center justify-center",
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              )}
            >
              {i + 1}
            </div>
            <span className={cn("text-xs hidden sm:block", i === step ? "text-primary font-semibold" : "text-slate-500")}>{s}</span>
            {i < steps.length - 1 && <div className={cn("h-0.5 flex-1", i < step ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800")} />}
          </div>
        ))}
      </div>

      {/* STEP 0 — you */}
      {step === 0 && (
        <div className="card p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">About you</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            This personalizes your dashboard. We never claim progress you haven't actually made.
          </p>
          <label className="label mt-5">Your name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label mt-4">Which CAT are you targeting?</label>
          <div className="grid grid-cols-3 gap-2">
            {[new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2].map((y) => (
              <OptionChip
                key={y}
                active={targetYear === y}
                onClick={() => setTargetYear(y)}
                className="text-center"
              >
                {y}
              </OptionChip>
            ))}
          </div>
          <label className="label mt-4">Current preparation level</label>
          <div className="grid grid-cols-3 gap-2">
            {([
              ["beginner", "Beginner", "New to CAT"],
              ["intermediate", "Intermediate", "Some practice done"],
              ["advanced", "Advanced", "Mock-ready"],
            ] as const).map(([v, l, s]) => (
              <OptionChip key={v} active={level === v} onClick={() => setLevel(v)}>
                <div className="font-semibold">{l}</div>
                <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{s}</div>
              </OptionChip>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1 — time */}
      {step === 1 && (
        <div className="card p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your study time</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Being honest here means the planner never overloads you.
          </p>
          <label className="label mt-5">How much time per day can you give?</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ["30-45", "30–45 min"],
              ["60-90", "1–1.5 hours"],
              ["2-4", "2–4 hours"],
              ["4+", "4+ hours"],
            ] as const).map(([v, l]) => (
              <OptionChip key={v} active={timeMode === v} onClick={() => setTimeMode(v)} className="text-center">
                {l}
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
        <div className="card p-6">
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
        <div className="card p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Study style</h1>
          <label className="label mt-5">How do you want to prepare?</label>
          <div className="space-y-2">
            {([
              ["concept", "Concept-focused", "Learn topics deeply before heavy practice."],
              ["balanced", "Balanced", "Learn + practice in equal measure."],
              ["practice", "Practice-focused", "Do lots of questions with quick learning."],
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
        <div className="card p-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Your initial roadmap</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Based on your input, CAT Command creates a plan that starts with:
          </p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="chip bg-primary/10 text-primary shrink-0">High priority</span>
              <span>High-weightage topics first, starting with Percentages and core Arithmetic.</span>
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
              <span className="chip bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 shrink-0">Adaptive</span>
              <span>Every answer updates the plan, readiness score and revision schedule.</span>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 p-3 text-xs text-amber-800 dark:text-amber-300">
            This is a starting roadmap built from what you told us. It doesn&apos;t claim knowledge of progress you haven&apos;t made.
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