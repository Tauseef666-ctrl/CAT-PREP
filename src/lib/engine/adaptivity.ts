import type { AppState, Difficulty, Question } from "../types";
import { QUESTION_BANK } from "../content";
import { overallMetrics } from "./metrics";

// Adaptive practice recommendation: adjust difficulty based on recent performance.
export interface AdaptivityProfile {
  recommendedDifficulty: Difficulty;
  mode:
    | "concept-rebuild"
    | "easy-drill"
    | "standard"
    | "speed-drill"
    | "challenge"
    | "fresh";
  reason: string;
}

export function adaptiveProfile(state: AppState): AdaptivityProfile {
  const recent = state.questionResults.slice(-10);
  if (recent.length === 0) {
    return {
      recommendedDifficulty: 1,
      mode: "fresh",
      reason: "No practice yet — start with Beginner/Easy questions to map your baseline.",
    };
  }

  const correct = recent.filter((r) => r.correct).length;
  const accuracy = Math.round((correct / recent.length) * 100);
  const avgTime = recent.reduce((s, r) => s + r.timeSec, 0) / recent.length;
  const maxSeen = Math.max(...recent.map((r) => r.difficulty));

  let difficulty: Difficulty = 2;
  let mode: AdaptivityProfile["mode"] = "standard";
  let reason: string;

  if (accuracy < 40) {
    difficulty = 1;
    mode = "concept-rebuild";
    reason = `Accuracy is ${accuracy}% — well below target. Rebuild the concept and solve Beginner questions before advancing.`;
  } else if (accuracy < 60) {
    difficulty = Math.max(2, maxSeen) as Difficulty;
    mode = "easy-drill";
    reason = `Accuracy is ${accuracy}%. Practice at or one step below recent difficulty, and review every explanation.`;
  } else if (accuracy >= 75 && avgTime > 75) {
    difficulty = Math.max(3, Math.min(5, maxSeen)) as Difficulty;
    mode = "speed-drill";
    reason = `Accuracy is ${accuracy}% but time per question (${Math.round(avgTime)}s) is high — run timed drills to build speed.`;
  } else if (accuracy >= 80) {
    difficulty = Math.min(5, maxSeen + 1) as Difficulty;
    if (maxSeen >= 4) {
      mode = "challenge";
      reason = `Consistent ${accuracy}% accuracy — challenge yourself with CAT-level and Challenge questions.`;
    } else {
      mode = "standard";
      reason = `Continue climbing: difficulty has been raised one step because recent accuracy is consistently strong.`;
    }
  } else {
    difficulty = maxSeen as Difficulty;
    reason = `Steady accuracy of ${accuracy}% — hold the current difficulty and tighten accuracy before moving up.`;
  }

  return { recommendedDifficulty: difficulty, mode, reason };
}

// Choose the next question given filters + adaptivity.
export function pickAdaptiveQuestion(
  state: AppState,
  filters: { section?: string; topicId?: string; difficulty?: Difficulty },
  avoidIds: string[]
): Question | undefined {
  const done = new Set(state.questionResults.map((r) => r.questionId));
  avoidIds.forEach((id) => done.add(id));

  const pool = QUESTION_BANK.filter((q) => {
    if (filters.section && q.section !== filters.section) return false;
    if (filters.topicId && q.topicId !== filters.topicId) return false;
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    if (done.has(q.id)) return false;
    return true;
  });

  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
}

export function sectionAccuracy(state: AppState, section: string): number {
  const res = state.questionResults.filter((r) => r.section === section);
  if (res.length === 0) return 0;
  return Math.round((res.filter((r) => r.correct).length / res.length) * 100);
}

export { overallMetrics };