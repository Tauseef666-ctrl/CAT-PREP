// Central domain types for CAT Command.

export type SectionId = "qa" | "varc" | "dilr";
export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6; // 1=Beginner ... 5=CAT Level, 6=Challenge
export type Priority = 1 | 2 | 3; // 1 = high, 2 = medium, 3 = low
export type TopicStatus = "not-started" | "in-progress" | "completed";
export type MistakeType =
  | "Conceptual"
  | "Calculation"
  | "Misread"
  | "Wrong approach"
  | "Time management"
  | "Guess"
  | "Silly mistake";
export type VideoType =
  | "Beginner Concept"
  | "Complete Lecture"
  | "One Shot"
  | "Revision"
  | "Strategy"
  | "Problem Solving"
  | "Mock Analysis";

export interface Example {
  title: string;
  level: "Beginner" | "Easy" | "Moderate" | "CAT-Level";
  question: string;
  solution: string[];
}

export interface Topic {
  id: string;
  chapterId: string;
  section: SectionId;
  title: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  priority: Priority;
  estimatedMinutes: number;
  prerequisites: string[];
  concept: string;
  coreRules: string[];
  formulas: string[];
  examples: Example[];
  commonMistakes: string[];
  shortcuts: string[];
  videoId?: string;
  practiceQuestionIds: string[];
  isTopicTestAvailable?: boolean;
}

export interface Chapter {
  id: string;
  section: SectionId;
  title: string;
  order: number;
  topics: Topic[];
}

export interface Section {
  id: SectionId;
  title: string;
  shortTitle: string;
  description: string;
  weightage: string;
}

export type QuestionType = "mcq" | "integer" | "set-part";

export interface Question {
  id: string;
  section: SectionId;
  topicId?: string;
  chapterId?: string;
  difficulty: Difficulty;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  set?: string; // For DILR: id of set this question belongs to
  explanation: string;
  fasterApproach?: string;
  conceptTested?: string;
  commonTrap?: string;
  isPYQ?: boolean;
  year?: number;
  source?: string;
}

export interface DILRSet {
  id: string;
  chapterId: string;
  title: string;
  statement: string;
  dataBlocks: string[];
  questions: Question[];
  hints: string[];
  fullSolution: string[];
  alternativeApproach?: string[];
  difficulty: Difficulty;
  estimatedMinutes: number;
  domain: string;
}

export interface RCPassage {
  id: string;
  title: string;
  domain:
    | "Science"
    | "Technology"
    | "Philosophy"
    | "History"
    | "Economics"
    | "Business"
    | "Psychology"
    | "Sociology"
    | "Environment"
    | "Literature";
  length: "Short" | "Medium" | "Long";
  difficulty: Difficulty;
  passage: string;
  questions: Question[];
  estimatedMinutes: number;
}

// ---- Progress ----

export interface TopicProgress {
  topicId: string;
  status: TopicStatus;
  conceptLearned: boolean;
  videoWatched: boolean;
  examplesDone: boolean;
  practiced: boolean;
  timedPracticed: boolean;
  topicTestDone: boolean;
  revisionCount: number;
  lastRevisionAt?: string;
  nextRevisionAt?: string;
  bookmarked: boolean;
}

export interface QuestionResult {
  questionId: string;
  topicId?: string;
  section: SectionId;
  correct: boolean;
  timeSec: number;
  attemptedAt: string;
  difficulty: Difficulty;
  isPYQ?: boolean;
  source?: string;
  mistakeType?: MistakeType;
  yourAnswer?: number;
  correctIndex?: number;
}

export interface SessionResult {
  sessionId: string;
  date: string;
  durationMin: number;
  type: "practice" | "learn" | "test" | "revision" | "reading" | "video";
  topicId?: string;
  questions: QuestionResult[];
  itemsCompleted: number;
}

export interface StudyDay {
  date: string; // yyyy-mm-dd
  targetMinutes: number;
  completedMinutes: number;
}

