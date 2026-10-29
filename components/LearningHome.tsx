"use client";

import Link from "next/link";
import { lessons, type Direction, type Lesson } from "@/lib/learning-content";
import {
  currentStreak,
  localDateKey,
  type LearningState,
} from "@/lib/learning-state";
import { BridgeMark } from "./BridgeMark";
import { Icon } from "./Icon";

type Props = {
  direction: Direction;
  completed: Set<string>;
  learning: LearningState;
  now: Date | null;
  dueCount: number;
  onStart: (lesson: Lesson) => void;
  onGoal: (goal: number) => void;
};

export function DailyGoals({
  direction,
  learning,
  now,
  onGoal,
}: Pick<Props, "direction" | "learning" | "now" | "onGoal">) {
  const ja = direction === "ja-id";
  const answered = now
    ? (learning.activity[localDateKey(now)]?.answered ?? 0)
    : 0;
  const goal = learning.dailyGoal;
  const reached = answered >= goal;
  return (
    <section className="habit-card daily-card" aria-labelledby="daily-title">
      <div className="card-heading">
        <h2 id="daily-title">{ja ? "今日の目標" : "Target hari ini"}</h2>
        <Icon name="target" size={22} />
      </div>
      <p>
        {reached
          ? ja
            ? "目標達成！今日の自分に拍手。"
            : "Target tercapai. Hebat!"
          : ja
            ? "小さな積み重ねが、大きな一歩に。"
            : "Langkah kecil, kemajuan besar."}
      </p>
      <div className="goal-value">
        <strong>
          {answered}
          <span> / {goal}</span>
        </strong>
        <span>{ja ? "問にチャレンジ" : "soal dijawab"}</span>
      </div>
      <progress
        max={goal}
        value={Math.min(answered, goal)}
        aria-label={ja ? "今日の学習目標" : "Progres target harian"}
      />
      <fieldset className="goal-options">
        <legend>{ja ? "1日の目標を選ぶ" : "Pilih target harian"}</legend>
        {[6, 12, 24].map((value) => (
          <button
            key={value}
            aria-pressed={goal === value}
            onClick={() => onGoal(value)}
          >
            {value}
            <small>{ja ? "問" : " soal"}</small>
          </button>
        ))}
      </fieldset>
      <span className="goal-note" role="status">
        {reached
          ? ja
            ? "✓ 今日の目標を達成しました"
            : "✓ Target harian tercapai"
          : ja
            ? `あと${goal - answered}問で達成`
            : `${goal - answered} soal lagi`}
      </span>
    </section>
  );
}

