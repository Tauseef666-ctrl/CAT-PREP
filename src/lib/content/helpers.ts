import type { Difficulty, Example, Priority, Topic } from "../types";

export interface TopicSeed {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  priority: Priority;
  estimatedMinutes: number;
  prerequisites?: string[];
  concept: string;
  coreRules?: string[];
  formulas?: string[];
  examples?: Example[];
  commonMistakes?: string[];
  shortcuts?: string[];
  videoId?: string;
  practiceQuestionIds?: string[];
}

export function makeChapter(
  id: string,
  section: "qa" | "varc" | "dilr",
  title: string,
  order: number,
  seeds: TopicSeed[]
): { id: string; section: "qa" | "varc" | "dilr"; title: string; order: number; topics: Topic[] } {
  return {
    id,
    section,
    title,
    order,
    topics: seeds.map((s, i) => ({
      id: s.id,
      chapterId: id,
      section,
      title: s.title,
      description: s.description,
      difficulty: s.difficulty,
      priority: s.priority,
      estimatedMinutes: s.estimatedMinutes,
      prerequisites: s.prerequisites ?? [],
      concept: s.concept,
      coreRules: s.coreRules ?? [],
      formulas: s.formulas ?? [],
      examples: s.examples ?? [],
      commonMistakes: s.commonMistakes ?? [],
      shortcuts: s.shortcuts ?? [],
      videoId: s.videoId,
      practiceQuestionIds: s.practiceQuestionIds ?? [],
      isTopicTestAvailable: true,
      order: i + 1,
    })) as Topic[],
  };
}