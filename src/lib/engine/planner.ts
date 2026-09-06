import type { AppState, SectionId, Topic } from "../types";
import { ALL_TOPICS, TOPIC_MAP, QUESTIONS_BY_TOPIC, RC_PASSAGES, DILR_SETS } from "../content";
import { topicStrength, todayKey, difficultyLabel } from "./metrics";

export type PlanItemType =
  | "learn"
  | "video"
  | "practice"
  | "revision"
  | "dilr-set"
  | "rc"
  | "challenge"
  | "mistake-rev"
  | "speed";

export interface PlanItem {
  kind: PlanItemType;
  title: string;
  subtitle: string;
  topicId?: string;
  section: SectionId;
  durationMin: number;
  reason: string;
  difficulty: number;
}

export interface DailyPlan {
  availableMinutes: number;
  items: PlanItem[];
  rationale: string[];
  totalMinutes: number;
}

interface Candidate {
  topic: Topic;
  score: number;
}

function conceptLearned(s: AppState, t: Topic): boolean {
  const p = s.topicProgress[t.id];
  return !!p?.conceptLearned;
}

function notStarted(s: AppState, t: Topic): boolean {
  return !s.topicProgress[t.id] || s.topicProgress[t.id]!.status === "not-started";
}

function inProgress(s: AppState, t: Topic): boolean {
  return s.topicProgress[t.id]?.status === "in-progress";
}

// Pre-requisite readiness: all pre-reqs at least started
function prereqsReady(s: AppState, t: Topic): boolean {
  return t.prerequisites.every((p) => {
    const st = s.topicProgress[p];
    return st && st.status !== "not-started";
  });
}

// Score the next-best topic to learn/study
function bestTopics(state: AppState, limit = 8): Candidate[] {
  const lastDay = todayKey();
  const recentTopics = new Set(
    state.sessions
      .filter((sn) => sn.date === lastDay)
      .flatMap((sn) => (sn.topicId ? [sn.topicId] : []))
  );

  const cands: Candidate[] = ALL_TOPICS.map((t) => {
    const p = state.topicProgress[t.id];
    let score = 0;
    const strength = topicStrength(state, t);

    // Priority: high priority topics are the backbone of the plan
    score += (4 - t.priority) * 10;

    // untouched high priority first
    if (notStarted(state, t)) score += 12;
    else if (inProgress(state, t)) score += 8;

    // weak topic (low accuracy, attempted) boosts urgency
    if (strength.weak) score += 18;
    else if (strength.attempts >= 3 && strength.accuracy < 72) score += 10;

    // recent learning gives slight bump to continue
    if (recentTopics.has(t.id) && inProgress(state, t)) score += 6;

    // revision due
    if (p?.nextRevisionAt && p.nextRevisionAt <= lastDay) score += 25;

    // don't push ahead of unreached prereqs
    if (!prereqsReady(state, t)) score -= 20;

    // already mastered & revised
    if (p?.status === "completed" && p.revisionCount >= 3) score -= 30;

    return { topic: t, score };
  });
  return cands.sort((a, b) => b.score - a.score).slice(0, limit);
}

function sectionOfNextLearned(state: AppState): SectionId {
  // pick the section needing the most love
  const score: Record<SectionId, number> = { qa: 0, varc: 0, dilr: 0 };
  ALL_TOPICS.forEach((t) => {
    const p = state.topicProgress[t.id];
    if (!p || p.status === "not-started") score[t.section] += 1;
  });
  const sorted = (Object.keys(score) as SectionId[]).sort((a, b) => score[b] - score[a]);
  return sorted[0];
}

