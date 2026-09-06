import type { AppState, Question, SectionId, TestAttempt, TestDefinition } from "../types";
import { QUESTION_BANK } from "../content";

export interface TestSpec {
  title: string;
  type: TestDefinition["type"];
  section?: SectionId;
  topicId?: string;
  questionCount: number;
  durationMin: number;
}

// Deterministic pseudo-random from a string seed
export function seeded(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export function buildTest(spec: TestSpec, createdAt = new Date().toISOString()): TestDefinition | null {
  let pool: Question[];
  if (spec.topicId) pool = QUESTION_BANK.filter((q) => q.topicId === spec.topicId);
  else if (spec.section) pool = QUESTION_BANK.filter((q) => q.section === spec.section);
  else pool = QUESTION_BANK.filter((q) => !q.set);

  if (pool.length === 0) return null;
  const rand = seeded(createdAt + spec.title);
  const shuffled = [...pool].sort(() => rand() - 0.5);
  const questionIds = shuffled.slice(0, Math.min(spec.questionCount, shuffled.length)).map((q) => q.id);

  return {
    id: `t-${Date.now()}`,
    title: spec.title,
    type: spec.type,
    section: spec.section,
    durationMin: spec.durationMin,
    questionIds,
    createdAt,
  };
}

export const TEST_PRESETS: { spec: Omit<TestSpec, "questionCount" | "durationMin">; count: number; minutes: number; desc: string }[] = [
  { spec: { title: "Unlimited Mini Mock", type: "mini" }, count: 15, minutes: 25, desc: "15 questions across all sections, 25 min" },
  { spec: { title: "QA Sectional", type: "sectional", section: "qa" }, count: 12, minutes: 25, desc: "Quantitative Ability bench, 25 min" },
  { spec: { title: "VARC Sectional", type: "sectional", section: "varc" }, count: 12, minutes: 25, desc: "VARC bench, 25 min" },
  { spec: { title: "DILR Sectional", type: "sectional", section: "dilr" }, count: 12, minutes: 25, desc: "DILR bench, 25 min" },
];

export function buildTestAttempt(
  def: TestDefinition,
  answers: Record<string, number>,
  timeUsedSec: number,
  startedAt: string
): TestAttempt {
  const qm = Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]));
  const answersRecord = def.questionIds
    .filter((id) => answers[id] !== undefined && answers[id] !== null && answers[id] !== -1)
    .map((id) => {
      const q = qm[id];
      return {
        questionId: id,
        topicId: q.topicId,
        section: q.section,
        correct: q.correctIndex === answers[id],
        timeSec: Math.max(1, Math.round(timeUsedSec / Math.max(1, def.questionIds.length))),
        attemptedAt: new Date().toISOString(),
        difficulty: q.difficulty,
        isPYQ: q.isPYQ,
        source: q.source,
        yourAnswer: answers[id],
        correctIndex: q.correctIndex,
      };
    })
    .filter(Boolean);

  const correct = answersRecord.filter((r) => r.correct).length;
  const incorrect = answersRecord.filter((r) => !r.correct).length;
  const skipped = def.questionIds.length - correct - incorrect;

  const sectionScores: TestAttempt["sectionScores"] = { qa: { correct: 0, incorrect: 0, skipped: 0, timeSec: 0 }, varc: { correct: 0, incorrect: 0, skipped: 0, timeSec: 0 }, dilr: { correct: 0, incorrect: 0, skipped: 0, timeSec: 0 } };
  for (const r of answersRecord) {
    sectionScores[r.section].correct += r.correct ? 1 : 0;
    sectionScores[r.section].incorrect += r.correct ? 0 : 1;
    sectionScores[r.section].timeSec += r.timeSec;
  }

  const topicScores: TestAttempt["topicScores"] = {};
  for (const r of answersRecord) {
    if (!r.topicId) continue;
    topicScores[r.topicId] ??= { correct: 0, total: 0, timeSec: 0 };
    topicScores[r.topicId].total += 1;
    topicScores[r.topicId].correct += r.correct ? 1 : 0;
    topicScores[r.topicId].timeSec += r.timeSec;
  }

  const difficultyScores: TestAttempt["difficultyScores"] = {};
  for (const r of answersRecord) {
    difficultyScores[r.difficulty] ??= { correct: 0, total: 0, timeSec: 0 };
    difficultyScores[r.difficulty].total += 1;
    difficultyScores[r.difficulty].correct += r.correct ? 1 : 0;
    difficultyScores[r.difficulty].timeSec += r.timeSec;
  }

  const maxScore = def.questionIds.length * 3;
  const score = correct * 3 - incorrect * 1;

  return {
    attemptId: `a-${Date.now()}`,
    testId: def.id,
    startedAt,
    submittedAt: new Date().toISOString(),
    timeUsedSec,
    answers,
    answersRecord,
    score,
    maxScore,
    correct,
    incorrect,
    skipped,
    sectionScores,
    topicScores,
    difficultyScores,
    flagged: def.questionIds.filter((id) => answers[id] === -2),
    type: def.type,
    title: def.title,
  };
}

const DRAFT_KEY = "catcommand:draft-test";

export function setDraftTest(def: TestDefinition | null) {
  try {
    if (def) localStorage.setItem(DRAFT_KEY, JSON.stringify(def));
    else localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function getDraftTest(): TestDefinition | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as TestDefinition) : null;
  } catch {
    return null;
  }
}

export const performanceBand = (correct: number, total: number): {
  label: string;
  color: "green" | "amber" | "red";
  guidance: string;
} => {
  const acc = total === 0 ? 0 : Math.round((correct / total) * 100);
  if (acc >= 75)
    return { label: "Strong", color: "green", guidance: "Consistent accuracy. Raise difficulty or speed next time." };
  if (acc >= 50)
    return { label: "Building", color: "amber", guidance: "Good base — target the wrong topics specifically." };
  return { label: "Foundation", color: "red", guidance: "Rebuild the core concepts before more mocks." };
};

export function nextTestSuggestion(state: AppState): { title: string; reason: string; href: string } {
  const attempts = state.testAttempts.filter((t) => t.submittedAt);
  if (attempts.length === 0)
    return { title: "Unlimited Mini Mock", reason: "Establish your baseline across all three sections.", href: "/tests?start=mini" };
  const latest = attempts[0];
  const acc = latest.correct / Math.max(1, latest.correct + latest.incorrect);
  if (acc >= 0.6) {
    const sec = (["qa", "varc", "dilr"] as SectionId[]).sort(
      (a, b) => (latest.sectionScores[b]?.correct ?? 0) - (latest.sectionScores[a]?.correct ?? 0)
    )[0];
    return {
      title: `${sec.toUpperCase()} Sectional`,
      reason: "Your strongest section at this accuracy can now be pushed for speed.",
      href: `/tests?start=${sec}`,
    };
  }
  return {
    title: "Topic Tests first",
    reason: "Accuracy below 60% — isolate weak topics before another full mock.",
    href: `/learn?s=qa`,
  };
}