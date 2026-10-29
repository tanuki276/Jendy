import type { Direction } from "@/lib/learning-content";

export type ReviewGrade = "again" | "hard" | "good" | "easy";

export type ReviewItem = {
  key: string;
  lessonId: string;
  phraseIndex: number;
  direction: Direction;
  intervalDays: number;
  ease: number;
  repetitions: number;
  dueAt: string;
  lastReviewedAt: string;
};

export type LearningStats = {
  xp: number;
  streak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  answered: number;
  correct: number;
  completedLessons: number;
};

export type LearningState = {
  stats: LearningStats;
  reviews: ReviewItem[];
  lessonScores: Record<string, number>;
  dailyGoal: number;
  activity: Record<string, { answered: number; xp: number }>;
};

const KEY = "jendy:learning-state:v1";

const initialState: LearningState = {
  stats: {
    xp: 0,
    streak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    answered: 0,
    correct: 0,
    completedLessons: 0,
  },
  reviews: [],
  lessonScores: {},
  dailyGoal: 12,
  activity: {},
};

export function createEmptyLearningState(): LearningState {
  return {
    stats: { ...initialState.stats },
    reviews: [],
    lessonScores: {},
    dailyGoal: 12,
    activity: {},
  };
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dayDiff(a: string, b: string) {
  const start = new Date(`${a}T00:00:00`);
  const end = new Date(`${b}T00:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

export function loadLearningState(): LearningState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return createEmptyLearningState();
    const parsed = JSON.parse(raw) as Partial<LearningState>;
    return {
      stats: {
        ...initialState.stats,
        ...(parsed.stats ?? {}),
        longestStreak: Math.max(
          parsed.stats?.longestStreak ?? 0,
          parsed.stats?.streak ?? 0,
        ),
      },
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
      lessonScores: parsed.lessonScores ?? {},
      dailyGoal: [6, 12, 24].includes(parsed.dailyGoal ?? 0)
        ? parsed.dailyGoal!
        : 12,
      activity: sanitizeActivity(parsed.activity),
    };
  } catch {
    return initialState;
  }
}

function sanitizeActivity(value: unknown): LearningState["activity"] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([day, entry]) =>
          /^\d{4}-\d{2}-\d{2}$/.test(day) &&
          entry &&
          typeof entry === "object" &&
          Number.isSafeInteger(entry.answered) &&
          entry.answered >= 0 &&
          Number.isSafeInteger(entry.xp) &&
          entry.xp >= 0,
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-180),
  );
}

/** Keep historical streaks in storage; only show a current streak until yesterday. */
export function currentStreak(state: LearningState, now = new Date()): number {
  const last = state.stats.lastStudyDate;
  if (!last) return 0;
  const days = dayDiff(last, localDateKey(now));
  return days >= 0 && days <= 1 ? state.stats.streak : 0;
}

function recordActivity(
  state: LearningState,
  answered: number,
  xp: number,
): LearningState {
  const today = localDateKey();
  const previous = state.activity?.[today] ?? { answered: 0, xp: 0 };
  const activity = {
    ...state.activity,
    [today]: { answered: previous.answered + answered, xp: previous.xp + xp },
  };
  return {
    ...state,
    activity: Object.fromEntries(
      Object.entries(activity)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-180),
    ),
  };
}

export function saveLearningState(state: LearningState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Keep the current in-memory session usable if storage is unavailable.
  }
}

export function touchStudyDay(state: LearningState): LearningState {
  const today = localDateKey();
  const previous = state.stats.lastStudyDate;
  if (previous === today) return state;

  let streak = 1;
  if (previous && dayDiff(previous, today) === 1)
    streak = state.stats.streak + 1;

  return {
    ...state,
    stats: {
      ...state.stats,
      streak,
      longestStreak: Math.max(
        state.stats.longestStreak ?? state.stats.streak,
        streak,
      ),
      lastStudyDate: today,
    },
  };
}

export function recordAnswer(
  state: LearningState,
  correct: boolean,
): LearningState {
  const touched = recordActivity(touchStudyDay(state), 1, correct ? 10 : 2);
  return {
    ...touched,
    stats: {
      ...touched.stats,
      answered: touched.stats.answered + 1,
      correct: touched.stats.correct + (correct ? 1 : 0),
      xp: touched.stats.xp + (correct ? 10 : 2),
    },
  };
}

export function recordLessonCompletion(
  state: LearningState,
  lessonId: string,
  score: number,
): LearningState {
  const alreadyScored = typeof state.lessonScores[lessonId] === "number";
  const touched = recordActivity(
    touchStudyDay(state),
    0,
    alreadyScored ? 15 : 50,
  );
  return {
    ...touched,
    lessonScores: {
      ...touched.lessonScores,
      [lessonId]: Math.max(touched.lessonScores[lessonId] ?? 0, score),
    },
    stats: {
      ...touched.stats,
      xp: touched.stats.xp + (alreadyScored ? 15 : 50),
      completedLessons:
        touched.stats.completedLessons + (alreadyScored ? 0 : 1),
    },
  };
}

export function upsertReviewItem(
  state: LearningState,
  input: Pick<ReviewItem, "lessonId" | "phraseIndex" | "direction">,
): LearningState {
  const key = `${input.direction}:${input.lessonId}:${input.phraseIndex}`;
  if (state.reviews.some((item) => item.key === key)) return state;

  const now = new Date();
  const item: ReviewItem = {
    key,
    ...input,
    intervalDays: 0,
    ease: 2.5,
    repetitions: 0,
    dueAt: now.toISOString(),
    lastReviewedAt: now.toISOString(),
  };

  return { ...state, reviews: [...state.reviews, item] };
}

export function gradeReview(
  state: LearningState,
  key: string,
  grade: ReviewGrade,
): LearningState {
  if (!state.reviews.some((item) => item.key === key)) return state;
  const now = new Date();
  const next = state.reviews.map((item) => {
    if (item.key !== key) return item;

    let repetitions = item.repetitions;
    let intervalDays = item.intervalDays;
    let ease = item.ease;

    if (grade === "again") {
      repetitions = 0;
      intervalDays = 0;
      ease = Math.max(1.3, ease - 0.2);
    } else if (grade === "hard") {
      repetitions += 1;
      intervalDays = Math.max(1, Math.round(Math.max(1, intervalDays) * 1.2));
      ease = Math.max(1.3, ease - 0.05);
    } else if (grade === "good") {
      repetitions += 1;
      intervalDays =
        repetitions === 1
          ? 1
          : repetitions === 2
            ? 3
            : Math.max(4, Math.round(Math.max(1, intervalDays) * ease));
    } else {
      repetitions += 1;
      intervalDays =
        repetitions === 1
          ? 3
          : repetitions === 2
            ? 7
            : Math.max(
                7,
                Math.round(Math.max(1, intervalDays) * (ease + 0.35)),
              );
      ease += 0.08;
    }

    const due = new Date(now);
    if (grade === "again") due.setMinutes(due.getMinutes() + 10);
    else due.setDate(due.getDate() + intervalDays);

    return {
      ...item,
      repetitions,
      intervalDays,
      ease,
      dueAt: due.toISOString(),
      lastReviewedAt: now.toISOString(),
    };
  });

  const xpByGrade: Record<ReviewGrade, number> = {
    again: 2,
    hard: 5,
    good: 8,
    easy: 10,
  };
  const touched = recordActivity(touchStudyDay(state), 1, xpByGrade[grade]);
  return {
    ...touched,
    reviews: next,
    stats: {
      ...touched.stats,
      xp: touched.stats.xp + xpByGrade[grade],
    },
  };
}

export function dueReviews(state: LearningState, direction?: Direction) {
  const now = Date.now();
  return state.reviews.filter((item) => {
    if (direction && item.direction !== direction) return false;
    return new Date(item.dueAt).getTime() <= now;
  });
}
