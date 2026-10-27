"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Icon } from "@/components/Icon";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type Direction = "ja-id" | "id-ja";
type AuthMode = "signin" | "signup";

type Lesson = {
  id: string;
  level: string;
  titleJa: string;
  titleId: string;
  descriptionJa: string;
  descriptionId: string;
  minutes: number;
  phrases: Array<{ ja: string; id: string; noteJa: string; noteId: string }>;
};

const LOCAL_PROGRESS_KEY = "jendy:progress:v1";
const LOCAL_DIRECTION_KEY = "jendy:direction:v1";

const lessons: Lesson[] = [
  {
    id: "greetings-01",
    level: "A1 · 01",
    titleJa: "あいさつと自己紹介",
    titleId: "Salam & perkenalan",
    descriptionJa: "時間帯のあいさつ、名前、出身を自然に伝える。",
    descriptionId: "Belajar salam, nama, dan asal dengan ungkapan alami.",
    minutes: 12,
    phrases: [
      { ja: "おはようございます", id: "Selamat pagi", noteJa: "朝の丁寧なあいさつ", noteId: "Salam sopan pada pagi hari" },
      { ja: "私の名前はユキです", id: "Nama saya Yuki", noteJa: "saya は丁寧な「私」", noteId: "saya adalah kata sopan untuk ‘saya/aku’" },
      { ja: "日本から来ました", id: "Saya dari Jepang", noteJa: "日常会話では簡潔な形が自然", noteId: "Bentuk ringkas ini alami dalam percakapan" },
    ],
  },
  {
    id: "sentence-01",
    level: "A1 · 02",
    titleJa: "語順と基本文",
    titleId: "Urutan kata dasar",
    descriptionJa: "インドネシア語のSVOと、日本語のSOVの違いを体で覚える。",
    descriptionId: "Pahami perbedaan pola SVO bahasa Indonesia dan SOV bahasa Jepang.",
    minutes: 16,
    phrases: [
      { ja: "私はコーヒーを飲みます", id: "Saya minum kopi", noteJa: "Saya + minum + kopi の順", noteId: "Pola: subjek + verba + objek" },
      { ja: "彼は本を読みます", id: "Dia membaca buku", noteJa: "meN- は能動動詞でよく使う接頭辞", noteId: "meN- sering membentuk verba aktif" },
      { ja: "これは私の本です", id: "Ini buku saya", noteJa: "所有者は名詞の後ろ", noteId: "Pemilik biasanya berada setelah nomina" },
    ],
  },
  {
    id: "numbers-01",
    level: "A1 · 03",
    titleJa: "数字・時間・値段",
    titleId: "Angka, waktu & harga",
    descriptionJa: "買い物と待ち合わせに必要な数字表現をまとめて習得。",
    descriptionId: "Kuasai angka untuk belanja, waktu, dan membuat janji.",
    minutes: 14,
    phrases: [
      { ja: "これはいくらですか？", id: "Berapa harganya?", noteJa: "berapa = いくつ／いくら", noteId: "berapa berarti ‘berapa/bagaimana jumlahnya’" },
      { ja: "三時です", id: "Jam tiga", noteJa: "jam + 数字で時刻", noteId: "Gunakan jam + angka untuk menyatakan waktu" },
      { ja: "二万ルピア", id: "Dua puluh ribu rupiah", noteJa: "ribu = 千", noteId: "ribu berarti seribu" },
    ],
  },
  {
    id: "daily-01",
    level: "A1 · 04",
    titleJa: "毎日の動作",
    titleId: "Kegiatan sehari-hari",
    descriptionJa: "食べる、行く、働く、勉強するを使って一日を話す。",
    descriptionId: "Ceritakan rutinitas dengan makan, pergi, bekerja, dan belajar.",
    minutes: 18,
    phrases: [
      { ja: "毎朝六時に起きます", id: "Saya bangun jam enam setiap pagi", noteJa: "setiap = 毎〜", noteId: "setiap berarti ‘setiap’" },
      { ja: "会社で働きます", id: "Saya bekerja di kantor", noteJa: "di = 場所を表す「〜で／に」", noteId: "di menandai lokasi" },
      { ja: "夜にインドネシア語を勉強します", id: "Malam hari saya belajar bahasa Indonesia", noteJa: "時間は文頭にも置ける", noteId: "Keterangan waktu dapat diletakkan di awal" },
    ],
  },
  {
    id: "travel-01",
    level: "A2 · 01",
    titleJa: "移動と旅行",
    titleId: "Perjalanan & transportasi",
    descriptionJa: "空港、配車、ホテルで困らないための実用表現。",
    descriptionId: "Ungkapan praktis untuk bandara, transportasi, dan hotel.",
    minutes: 20,
    phrases: [
      { ja: "駅はどこですか？", id: "Stasiun di mana?", noteJa: "di mana = どこ", noteId: "di mana berarti ‘di mana’" },
      { ja: "ここで降ります", id: "Saya turun di sini", noteJa: "turun = 降りる", noteId: "turun berarti turun dari kendaraan" },
      { ja: "予約しています", id: "Saya sudah reservasi", noteJa: "sudah = すでに／完了", noteId: "sudah menandai sesuatu telah dilakukan" },
    ],
  },
  {
    id: "conversation-01",
    level: "A2 · 02",
    titleJa: "会話をつなぐ",
    titleId: "Menyambung percakapan",
    descriptionJa: "相づち、聞き返し、理由説明で短文から会話へ。",
    descriptionId: "Gunakan respons, klarifikasi, dan alasan agar percakapan lebih alami.",
    minutes: 22,
    phrases: [
      { ja: "もう一度お願いします", id: "Tolong ulangi sekali lagi", noteJa: "tolong = 〜してください", noteId: "tolong membuat permintaan lebih sopan" },
      { ja: "どういう意味ですか？", id: "Apa maksudnya?", noteJa: "maksud = 意味／意図", noteId: "maksud berarti arti atau maksud" },
      { ja: "なぜなら、仕事があるからです", id: "Karena saya harus bekerja", noteJa: "karena = なぜなら／〜なので", noteId: "karena memperkenalkan alasan" },
    ],
  },
];

