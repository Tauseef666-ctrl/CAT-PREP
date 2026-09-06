import type { AppState, SectionId } from "../types";
import { ALL_TOPICS } from "../content";
import { overallMetrics, sectionMetrics, todayKey } from "./metrics";

export interface ReadinessComponents {
  conceptStrength: number;
  practiceStrength: number;
  accuracy: number;
  speed: number;
  mockReadiness: number;
  revisionConsistency: number;
  coverage: number;
  weakTopicCoverage: number;
}

export interface ReadinessResult {
  score: number;
  components: ReadinessComponents;
  biggestLimiter: string;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function readinessIndex(state: AppState): ReadinessResult {
  const all = overallMetrics(state);
  const qa = sectionMetrics(state, "qa");
  const varc = sectionMetrics(state, "varc");
  const dilr = sectionMetrics(state, "dilr");

  const totalTopics = all.totalTopics || 1;

  // Concept strength: how much syllabus has been conceptually learned (any progress counts)
  const touched = ALL_TOPICS.filter((t) => {
    const p = state.topicProgress[t.id];
    return p && (p.conceptLearned || p.videoWatched || p.examplesDone || p.status !== "not-started");
  }).length;
  const completed = ALL_TOPICS.filter((t) => state.topicProgress[t.id]?.status === "completed").length;
  const conceptStrength = Math.round(((touched * 0.6 + completed * 0.4) / totalTopics) * 100);

  // Practice strength: questions solved relative to a healthy target (~300 questions for full coverage)
  const practiceStrength = Math.round(clamp01(all.questionsSolved / 300) * 100);

  // Accuracy
  const accuracy = all.accuracy;

  // Speed: 90s/question target
  const speed = all.avgTimeSec
    ? Math.round(clamp01(90 / all.avgTimeSec) * 100)
    : Math.min(20, practiceStrength); // no data yet → low but not zero

  // Mock readiness: mocks taken + sectional balance + completion
  const mocks = all.testsTaken;
  const pyqRatio = all.questionsSolved ? Math.round(clamp01(all.pyqSolved / Math.max(all.questionsSolved, 1)) * 100) : 0;
  const mockReadiness = Math.round(
    clamp01(
      mocks * 0.25 + (qa.accuracy * 0.33 + varc.accuracy * 0.33 + dilr.accuracy * 0.34) / 100 * 0.45 + pyqRatio / 100 * 0.3
    ) * 100
  );

  // Revision consistency: due items done vs total generated
  const due = ALL_TOPICS.filter((t) => state.topicProgress[t.id]?.nextRevisionAt).length;
  const doneRev = ALL_TOPICS.filter(
    (t) => state.topicProgress[t.id]?.nextRevisionAt && state.topicProgress[t.id]?.nextRevisionAt! <= todayKey()
  ).length;
  const revisionConsistency = due === 0 ? 60 : Math.round(((due - doneRev) / due) * 100);

  // Weak-topic coverage: weak topics practiced
  const weakSet = new Set(state.plan.weakTopics);
  const weakTopics = ALL_TOPICS.filter(
    (t) => weakSet.has(t.id) ||
      (state.questionResults.filter((r) => r.topicId === t.id && !r.correct).length >= 2)
  );
  const coveredWeak = weakTopics.filter((t) =>
    state.questionResults.some((r) => r.topicId === t.id && r.correct)
  ).length;
  const weakTopicCoverage = weakTopics.length === 0 ? 75 : Math.round((coveredWeak / weakTopics.length) * 100);

  const score = Math.round(
    Math.round(
      conceptStrength * 0.22 +
      practiceStrength * 0.2 +
      accuracy * 0.18 +
      speed * 0.14 +
      mockReadiness * 0.12 +
      revisionConsistency * 0.07 +
      weakTopicCoverage * 0.07
    )
  );

  // Biggest limiter
  const comps = { conceptStrength, practiceStrength, accuracy, speed, mockReadiness, revisionConsistency, coverage: all.syllabusCompletion, weakTopicCoverage };
  const min = Math.min(
    comps.conceptStrength,
    comps.practiceStrength,
    comps.accuracy,
    comps.speed,
    comps.mockReadiness,
    comps.revisionConsistency,
    comps.weakTopicCoverage
  );
  let biggestLimiter: string;
  if (min === comps.practiceStrength) biggestLimiter = "You have low practice volume relative to your target. Prioritize daily question practice over new concepts.";
  else if (min === comps.speed) biggestLimiter = "Your solving time is above the healthy target. Timed drills and speed sets should be a focus.";
  else if (min === comps.accuracy) biggestLimiter = "Accuracy is the limiting factor. Solve easier concept questions and use the Mistake Notebook before raising difficulty.";
  else if (min === comps.mockReadiness) biggestLimiter = "Mock readiness is low. Build mini/sectional mocks and PYQ practice into the week.";
  else if (min === comps.conceptStrength) biggestLimiter = "Concept coverage is behind. Learn the high-priority topics first.";
  else if (min === comps.weakTopicCoverage) biggestLimiter = "Weak topics remain unpracticed. Attack mistake-driven weak areas first.";
  else biggestLimiter = "Revision consistency is the gap. Keep the spaced-revision sessions complete.";

  return { score, components: comps, biggestLimiter };
}

export interface SectionReadiness {
  [key: string]: number;
}

export function sectionalReadiness(state: AppState): Record<SectionId, number> {
  const s: Record<SectionId, number> = { qa: 0, varc: 0, dilr: 0 };
  (Object.keys(s) as SectionId[]).forEach((sec) => {
    const m = sectionMetrics(state, sec);
    const topics = ALL_TOPICS.filter((t) => t.section === sec);
    const done = topics.filter((t) => state.topicProgress[t.id]?.status === "completed").length;
    const comp = topics.length ? (done / topics.length) * 100 : 0;
    s[sec] = Math.round(
      clamp01(m.accuracy / 100) * 45 + clamp01(m.questionsSolved / 100) * 25 + (comp / 100) * 30
    );
  });
  return s;
}