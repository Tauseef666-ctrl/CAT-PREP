import type { AppState, Question, QuestionResult, SectionId, Topic } from "../types";
import { ALL_TOPICS, QUESTION_BANK } from "../content";

export interface TopicStrength {
  topic: Topic;
  accuracy: number; // 0-100, null-safe
  attempts: number;
  correct: number;
  avgTimeSec: number;
  weak: boolean;
  strength: number; // 0-100 composite
  solvedCount: number;
}

export const SECTION_NAMES: Record<SectionId, string> = {
  qa: "Quantitative Ability",
  varc: "VARC",
  dilr: "DILR",
};

export const todayKey = (): string => new Date().toISOString().slice(0, 10);

export const QUESTION_OF = (id: string): Question | undefined =>
  QUESTION_BANK.find((q) => q.id === id);

// Results that carry a topic
const topicResults = (state: AppState, topicId: string): QuestionResult[] =>
  state.questionResults.filter((r) => r.topicId === topicId);

export function topicStrength(state: AppState, topic: Topic): TopicStrength {
  const res = topicResults(state, topic.id);
  const correct = res.filter((r) => r.correct).length;
  const attempts = res.length;
  const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
  const avgTimeSec =
    attempts === 0 ? 0 : Math.round(res.reduce((s, r) => s + r.timeSec, 0) / attempts);
  // strength blends accuracy and practice coverage (capped)
  const coverage = Math.min(1, attempts / 5);
  const strength = Math.round(accuracy * 0.75 + coverage * 100 * 0.25);
  return {
    topic,
    accuracy,
    attempts,
    correct,
    avgTimeSec,
    weak: attempts >= 2 && accuracy < 60,
    strength,
    solvedCount: attempts,
  };
}

export interface SectionMetrics {
  questionsSolved: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  avgTimeSec: number;
  pyqSolved: number;
}

export function sectionMetrics(state: AppState, section?: SectionId): SectionMetrics {
  const res = section
    ? state.questionResults.filter((r) => r.section === section)
    : state.questionResults;
  const correct = res.filter((r) => r.correct).length;
  const attempts = res.length;
  return {
    questionsSolved: attempts,
    correct,
    incorrect: attempts - correct,
    accuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    avgTimeSec:
      attempts === 0 ? 0 : Math.round(res.reduce((s, r) => s + r.timeSec, 0) / attempts),
    pyqSolved: res.filter((r) => r.isPYQ).length,
  };
}

export function overallMetrics(state: AppState) {
  const all = sectionMetrics(state);
  const completedTopics = ALL_TOPICS.filter((t) => state.topicProgress[t.id]?.status === "completed").length;
  const inProgress = ALL_TOPICS.filter((t) => state.topicProgress[t.id]?.status === "in-progress").length;
  const totalTopics = ALL_TOPICS.length;
  const studyMinutes = state.studyDays.reduce((s, d) => s + d.completedMinutes, 0);
  const sessionsCount = state.sessions.length;
  const testsTaken = state.testAttempts.filter((t) => t.submittedAt).length;
  return {
    ...all,
    totalTopics,
    completedTopics,
    inProgressTopics: inProgress,
    syllabusCompletion: Math.round((completedTopics / totalTopics) * 100),
    studyMinutes,
    sessionsCount,
    testsTaken,
    streak: state.streak.current,
    xp: state.xp,
    mistakes: state.mistakes.length,
    questionsSolved: all.questionsSolved,
  };
}

// Weak topics: topics where accuracy is low OR state flags them weak OR priority high & untouched
export function weakTopicAnalysis(state: AppState, limit = 6): TopicStrength[] {
  return ALL_TOPICS.map((t) => topicStrength(state, t))
    .filter((s) => s.attempts >= 2 && s.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function strongTopicAnalysis(state: AppState, limit = 6): TopicStrength[] {
  return ALL_TOPICS.map((t) => topicStrength(state, t))
    .filter((s) => s.attempts >= 2 && s.accuracy >= 75)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, limit);
}

export function isTopicDueForRevision(
  state: AppState,
  topicId: string,
  today = todayKey()
): boolean {
  const next = state.topicProgress[topicId]?.nextRevisionAt;
  if (!next) return false;
  return next <= today;
}

export function topicsDueForRevision(state: AppState, limit = 8): Topic[] {
  return ALL_TOPICS.filter(
    (t) => state.topicProgress[t.id]?.nextRevisionAt && isTopicDueForRevision(state, t.id)
  ).slice(0, limit);
}

// Syllabus completion per section
export function sectionCompletion(state: AppState, section: SectionId): number {
  const topics = ALL_TOPICS.filter((t) => t.section === section);
  const done = topics.filter((t) => state.topicProgress[t.id]?.status === "completed").length;
  return topics.length === 0 ? 0 : Math.round((done / topics.length) * 100);
}

export function difficultyLabel(d: number): string {
  return ["", "Beginner", "Easy", "Medium", "Hard", "CAT Level", "Challenge"][d] ?? "Medium";
}