export function buildDailyPlan(state: AppState, availableMinutes: number): DailyPlan {
  const items: PlanItem[] = [];
  const rationale: string[] = [];
  let remaining = availableMinutes;
  const today = todayKey();

  // 1. REVISION DUE — small, high-value
  const due = ALL_TOPICS
    .filter((t) => state.topicProgress[t.id]?.nextRevisionAt && state.topicProgress[t.id]!.nextRevisionAt! <= today)
    .sort((a, b) => (state.topicProgress[a.id]?.nextRevisionAt ?? "").localeCompare(state.topicProgress[b.id]?.nextRevisionAt ?? ""));
  for (const t of due.slice(0, 2)) {
    if (remaining < 5) break;
    const dur = Math.min(5, remaining);
    items.push({
      kind: "revision",
      title: `Revise ${t.title}`,
      subtitle: "Spaced revision · formula + 2 quick questions",
      topicId: t.id,
      section: t.section,
      durationMin: dur,
      reason: "This topic is due for spaced revision today. A 5-minute review locks it into long-term memory.",
      difficulty: t.difficulty,
    });
    rationale.push(`${t.title} is due for revision (scheduled by the spaced-repetition system).`);
    remaining -= dur;
  }

  // 2. MISTAKE REVISION — retry wrong questions
  const pendingMistakes = state.mistakes.filter((m) => m.retryStatus === "pending");
  if (pendingMistakes.length > 0 && remaining >= 8) {
    const dur = Math.min(10, remaining);
    items.push({
      kind: "mistake-rev",
      title: "Retry your mistakes",
      subtitle: `${pendingMistakes.length} wrong questions to master`,
      section: "qa",
      durationMin: dur,
      reason: `${pendingMistakes.length} mistakes are awaiting retry. Retrying converts errors into mastery.`,
      difficulty: 3,
    });
    rationale.push("You have unanswered mistakes in the notebook — retrying them now is the highest-value practice.");
    remaining -= dur;
  }

  // 3. CORE LEARNING + PRACTICE - use best topics
  const cands = bestTopics(state, 8);
  const sectionTarget = sectionOfNextLearned(state);

  for (const { topic: t } of cands) {
    if (remaining < 10) break;
    const learned = conceptLearned(state, t);
    const strength = topicStrength(state, t);
    const noQuestions = (QUESTIONS_BY_TOPIC[t.id] ?? []).length;

    // Decide: learn/drill vs practice depending on state
    if (!learned) {
      const dur = Math.min(Math.min(t.estimatedMinutes, 25), remaining);
      items.push({
        kind: "learn",
        title: `Learn ${t.title}`,
        subtitle: `${t.section.toUpperCase()} · ${difficultyLabel(t.difficulty)} · concept + notes`,
        topicId: t.id,
        section: t.section,
        durationMin: dur,
        reason: prerequisiteReason(state, t),
        difficulty: t.difficulty,
      });
      rationale.push(
        `${t.title} has high preparation priority${strength.weak ? " and your recent accuracy is below your target" : ""}.`
      );
      remaining -= dur;
      if (remaining >= 8) {
        const vdur = Math.min(10, remaining);
        items.push({
          kind: "video",
          title: `Watch: ${t.title}`,
          subtitle: "Recommended lesson",
          topicId: t.id,
          section: t.section,
          durationMin: vdur,
          reason: "A short lecture reinforces the concept you just learned.",
          difficulty: t.difficulty,
        });
        remaining -= vdur;
      }
    } else {
      // practice path
      if (noQuestions > 0 && remaining >= 8) {
        const dur = Math.min(15, remaining);
        items.push({
          kind: "practice",
          title: `Practice ${t.title}`,
          subtitle: `${noQuestions} questions in your bank`,
          topicId: t.id,
          section: t.section,
          durationMin: dur,
          reason:
            strength.weak
              ? `Your accuracy in ${t.title} is ${strength.accuracy}% — below your target. Practice with explanation review.`
              : `${t.title} continues your in-progress topic. Speed and accuracy both improve.`,
          difficulty: t.difficulty,
        });
        remaining -= dur;
      }
    }

    // interleave DILR and RC to keep all sections moving
    if (items.length % 2 === 1 && remaining >= 10) {
      if (remaining >= 12) {
        items.push({
          kind: "dilr-set",
          title: "One DILR set",
          subtitle: DILR_SETS[0]?.title ?? "Set practice",
          section: "dilr",
          durationMin: Math.min(15, remaining),
          reason: "DILR rewards consistent set-solving. One set per day compounds quickly.",
          difficulty: 3,
        });
        remaining -= 15;
        continue;
      }
      if (remaining >= 8) {
        items.push({
          kind: "rc",
          title: "One RC passage",
          subtitle: RC_PASSAGES[0]?.title ?? "Reading practice",
          section: "varc",
          durationMin: Math.min(10, remaining),
          reason: "Daily reading builds the reading speed CAT's VARC demands.",
          difficulty: 3,
        });
        remaining -= 10;
      }
    }

    if (remaining < 10) break;
  }

  // 4. Speed drill if performance gap detected
  const overall = state.questionResults;
  if (overall.length >= 5 && remaining >= 10) {
    const acc = Math.round((overall.filter((r) => r.correct).length / overall.length) * 100);
    const avgTime = overall.reduce((s, r) => s + r.timeSec, 0) / overall.length;
    if (avgTime > 75 && acc >= 70) {
      items.push({
        kind: "speed",
        title: "Time-pressure drill",
        subtitle: "10 questions · timed",
        section: "qa",
        durationMin: Math.min(15, remaining),
        reason: "Your accuracy is healthy but your solving time is above target. Timed drills fix speed.",
        difficulty: 3,
      });
      rationale.push("Speed is your gap: accuracy is strong, time per question is high.");
      remaining -= 15;
    } else if (acc < 60) {
      items.push({
        kind: "challenge",
        title: "Daily CAT Challenge",
        subtitle: "Concept-first mini batch",
        section: "qa",
        durationMin: Math.min(10, remaining),
        reason: "Accuracy is below target. The challenge is built from easier, concept-checking questions.",
        difficulty: 2,
      });
      remaining -= 10;
    }
  }

  const totalMinutes = items.reduce((s, i) => s + i.durationMin, 0);

  // Ratchet down to the real budget if we overbuilt
  const trimmed = [];
  let used = 0;
  for (const it of items) {
    const next = used + it.durationMin;
    if (next > availableMinutes) break;
    trimmed.push(it);
    used = next;
  }

  return {
    availableMinutes,
    items: trimmed.length > 0 ? trimmed : (items.length > 0 ? [items[0]] : []),
    rationale: rationale.slice(0, 4).length > 0
      ? rationale.slice(0, 4)
      : ["No plan yet — complete onboarding to get your first personalized plan."],
    totalMinutes: trimmed.length > 0 ? used : (items.length > 0 ? Math.min(items[0].durationMin, availableMinutes) : 0),
  };
}

