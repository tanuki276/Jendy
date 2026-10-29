"use client";

import { playEffect, effectsMuted, setEffectsMuted } from "@/lib/sound-effects";
import { buildLessonSession, type SessionQuestion } from "@/lib/lesson-session";
import { buildExercisePlan, type ExerciseMode } from "@/lib/exercise-plan";
import { AppNavigation } from "./AppNavigation";
import { LearningHome, DailyGoals, WeekCard, AchievementCard } from "./LearningHome";
import { LearningJourney } from "./LearningJourney";
import { LessonQuestion, type AnswerMode } from "./LessonQuestion";
import { normalizeRecall } from "@/lib/practice";
import { CultureBanner, StageSeal } from "./CultureArt";
import { BridgeMark } from "./BridgeMark";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ExpressionCard } from "@/components/ExpressionCard";
import { shuffle } from "@/lib/practice";
import { useModalFocus } from "@/components/useModalFocus";
import { Icon } from "@/components/Icon";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { lessons, type Direction, type Lesson, targetText, sourceText } from "@/lib/learning-content";
import {
  createEmptyLearningState,
  currentStreak,
  dueReviews,
  gradeReview,
  loadLearningState,
  recordAnswer,
  recordLessonCompletion,
  saveLearningState,
  upsertReviewItem,
  type LearningState,
  type ReviewGrade,
} from "@/lib/learning-state";

type AuthMode = "signin" | "signup";
type LessonPhase = "learn" | "quiz" | "result";

const WordNetwork = dynamic(() => import("@/components/WordNetwork").then(module => module.WordNetwork));
const PracticeLab = dynamic(() => import("@/components/PracticeLab").then(module => module.PracticeLab));


const LOCAL_PROGRESS_KEY = "jendy:progress:v1";
const LOCAL_DIRECTION_KEY = "jendy:direction:v1";

function directionText(direction: Direction) {
  return direction === "ja-id"
    ? {
        source: "日本語",
        target: "Bahasa Indonesia",
        eyebrow: "BAHASA INDONESIA, DENGAN PENJELASAN JEPANG",
        title: "その訳の先にある、\n「なぜ？」まで。",
        lead: "日本語とインドネシア語の違いから、文のしくみ・語感・実際の使い方を学ぶ。語根も、助詞も、友達へのひと言も。理解して、自分の言葉に。",
        start: "今日の学習を始める",
      }
    : {
        source: "Bahasa Indonesia",
        target: "日本語",
        eyebrow: "BELAJAR BAHASA JEPANG DALAM BAHASA INDONESIA",
        title: "Pahami bukan hanya arti,\ntetapi juga alasannya.",
        lead: "Temukan perbedaan bahasa Jepang dan Indonesia: struktur kalimat, partikel, nuansa, dan ungkapan sehari-hari. Pahami alasannya, lalu latih penggunaannya.",
        start: "Mulai belajar hari ini",
      };
}

function readLocalProgress(direction: Direction) {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Record<Direction, string[]>>) : {};
    return new Set(parsed[direction] ?? []);
  } catch {
    return new Set<string>();
  }
}

function writeLocalProgress(direction: Direction, completed: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Record<Direction, string[]>>) : {};
    parsed[direction] = [...completed];
    window.localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(parsed));
  } catch {
    // Local progress remains in memory when storage is unavailable.
  }
}

function writeLocalDirection(direction: Direction) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_DIRECTION_KEY, direction);
  } catch {
    // Direction persistence is optional.
  }
}

async function withTimeout<T>(promise: PromiseLike<T>, milliseconds = 7000): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Supabase timeout")), milliseconds);
  });
  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export type PageView = "home" | "login" | "study" | "lesson" | "practice" | "dictionary" | "review" | "dashboard";

