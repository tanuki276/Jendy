import { lessons, type Direction, type Lesson, type QuizQuestion } from "./learning-content";
export type PracticeItem = { lesson: Lesson; question: QuizQuestion; phraseIndex: number };
export type TopicStats = { attempts: number; correct: number; lastWrong: boolean };
export type PracticeStats = Record<string, TopicStats>;
export const practiceBank: PracticeItem[] = lessons.flatMap(lesson => lesson.quiz.map((question, phraseIndex) => ({ lesson, question, phraseIndex })));
export function shuffle<T>(items: readonly T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function recordPractice(stats: PracticeStats, direction: Direction, lessonId: string, correct: boolean): PracticeStats {
  const key = `${direction}:${lessonId}`;
  const prev = stats[key] ?? { attempts: 0, correct: 0, lastWrong: false };
  return { ...stats, [key]: { attempts: prev.attempts + 1, correct: prev.correct + Number(correct), lastWrong: !correct } };
}
export function buildSession(stats: PracticeStats, direction: Direction, level = "All", weakOnly = false, random = Math.random): PracticeItem[] {
  let candidates = practiceBank.filter(item => level === "All" || item.lesson.level.startsWith(level));
  const weak = candidates.filter(item => { const score = stats[`${direction}:${item.lesson.id}`]; return score && (score.lastWrong || score.correct / score.attempts < .8); });
  if (weakOnly) return shuffle(weak, random).slice(0, 12);
  const priority = shuffle(weak, random).slice(0, 4);
  const selected = new Set(priority.map(item => item.question.id));
  const rest = shuffle(candidates.filter(item => !selected.has(item.question.id)), random);
  return shuffle([...priority, ...rest.slice(0, 12 - priority.length)], random);
}
export function normalizeRecall(input: string) {
  return input.normalize("NFKC").toLocaleLowerCase().replace(/[。、！？!?.,\s]/gu, "");
}
export function readPracticeStats(): PracticeStats {
  if (typeof window === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem("jendy:practice:v1") ?? "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v && typeof v === "object" && Number.isSafeInteger(v.attempts) && v.attempts > 0 && Number.isSafeInteger(v.correct) && v.correct >= 0 && v.correct <= v.attempts && typeof v.lastWrong === "boolean"));
  } catch { return {}; }
}
