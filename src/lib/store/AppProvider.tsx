"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AppState,
  MistakeEntry,
  MistakeType,
  QuestionResult,
  StudyPlan,
  TestAttempt,
  UserProfile,
} from "../types";
import { TOPIC_MAP } from "../content";
import { dueDateFromCount, nextRevisionForRevision } from "../engine/revision";
import { evaluateAchievements } from "../engine/achievements";

const STORAGE_KEY = "catcommand:state:v1";

export function defaultState(userName = "Aditya"): AppState {
  const now = new Date().toISOString();
  return {
    profile: {
      name: userName,
      course: "Diploma Mechanical Engineering (Production)",
      board: "BTEUP",
      targetExamYear: new Date().getFullYear() + 1,
      createdOn: now,
      onboarded: false,
    },
    plan: {
      dailyMinutes: 60,
      daysPerWeek: [1, 2, 3, 4, 5, 6],
      targetExamYear: new Date().getFullYear() + 1,
      prepLevel: "beginner",
      focusMode: "balanced",
      strongSections: [],
      weakSections: [],
      language: "hinglish",
      diplomaLoad: 2,
      holidays: [],
      weakTopics: [],
      strongTopics: [],
    },
    topicProgress: {},
    questionResults: [],
    sessions: [],
    studyDays: [],
    testAttempts: [],
    mistakes: [],
    revisions: [],
    achievements: [],
    streak: { current: 0, longest: 0 },
    bookmarks: { topics: [], questions: [], notes: [], videos: [], pyqs: [], resources: [], formulas: [] },
    readingItems: [],
    notes: [],
    dailyChallenges: {},
    xp: 0,
  };
}