function directionText(direction: Direction) {
  return direction === "ja-id"
    ? {
        source: "日本語",
        target: "Bahasa Indonesia",
        eyebrow: "BAHASA INDONESIA, DENGAN PENJELASAN JEPANG",
        title: "インドネシア語を、\n暗記ではなく理解する。",
        lead: "日本語話者がつまずきやすい語順・接辞・会話の温度感まで。実際に使えるBahasa Indonesiaを段階的に学びます。",
        start: "基礎から始める",
        curriculum: "カリキュラムを見る",
      }
    : {
        source: "Bahasa Indonesia",
        target: "日本語",
        eyebrow: "BELAJAR BAHASA JEPANG DALAM BAHASA INDONESIA",
        title: "Belajar bahasa Jepang,\nbukan sekadar menghafal.",
        lead: "Pelajari struktur kalimat, partikel, nuansa, dan percakapan nyata dengan penjelasan bahasa Indonesia yang jelas.",
        start: "Mulai dari dasar",
        curriculum: "Lihat kurikulum",
      };
}

function readLocalProgress(direction: Direction) {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const raw = window.localStorage.getItem(LOCAL_PROGRESS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Record<Direction, string[]>>) : {};
    const items = parsed[direction];
    return new Set(Array.isArray(items) ? items.filter((item): item is string => typeof item === "string") : []);
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
    // Storage can be unavailable in strict/private browser modes. The in-memory state still works.
  }
}

