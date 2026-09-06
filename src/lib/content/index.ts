import type { Chapter, Section } from "../types";
import { QA_CHAPTERS } from "./qa";
import { VARC_CHAPTERS } from "./varc";
import { DILR_CHAPTERS } from "./dilr";
import { QUESTION_BANK, QA_QUESTIONS, VARC_QUESTIONS, DILR_QUESTIONS } from "./questions";
import { VIDEOS } from "./videos";
import { FORMULAS } from "./formulas";
import { RESOURCES, RC_PASSAGES, DILR_SETS, READING_ITEMS, SEED_NOTES } from "./resources";
import { SECTIONS, SECTION_LIST } from "./sections";

export const CHAPTERS: Chapter[] = [...QA_CHAPTERS, ...VARC_CHAPTERS, ...DILR_CHAPTERS];

export const ALL_TOPICS = CHAPTERS.flatMap((c) => c.topics);

export const CHAPTER_MAP: Record<string, Chapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.id, c])
);

export const TOPIC_MAP: Record<string, (typeof ALL_TOPICS)[number]> = Object.fromEntries(
  ALL_TOPICS.map((t) => [t.id, t])
);

export const SECTION_MAP: Record<string, Section> = { ...SECTIONS };

export {
  QA_CHAPTERS,
  VARC_CHAPTERS,
  DILR_CHAPTERS,
  QUESTION_BANK,
  QA_QUESTIONS,
  VARC_QUESTIONS,
  DILR_QUESTIONS,
  VIDEOS,
  FORMULAS,
  RESOURCES,
  RC_PASSAGES,
  DILR_SETS,
  READING_ITEMS,
  SEED_NOTES,
  SECTIONS,
  SECTION_LIST,
};

export const QUESTION_MAP: Record<string, (typeof QUESTION_BANK)[number]> =
  Object.fromEntries(QUESTION_BANK.map((q) => [q.id, q]));

export const VIDEO_MAP: Record<string, (typeof VIDEOS)[number]> = Object.fromEntries(
  VIDEOS.map((v) => [v.id, v])
);

export const DILR_SET_MAP: Record<string, (typeof DILR_SETS)[number]> = Object.fromEntries(
  DILR_SETS.map((s) => [s.id, s])
);

// Fast lookup: topicId -> questions
export const QUESTIONS_BY_TOPIC: Record<string, (typeof QUESTION_BANK)[number][]> =
  (() => {
    const map: Record<string, (typeof QUESTION_BANK)[number][]> = {};
    for (const q of QUESTION_BANK) {
      if (!q.topicId) continue;
      (map[q.topicId] ??= []).push(q);
    }
    return map;
  })();

// Fast lookup: topicId -> RC passages (derived from question topic tags)
export const RC_BY_TOPIC: Record<string, (typeof RC_PASSAGES)[number][]> = (() => {
  const map: Record<string, (typeof RC_PASSAGES)[number][]> = {};
  for (const r of RC_PASSAGES) {
    for (const q of r.questions) {
      if (q.topicId) (map[q.topicId] ??= []).push(r);
    }
  }
  return map;
})();

// Fast lookup: topicId -> DILR sets (derived from question topic tags)
export const DILR_BY_TOPIC: Record<string, (typeof DILR_SETS)[number][]> = (() => {
  const map: Record<string, (typeof DILR_SETS)[number][]> = {};
  for (const s of DILR_SETS) {
    for (const q of s.questions) {
      if (q.topicId) (map[q.topicId] ??= []).push(s);
    }
  }
  return map;
})();

// Fast lookup: topicId -> verified PYQ-tagged questions in the bank
export const PYQ_BY_TOPIC: Record<string, (typeof QUESTION_BANK)[number][]> = (() => {
  const map: Record<string, (typeof QUESTION_BANK)[number][]> = {};
  for (const q of QUESTION_BANK) {
    if (q.isPYQ && q.topicId) (map[q.topicId] ??= []).push(q);
  }
  return map;
})();

// Fast lookup: section -> questions for practice filters
export const SECTION_FILTER_OPTIONS = SECTIONS;