import type { AppState, SectionId } from "../types";

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  studyMinutes: number;
  daysActive: number;
  topicsStudied: number;
  questionsSolved: number;
  accuracy: number | null;
  testsTaken: number;
  mistakesNew: number;
  revisionsDone: number;
  streakChange: number;
  sectionCoverage: Partial<Record<SectionId, number>>;
  improved: string[];
  attention: string[];
  nextWeek: string[];
}

function localKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

export function buildWeeklyReport(state: AppState, now = new Date()): WeeklyReport {
  const end = localKey(now);
  const start = new Date(now);
  start.setDate(now.getDate() - 6);
  const startKey = localKey(start);

  const inWeek = (d: string | undefined): boolean => !!d && d >= startKey && d <= end;

  const studyMinutes =
    state.studyDays.filter((d) => inWeek(d.date)).reduce((s, d) => s + (d.completedMinutes || 0), 0) +
    state.sessions.filter((s) => inWeek(dayKey(s.date))).reduce((s, sn) => s + (sn.durationMin || 0), 0);

  const daysActive = new Set(
    state.sessions.map((s) => dayKey(s.date)).filter(inWeek)
  ).size;

  const topicsStudied = new Set(
    state.sessions.filter((s) => inWeek(dayKey(s.date)) && s.topicId).map((s) => s.topicId)
  ).size;

  const qs = state.questionResults.filter((q) => inWeek(dayKey(q.attemptedAt)));
  const questionsSolved = qs.length;
  const correct = qs.filter((q) => q.correct).length;
  const accuracy = qs.length ? Math.round((correct / qs.length) * 100) : null;

  const testsTaken = state.testAttempts.filter((t) => t.submittedAt && inWeek(dayKey(t.submittedAt))).length;

  const mistakesNew = state.mistakes.filter((m) => inWeek(m.date)).length;

  const revisionsDone = state.sessions.filter(
    (s) => inWeek(dayKey(s.date)) && (s.type === "revision" || s.type === "learn") && s.itemsCompleted > 0
  ).reduce((n, s) => n + s.itemsCompleted, 0);

  const streakChange = state.streak.current;

  const sectionCoverage: Partial<Record<SectionId, number>> = {};
  for (const id of ["qa", "varc", "dilr"] as SectionId[]) {
    sectionCoverage[id] = qs.filter((q) => q.section === id).length;
  }

  const improved: string[] = [];
  if (accuracy != null && accuracy >= 70) improved.push(`Accuracy was solid at ${accuracy}%${correct}/${questionsSolved}.`);
  if (topicsStudied >= 3) improved.push(`Worked through ${topicsStudied} topics this week.`);
  if (testsTaken >= 1) improved.push(`Took ${testsTaken} test${testsTaken > 1 ? "s" : ""} — the best readiness signal.`);
  if (revisionsDone >= 3) improved.push(`Completed ${revisionsDone} revision blocks (spaced retention holding).`);
  if (daysActive >= 4 && studyMinutes > 0) improved.push(`Studied on ${daysActive} day${daysActive > 1 ? "s" : ""} (${Math.round(studyMinutes)} min).`);

  const attention: string[] = [];
  if (accuracy != null && accuracy < 60) attention.push(`Accuracy fell to ${accuracy}% — go back to concepts before harder questions.`);
  if (questionsSolved === 0) attention.push("No questions solved — practice is the engine of CAT scoring.");
  else {
    const weakSecs = (Object.entries(sectionCoverage) as [SectionId, number][]).filter(([, n]) => n === 0 || n < Math.max(1, questionsSolved / 6));
    if (weakSecs.length) attention.push(`${weakSecs.map(([s]) => s.toUpperCase()).join(", ")} got little or no practice — rotate sections daily.`);
  }
  if (testsTaken === 0 && daysActive >= 4) attention.push("No mock or section test this week. Schedule one — it recalibrates your plan.");
  if (mistakesNew === 0 && questionsSolved > 0) attention.push("No mistakes logged — check you're recording 'why' on wrong answers for the mistake notebook.");
  if (studyMinutes === 0) attention.push("No study time recorded. Even 15 minutes a day beats a week off.");

  const nextWeek: string[] = [];
  if (accuracy != null && accuracy < 60) nextWeek.push("Review weak topics' notes → retry their easy questions → then medium.");
  nextWeek.push("Keep a daily 10-minute mixed practice block for speed.");
  if (testsTaken === 0) nextWeek.push("Attempt one sectional mock and study its analysis within 24 hours.");
  if (mistakesNew > 0) nextWeek.push("Retry the mistake notebook and mark mastered items done.");
  if (nextWeek.length === 0) nextWeek.push("Consistency now — repeat the winning pattern from this week.");

  return {
    weekStart: startKey,
    weekEnd: end,
    studyMinutes,
    daysActive,
    topicsStudied,
    questionsSolved,
    accuracy,
    testsTaken,
    mistakesNew,
    revisionsDone,
    streakChange,
    sectionCoverage,
    improved,
    attention,
    nextWeek,
  };
}