function prerequisiteReason(state: AppState, t: Topic): string {
  if (t.prerequisites.length > 0) {
    const missing = t.prerequisites.filter((p) => {
      const st = state.topicProgress[p];
      return !st || st.status === "not-started";
    });
    if (missing.length > 0) {
      return `Before ${t.title}, strengthen ${missing.map((m) => TOPIC_MAP[m]?.title ?? m).join(", ")} — it is a prerequisite. You can still explore, but this order works best.`;
    }
  }
  const pri = t.priority === 1 ? "high preparation priority" : t.priority === 2 ? "medium preparation priority" : "lower priority";
  return `${t.title} has ${pri} and is foundational within ${t.section.toUpperCase()}.`;
}

// Quick-mode session generator: the highest-impact set of activities for
// a short, fixed time window (30/45/60/90 min).
export function quickMode(timeMin: number): { time: number; blocks: { minutes: number; name: string; kind: PlanItemType }[] } {
  const blocks: { minutes: number; name: string; kind: PlanItemType }[] = [];
  let t = timeMin;

  const add = (m: number, name: string, kind: PlanItemType) => {
    if (t <= 0 || m <= 0) return;
    const take = Math.min(m, t);
    blocks.push({ minutes: take, name, kind });
    t -= take;
  };

  // High-impact ordering for short windows: quick revision first if due,
  // then core concept, video, practice, speed.
  add(5, "Spaced revision (due topics)", "revision");
  add(10, "Concept — highest-priority topic", "learn");
  add(15, "Recommended video lesson", "video");
  add(15, "Targeted practice", "practice");
  add(10, "Timed mini-drill", "speed");

  return { time: timeMin, blocks };
}