function writeLocalDirection(direction: Direction) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_DIRECTION_KEY, direction);
  } catch {
    // Ignore storage failures and keep the current session usable.
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

export default function Home() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [direction, setDirection] = useState<Direction>("ja-id");
  const [user, setUser] = useState<User | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [savingLesson, setSavingLesson] = useState<string | null>(null);

  const copy = directionText(direction);

  useEffect(() => {
    try {
      const savedDirection = window.localStorage.getItem(LOCAL_DIRECTION_KEY);
      if (savedDirection === "ja-id" || savedDirection === "id-ja") setDirection(savedDirection);
    } catch {
      // Local storage is optional; defaults keep the app functional.
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    void (async () => {
      try {
        const { data } = await withTimeout(supabase.auth.getUser());
        if (active) setUser(data.user ?? null);
      } catch {
        // Supabase may be paused/offline. Local learning must remain fully usable.
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

        const localOnly = [...local].filter((lessonId) => !remote.has(lessonId));
        if (localOnly.length > 0) {
          await withTimeout(
            supabase.from("jendy_progress").upsert(
              localOnly.map((lessonId) => ({
                user_id: user.id,
                lesson_id: lessonId,
                direction,
                completed: true,
                score: 100,
                updated_at: new Date().toISOString(),
              })),
              { onConflict: "user_id,lesson_id,direction" },
            ),
          );
        }
      } catch {
        // Cloud sync is best-effort. Local progress is the source of continuity while offline.
      }
    })();

    return () => {
      active = false;
    };
  }, [supabase, user, direction]);

  function syncDirectionToCloud(next: Direction) {
    if (!supabase || !user) return;

    void (async () => {
      try {
        await withTimeout(
          supabase.from("jendy_profiles").upsert(
            {
              user_id: user.id,
              display_name: user.user_metadata?.display_name ?? null,
              learning_direction: next,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" },
          ),
        );
      } catch {
        // Direction is already persisted locally; cloud can catch up later.
      }
    })();
  }

  function switchDirection() {
    const next = direction === "ja-id" ? "id-ja" : "ja-id";
    setDirection(next);
    writeLocalDirection(next);
    syncDirectionToCloud(next);
  }

  function openAuth(mode: AuthMode) {
    setAuthMode(mode);
    setAuthMessage("");
    setAuthOpen(true);
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setAuthMessage(
        direction === "ja-id"
          ? "現在はローカルモードです。ログインなしでも進捗はこの端末に保存されます。"
          : "Mode lokal aktif. Progres tetap tersimpan di perangkat ini tanpa login.",
      );
      return;
    }

    setAuthBusy(true);
    setAuthMessage("");

    try {
      if (authMode === "signin") {
        const { error } = await withTimeout(supabase.auth.signInWithPassword({ email, password }));
        if (error) setAuthMessage(error.message);
        else {
          setAuthMessage(direction === "ja-id" ? "ログインしました。ローカル進捗も同期します。" : "Berhasil masuk. Progres lokal akan disinkronkan.");
          setTimeout(() => setAuthOpen(false), 450);
        }
      } else {
        const { data, error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { display_name: displayName },
            },
          }),
        );

        if (error) {
          setAuthMessage(error.message);
        } else if (!data.session) {
          setAuthMessage(
            direction === "ja-id"
              ? "確認メールを送りました。メール内のリンクを開いて登録を完了してください。"
              : "Email konfirmasi sudah dikirim. Buka tautannya untuk menyelesaikan pendaftaran.",
          );
        } else {
          setAuthMessage(direction === "ja-id" ? "アカウントを作成しました。" : "Akun berhasil dibuat.");
          setTimeout(() => setAuthOpen(false), 450);
        }
      }
    } catch {
      setAuthMessage(
        direction === "ja-id"
          ? "クラウドに接続できません。ローカル学習はそのまま利用できます。"
          : "Tidak dapat terhubung ke cloud. Mode belajar lokal tetap dapat digunakan.",
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function signOut() {
    if (supabase) {
      try {
        await withTimeout(supabase.auth.signOut());
      } catch {
        // Signing out of the remote session can fail while offline; local progress remains intact.
      }
    }
    setUser(null);
    setCompleted(readLocalProgress(direction));
  }

  function completeLesson(lessonId: string) {
    setSavingLesson(lessonId);
    const next = new Set([...completed, lessonId]);
    setCompleted(next);
    writeLocalProgress(direction, next);
    setSavingLesson(null);

    if (!supabase || !user) return;

    void (async () => {
      try {
        await withTimeout(
          supabase.from("jendy_progress").upsert(
            {
              user_id: user.id,
              lesson_id: lessonId,
              direction,
              completed: true,
              score: 100,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,lesson_id,direction" },
          ),
        );
      } catch {
        // Local completion is already saved. It will be merged on a later successful session.
      }
    })();
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = direction === "ja-id" ? "id-ID" : "ja-JP";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  const progress = Math.round((completed.size / lessons.length) * 100);

  return (
    <main>
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Jendy home">
          <span className="brand-mark"><span /></span>
          <span>Jendy</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#curriculum">{direction === "ja-id" ? "学ぶ" : "Belajar"}</a>
          <a href="#method">{direction === "ja-id" ? "学習法" : "Metode"}</a>
          <a href="#sample">{direction === "ja-id" ? "例文" : "Contoh"}</a>
        </nav>

        <div className="header-actions">
          <button className="direction-mini" onClick={switchDirection} aria-label="学習方向を切り替える">
            <Icon name="swap" size={17} />
            <span>{direction === "ja-id" ? "JA → ID" : "ID → JA"}</span>
          </button>
          {user ? (
            <button className="ghost-button" onClick={signOut}><Icon name="logout" size={17} />{direction === "ja-id" ? "ログアウト" : "Keluar"}</button>
          ) : (
            <button className="ghost-button" onClick={() => openAuth("signin")}><Icon name="login" size={17} />{direction === "ja-id" ? "ログイン" : "Masuk"}</button>
          )}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span />{copy.eyebrow}</div>
          <h1>{copy.title.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</h1>
          <p>{copy.lead}</p>
          <div className="hero-actions">
            <a className="primary-button" href="#curriculum">{copy.start}<Icon name="arrow" size={18} /></a>
            <a className="text-link" href="#curriculum">{copy.curriculum}</a>
          </div>
          <div className="hero-proof">
            <div><strong>6</strong><span>{direction === "ja-id" ? "基礎ユニット" : "unit dasar"}</span></div>
            <div><strong>2-way</strong><span>{direction === "ja-id" ? "双方向学習" : "dua arah"}</span></div>
            <div><strong>LOCAL</strong><span>{direction === "ja-id" ? "オフライン進捗保存" : "progres lokal"}</span></div>
          </div>
        </div>

        <div className="hero-card-wrap" aria-label="学習プレビュー">
          <div className="flag-ribbon"><span className="flag-red" /><span className="flag-white" /></div>
          <div className="hero-card">
            <div className="card-topline">
              <span>{direction === "ja-id" ? "LESSON 01 · GREETINGS" : "PELAJARAN 01 · あいさつ"}</span>
              <Icon name="book" size={19} />
            </div>
            <p className="prompt-label">{direction === "ja-id" ? "この表現をインドネシア語で" : "Ucapkan dalam bahasa Jepang"}</p>
            <p className="prompt-main">{direction === "ja-id" ? "「はじめまして」" : "“Senang bertemu dengan Anda.”"}</p>
            <div className="answer-box">
              <span className="answer-language">{direction === "ja-id" ? "ID" : "JA"}</span>
              <div>
                <strong>{direction === "ja-id" ? "Senang berkenalan dengan Anda." : "はじめまして。"}</strong>
                <small>{direction === "ja-id" ? "sə-naŋ bər-kə-na-lan" : "Hajimemashite"}</small>
              </div>
              <button onClick={() => speak(direction === "ja-id" ? "Senang berkenalan dengan Anda" : "はじめまして")} aria-label="発音を再生">
                <Icon name="volume" size={20} />
              </button>
            </div>
            <div className="grammar-note">
              <Icon name="spark" size={18} />
              <p>{direction === "ja-id" ? <><b>berkenalan</b> は「知り合う・自己紹介し合う」。ber- が付くことで状態や相互的な動作を表します。</> : <><b>はじめまして</b> dipakai saat pertama kali bertemu. Biasanya diikuti perkenalan nama dan 「よろしくお願いします」.</>}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="direction-panel" aria-label="学習方向">
        <div>
          <Icon name="globe" size={22} />
          <span>{direction === "ja-id" ? "現在のコース" : "Kursus saat ini"}</span>
        </div>
        <button onClick={switchDirection}>
          <strong>{copy.source}</strong>
          <Icon name="arrow" size={18} />
          <strong>{copy.target}</strong>
          <span className="switch-hint"><Icon name="swap" size={15} />{direction === "ja-id" ? "逆方向へ" : "Balik arah"}</span>
        </button>
      </section>

      <section className="method-section" id="method">
        <div className="section-kicker">{direction === "ja-id" ? "WHY JENDY" : "KENAPA JENDY"}</div>
        <div className="section-heading-row">
          <h2>{direction === "ja-id" ? "「通じる」までを、構造化する。" : "Dari paham sampai benar-benar bisa dipakai."}</h2>
          <p>{direction === "ja-id" ? "単語だけでは会話になりません。Jendyは、文法の理由・音・実際の場面をひとつのレッスンで結びます。" : "Kosakata saja tidak cukup. Jendy menghubungkan alasan tata bahasa, bunyi, dan konteks nyata dalam satu pelajaran."}</p>
        </div>
        <div className="method-grid">
          <article><span>01</span><Icon name="book" size={24} /><h3>{direction === "ja-id" ? "母語で深く理解" : "Pahami lewat bahasa ibu"}</h3><p>{direction === "ja-id" ? "直訳では分からない接辞や語感を、日本語との差から説明。" : "Partikel dan nuansa Jepang dijelaskan melalui perbandingan dengan bahasa Indonesia."}</p></article>
          <article><span>02</span><Icon name="volume" size={24} /><h3>{direction === "ja-id" ? "音と一緒に覚える" : "Belajar bersama bunyi"}</h3><p>{direction === "ja-id" ? "例文はワンタップで読み上げ。文字だけの暗記から抜け出します。" : "Contoh dapat dibacakan dengan sekali tekan agar tidak hanya menghafal tulisan."}</p></article>
          <article><span>03</span><Icon name="chart" size={24} /><h3>{direction === "ja-id" ? "止まらない進捗保存" : "Progres tetap berjalan"}</h3><p>{direction === "ja-id" ? "まず端末に保存し、ログイン中はSupabaseにも同期。クラウド停止中でも学習できます。" : "Progres disimpan di perangkat terlebih dahulu lalu disinkronkan ke Supabase saat login. Belajar tetap berjalan saat cloud offline."}</p></article>
        </div>
      </section>

      <section className="curriculum-section" id="curriculum">
        <div className="curriculum-header">
          <div>
            <div className="section-kicker">{direction === "ja-id" ? "FOUNDATION CURRICULUM" : "KURIKULUM DASAR"}</div>
            <h2>{direction === "ja-id" ? "最初の6ユニット" : "6 unit pertama"}</h2>
          </div>
          <div className="progress-card">
            <div><Icon name="user" size={18} /><span>{user ? (user.user_metadata?.display_name || user.email) : (direction === "ja-id" ? "この端末に保存" : "Tersimpan di perangkat ini")}</span></div>
            <strong>{progress}%</strong>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        <div className="lesson-grid">
          {lessons.map((lesson) => {
            const isDone = completed.has(lesson.id);
            return (
              <article className={`lesson-card ${isDone ? "done" : ""}`} key={lesson.id}>
                <div className="lesson-meta"><span>{lesson.level}</span><span>{lesson.minutes} min</span></div>
                <h3>{direction === "ja-id" ? lesson.titleJa : lesson.titleId}</h3>
                <p>{direction === "ja-id" ? lesson.descriptionJa : lesson.descriptionId}</p>
                <div className="lesson-example">
                  <small>{direction === "ja-id" ? "KEY PHRASE" : "FRASA KUNCI"}</small>
                  <strong>{direction === "ja-id" ? lesson.phrases[0].id : lesson.phrases[0].ja}</strong>
                  <span>{direction === "ja-id" ? lesson.phrases[0].ja : lesson.phrases[0].id}</span>
                </div>
                <button className="lesson-action" disabled={savingLesson === lesson.id || isDone} onClick={() => completeLesson(lesson.id)}>
                  {isDone ? <><Icon name="check" size={18} />{direction === "ja-id" ? "完了" : "Selesai"}</> : <>{savingLesson === lesson.id ? (direction === "ja-id" ? "保存中…" : "Menyimpan…") : (direction === "ja-id" ? "このユニットを完了" : "Tandai selesai")}<Icon name="arrow" size={17} /></>}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sample-section" id="sample">
        <div className="sample-copy">
          <div className="section-kicker">{direction === "ja-id" ? "REAL PHRASES" : "CONTOH NYATA"}</div>
          <h2>{direction === "ja-id" ? "一文ずつ、仕組みまで。" : "Bukan hanya arti—pahami cara kerjanya."}</h2>
          <p>{direction === "ja-id" ? "同じ意味でも場面によって自然な言い方は変わります。土台では「訳・語感・文法メモ・音」をセットにしました。" : "Ungkapan yang alami berubah sesuai situasi. Setiap contoh menggabungkan terjemahan, nuansa, catatan tata bahasa, dan audio."}</p>
        </div>
        <div className="phrase-stack">
          {lessons[0].phrases.map((phrase, index) => {
            const target = direction === "ja-id" ? phrase.id : phrase.ja;
            const source = direction === "ja-id" ? phrase.ja : phrase.id;
            const note = direction === "ja-id" ? phrase.noteJa : phrase.noteId;
            return (
              <article key={target}>
                <span className="phrase-number">0{index + 1}</span>
                <div className="phrase-body"><small>{source}</small><strong>{target}</strong><p>{note}</p></div>
                <button onClick={() => speak(target)} aria-label={`${target} を読み上げる`}><Icon name="volume" size={20} /></button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-mark"><span /><span /></div>
        <div>
          <p>{direction === "ja-id" ? "LOCAL-FIRST FOUNDATION" : "FONDASI LOCAL-FIRST"}</p>
          <h2>{direction === "ja-id" ? "クラウドが止まっても、学習は止めない。" : "Cloud boleh berhenti, belajar tetap lanjut."}</h2>
        </div>
        <a className="light-button" href="#curriculum">{direction === "ja-id" ? "学習を続ける" : "Lanjut belajar"}<Icon name="arrow" size={18} /></a>
      </section>

      <footer>
        <a href="#top" className="brand footer-brand"><span className="brand-mark"><span /></span><span>Jendy</span></a>
        <p>Japanese ↔ Bahasa Indonesia · Next.js · local-first · Supabase sync · Vercel.</p>
        <span>© 2026 Jendy</span>
      </footer>

      {authOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAuthOpen(false); }}>
          <div className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
            <button className="modal-close" aria-label="閉じる" onClick={() => setAuthOpen(false)}>×</button>
            <div className="auth-icon"><Icon name={authMode === "signin" ? "login" : "user"} size={24} /></div>
            <p className="modal-kicker">JENDY ACCOUNT</p>
            <h2 id="auth-title">{authMode === "signin" ? (direction === "ja-id" ? "クラウド同期する" : "Sinkronkan ke cloud") : (direction === "ja-id" ? "同期用アカウントを作る" : "Buat akun sinkronisasi")}</h2>
            <p className="modal-description">{direction === "ja-id" ? "ログインなしでもこの端末に進捗を保存できます。ログインすると、利用可能なときだけSupabaseにも同期します。" : "Progres tetap tersimpan di perangkat tanpa login. Jika masuk, progres juga disinkronkan ke Supabase saat tersedia."}</p>
            <form onSubmit={submitAuth}>
              {authMode === "signup" && <label>{direction === "ja-id" ? "表示名" : "Nama tampilan"}<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={direction === "ja-id" ? "例: Yuki" : "Contoh: Yuki"} autoComplete="name" /></label>}
              <label>{direction === "ja-id" ? "メールアドレス" : "Email"}<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
              <label>{direction === "ja-id" ? "パスワード" : "Kata sandi"}<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} autoComplete={authMode === "signin" ? "current-password" : "new-password"} required /></label>
              {authMessage && <div className="auth-message">{authMessage}</div>}
              <button className="auth-submit" disabled={authBusy}>{authBusy ? (direction === "ja-id" ? "処理中…" : "Memproses…") : authMode === "signin" ? (direction === "ja-id" ? "ログイン" : "Masuk") : (direction === "ja-id" ? "無料アカウントを作成" : "Buat akun gratis")}<Icon name="arrow" size={18} /></button>
            </form>
            <button className="mode-switch" onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setAuthMessage(""); }}>
              {authMode === "signin" ? (direction === "ja-id" ? "初めてですか？ アカウントを作成" : "Belum punya akun? Daftar") : (direction === "ja-id" ? "すでにアカウントがありますか？ ログイン" : "Sudah punya akun? Masuk")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