export function JendyApp({ view }: { view: PageView }) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [direction, setDirection] = useState<Direction>("ja-id");
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [learning, setLearning] = useState<LearningState>(createEmptyLearningState);

  const [storageReady, setStorageReady] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const sessionXpStart = useRef(0);
  const [courseLevel, setCourseLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonPhase, setLessonPhase] = useState<LessonPhase>("learn");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [effectsOff,setEffectsOff]=useState(false);
  const [exercisePlan,setExercisePlan]=useState<ExerciseMode[]>([]);
  const [answerMode, setAnswerMode] = useState<AnswerMode>("tiles");
  const [mistakes, setMistakes] = useState<number[]>([]);
  const [repairQueue, setRepairQueue] = useState<number[]>([]);
  const [repairPosition, setRepairPosition] = useState(0);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);

  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewRevealed, setReviewRevealed] = useState(false);

  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  useModalFocus(Boolean(activeLesson), modalRef, closeLesson);
  const categories = Array.from(new Set(lessons.map(lesson => lesson.category ?? "Foundation")));
  const filteredLessons = lessons.filter(lesson => (courseLevel === "All" || lesson.level.startsWith(courseLevel)) && (category === "All" || (lesson.category ?? "Foundation") === category) && `${lesson.titleJa} ${lesson.titleId} ${lesson.grammarJa} ${lesson.grammarId}`.toLowerCase().includes(search.trim().toLowerCase()));
  const quizChoices = useMemo(() => {
    const question = activeLesson?.quiz[quizIndex];
    return question ? shuffle(direction === "ja-id" ? question.choicesId : question.choicesJa) : [];
  }, [activeLesson, quizIndex, direction]);
  const copy = directionText(direction);
  const progress = Math.round((completed.size / lessons.length) * 100);
  const accuracy = learning.stats.answered === 0 ? 0 : Math.round((learning.stats.correct / learning.stats.answered) * 100);
  const reviews = useMemo(() => dueReviews(learning, direction), [learning, direction]);
  const currentReview = reviews[reviewIndex] ?? reviews[0] ?? null;
  const currentReviewLesson = currentReview ? lessons.find((lesson) => lesson.id === currentReview.lessonId) : null;
  const currentReviewPhrase = currentReviewLesson?.phrases[currentReview?.phraseIndex ?? 0] ?? null;

  useEffect(() => {
    try {
      const savedDirection = window.localStorage.getItem(LOCAL_DIRECTION_KEY);
      if (savedDirection === "ja-id" || savedDirection === "id-ja") setDirection(savedDirection);
    } catch {
      // Defaults keep the app usable.
    }
    setNow(new Date());
    setEffectsOff(effectsMuted());
    setLearning(loadLearningState());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = window.setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, []);

  useEffect(() => {
    if (activeLesson) setAnswerMode(exercisePlan[quizIndex]??"tiles");
  }, [activeLesson, quizIndex, repairPosition, exercisePlan]);

  useEffect(() => {
    if (!activeLesson) return;
    const target = selectedAnswer ? modalRef.current?.querySelector<HTMLElement>(".quiz-feedback .next-button") : modalRef.current;
    (target ?? modalRef.current)?.focus();
  }, [activeLesson, quizIndex, lessonPhase, selectedAnswer]);

  useEffect(() => {
    if (storageReady) saveLearningState(learning);
  }, [learning, storageReady]);

  useEffect(() => {
    document.documentElement.lang = direction === "ja-id" ? "ja" : "id";
  }, [direction]);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    void (async () => {
      try {
        const { data } = await withTimeout(supabase.auth.getUser());
        if (active) setUser(data.user ?? null);
      } catch {
        // Supabase can be offline; learning remains local-first.
      }
    })();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const local = readLocalProgress(direction);
    setCompleted(local);

    if (!supabase || !user) return;
    let active = true;

    void (async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("jendy_progress")
            .select("lesson_id, completed")
            .eq("user_id", user.id)
            .eq("direction", direction)
            .eq("completed", true),
        );
        if (error) return;

        const remote = new Set((data ?? []).map((row) => row.lesson_id as string));
        const merged = new Set([...local, ...remote]);
        if (active) {
          setCompleted(merged);
          writeLocalProgress(direction, merged);
        }
      } catch {
        // Cloud synchronization is best-effort.
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase, user, direction]);

  function switchDirection() {
    const next = direction === "ja-id" ? "id-ja" : "ja-id";
    setActiveLesson(null);
    setDirection(next);
    setReviewIndex(0);
    setReviewRevealed(false);
    writeLocalDirection(next);

    if (supabase && user) {
      void withTimeout(
        supabase.from("jendy_profiles").upsert(
          {
            user_id: user.id,
            display_name: user.user_metadata?.display_name ?? null,
            learning_direction: next,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        ),
      ).catch(() => undefined);
    }
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = direction === "ja-id" ? "id-ID" : "ja-JP";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function openLesson(lesson: Lesson) {
    sessionXpStart.current = learning.stats.xp;
    setMistakes([]); setRepairQueue([]); setRepairPosition(0); setCombo(0); setBestCombo(0);
    const session=view==="study"?lesson:{...lesson,quiz:buildLessonSession(lesson,completed)};
    setExercisePlan(buildExercisePlan(session.quiz));
    setActiveLesson(session);
    setLessonPhase(view === "study" ? "learn" : "quiz");
    setPhraseIndex(0);
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
  }

  function closeLesson() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setActiveLesson(null);
  }

  function nextPhrase() {
    if (!activeLesson) return;
    const phrase = activeLesson.phrases[phraseIndex];
    setLearning((current) => upsertReviewItem(current, { lessonId: activeLesson.id, phraseIndex, direction }));

    if (phraseIndex < activeLesson.phrases.length - 1) {
      setPhraseIndex((index) => index + 1);
    } else {
      closeLesson();
    }
  }

  function answerQuestion(choice: string) {
    if (!activeLesson || selectedAnswer) return;
    const question = activeLesson.quiz[quizIndex];
    const expected = direction === "ja-id" ? question.answerId : question.answerJa;
    const correct = normalizeRecall(choice) === normalizeRecall(expected);
    playEffect(correct ? "correct" : "wrong");
    setSelectedAnswer(choice);
    setAnswerCorrect(correct);
    if (correct) {
      if (!repairQueue.length) setQuizScore((score) => score + 1);
      setCombo(value => value + 1); setBestCombo(value => Math.max(value, combo + 1));
    } else {
      setCombo(0);
      if (!repairQueue.length) setMistakes(value => value.includes(quizIndex) ? value : [...value, quizIndex]);
    }
    setLearning((current) => upsertReviewItem(recordAnswer(current, correct), { lessonId: (question as SessionQuestion).sourceLessonId ?? activeLesson.id, phraseIndex: (question as SessionQuestion).sourcePhraseIndex ?? quizIndex, direction }));
  }

  function nextQuestion() {
    if (!activeLesson) return;
    if (repairQueue.length) {
      const remaining = [...repairQueue];
      if (!answerCorrect) remaining.push(quizIndex);
      if (repairPosition + 1 < remaining.length) {
        setRepairQueue(remaining); setRepairPosition(value => value + 1);
        setQuizIndex(remaining[repairPosition + 1]); setSelectedAnswer(null); setAnswerCorrect(null);
      } else {
        setMistakes([]); setRepairQueue([]); setLessonPhase("result");
      }
      return;
    }
    if (quizIndex < activeLesson.quiz.length - 1) {
      setQuizIndex((index) => index + 1);
      setSelectedAnswer(null);
      setAnswerCorrect(null);
      return;
    }

    const finalCorrect = quizScore;
    const score = Math.round((finalCorrect / activeLesson.quiz.length) * 100);
    setLessonPhase("result");

    if (score >= 67) {
      const stageStart=Math.floor(lessons.findIndex(l=>l.id===activeLesson.id)/6)*6;
      const batch=lessons.slice(stageStart,stageStart+6);
      playEffect(!completed.has(activeLesson.id)&&batch.every(item=>item.id===activeLesson.id||completed.has(item.id))?'stage':'complete');
      const nextCompleted = new Set([...completed, activeLesson.id]);
      setCompleted(nextCompleted);
      writeLocalProgress(direction, nextCompleted);
      setLearning((current) => recordLessonCompletion(current, `${direction}:${activeLesson.id}`, score));

      if (supabase && user) {
        void withTimeout(
          supabase.from("jendy_progress").upsert(
            {
              user_id: user.id,
              lesson_id: activeLesson.id,
              direction,
              completed: true,
              score,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,lesson_id,direction" },
          ),
        ).catch(() => undefined);
      }
    }
  }

  function repairMistakes() {
    setRepairQueue(mistakes); setRepairPosition(0); setQuizIndex(mistakes[0]);
    setSelectedAnswer(null); setAnswerCorrect(null); setLessonPhase("quiz"); setCombo(0);
  }

  function retryLessonQuiz() {
    sessionXpStart.current = learning.stats.xp;
    if(activeLesson)setExercisePlan(buildExercisePlan(activeLesson.quiz));
    setMistakes([]); setRepairQueue([]); setRepairPosition(0); setCombo(0); setBestCombo(0);
    setLessonPhase("quiz");
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
  }

  function handleReviewGrade(grade: ReviewGrade) {
    if (!currentReview) return;
    setLearning((current) => gradeReview(current, currentReview.key, grade));
    setReviewRevealed(false);
    setReviewIndex(0);
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setAuthMessage(direction === "ja-id" ? "現在ログインを利用できません。レッスンはログインせずに利用できます。" : "Login saat ini tidak tersedia. Pelajaran tetap dapat diakses tanpa login.");
      return;
    }

    setAuthBusy(true);
    setAuthMessage("");
    try {
      if (authMode === "signin") {
        const { error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));
        if (error) setAuthMessage(error.message);
        else {
          setAuthMessage(direction === "ja-id" ? "ログインしました。" : "Berhasil masuk.");
          router.replace("/dashboard");
        }
      } else {
        const { data, error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/login`, data: { display_name: displayName } },
          }),
        );
        if (error) setAuthMessage(error.message);
        else if (!data.session) setAuthMessage(direction === "ja-id" ? "確認メールを送りました。" : "Email konfirmasi sudah dikirim.");
        else router.replace("/dashboard");
      }
    } catch {
      setAuthMessage(direction === "ja-id" ? "ログインに失敗しました。接続を確認して、もう一度お試しください。" : "Login gagal. Periksa koneksi dan coba lagi.");
    } finally {
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (supabase) {
      try {
        await withTimeout(supabase.auth.signOut());
      } catch {
        // Local state is intentionally preserved.
      }
    }
    setUser(null);
  }

  const followingLesson = activeLesson ? lessons[lessons.findIndex(lesson => lesson.id === activeLesson.id) + 1] : undefined;
  const lessonScore = activeLesson ? Math.round(quizScore / activeLesson.quiz.length * 100) : 0;

  return (
    <div className={`app-shell view-${view}`}>
      <AppNavigation view={view} direction={direction} xp={learning.stats.xp} streak={now ? currentStreak(learning, now) : 0} reviews={reviews.length} signedIn={Boolean(user)} effectsOff={effectsOff} onDirection={switchDirection} onSignOut={signOut} onEffects={() => { const next = !effectsOff; setEffectsOff(next); setEffectsMuted(next); if (!next) playEffect("correct"); }}/>
      <main id="page-content" className="app-content">
      {view === "home" && <LearningHome direction={direction} completed={completed} learning={learning} now={now} dueCount={reviews.length} onStart={openLesson} onGoal={goal => setLearning(current => ({ ...current, dailyGoal: goal }))}/>}

      {view !== "home" && view !== "login" && <div className="page-intro">
        <h1>{({ study: ["学習モード", "Mode belajar"], lesson: ["レッスン", "Pelajaran"], practice: ["練習", "Latihan"], dictionary: ["語族辞書", "Keluarga kata"], review: ["復習", "Ulasan"], dashboard: ["学習状況", "Progres belajar"] } as const)[view][direction === "ja-id" ? 0 : 1]}</h1>
      </div>}
      {view !== "home" && <section className="direction-panel">
        <div><Icon name="globe" size={22} /><span>{direction === "ja-id" ? "現在の学習方向" : "Arah belajar"}</span></div>
        <button onClick={switchDirection}><strong>{copy.source}</strong><Icon name="arrow" size={18} /><strong>{copy.target}</strong><span className="switch-hint"><Icon name="swap" size={15} />{direction === "ja-id" ? "逆方向へ" : "Balik arah"}</span></button>
      </section>}

      {view === "practice" && <PracticeLab key={direction} direction={direction} onAnswer={(correct, lessonId, phraseIndex) => {playEffect(correct?"correct":"wrong");setLearning(current => upsertReviewItem(recordAnswer(current, correct), { lessonId, phraseIndex, direction }));}} />}
      {view === "dictionary" && <WordNetwork direction={direction} />}

      {view === "dashboard" && <section className="dashboard-section" id="dashboard">
        <div className="section-kicker">LEARNING DASHBOARD</div>
        <div className="dashboard-heading">
          <div><h2>{direction === "ja-id" ? "今日の学習状況" : "Progres belajar hari ini"}</h2><p>{direction === "ja-id" ? "読む → 解く → 復習する、を1つの流れに。" : "Baca → jawab → ulangi, dalam satu alur."}</p></div>
          <div className="sync-badge"><span className={user ? "online" : "local"} />{user ? (direction === "ja-id" ? "ログイン中" : "Sudah masuk") : (direction === "ja-id" ? "ゲスト" : "Tamu")}</div>
        </div>
        <div className="stat-grid">
          <article><span>XP</span><strong>{learning.stats.xp}</strong><small>{direction === "ja-id" ? "正解 +10 / 復習 +2〜10" : "Benar +10 / ulasan +2–10"}</small></article>
          <article><span>STREAK</span><strong>{now ? currentStreak(learning, now) : 0}<em>{direction === "ja-id" ? "日" : " hari"}</em></strong><small>{direction === "ja-id" ? "学習した日を連続記録" : "Hari belajar berturut-turut"}</small></article>
          <article><span>ACCURACY</span><strong>{accuracy}%</strong><small>{learning.stats.answered} {direction === "ja-id" ? "問回答" : "jawaban"}</small></article>
          <article><span>REVIEW</span><strong>{reviews.length}</strong><small>{direction === "ja-id" ? "今すぐ復習できる項目" : "Item siap diulas"}</small></article>
        </div>
        <div className="dashboard-habits"><DailyGoals direction={direction} learning={learning} now={now} onGoal={goal => setLearning(current => ({ ...current, dailyGoal: goal }))}/><WeekCard direction={direction} learning={learning} now={now}/><AchievementCard direction={direction} learning={learning} now={now}/></div>
        <div className="dashboard-progress"><div><span>{direction === "ja-id" ? "基礎コース進捗" : "Progres kursus dasar"}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      </section>}

      {(view === "lesson" || view === "study") && <>
      <section className="curriculum-section" id="curriculum">
        <p className="mode-description">{view === "study" ? (direction === "ja-id" ? "例文・音声・文法解説を、自分のペースで確認できます。" : "Baca contoh dan penjelasan sesuai kecepatan Anda.") : (direction === "ja-id" ? "まずは「学習を続ける」から。選択・入力・文章タイル・聞き取りで練習できます。" : "Lanjutkan jalur belajar dengan pilihan, mengetik, dan menyimak.")}</p><div className="curriculum-header" hidden={view === "lesson" && !catalogOpen}><div><div className="section-kicker">STRUCTURED CURRICULUM</div><h2>{direction === "ja-id" ? `${lessons.length}の学び、2つの視点。` : `${lessons.length} pelajaran, dua sudut pandang.`}</h2></div><p className="curriculum-note">{direction === "ja-id" ? "入門6 + 基礎48 + 文の組み立て128 + 場面ミッション16" : "6 pemula + 48 dasar + 128 latihan pola + 16 misi situasi"}</p></div>
        <div className="course-filters" hidden={view === "lesson" && !catalogOpen}>
          <label>{direction === "ja-id" ? "教材を検索" : "Cari pelajaran"}<input type="search" value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(12); }} placeholder={direction === "ja-id" ? "助詞、チャット、baca…" : "partikel, chat, baca…"} /></label>
          <label>{direction === "ja-id" ? "レベル" : "Tingkat"}<select value={courseLevel} onChange={e => { setCourseLevel(e.target.value); setVisibleCount(12); }}><option value="All">All</option>{["A1", "A2", "B1"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label>{direction === "ja-id" ? "テーマ" : "Tema"}<select value={category} onChange={e => { setCategory(e.target.value); setVisibleCount(12); }}><option value="All">All</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
          <span role="status">{filteredLessons.length} {direction === "ja-id" ? "レッスン" : "pelajaran"}</span>
        </div>
        {view === "lesson" && <><LearningJourney key={direction} direction={direction} completed={completed} onStart={openLesson} xp={learning.stats.xp} streak={now ? currentStreak(learning, now) : 0}/><button className="catalog-toggle outline-button" aria-expanded={catalogOpen} onClick={()=>setCatalogOpen(value=>!value)}>{direction === "ja-id" ? (catalogOpen ? "教材一覧を閉じる" : "教材一覧から選ぶ") : (catalogOpen ? "Tutup daftar" : "Pilih dari daftar")}</button></>}<div className="lesson-grid" hidden={view === "lesson" && !catalogOpen}>
          {filteredLessons.slice(0, visibleCount).map((lesson) => {
            const isDone = completed.has(lesson.id);
            const score = learning.lessonScores[`${direction}:${lesson.id}`] ?? (direction === "ja-id" ? learning.lessonScores[lesson.id] : undefined);
            return <article className={`lesson-card ${isDone ? "done" : ""}`} key={lesson.id}>
              <div className="lesson-meta"><span>{lesson.level}</span><span>{lesson.minutes} min</span></div>
              <h3>{direction === "ja-id" ? lesson.titleJa : lesson.titleId}</h3>
              <p>{direction === "ja-id" ? lesson.descriptionJa : lesson.descriptionId}</p>
              <div className="lesson-example"><small>{direction === "ja-id" ? "KEY PHRASE" : "FRASA KUNCI"}</small><strong>{targetText(direction, lesson.phrases[0])}</strong><span>{sourceText(direction, lesson.phrases[0])}</span></div>
              {typeof score === "number" && <div className="lesson-score">BEST {score}%</div>}
              <button className="lesson-action" onClick={() => openLesson(lesson)}>{view === "study" ? <>{direction === "ja-id" ? "例文と解説を読む" : "Baca contoh dan penjelasan"}</> : isDone ? <><Icon name="check" size={18} />{direction === "ja-id" ? "復習する" : "Ulangi"}</> : <>{direction === "ja-id" ? "レッスン開始" : "Mulai pelajaran"}<Icon name="arrow" size={17} /></>}</button>
            </article>;
          })}
        </div>
      </section>

      {(view === "study" || catalogOpen) && filteredLessons.length > visibleCount && <div className="more-lessons"><button className="outline-button" onClick={() => setVisibleCount(count => count + 12)}>{direction === "ja-id" ? "さらに12レッスンを見る" : "Lihat 12 pelajaran lagi"} ↓</button></div>}
      {!filteredLessons.length && <p className="no-lessons" role="status">{direction === "ja-id" ? "条件に合う教材がありません。検索や絞り込みを変更してください。" : "Tidak ada pelajaran yang cocok. Ubah pencarian atau filter."}</p>}
      </>}
      {view === "review" && <section className="review-section" id="review">
        <div className="review-copy"><div className="section-kicker">SPACED REPETITION</div><h2>{direction === "ja-id" ? "忘れる前に、もう一度。" : "Ulangi sebelum lupa."}</h2><p>{direction === "ja-id" ? "Again / Hard / Good / Easy の評価から次回復習日を自動調整します。" : "Nilai Again / Hard / Good / Easy akan mengatur jadwal ulasan berikutnya."}</p></div>
        <div className="review-card">
          {!currentReview || !currentReviewPhrase ? <div className="review-empty"><Icon name="check" size={28} /><strong>{direction === "ja-id" ? "今日の復習は完了" : "Ulasan hari ini selesai"}</strong><span>{direction === "ja-id" ? "レッスンを進めると新しい復習カードが追加されます。" : "Selesaikan pelajaran untuk menambah kartu ulasan."}</span></div> : <>
            <div className="review-top"><span>SRS · {reviews.length} DUE</span><button onClick={() => speak(targetText(direction, currentReviewPhrase))}><Icon name="volume" size={19} /></button></div>
            <div className="review-question"><small>{direction === "ja-id" ? "この表現を思い出してください" : "Ingat ungkapan ini"}</small><strong>{sourceText(direction, currentReviewPhrase)}</strong></div>
            {!reviewRevealed ? <button className="reveal-button" onClick={() => setReviewRevealed(true)}>{direction === "ja-id" ? "答えを見る" : "Lihat jawaban"}</button> : <div className="review-answer"><strong>{targetText(direction, currentReviewPhrase)}</strong><ExpressionCard key={currentReview.key} phrase={currentReviewPhrase} direction={direction} /><div className="grade-grid">
              {(["again", "hard", "good", "easy"] as ReviewGrade[]).map((grade) => <button key={grade} onClick={() => handleReviewGrade(grade)}><b>{grade === "again" ? (direction === "ja-id" ? "もう一度" : "Ulangi") : grade === "hard" ? (direction === "ja-id" ? "難しい" : "Sulit") : grade === "good" ? (direction === "ja-id" ? "できた" : "Bagus") : (direction === "ja-id" ? "簡単" : "Mudah")}</b><span>{grade === "again" ? "10m" : grade === "hard" ? "1d" : grade === "good" ? "1d+" : "3d+"}</span></button>)}
            </div></div>}
          </>}
        </div>
      </section>}

      {activeLesson && <div className="modal-backdrop lesson-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLesson(); }}>
        <div ref={modalRef} className={view === "study" ? "lesson-player" : "lesson-player immersion-player"} role="dialog" aria-modal="true" aria-labelledby="lesson-title" tabIndex={-1}>
          <button className="modal-close" aria-label={direction === "ja-id" ? "閉じる" : "Tutup"} onClick={closeLesson}>×</button>
          <div className="player-header"><div><span>{activeLesson.level}</span><h2 id="lesson-title">{direction === "ja-id" ? activeLesson.titleJa : activeLesson.titleId}</h2></div><div className="phase-pills"><span className="active">{view === "study" ? (direction === "ja-id" ? "学習モード" : "Mode belajar") : lessonPhase === "result" ? (direction === "ja-id" ? "結果" : "Hasil") : (direction === "ja-id" ? "翻訳問題" : "Terjemahan")}</span></div></div>

          {lessonPhase === "learn" && <div className="learn-stage">
            <div className="grammar-panel"><div className="section-kicker">GRAMMAR MAP</div><p>{direction === "ja-id" ? activeLesson.grammarJa : activeLesson.grammarId}</p></div>
            <div className="phrase-player"><div className="phrase-progress"><span>{phraseIndex + 1} / {activeLesson.phrases.length}</span><div><i style={{ width: `${((phraseIndex + 1) / activeLesson.phrases.length) * 100}%` }} /></div></div><small>{sourceText(direction, activeLesson.phrases[phraseIndex])}</small><strong>{targetText(direction, activeLesson.phrases[phraseIndex])}</strong>{activeLesson.phrases[phraseIndex].reading && direction === "ja-id" && <em>{activeLesson.phrases[phraseIndex].reading}</em>}<p>{direction === "ja-id" ? activeLesson.phrases[phraseIndex].noteJa : activeLesson.phrases[phraseIndex].noteId}</p><ExpressionCard key={`${activeLesson.id}:${phraseIndex}:${direction}`} phrase={activeLesson.phrases[phraseIndex]} direction={direction} onSave={() => setLearning(current => upsertReviewItem(current, { lessonId: activeLesson.id, phraseIndex, direction }))} /><div className="player-actions"><button className="audio-button" onClick={() => speak(targetText(direction, activeLesson.phrases[phraseIndex]))}><Icon name="volume" size={19} />{direction === "ja-id" ? "発音" : "Audio"}</button><button className="next-button" onClick={nextPhrase}>{phraseIndex === activeLesson.phrases.length - 1 ? (direction === "ja-id" ? "学習を終える" : "Selesai belajar") : (direction === "ja-id" ? "次へ" : "Berikutnya")}<Icon name="arrow" size={18} /></button></div></div>
          </div>}

          {lessonPhase === "quiz" && (() => { const question = activeLesson.quiz[quizIndex]; const choices = quizChoices; const expected = direction === "ja-id" ? question.answerId : question.answerJa; return <div className="quiz-stage"><div className="quiz-progress"><span>{repairQueue.length ? (direction === "ja-id" ? "間違いを解き直そう" : "Perbaiki kesalahan") : `QUESTION ${quizIndex + 1} / ${activeLesson.quiz.length}`}</span><strong>{combo > 1 ? `${combo} ${direction === "ja-id" ? "連続正解" : "beruntun"}` : `${quizScore} pts`}</strong></div><progress className="lesson-progress" aria-label={direction === "ja-id" ? "レッスン進捗" : "Progres pelajaran"} max={repairQueue.length || activeLesson.quiz.length} value={repairQueue.length ? repairPosition : quizIndex}/ >{(question as SessionQuestion).isReview&&<p className="question-instruction">{direction==="ja-id"?"復習 · 前に学んだ表現をもう一度":"Ulasan · ulangi ungkapan"}</p>}<LessonQuestion key={`${question.id}:${direction}`} question={question} direction={direction} choices={choices} answered={Boolean(selectedAnswer)} selected={selectedAnswer ?? undefined} mode={answerMode} onMode={setAnswerMode} onAnswer={answerQuestion} />{selectedAnswer && <div role="status" aria-live="polite" className={`quiz-feedback ${answerCorrect ? "correct" : "wrong"}`}><strong>{answerCorrect ? (direction === "ja-id" ? "正解" : "Benar") : (direction === "ja-id" ? "もう一歩" : "Belum tepat")}</strong><p className="model-answer">{expected}</p>{answerMode !== "choose" && !answerCorrect && <p>{direction === "ja-id" ? "模範例と一致しませんでした。別の正しい訳もあり、この照合だけで文法の誤りとは断定できません。" : "Jawaban berbeda dari contoh. Terjemahan lain juga bisa benar."}</p>}<p>{direction === "ja-id" ? question.explanationJa : question.explanationId}</p><button className="next-button" onClick={nextQuestion}>{!repairQueue.length && quizIndex === activeLesson.quiz.length - 1 ? (direction === "ja-id" ? "結果を見る" : "Lihat hasil") : (direction === "ja-id" ? "次の問題" : "Soal berikutnya")}<Icon name="arrow" size={18} /></button></div>}</div>; })()}

          {lessonPhase === "result" && <div className="result-stage"><div className={`result-ring ${lessonScore >= 67 ? "pass" : ""}`}><strong>{lessonScore}%</strong><span>{lessonScore >= 67 ? "PASS" : "RETRY"}</span></div><h3>{lessonScore >= 67 ? (direction === "ja-id" ? "レッスン完了" : "Pelajaran selesai") : (direction === "ja-id" ? "もう一度挑戦" : "Coba lagi")}</h3><p>{lessonScore >= 67 ? (direction === "ja-id" ? "解いた表現は復習に追加しました。次のレッスンに進むか、あとで復習しましょう。" : "Contoh sudah masuk antrean SRS dan akan muncul lagi sesuai jadwal ulasan.") : (direction === "ja-id" ? "67%以上で完了です。間違えたポイントを確認して再挑戦しましょう。" : "Butuh 67% untuk lulus. Tinjau lalu coba lagi.")}</p><div className="result-metrics"><div className="result-xp"><Icon name="spark" size={24}/><strong>+{learning.stats.xp - sessionXpStart.current}</strong><span>{direction === "ja-id" ? "獲得 XP" : "XP diperoleh"}</span></div><div><strong>{quizScore}/{activeLesson.quiz.length}</strong><span>{direction === "ja-id" ? "初回の正解" : "Benar pertama"}</span></div><div><strong>{bestCombo}</strong><span>{direction === "ja-id" ? "最高連続正解" : "Terbaik beruntun"}</span></div></div>{mistakes.length > 0 && <button className="repair-button primary-button" onClick={repairMistakes}>{direction === "ja-id" ? `間違えた${mistakes.length}問を解き直す` : `Ulangi ${mistakes.length} kesalahan`}</button>}<div className="result-actions"><button className="outline-button" onClick={retryLessonQuiz}>{direction === "ja-id" ? "クイズ再挑戦" : "Ulangi kuis"}</button>{lessonScore >= 67 && followingLesson && <button className="next-button" onClick={() => openLesson(followingLesson)}>{direction === "ja-id" ? "次のレッスンへ" : "Pelajaran berikutnya"}<Icon name="arrow" size={18} /></button>}<button className="outline-button" onClick={closeLesson}>{direction === "ja-id" ? "一覧に戻る" : "Kembali ke daftar"}</button></div></div>}
        </div>
      </div>}

      {view === "login" && <section className="login-page">
        <div className="auth-modal login-card">
          <div className="auth-icon"><Icon name={authMode === "signin" ? "login" : "user"} size={24} /></div>
          <h1>{authMode === "signin" ? (direction === "ja-id" ? "ログイン" : "Masuk") : (direction === "ja-id" ? "アカウントを作成" : "Buat akun")}</h1>
          <p className="modal-description">{direction === "ja-id" ? "アカウントにログインして、学習を続けましょう。" : "Masuk ke akun untuk melanjutkan belajar."}</p>
          {user ? <div className="signed-in-message"><p>{direction === "ja-id" ? "ログイン済みです。" : "Anda sudah masuk."}</p><Link href="/dashboard" className="primary-button">{direction === "ja-id" ? "学習状況を見る" : "Lihat progres"} →</Link></div> : <>
            <form onSubmit={submitAuth}>
              {authMode === "signup" && <label>{direction === "ja-id" ? "表示名" : "Nama"}<input autoComplete="nickname" value={displayName} onChange={e => setDisplayName(e.target.value)} /></label>}
              <label>Email<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
              <label>{direction === "ja-id" ? "パスワード" : "Kata sandi"}<input type="password" autoComplete={authMode === "signin" ? "current-password" : "new-password"} value={password} onChange={e => setPassword(e.target.value)} minLength={6} required /></label>
              {authMessage && <div className="auth-message" role="status">{authMessage}</div>}
              <button className="auth-submit" disabled={authBusy}>{authBusy ? (direction === "ja-id" ? "処理中…" : "Memproses…") : authMode === "signin" ? (direction === "ja-id" ? "ログイン" : "Masuk") : (direction === "ja-id" ? "作成" : "Daftar")}<Icon name="arrow" size={18} /></button>
            </form>
            <button className="mode-switch" onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setAuthMessage(""); }}>{authMode === "signin" ? (direction === "ja-id" ? "アカウントを作成" : "Buat akun") : (direction === "ja-id" ? "ログインへ" : "Ke login")}</button>
            <Link className="guest-link" href="/lesson">{direction === "ja-id" ? "ログインせずにレッスンを見る" : "Lihat pelajaran tanpa login"} →</Link>
          </>}
        </div>
      </section>}

      <footer className="app-footer"><Link href="/" className="brand footer-brand"><BridgeMark /><span>Jendy</span></Link><p>Japanese ↔ Bahasa Indonesia · Understand the why</p><span>© 2026 Jendy</span></footer>
      </main>
    </div>
  );
}