export function WeekCard({
  direction,
  learning,
  now,
}: Pick<Props, "direction" | "learning" | "now">) {
  const ja = direction === "ja-id";
  const streak = now ? currentStreak(learning, now) : 0;
  const days = now
    ? Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i);
        const key = localDateKey(date);
        return {
          key,
          today: key === localDateKey(now),
          studied:
            Boolean(learning.activity[key]) ||
            learning.stats.lastStudyDate === key,
          future: key > localDateKey(now),
        };
      })
    : [];
  return (
    <section className="habit-card week-card">
      <div className="streak-heading">
        <span className="feature-icon amber">
          <Icon name="flame" size={28} />
        </span>
        <div>
          <strong>
            {streak}
            <small>{ja ? "日連続" : "hari beruntun"}</small>
          </strong>
          <p>
            {ja
              ? "今日の一歩を、明日の自信に。"
              : "Hari ini belajar, besok lebih percaya diri."}
          </p>
        </div>
      </div>
      <div className="week-days">
        {(ja
          ? ["月", "火", "水", "木", "金", "土", "日"]
          : ["S", "S", "R", "K", "J", "S", "M"]
        ).map((label, i) => (
          <div
            key={i}
            className={`${days[i]?.studied ? "studied" : ""} ${days[i]?.today ? "today" : ""}`}
            aria-label={
              days[i]
                ? `${days[i].key}: ${days[i].studied ? (ja ? "学習済み" : "sudah belajar") : days[i].future ? (ja ? "これから" : "mendatang") : ja ? "学習記録なし" : "belum belajar"}`
                : undefined
            }
          >
            <span>{label}</span>
            <b>
              {days[i]?.studied ? (
                <Icon name="check" size={16} />
              ) : days[i]?.today ? (
                <span className="today-dot" />
              ) : (
                "·"
              )}
            </b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AchievementCard({
  direction,
  learning,
}: Pick<Props, "direction" | "learning" | "now">) {
  const ja = direction === "ja-id";
  const badges = [
    {
      icon: "star" as const,
      name: ja ? "はじめの一歩" : "Langkah pertama",
      description: ja ? "1レッスン完了" : "Selesaikan 1 pelajaran",
      earned: learning.stats.completedLessons >= 1,
    },
    {
      icon: "flame" as const,
      name: ja ? "3日間の積み重ね" : "Tiga hari tekun",
      description: ja ? "3日連続で学習" : "Belajar 3 hari beruntun",
      earned: learning.stats.longestStreak >= 3,
    },
    {
      icon: "target" as const,
      name: ja ? "100の挑戦" : "100 tantangan",
      description: ja ? "100問に回答" : "Jawab 100 soal",
      earned: learning.stats.answered >= 100,
    },
    {
      icon: "trophy" as const,
      name: ja ? "ことばの冒険家" : "Penjelajah bahasa",
      description: ja ? "1,000 XPを獲得" : "Raih 1.000 XP",
      earned: learning.stats.xp >= 1000,
    },
  ];
  return (
    <section className="habit-card achievement-card">
      <div className="card-heading">
        <h2>{ja ? "小さな勲章" : "Lencana kecil"}</h2>
        <span>{badges.filter((b) => b.earned).length} / 4</span>
      </div>
      <div className="achievement-list">
        {badges.map((b) => (
          <div key={b.name} className={b.earned ? "earned" : ""}>
            <span className="badge-icon">
              <Icon name={b.icon} size={22} />
            </span>
            <div>
              <strong>{b.name}</strong>
              <small>{b.description}</small>
            </div>
            <span className="badge-status">
              {b.earned ? (
                <Icon name="check" size={17} />
              ) : ja ? (
                "挑戦中"
              ) : (
                "Belum"
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LearningHome({
  direction,
  completed,
  learning,
  now,
  dueCount,
  onStart,
  onGoal,
}: Props) {
  const ja = direction === "ja-id";
  const next = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];
  const stage = Math.floor(lessons.indexOf(next) / 6);
  const batch = lessons.slice(stage * 6, stage * 6 + 6);
  return (
    <div className="learning-home">
      <div className="home-heading">
        <div>
          <span className="section-kicker">YOUR EVERYDAY ADVENTURE</span>
          <h1>
            {ja
              ? "ことばで、世界が近くなる。"
              : "Dunia lebih dekat, kata demi kata."}
          </h1>
          <p>
            {ja
              ? "おかえりなさい。今日も、ひとつ「わかった」を増やそう。"
              : "Selamat datang. Mari temukan satu hal baru hari ini."}
          </p>
        </div>
        <span className="course-pill">
          <span className={`country-flag ${ja ? "indonesia" : "japan"}`} />
          {ja ? "インドネシア語コース" : "Kursus bahasa Jepang"}
        </span>
      </div>
      <div className="home-columns">
        <div className="home-main">
          <section className="hero" id="top">
            <div className="home-hero-copy">
              <span className="hero-label">
                <span /> {ja ? "今日のレッスン" : "PELAJARAN HARI INI"}
              </span>
              <h2>
                {completed.size
                  ? ja
                    ? "昨日より、\nひとこと先へ。"
                    : "Selangkah lagi,\nsatu kata baru."
                  : ja
                    ? "最初のひとことが、\n冒険のはじまり。"
                    : "Kata pertamamu,\nawal petualangan."}
              </h2>
              <p>
                {ja
                  ? "選んで、聞いて、組み立てて。\n「なぜ？」がわかると、学びはもっと楽しい。"
                  : "Pilih, dengarkan, dan susun kalimat.\nPahami alasannya, nikmati belajarnya."}
              </p>
              <button className="primary-button" onClick={() => onStart(next)}>
                {ja
                  ? completed.size
                    ? "学習を続ける"
                    : "さっそく始める"
                  : "Mulai belajar"}
                <Icon name="arrow" size={19} />
              </button>
              <span className="hero-duration">
                <Icon name="clock" size={14} />
                {ja
                  ? "12問のミニレッスン · 自分のペースで"
                  : "12 soal · sesuai ritmemu"}
              </span>
            </div>
            <div className="bridge-scene" aria-hidden="true">
              <span className="scene-spark spark-one">✦</span>
              <span className="scene-spark spark-two">✧</span>
              <span className="greeting-bubble">
                {ja ? "Halo!" : "こんにちは！"}
              </span>
              <BridgeMark />
              <span className="scene-caption">
                JAPAN <span>↔</span> INDONESIA
              </span>
            </div>
          </section>
          <section className="path-preview">
            <div className="card-heading">
              <div>
                <span className="section-kicker">YOUR LEARNING PATH</span>
                <h2>
                  {ja
                    ? "一歩ずつ、できることが増える。"
                    : "Sedikit demi sedikit, semakin bisa."}
                </h2>
              </div>
              <Link href="/lesson">
                {ja ? "マップを見る" : "Lihat jalur"}
                <Icon name="arrow" size={16} />
              </Link>
            </div>
            <div className="mini-path">
              {batch.map((lesson, i) => (
                <button
                  key={lesson.id}
                  className={`${completed.has(lesson.id) ? "done" : ""} ${lesson.id === next.id ? "current" : ""}`}
                  onClick={() => onStart(lesson)}
                  aria-label={`${ja ? lesson.titleJa : lesson.titleId} · ${completed.has(lesson.id) ? (ja ? "完了・復習する" : "Selesai, ulangi") : ja ? "開始" : "Mulai"}`}
                  aria-current={lesson.id === next.id ? "step" : undefined}
                >
                  <span>
                    {completed.has(lesson.id) ? (
                      <Icon name="check" size={22} />
                    ) : i === 5 ? (
                      <Icon name="trophy" size={22} />
                    ) : (
                      <Icon name="star" size={22} />
                    )}
                  </span>
                  <small>{String(stage * 6 + i + 1).padStart(2, "0")}</small>
                </button>
              ))}
            </div>
            <div className="next-lesson-label">
              <span>UNIT {stage + 1}</span>
              <strong>{ja ? next.titleJa : next.titleId}</strong>
              <span>
                {batch.filter((l) => completed.has(l.id)).length} /{" "}
                {batch.length}
              </span>
            </div>
          </section>
          <div className="activity-links">
            <Link href="/review" className="activity-link">
              <span className="feature-icon lavender">
                <Icon name="book" size={25} />
              </span>
              <div>
                <h2>{ja ? "記憶を、もうひと押し。" : "Kuatkan ingatanmu."}</h2>
                <p>
                  {dueCount
                    ? ja
                      ? `${dueCount}個の表現が復習を待っています`
                      : `${dueCount} ungkapan siap diulas`
                    : ja
                      ? "学んだ表現を、忘れる前に復習"
                      : "Ulangi ungkapan sebelum lupa"}
                </p>
              </div>
              <Icon name="chevron" size={18} />
            </Link>
            <Link href="/practice" className="activity-link">
              <span className="feature-icon mint">
                <Icon name="spark" size={25} />
              </span>
              <div>
                <h2>
                  {ja ? "ちょっと、腕だめし。" : "Saatnya tantangan kecil."}
                </h2>
                <p>
                  {ja
                    ? "語順クエスト・選択問題・入力練習"
                    : "Susun kata, pilih, dan ketik jawaban"}
                </p>
              </div>
              <Icon name="chevron" size={18} />
            </Link>
          </div>
          <div className="learning-note">
            <Icon name="globe" size={20} />
            <p>
              {ja
                ? "訳を覚える、その先へ。日本語とインドネシア語の違いから「なぜそう言うの？」まで学べる198レッスン。"
                : "Lebih dari menghafal arti. Pelajari alasannya lewat 198 pelajaran bahasa Jepang dan Indonesia."}
            </p>
          </div>
        </div>
        <aside className="home-aside">
          <DailyGoals
            direction={direction}
            learning={learning}
            now={now}
            onGoal={onGoal}
          />
          <WeekCard direction={direction} learning={learning} now={now} />
          <AchievementCard
            direction={direction}
            learning={learning}
            now={now}
          />
        </aside>
      </div>
    </div>
  );
}
