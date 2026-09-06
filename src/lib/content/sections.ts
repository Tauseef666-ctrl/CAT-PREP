import type { Section } from "../types";

export const SECTIONS: Record<string, Section> = {
  qa: {
    id: "qa",
    title: "Quantitative Ability",
    shortTitle: "QA",
    description:
      "Arithmetic, Algebra, Number System, Geometry, Mensuration and Modern Math. 22 questions in the CAT QA section — the most formula-driven and practice-intensive part.",
    weightage: "22 questions · 66 marks",
  },
  varc: {
    id: "varc",
    title: "Verbal Ability & Reading Comprehension",
    shortTitle: "VARC",
    description:
      "Reading Comprehension passages and Verbal Ability questions. 24 questions — requires daily reading habit, logic and vocabulary in context.",
    weightage: "24 questions · 72 marks",
  },
  dilr: {
    id: "dilr",
    title: "Data Interpretation & Logical Reasoning",
    shortTitle: "DILR",
    description:
      "Set-based solving: interpretation and reasoning. 20 questions in 4 sets — the section that rewards strategy and practice with timed sets.",
    weightage: "20 questions · 60 marks",
  },
};

export const SECTION_LIST: Section[] = [
  SECTIONS.qa,
  SECTIONS.varc,
  SECTIONS.dilr,
];