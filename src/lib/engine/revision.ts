import type { AppState } from "../types";

// Spaced repetition schedule: Day 0 → 1 → 3 → 7 → 14 → 30.
// Intervals shrink/grow based on performance on revision sessions.
export const REVISION_INTERVALS = [1, 3, 7, 14, 30];

export function scheduleFromRevisionCount(revisionCount: number): number {
  return REVISION_INTERVALS[Math.min(revisionCount, REVISION_INTERVALS.length - 1)];
}

export function dueDateFromCount(revisionCount: number, from = new Date()): string {
  const days = scheduleFromRevisionCount(revisionCount);
  const d = new Date(from);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysUntil(date: string): number {
  const now = new Date();
  const target = new Date(date + "T00:00:00");
  return Math.round((target.getTime() - now.getTime()) / 86400000);
}

export function nextRevisionForRevision(
  state: AppState,
  topicId: string,
  performanceGood: boolean
): { nextDate: string; interval: number } {
  const current = state.topicProgress[topicId]?.revisionCount ?? 0;
  // Good performance → advance; weak → repeat the same interval.
  const interval = performanceGood
    ? scheduleFromRevisionCount(current)
    : Math.max(1, REVISION_INTERVALS[Math.max(0, current - 1)] ?? 1);
  const next = new Date();
  next.setDate(next.getDate() + interval);
  return { nextDate: next.toISOString().slice(0, 10), interval };
}

export interface RevisionStatus {
  totalDue: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
}

export function revisionStatus(state: AppState, today = new Date().toISOString().slice(0, 10)): RevisionStatus {
  let dueToday = 0;
  let overdue = 0;
  let upcoming = 0;
  const scheduled = new Set<string>();
  for (const t of Object.values(state.topicProgress)) {
    if (!t.nextRevisionAt) continue;
    scheduled.add(t.topicId);
    const diff = daysUntil(t.nextRevisionAt);
    if (diff === 0) dueToday++;
    else if (diff < 0) overdue++;
    else upcoming++;
  }
  return { totalDue: scheduled.size, overdue, dueToday, upcoming };
}