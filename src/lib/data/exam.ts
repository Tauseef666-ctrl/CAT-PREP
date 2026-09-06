import type { SectionId } from "../types";

/**
 * CAT exam-pattern configuration.
 *
 * NOTE: The CAT exam pattern (section count, question counts, timing,
 * marking scheme) is officially decided per slot by the conducting IIM
 * and has varied across years. Do NOT hard-code `questionCount` or
 * `marks` anywhere else — read them from this config, and keep this file
 * updated whenever official CAT authorities publish changes.
 *
 * Source of truth: official CAT website (iimcat.ac.in) notifications and
 * the official admission brochures. Figures below are historical/latest
 * known values and MUST be re-verified before display as "current".
 */

export interface ExamSectionConfig {
  id: SectionId;
  name: string;
  short: "VARC" | "DILR" | "QA";
  slotTimeMin?: number;
  slotQuestions?: number;
  sectionMarks: number[];
  description: string;
  officialNote: string;
}

export interface ExamPattern {
  totalSections: number;
  patternSummary: string;
  sections: ExamSectionConfig[];
  lastVerified: string;
  configurable: boolean;
}

export const EXAM_PATTERN: ExamPattern = {
  totalSections: 3,
  patternSummary:
    "CAT is a computer-based test with three sections — VARC, DILR, QA. Timings, question counts and mark values (including per-correct/per-incorrect and TITA questions) vary by slot and year; always cross-check the current year's official brochure.",
  lastVerified: "2026-09",
  configurable: true,
  sections: [
    {
      id: "qa",
      name: "Quantitative Ability",
      short: "QA",
      slotTimeMin: 40,
      slotQuestions: 22,
      sectionMarks: [3, -1, 0],
      description: "Arithmetic, Algebra, Number System, Geometry and Modern Mathematics.",
      officialNote: "QA slot timings/questions in the last released brochure. Verify per year.",
    },
    {
      id: "varc",
      name: "Verbal Ability & Reading Comprehension",
      short: "VARC",
      slotTimeMin: 40,
      slotQuestions: 24,
      sectionMarks: [3, -1, 0],
      description: "Reading Comprehension passages and Verbal Ability questions.",
      officialNote: "VARC slot timings/questions in the last released brochure. Verify per year.",
    },
    {
      id: "dilr",
      name: "Data Interpretation & Logical Reasoning",
      short: "DILR",
      slotTimeMin: 40,
      slotQuestions: 20,
      sectionMarks: [3, -1, 0],
      description: "Data Interpretation charts and Logical Reasoning set-based questions.",
      officialNote: "Each candidate receives one question set per section; set selection is randomized.",
    },
  ],
};

/** Human label for target-percentile presets used in onboarding/planner. */
export const PERCENTILE_TARGETS = [
  { label: "Just understand CAT", percentile: undefined },
  { label: "80+ percentile", percentile: 80 },
  { label: "90+ percentile", percentile: 90 },
  { label: "95+ percentile", percentile: 95 },
  { label: "98+ percentile", percentile: 98 },
  { label: "99+ percentile", percentile: 99 },
  { label: "99.5+ percentile", percentile: 99.5 },
] as const;

export function percentileLabel(p?: number): string {
  if (p == null) return "Aiming to understand CAT";
  return `${p >= 99.5 ? "99.5+" : `${p}+`} percentile`;
}