interface StoreContextValue {
  state: AppState;
  update: (patch: (s: AppState) => AppState) => void;
  // Convenience actions
  onBoard: (profile: Partial<UserProfile>, plan: StudyPlan) => void;
  updatePlan: (plan: Partial<StudyPlan>) => void;
  setConceptLearned: (topicId: string) => void;
  setVideoWatched: (topicId: string) => void;
  setExamplesDone: (topicId: string) => void;
  completeTopic: (topicId: string) => void;
  markTopicInProgress: (topicId: string) => void;
  recordProjectEntry: (topicId: string) => void;
  recordAnswer: (result: QuestionResult) => void;
  recordSession: (
    session: { type: string; topicId?: string; durationMin: number; itemsCompleted: number },
    results?: QuestionResult[]
  ) => void;
  recordMistake: (entry: Omit<MistakeEntry, "id" | "date" | "retryStatus">) => void;
  updateMistakeRetry: (id: string, status: MistakeEntry["retryStatus"]) => void;
  recordRevision: (topicId: string, performanceGood: boolean) => void;
  recordTestAttempt: (attempt: TestAttempt) => void;
  toggleBookmark: (
    kind: keyof AppState["bookmarks"],
    id: string
  ) => void;
  toggleNoteBookmark: (noteId: string) => void;
  addNote: (note: { topicId?: string; title: string; content: string; type: string }) => void;
  toggleReadingCompleted: (id: string) => void;
  completeDailyChallenge: (score: number) => void;
  addStudyTime: (minutes: number) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadState(): AppState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as AppState;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full / unavailable — fail silently
    }
  }, [state]);

  const update = useCallback((patch: (s: AppState) => AppState) => {
    setState((prev) => patch(prev));
  }, []);

  const onBoard = useCallback((profile: Partial<UserProfile>, plan: StudyPlan) => {
    setState((prev) => ({
      ...prev,
      profile: {
        name: profile.name || prev.profile.name,
        course: profile.course || prev.profile.course,
        board: profile.board || prev.profile.board,
        targetExamYear: profile.targetExamYear || plan.targetExamYear,
        createdOn: prev.profile.createdOn,
        onboarded: true,
      },
      plan,
    }));
  }, []);

  const updatePlan = useCallback((p: Partial<StudyPlan>) => {
    setState((prev) => ({ ...prev, plan: { ...prev.plan, ...p } }));
  }, []);

  const setConceptLearned = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      const nextStatus = cur?.status === "not-started" || !cur ? "in-progress" : cur.status;
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: nextStatus,
            conceptLearned: true,
            videoWatched: cur?.videoWatched ?? false,
            examplesDone: cur?.examplesDone ?? false,
            practiced: cur?.practiced ?? false,
            timedPracticed: cur?.timedPracticed ?? false,
            topicTestDone: cur?.topicTestDone ?? false,
            revisionCount: cur?.revisionCount ?? 0,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const setVideoWatched = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: cur?.status ?? "in-progress",
            conceptLearned: cur?.conceptLearned ?? false,
            videoWatched: true,
            examplesDone: cur?.examplesDone ?? false,
            practiced: cur?.practiced ?? false,
            timedPracticed: cur?.timedPracticed ?? false,
            topicTestDone: cur?.topicTestDone ?? false,
            revisionCount: cur?.revisionCount ?? 0,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const setExamplesDone = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: "in-progress",
            conceptLearned: cur?.conceptLearned ?? false,
            videoWatched: cur?.videoWatched ?? false,
            examplesDone: true,
            practiced: cur?.practiced ?? false,
            timedPracticed: cur?.timedPracticed ?? false,
            topicTestDone: cur?.topicTestDone ?? false,
            revisionCount: cur?.revisionCount ?? 0,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const markTopicInProgress = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: "in-progress",
            conceptLearned: cur?.conceptLearned ?? false,
            videoWatched: cur?.videoWatched ?? false,
            examplesDone: cur?.examplesDone ?? false,
            practiced: cur?.practiced ?? false,
            timedPracticed: cur?.timedPracticed ?? false,
            topicTestDone: cur?.topicTestDone ?? false,
            revisionCount: cur?.revisionCount ?? 0,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const completeTopic = useCallback((topicId: string) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: "completed",
            conceptLearned: true,
            videoWatched: cur?.videoWatched ?? true,
            examplesDone: cur?.examplesDone ?? true,
            practiced: cur?.practiced ?? true,
            timedPracticed: cur?.timedPracticed ?? true,
            topicTestDone: cur?.topicTestDone ?? true,
            revisionCount: cur?.revisionCount ?? 0,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const recordProjectEntry = useCallback((topicId: string) => {
    setState((prev) => ({
      ...prev,
      topicProgress: {
        ...prev.topicProgress,
        [topicId]: {
          topicId,
          status: "completed",
          conceptLearned: true,
          videoWatched: true,
          examplesDone: true,
          practiced: true,
          timedPracticed: true,
          topicTestDone: true,
          revisionCount: 0,
          bookmarked: prev.topicProgress[topicId]?.bookmarked ?? false,
        },
      },
    }));
  }, []);

  const addStudyTime = useCallback((minutes: number) => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      const existing = prev.studyDays.find((d) => d.date === today);
      const studyDays = existing
        ? prev.studyDays.map((d) =>
            d.date === today ? { ...d, completedMinutes: d.completedMinutes + minutes } : d
          )
        : [
            ...prev.studyDays,
            {
              date: today,
              targetMinutes: prev.plan.dailyMinutes,
              completedMinutes: minutes,
            },
          ];
      // streak update
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const didYesterday = studyDays.some((d) => d.date === yesterday && d.completedMinutes > 0);
      const current = (didYesterday ? prev.streak.current : 0) + 1;
      return {
        ...prev,
        studyDays,
        streak: { current, longest: Math.max(prev.streak.longest, current) },
        lastActivityAt: new Date().toISOString(),
      };
    });
  }, []);

  const recordAnswer = useCallback((result: QuestionResult) => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const existing = prev.studyDays.find((d) => d.date === today);
      const studyDays = existing
        ? prev.studyDays.map((d) => (d.date === today ? d : d))
        : prev.studyDays;
      return {
        ...prev,
        questionResults: [...prev.questionResults, result],
        xp: prev.xp + (result.correct ? 10 : 2),
        lastActivityAt: new Date().toISOString(),
        studyDays,
      };
    });
  }, []);

  const recordSession = useCallback(
    (session: { type: string; topicId?: string; durationMin: number; itemsCompleted: number }, results?: QuestionResult[]) => {
      const now = new Date().toISOString();
      const today = now.slice(0, 10);
      setState((prev) => {
        const cur = session.topicId ? prev.topicProgress[session.topicId] : undefined;
        let topicProgress = prev.topicProgress;
        if (session.topicId) {
          const practiced = cur?.practiced ?? false;
          topicProgress = {
            ...prev.topicProgress,
            [session.topicId]: {
              topicId: session.topicId,
              status: "in-progress",
              conceptLearned: cur?.conceptLearned ?? false,
              videoWatched: cur?.videoWatched ?? false,
              examplesDone: cur?.examplesDone ?? false,
              practiced: practiced || session.type === "practice" || session.type === "learn",
              timedPracticed: cur?.timedPracticed ?? false,
              topicTestDone: cur?.topicTestDone ?? false,
              revisionCount: cur?.revisionCount ?? 0,
              bookmarked: cur?.bookmarked ?? false,
            },
          };
        }
        // add study time
        const existing = prev.studyDays.find((d) => d.date === today);
        const studyDays = existing
          ? prev.studyDays.map((d) =>
              d.date === today ? { ...d, completedMinutes: d.completedMinutes + session.durationMin } : d
            )
          : [
              ...prev.studyDays,
              { date: today, targetMinutes: prev.plan.dailyMinutes, completedMinutes: session.durationMin },
            ];
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const didYesterday = studyDays.some((d) => d.date === yesterday && d.completedMinutes > 0);
        const current = (didYesterday ? prev.streak.current : 0) + 1;
        return {
          ...prev,
          sessions: [
            ...prev.sessions,
            {
              sessionId: `s-${Date.now()}`,
              date: today,
              durationMin: session.durationMin,
              type: session.type as never,
              topicId: session.topicId,
              questions: results ?? [],
              itemsCompleted: session.itemsCompleted,
            },
          ],
          questionResults: results ? [...prev.questionResults, ...results] : prev.questionResults,
          topicProgress,
          studyDays,
          xp: prev.xp + (results ? results.filter((r) => r.correct).length * 10 : 0) + session.itemsCompleted * 2,
          streak: { current, longest: Math.max(prev.streak.longest, current) },
          lastActivityAt: now,
        };
      });
    },
    []
  );

  const recordMistake = useCallback((entry: Omit<MistakeEntry, "id" | "date" | "retryStatus">) => {
    setState((prev) => {
      // no duplicates for the same question
      if (prev.mistakes.some((m) => m.questionId === entry.questionId)) return prev;
      const mistake: MistakeEntry = {
        ...entry,
        id: `m-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        retryStatus: "pending",
      };
      return { ...prev, mistakes: [mistake, ...prev.mistakes] };
    });
  }, []);

  const updateMistakeRetry = useCallback((id: string, status: MistakeEntry["retryStatus"]) => {
    setState((prev) => ({
      ...prev,
      mistakes: prev.mistakes.map((m) => (m.id === id ? { ...m, retryStatus: status } : m)),
    }));
  }, []);

  const recordRevision = useCallback((topicId: string, performanceGood: boolean) => {
    setState((prev) => {
      const cur = prev.topicProgress[topicId];
      const revCount = (cur?.revisionCount ?? 0) + 1;
      const { nextDate } = nextRevisionForRevision(
        { ...prev, topicProgress: { ...prev.topicProgress, [topicId]: { ...cur!, revisionCount: revCount - 1 } } } as never,
        topicId,
        performanceGood
      );
      return {
        ...prev,
        topicProgress: {
          ...prev.topicProgress,
          [topicId]: {
            topicId,
            status: cur?.status ?? "completed",
            conceptLearned: cur?.conceptLearned ?? true,
            videoWatched: cur?.videoWatched ?? true,
            examplesDone: cur?.examplesDone ?? true,
            practiced: cur?.practiced ?? true,
            timedPracticed: cur?.timedPracticed ?? true,
            topicTestDone: cur?.topicTestDone ?? true,
            revisionCount: revCount,
            lastRevisionAt: new Date().toISOString().slice(0, 10),
            nextRevisionAt: nextDate,
            bookmarked: cur?.bookmarked ?? false,
          },
        },
      };
    });
  }, []);

  const recordTestAttempt = useCallback((attempt: TestAttempt) => {
    setState((prev) => ({
      ...prev,
      testAttempts: [attempt, ...prev.testAttempts].slice(0, 100),
      xp: prev.xp + 50,
    }));
  }, []);

  const toggleBookmark = useCallback((kind: keyof AppState["bookmarks"], id: string) => {
    setState((prev) => {
      const list = prev.bookmarks[kind];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      return { ...prev, bookmarks: { ...prev.bookmarks, [kind]: next } };
    });
  }, []);

  const toggleNoteBookmark = useCallback((noteId: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, bookmarked: !n.bookmarked } : n)),
    }));
  }, []);

  const addNote = useCallback((note: { topicId?: string; title: string; content: string; type: string }) => {
    setState((prev) => ({
      ...prev,
      notes: [
        {
          id: `n-${Date.now()}`,
          topicId: note.topicId,
          title: note.title,
          content: note.content,
          type: note.type as never,
          bookmarked: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...prev.notes,
      ],
    }));
  }, []);

  const toggleReadingCompleted = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      readingItems: prev.readingItems.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)),
    }));
  }, []);

  const completeDailyChallenge = useCallback((score: number) => {
    setState((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      return { ...prev, dailyChallenges: { ...prev.dailyChallenges, [today]: { solved: true, score, date: today } } };
    });
  }, []);

  const resetAll = useCallback(() => {
    // keep onboarding profile name
    setState((prev) => ({ ...defaultState(prev.profile.name), profile: { ...defaultState(prev.profile.name).profile } }));
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      update,
      onBoard,
      updatePlan,
      setConceptLearned,
      setVideoWatched,
      setExamplesDone,
      completeTopic,
      markTopicInProgress,
      recordProjectEntry,
      recordAnswer,
      recordSession,
      recordMistake,
      updateMistakeRetry,
      recordRevision,
      recordTestAttempt,
      toggleBookmark,
      toggleNoteBookmark,
      addNote,
      toggleReadingCompleted,
      completeDailyChallenge,
      addStudyTime,
      resetAll,
    }),
    [
      state,
      update,
      onBoard,
      updatePlan,
      setConceptLearned,
      setVideoWatched,
      setExamplesDone,
      completeTopic,
      markTopicInProgress,
      recordProjectEntry,
      recordAnswer,
      recordSession,
      recordMistake,
      updateMistakeRetry,
      recordRevision,
      recordTestAttempt,
      toggleBookmark,
      toggleNoteBookmark,
      addNote,
      toggleReadingCompleted,
      completeDailyChallenge,
      addStudyTime,
      resetAll,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within AppProvider");
  return ctx;
}

// Re-export for planner use
export { TOPIC_MAP as REVISION_TOPICS, dueDateFromCount };