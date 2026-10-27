"use client";

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

const featuredLesson = lessons.find(lesson => lesson.id === "contrast-already") ?? lessons[0];

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

export type PageView = "home" | "login" | "lesson" | "practice" | "dictionary" | "review" | "dashboard";

export function JendyApp({ view }: { view: PageView }) {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [direction, setDirection] = useState<Direction>("ja-id");
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [learning, setLearning] = useState<LearningState>(createEmptyLearningState);

  const [storageReady, setStorageReady] = useState(false);
  const [courseLevel, setCourseLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonPhase, setLessonPhase] = useState<LessonPhase>("learn");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
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

  useModalFocus(Boolean(activeLesson), modalRef, () => setActiveLesson(null));
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
    setLearning(loadLearningState());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) saveLearningState(learning);
  }, [learning, storageReady]);

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
    setActiveLesson(lesson);
    setLessonPhase("learn");
    setPhraseIndex(0);
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setAnswerCorrect(null);
  }

  function closeLesson() {
    setActiveLesson(null);
  }

  function nextPhrase() {
    if (!activeLesson) return;
    const phrase = activeLesson.phrases[phraseIndex];
    setLearning((current) => upsertReviewItem(current, { lessonId: activeLesson.id, phraseIndex, direction }));

    if (phraseIndex < activeLesson.phrases.length - 1) {
      setPhraseIndex((index) => index + 1);
    } else {
      setLessonPhase("quiz");
    }
  }

  function answerQuestion(choice: string) {
    if (!activeLesson || selectedAnswer) return;
    const question = activeLesson.quiz[quizIndex];
    const expected = direction === "ja-id" ? question.answerId : question.answerJa;
    const correct = choice === expected;
    setSelectedAnswer(choice);
    setAnswerCorrect(correct);
    if (correct) setQuizScore((score) => score + 1);
    setLearning((current) => recordAnswer(current, correct));
  }

  function nextQuestion() {
    if (!activeLesson) return;
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

  function retryLessonQuiz() {
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

  const lessonScore = activeLesson ? Math.round(quizScore / activeLesson.quiz.length * 100) : 0;

  return (
    <main>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Jendy home"><BridgeMark /><span>Jendy</span></Link>
        <nav className="nav-links" aria-label={direction === "ja-id" ? "メインナビゲーション" : "Navigasi utama"}>
          {([
            ["dashboard", "/dashboard", "学習状況", "Dasbor"],
            ["lesson", "/lesson", "レッスン", "Pelajaran"],
            ["practice", "/practice", "練習", "Latihan"],
            ["dictionary", "/dictionary", "語族辞書", "Keluarga kata"],
            ["review", "/review", "復習", "Ulasan"],
          ] as const).map(([page, href, ja, id]) => <Link key={href} href={href} aria-current={view === page ? "page" : undefined}>{direction === "ja-id" ? ja : id}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="direction-mini" onClick={switchDirection}><Icon name="swap" size={17} /><span>{direction === "ja-id" ? "JA → ID" : "ID → JA"}</span></button>
          {user ? <button className="ghost-button" onClick={signOut}><Icon name="logout" size={17} />{direction === "ja-id" ? "ログアウト" : "Keluar"}</button> : <Link className="ghost-button" href="/login" aria-current={view === "login" ? "page" : undefined}><Icon name="login" size={17} />{direction === "ja-id" ? "ログイン" : "Masuk"}</Link>}
        </div>
      </header>

      {view === "home" && <>
      <section className="hero" id="top">
        <div className="hero-copy"><BridgeMark />
          <div className="eyebrow"><span />{copy.eyebrow}</div>
          <h1>{copy.title.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1>
          <p>{copy.lead}</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/lesson">{copy.start}<Icon name="arrow" size={18} /></Link>
            <Link className="text-link" href="/lesson">{direction === "ja-id" ? "カリキュラムを見る" : "Lihat kurikulum"}</Link>
          </div>
          <div className="hero-proof">
            <div><strong>{learning.stats.xp}</strong><span>XP</span></div>
            <div><strong>{learning.stats.streak}</strong><span>{direction === "ja-id" ? "日ストリーク" : "hari streak"}</span></div>
            <div><strong>{reviews.length}</strong><span>{direction === "ja-id" ? "復習待ち" : "ulasan jatuh tempo"}</span></div>
          </div>
        </div>

        <div className="hero-card-wrap">
          <div className="flag-ribbon"><span className="flag-red" /><span className="flag-white" /></div>
          <div className="hero-card">
            <div className="card-topline"><span>LEARN THE WHY</span><Icon name="book" size={19} /></div>
            <p className="prompt-label">{direction === "ja-id" ? "もう・まだを、構造から理解する" : "Pahami もう・まだ lewat struktur"}</p>
            <p className="prompt-main" lang={direction === "ja-id" ? "id" : "ja"}>{direction === "ja-id" ? "Saya sudah makan" : "私はもう食べました"}</p>
            <p>{direction === "ja-id" ? "私はもう食べました" : "Saya sudah makan"}</p>
            <ExpressionCard key={direction} direction={direction} phrase={featuredLesson.phrases[0]} onSave={() => setLearning(current => upsertReviewItem(current, { lessonId: featuredLesson.id, phraseIndex: 0, direction }))} />
          </div>
        </div>
      </section>

      <section className="home-paths" aria-label={direction === "ja-id" ? "学習を選ぶ" : "Pilih kegiatan"}>
        <Link href="/lesson"><small>LESSONS</small><h2>{direction === "ja-id" ? "レッスンを選ぶ" : "Pilih pelajaran"}</h2><p>{direction === "ja-id" ? "A1からB1まで、192のレッスンを順番に学ぶ。" : "192 pelajaran dari A1 hingga B1."}</p><span>→</span></Link>
        <Link href="/practice"><small>PRACTICE</small><h2>{direction === "ja-id" ? "問題を解く" : "Kerjakan soal"}</h2><p>{direction === "ja-id" ? "12問ずつ、覚えた表現を使ってみる。" : "Latih ungkapan dalam sesi 12 soal."}</p><span>→</span></Link>
        <Link href="/review"><small>REVIEW</small><h2>{direction === "ja-id" ? "覚えた表現を復習" : "Ulangi ungkapan"}</h2><p>{direction === "ja-id" ? "復習する時期が来た表現を確認する。" : "Ulangi ungkapan yang sudah waktunya diulas."}</p><span>→</span></Link>
      </section>
      </>}

      {view !== "home" && view !== "login" && <div className="page-intro">
        <h1>{({ lesson: ["レッスン", "Pelajaran"], practice: ["練習", "Latihan"], dictionary: ["語族辞書", "Keluarga kata"], review: ["復習", "Ulasan"], dashboard: ["学習状況", "Progres belajar"] } as const)[view][direction === "ja-id" ? 0 : 1]}</h1>
      </div>}
      {view !== "home" && <section className="direction-panel">
        <div><Icon name="globe" size={22} /><span>{direction === "ja-id" ? "現在の学習方向" : "Arah belajar"}</span></div>
        <button onClick={switchDirection}><strong>{copy.source}</strong><Icon name="arrow" size={18} /><strong>{copy.target}</strong><span className="switch-hint"><Icon name="swap" size={15} />{direction === "ja-id" ? "逆方向へ" : "Balik arah"}</span></button>
      </section>}

      {view === "practice" && <PracticeLab key={direction} direction={direction} onAnswer={(correct, lessonId, phraseIndex) => setLearning(current => upsertReviewItem(recordAnswer(current, correct), { lessonId, phraseIndex, direction }))} />}
      {view === "dictionary" && <WordNetwork direction={direction} />}

      {view === "dashboard" && <section className="dashboard-section" id="dashboard">
        <div className="section-kicker">LEARNING DASHBOARD</div>
        <div className="dashboard-heading">
          <div><h2>{direction === "ja-id" ? "今日の学習状況" : "Progres belajar hari ini"}</h2><p>{direction === "ja-id" ? "読む → 解く → 復習する、を1つの流れに。" : "Baca → jawab → ulangi, dalam satu alur."}</p></div>
          <div className="sync-badge"><span className={user ? "online" : "local"} />{user ? (direction === "ja-id" ? "ログイン中" : "Sudah masuk") : (direction === "ja-id" ? "ゲスト" : "Tamu")}</div>
        </div>
        <div className="stat-grid">
          <article><span>XP</span><strong>{learning.stats.xp}</strong><small>{direction === "ja-id" ? "正解 +10 / 復習 +2〜10" : "Benar +10 / ulasan +2–10"}</small></article>
          <article><span>STREAK</span><strong>{learning.stats.streak}<em>{direction === "ja-id" ? "日" : " hari"}</em></strong><small>{direction === "ja-id" ? "学習した日を連続記録" : "Hari belajar berturut-turut"}</small></article>
          <article><span>ACCURACY</span><strong>{accuracy}%</strong><small>{learning.stats.answered} {direction === "ja-id" ? "問回答" : "jawaban"}</small></article>
          <article><span>REVIEW</span><strong>{reviews.length}</strong><small>{direction === "ja-id" ? "今すぐ復習できる項目" : "Item siap diulas"}</small></article>
        </div>
        <div className="dashboard-progress"><div><span>{direction === "ja-id" ? "基礎コース進捗" : "Progres kursus dasar"}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      </section>}

      {view === "lesson" && <>
      <section className="curriculum-section" id="curriculum">
        <div className="curriculum-header"><div><div className="section-kicker">STRUCTURED CURRICULUM</div><h2>{direction === "ja-id" ? `${lessons.length}の学び、2つの視点。` : `${lessons.length} pelajaran, dua sudut pandang.`}</h2></div><p className="curriculum-note">{direction === "ja-id" ? "基礎48 + 文の組み立て128 + 場面ミッション16" : "48 dasar + 128 latihan pola + 16 misi situasi"}</p></div>
        <div className="course-filters">
          <label>{direction === "ja-id" ? "教材を検索" : "Cari pelajaran"}<input type="search" value={search} onChange={e => { setSearch(e.target.value); setVisibleCount(12); }} placeholder={direction === "ja-id" ? "助詞、チャット、baca…" : "partikel, chat, baca…"} /></label>
          <label>{direction === "ja-id" ? "レベル" : "Tingkat"}<select value={courseLevel} onChange={e => { setCourseLevel(e.target.value); setVisibleCount(12); }}><option value="All">All</option>{["A1", "A2", "B1"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label>{direction === "ja-id" ? "テーマ" : "Tema"}<select value={category} onChange={e => { setCategory(e.target.value); setVisibleCount(12); }}><option value="All">All</option>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
          <span role="status">{filteredLessons.length} {direction === "ja-id" ? "レッスン" : "pelajaran"}</span>
        </div>
        <CultureBanner/><div className="stage-path"><h2>{direction === "ja-id" ? "ステージを進めよう" : "Lanjutkan tahap belajar"}</h2><p>{direction === "ja-id" ? "6レッスンで1ステージ。HP・回数制限なしで何度でも挑戦できます。" : "Enam pelajaran per tahap. Tanpa HP atau batas percobaan."}</p>{Array.from({length:Math.ceil(lessons.length/6)},(_,stage)=>{const batch=lessons.slice(stage*6,stage*6+6);const done=batch.filter(l=>completed.has(l.id)).length;const next=batch.find(l=>!completed.has(l.id))??batch[0];return <button key={stage} className={done===batch.length?"stage complete":"stage"} onClick={()=>openLesson(next)}><StageSeal number={stage+1} done={done} total={batch.length}/><strong>Stage {stage+1}</strong><small>{done} / {batch.length}</small></button>})}</div><div className="lesson-grid">
          {filteredLessons.slice(0, visibleCount).map((lesson) => {
            const isDone = completed.has(lesson.id);
            const score = learning.lessonScores[`${direction}:${lesson.id}`] ?? (direction === "ja-id" ? learning.lessonScores[lesson.id] : undefined);
            return <article className={`lesson-card ${isDone ? "done" : ""}`} key={lesson.id}>
              <div className="lesson-meta"><span>{lesson.level}</span><span>{lesson.minutes} min</span></div>
              <h3>{direction === "ja-id" ? lesson.titleJa : lesson.titleId}</h3>
              <p>{direction === "ja-id" ? lesson.descriptionJa : lesson.descriptionId}</p>
              <div className="lesson-example"><small>{direction === "ja-id" ? "KEY PHRASE" : "FRASA KUNCI"}</small><strong>{targetText(direction, lesson.phrases[0])}</strong><span>{sourceText(direction, lesson.phrases[0])}</span></div>
              {typeof score === "number" && <div className="lesson-score">BEST {score}%</div>}
              <button className="lesson-action" onClick={() => openLesson(lesson)}>{isDone ? <><Icon name="check" size={18} />{direction === "ja-id" ? "復習する" : "Ulangi"}</> : <>{direction === "ja-id" ? "レッスン開始" : "Mulai pelajaran"}<Icon name="arrow" size={17} /></>}</button>
            </article>;
          })}
        </div>
      </section>

      {filteredLessons.length > visibleCount && <div className="more-lessons"><button className="outline-button" onClick={() => setVisibleCount(count => count + 12)}>{direction === "ja-id" ? "さらに12レッスンを見る" : "Lihat 12 pelajaran lagi"} ↓</button></div>}
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
        <div ref={modalRef} className="lesson-player" role="dialog" aria-modal="true" aria-labelledby="lesson-title" tabIndex={-1}>
          <button className="modal-close" aria-label={direction === "ja-id" ? "閉じる" : "Tutup"} onClick={closeLesson}>×</button>
          <div className="player-header"><div><span>{activeLesson.level}</span><h2 id="lesson-title">{direction === "ja-id" ? activeLesson.titleJa : activeLesson.titleId}</h2></div><div className="phase-pills"><span className={lessonPhase === "learn" ? "active" : ""}>01 Learn</span><span className={lessonPhase === "quiz" ? "active" : ""}>02 Quiz</span><span className={lessonPhase === "result" ? "active" : ""}>03 Result</span></div></div>

          {lessonPhase === "learn" && <div className="learn-stage">
            <div className="grammar-panel"><div className="section-kicker">GRAMMAR MAP</div><p>{direction === "ja-id" ? activeLesson.grammarJa : activeLesson.grammarId}</p></div>
            <div className="phrase-player"><div className="phrase-progress"><span>{phraseIndex + 1} / {activeLesson.phrases.length}</span><div><i style={{ width: `${((phraseIndex + 1) / activeLesson.phrases.length) * 100}%` }} /></div></div><small>{sourceText(direction, activeLesson.phrases[phraseIndex])}</small><strong>{targetText(direction, activeLesson.phrases[phraseIndex])}</strong>{activeLesson.phrases[phraseIndex].reading && direction === "ja-id" && <em>{activeLesson.phrases[phraseIndex].reading}</em>}<p>{direction === "ja-id" ? activeLesson.phrases[phraseIndex].noteJa : activeLesson.phrases[phraseIndex].noteId}</p><ExpressionCard key={`${activeLesson.id}:${phraseIndex}:${direction}`} phrase={activeLesson.phrases[phraseIndex]} direction={direction} onSave={() => setLearning(current => upsertReviewItem(current, { lessonId: activeLesson.id, phraseIndex, direction }))} /><div className="player-actions"><button className="audio-button" onClick={() => speak(targetText(direction, activeLesson.phrases[phraseIndex]))}><Icon name="volume" size={19} />{direction === "ja-id" ? "発音" : "Audio"}</button><button className="next-button" onClick={nextPhrase}>{phraseIndex === activeLesson.phrases.length - 1 ? (direction === "ja-id" ? "クイズへ" : "Ke kuis") : (direction === "ja-id" ? "次へ" : "Berikutnya")}<Icon name="arrow" size={18} /></button></div></div>
          </div>}

          {lessonPhase === "quiz" && (() => { const question = activeLesson.quiz[quizIndex]; const choices = quizChoices; const expected = direction === "ja-id" ? question.answerId : question.answerJa; return <div className="quiz-stage"><div className="quiz-progress"><span>QUESTION {quizIndex + 1} / {activeLesson.quiz.length}</span><strong>{quizScore} pts</strong></div><h3>{direction === "ja-id" ? question.promptJa : question.promptId}</h3><div className="choice-grid">{choices.map((choice) => { const state = selectedAnswer ? choice === expected ? "correct" : choice === selectedAnswer ? "wrong" : "muted" : ""; return <button key={choice} className={state} disabled={Boolean(selectedAnswer)} onClick={() => answerQuestion(choice)}>{choice}</button>; })}</div>{selectedAnswer && <div className={`quiz-feedback ${answerCorrect ? "correct" : "wrong"}`}><strong>{answerCorrect ? (direction === "ja-id" ? "正解" : "Benar") : (direction === "ja-id" ? "もう一歩" : "Belum tepat")}</strong><p>{direction === "ja-id" ? question.explanationJa : question.explanationId}</p><button className="next-button" onClick={nextQuestion}>{quizIndex === activeLesson.quiz.length - 1 ? (direction === "ja-id" ? "結果を見る" : "Lihat hasil") : (direction === "ja-id" ? "次の問題" : "Soal berikutnya")}<Icon name="arrow" size={18} /></button></div>}</div>; })()}

          {lessonPhase === "result" && <div className="result-stage"><div className={`result-ring ${lessonScore >= 67 ? "pass" : ""}`}><strong>{lessonScore}%</strong><span>{lessonScore >= 67 ? "PASS" : "RETRY"}</span></div><h3>{lessonScore >= 67 ? (direction === "ja-id" ? "レッスン完了" : "Pelajaran selesai") : (direction === "ja-id" ? "もう一度挑戦" : "Coba lagi")}</h3><p>{lessonScore >= 67 ? (direction === "ja-id" ? "例文は復習キューに入りました。忘却曲線に合わせて再登場します。" : "Contoh sudah masuk antrean SRS dan akan muncul lagi sesuai jadwal ulasan.") : (direction === "ja-id" ? "67%以上で完了です。間違えたポイントを確認して再挑戦しましょう。" : "Butuh 67% untuk lulus. Tinjau lalu coba lagi.")}</p><div className="result-actions"><button className="outline-button" onClick={retryLessonQuiz}>{direction === "ja-id" ? "クイズ再挑戦" : "Ulangi kuis"}</button><button className="next-button" onClick={closeLesson}>{direction === "ja-id" ? "終了" : "Selesai"}</button></div></div>}
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

      <footer><Link href="/" className="brand footer-brand"><BridgeMark /><span>Jendy</span></Link><p>Japanese ↔ Bahasa Indonesia · Understand the why</p><span>© 2026 Jendy</span></footer>
    </main>
  );
}

