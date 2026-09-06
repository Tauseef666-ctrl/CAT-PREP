import type { Achievement, AppState } from "../types";
import { overallMetrics } from "./metrics";

export const ACHIEVEMENT_DEFS: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  { id: "first-10", title: "First 10", description: "Solve your first 10 questions." },
  { id: "first-100", title: "First 100", description: "Solve 100 questions across any sections." },
  { id: "q500", title: "500 Questions", description: "Cross 500 practice questions." },
  { id: "streak-3", title: "3-Day Streak", description: "Study three days in a row." },
  { id: "streak-7", title: "7-Day Streak", description: "Study seven days in a row." },
  { id: "acc-90", title: "90% Accuracy", description: "Hit 90% accuracy in a practice run." },
  { id: "first-mock", title: "First Mock", description: "Complete your first mock test." },
  { id: "dilr-set", title: "Set Solver", description: "Complete your first DILR set." },
  { id: "rc-passage", title: "RC Reader", description: "Finish your first RC passage." },
  { id: "mistake-master", title: "Mistake Master", description: "Retry and master a mistake from the notebook." },
  { id: "syllabus-25", title: "Syllabus Stride", description: "Complete 25% of the CAT syllabus." },
  { id: "syllabus-50", title: "Halfway There", description: "Complete 50% of the CAT syllabus." },
  { id: "syllabus-75", title: "Almost Done", description: "Complete 75% of the CAT syllabus." },
];

export function evaluateAchievements(state: AppState): Achievement[] {
  const all = overallMetrics(state);
  const today = new Date().toISOString().slice(0, 10);
  return ACHIEVEMENT_DEFS.map((def) => {
    let earned = !!state.achievements.find((a) => a.id === def.id)?.unlocked;
    const unlockedAt = state.achievements.find((a) => a.id === def.id)?.unlockedAt;

    if (!earned) {
      const qs = state.questionResults.length;
      switch (def.id) {
        case "first-10": earned = qs >= 10; break;
        case "first-100": earned = qs >= 100; break;
        case "q500": earned = qs >= 500; break;
        case "streak-3": earned = state.streak.current >= 3; break;
        case "streak-7": earned = state.streak.current >= 7; break;
        case "acc-90":
          earned =
            state.sessions.some(
              (sn) =>
                sn.type === "practice" &&
                sn.questions.length >= 5 &&
                sn.questions.filter((q) => q.correct).length / sn.questions.length >= 0.9
            );
          break;
        case "first-mock": earned = state.testAttempts.some((t) => t.submittedAt); break;
        case "dilr-set":
          earned = state.sessions.some(
            (sn) => sn.questions.filter((q) => q.section === "dilr").length >= 3
          );
          break;
        case "rc-passage":
          earned = state.sessions.some((sn) => sn.type === "practice" && sn.questions.some((q) => q.section === "varc"));
          break;
        case "mistake-master": earned = state.mistakes.some((m) => m.retryStatus === "mastered"); break;
        case "syllabus-25": earned = all.syllabusCompletion >= 25; break;
        case "syllabus-50": earned = all.syllabusCompletion >= 50; break;
        case "syllabus-75": earned = all.syllabusCompletion >= 75; break;
      }
    }

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      unlocked: earned,
      unlockedAt: earned ? unlockedAt ?? today : undefined,
    };
  });
}