export interface StudyPlan {
  dailyMinutes: number;
  daysPerWeek: number[];
  targetExamYear: number;
  prepLevel: "beginner" | "intermediate" | "advanced";
  focusMode: "concept" | "practice" | "balanced";
  strongSections: SectionId[];
  weakSections: SectionId[];
  language: "english" | "hinglish" | "hindi";
  diplomaLoad: 1 | 2 | 3; // 1 low ... 3 high
  holidays: string[];
  weakTopics: string[];
  strongTopics: string[];
}

export interface TestDefinition {
  id: string;
  title: string;
  type: "full" | "sectional" | "mini" | "chapter" | "topic" | "speed";
  section?: SectionId;
  durationMin: number;
  questionIds: string[];
  createdAt: string;
}

export interface TestAttempt {
  attemptId: string;
  testId: string;
  startedAt: string;
  submittedAt?: string;
  timeUsedSec: number;
  answers: Record<string, number>; // questionId -> selected index (-1 = skipped)
  answersRecord: QuestionResult[];
  score: number;
  maxScore: number;
  correct: number;
  incorrect: number;
  skipped: number;
  sectionScores: Record<SectionId, { correct: number; incorrect: number; skipped: number; timeSec: number }>;
  topicScores: Record<string, { correct: number; total: number; timeSec: number }>;
  difficultyScores: Record<number, { correct: number; total: number; timeSec: number }>;
  flagged: string[];
  type: TestDefinition["type"];
  title: string;
}

export interface MistakeEntry {
  id: string;
  questionId: string;
  topicId?: string;
  date: string;
  mistakeType: MistakeType;
  userReasoning?: string;
  correctMethod: string;
  retryStatus: "pending" | "retried" | "mastered";
  yourAnswer?: number;
  correctIndex?: number;
}

export interface ChromeConfig {
  mode: "skip" | "30-45" | "45-60" | "60-90" | "2-to-4" | "4-plus" | "custom";
  minutes: number;
}

export interface RevisionItem {
  topicId?: string;
  questionId?: string;
  dueDate: string;
  intervalDays: number;
  lastReviewed?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate?: string;
}

export interface UserProfile {
  name: string;
  course: string;
  board: string;
  targetExamYear: number;
  createdOn: string;
  onboarded: boolean;
}

export interface ReadingItem {
  id: string;
  title: string;
  source: string;
  url: string;
  readingMinutes: number;
  domain: SectionId | "general";
  category: string;
  completed: boolean;
  comprehension: { question: string; answer: string }[];
}

export interface NoteEntry {
  id: string;
  topicId?: string;
  title: string;
  content: string;
  type: "concept" | "formula" | "shortcut" | "mistake" | "custom";
  bookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoResource {
  id: string;
  topicId?: string;
  chapterId?: string;
  title: string;
  channel: string;
  duration: string;
  language: "English" | "Hinglish" | "Hindi";
  difficulty: Difficulty;
  type: VideoType;
  youtubeId?: string;
  url?: string;
  verified: boolean;
  label?: string;
  whyRecommended: string;
}

export interface FormulaEntry {
  id: string;
  section: SectionId;
  category: string;
  topicId?: string;
  name: string;
  formula: string;
  example: string;
}

export interface ResourceEntry {
  id: string;
  name: string;
  type: "book" | "pdf" | "website" | "article" | "course";
  category: string;
  source: string;
  url?: string;
  free: boolean;
  verified: boolean;
  note: string;
}

export interface AppState {
  profile: UserProfile;
  plan: StudyPlan;
  topicProgress: Record<string, TopicProgress>;
  questionResults: QuestionResult[];
  sessions: SessionResult[];
  studyDays: StudyDay[];
  testAttempts: TestAttempt[];
  mistakes: MistakeEntry[];
  revisions: RevisionItem[];
  achievements: Achievement[];
  streak: StreakData;
  bookmarks: {
    topics: string[];
    questions: string[];
    notes: string[];
    videos: string[];
    pyqs: string[];
    resources: string[];
    formulas: string[];
  };
  readingItems: ReadingItem[];
  notes: NoteEntry[];
  dailyChallenges: Record<string, { solved: boolean; score: number; date: string }>;
  currentTestAttempt?: TestAttempt;
  xp: number;
  lastActivityAt?: string;
}