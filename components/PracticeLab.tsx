"use client";
import { useEffect, useRef, useState } from "react";
import type { Direction } from "@/lib/learning-content";
import { lessons } from "@/lib/learning-content";
import { buildSession, normalizeRecall, practiceBank, readPracticeStats, recordPractice, shuffle, type PracticeItem, type PracticeStats } from "@/lib/practice";
import { Medal } from "./CultureArt";
import { WordOrderGame } from "./WordOrderGame";
import { ExpressionCard } from "./ExpressionCard";

type Props = { direction: Direction; onAnswer: (correct: boolean, lessonId: string, phraseIndex: number) => void };
export function PracticeLab({ direction, onAnswer }: Props) {
  const ja = direction === "ja-id";
  const [stats, setStats] = useState<PracticeStats>({});
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<PracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [choice, setChoice] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("All");
  const [mode, setMode] = useState("choose");
  const [empty, setEmpty] = useState(false);
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setStats(readPracticeStats()); setReady(true); }, []);
  const current = session[index];
  const finished = session.length > 0 && index >= session.length;
  const answer = current ? (ja ? current.question.answerId : current.question.answerJa) : "";
  const matching = answered && normalizeRecall(choice) === normalizeRecall(answer);
  const weaknesses = lessons.map(lesson => ({ lesson, value: stats[`${direction}:${lesson.id}`] }))
    .filter(row => row.value && (row.value.lastWrong || row.value.correct / row.value.attempts < .8))
    .sort((a, b) => a.value.correct / a.value.attempts - b.value.correct / b.value.attempts);
  function prepare(item: PracticeItem | undefined) {
    locked.current = false; setAnswered(false); setText(""); setChoice("");
    setChoices(item ? shuffle(ja ? item.question.choicesId : item.question.choicesJa) : []);
  }
  function start(weak = false) {
    const next = buildSession(stats, direction, level, weak);
    setSession(next); setIndex(0); setScore(0); setEmpty(next.length === 0); prepare(next[0]);
    setTimeout(() => heading.current?.focus(), 0);
  }
  function submit(value: string) {
    if (!current || locked.current || !value.trim()) return;
    locked.current = true;
    const correct = normalizeRecall(value) === normalizeRecall(answer);
    setChoice(value); setAnswered(true); if (correct) setScore(s => s + 1);
    recordAttempt(correct, current.lesson.id, current.phraseIndex);
  }
  function recordAttempt(correct: boolean, lessonId: string, phraseIndex: number) {
    const next = recordPractice(stats, direction, lessonId, correct);
    setStats(next);
    try { localStorage.setItem("jendy:practice:v1", JSON.stringify(next)); } catch { /* Keep practicing in memory. */ }
    onAnswer(correct, lessonId, phraseIndex);
  }
  function next() { const nextIndex = index + 1; setIndex(nextIndex); prepare(session[nextIndex]); heading.current?.focus(); }
  if (mode === "order") return <WordOrderGame direction={direction} onAnswer={recordAttempt} onBack={() => setMode("choose")} />;
  return <section className="practice-section" id="practice">
    <div className="section-kicker">PRACTICE WITHOUT A FINISH LINE</div>
    <h2>{ja ? "分かるから、使えるへ。" : "Dari paham, menjadi bisa memakai."}</h2>
    <p>{ja ? `${practiceBank.length}問 × 2方向。12問ずつ、弱点を織り交ぜて何度でも練習。` : `${practiceBank.length} soal × 2 arah. Latihan 12 soal per sesi dengan prioritas kelemahan.`}</p>
    {!session.length && <button type="button" className="quest-entry" onClick={() => setMode("order")}><Medal/><span><strong>{ja ? "語順クエストに挑戦" : "Misi susun kata"}</strong><small>{ja ? "8問のミッション · ヒントと再挑戦つき" : "8 soal · Petunjuk dan coba ulang"}</small></span><span aria-hidden="true">→</span></button>}
    {!session.length || finished ? <>
      {finished && <div className="session-summary" role="status"><strong>{score} / {session.length}</strong><p>{ja ? "今回の例文との一致数。次は新しい組み合わせで練習できます。" : "Jumlah jawaban yang sesuai contoh sesi ini. Lanjutkan dengan susunan soal baru."}</p></div>}
      <div className="practice-controls"><label>{ja ? "レベル" : "Tingkat"}<select value={level} onChange={e => setLevel(e.target.value)}><option value="All">{ja ? "すべて" : "Semua"}</option>{["A1", "A2", "B1"].map(value => <option key={value}>{value}</option>)}</select></label><label>{ja ? "練習方法" : "Cara latihan"}<select value={mode} onChange={e => setMode(e.target.value)}><option value="choose">{ja ? "選択問題" : "Pilihan ganda"}</option><option value="order">{ja ? "語順パズル・クエスト" : "Misi susun kata"}</option><option value="recall">{ja ? "文章を入力して思い出す" : "Mengingat dengan mengetik"}</option></select></label><button className="primary-button" disabled={!ready} onClick={() => start()}>{ja ? "12問の練習を始める" : "Mulai 12 soal"} →</button><button className="outline-button" disabled={!ready || !weaknesses.length} onClick={() => start(true)}>{ja ? "弱点だけ練習" : "Latih kelemahan"}</button></div>
      {empty && <p role="status">{ja ? "このレベルでは、まだ弱点が記録されていません。通常練習から始めてください。" : "Belum ada kelemahan pada tingkat ini. Mulai latihan biasa."}</p>}
    </> : current && <div className="practice-player">
      <div className="practice-top"><span>{current.lesson.level} · {index + 1} / {session.length}</span><button className="outline-button" onClick={() => { setSession([]); prepare(undefined); }}>{ja ? "練習を終える" : "Akhiri sesi"}</button></div>
      <h3 ref={heading} tabIndex={-1}>{ja ? current.question.promptJa : current.question.promptId}</h3>
      {mode === "choose" ? <div className="choice-grid">{choices.map(value => <button key={value} disabled={answered} className={answered ? value === answer ? "correct" : value === choice ? "wrong" : "muted" : ""} onClick={() => submit(value)}>{value}</button>)}</div> : <form className="recall-form" onSubmit={e => { e.preventDefault(); submit(text); }}><label>{ja ? "学習中の言語で入力" : "Ketik dalam bahasa yang dipelajari"}<textarea lang={ja ? "id" : "ja"} value={text} disabled={answered} onChange={e => setText(e.target.value)} required /></label><button className="primary-button" disabled={answered || !text.trim()}>{ja ? "模範例と照合" : "Bandingkan dengan contoh"}</button></form>}
      {answered && <div className="practice-feedback" aria-live="polite"><strong>{matching ? (ja ? "例文と一致 ✓" : "Sesuai contoh ✓") : mode === "choose" ? (ja ? "違いを確認しよう" : "Perhatikan perbedaannya") : (ja ? "模範例と比べてみよう" : "Bandingkan dengan contoh")}</strong><p className="model-answer" lang={ja ? "id" : "ja"}>{answer}</p>{mode === "recall" && !matching && <p>{ja ? "別の正しい表現もあります。語句の違いだけで、文法や自然さが誤りとは限りません。" : "Ungkapan lain juga bisa benar. Perbedaan kata tidak selalu berarti tata bahasa atau kealamian salah."}</p>}<p>{ja ? current.question.explanationJa : current.question.explanationId}</p><ExpressionCard key={`${current.question.id}:${direction}`} direction={direction} phrase={{ ja: current.question.answerJa, id: current.question.answerId, noteJa: current.question.explanationJa, noteId: current.question.explanationId }} /><button className="primary-button" onClick={next}>{index + 1 === session.length ? (ja ? "結果を見る" : "Lihat hasil") : (ja ? "次の問題" : "Soal berikutnya")} →</button></div>}
    </div>}
    <div className="weakness-list"><h3>{ja ? "あなたの復習ポイント" : "Fokus ulasan Anda"}</h3><p>{ja ? "この練習での回答に基づく記録。能力全体の点数ではありません。" : "Berdasarkan jawaban latihan ini, bukan penilaian seluruh kemampuan."}</p>{weaknesses.length ? weaknesses.slice(0, 5).map(({ lesson, value }) => <div key={lesson.id}><span>{ja ? lesson.titleJa : lesson.titleId}</span><strong>{value.correct} / {value.attempts} <small>{ja ? "一致" : "sesuai"}</small></strong></div>) : <p>{ja ? "練習すると、復習が必要な文法・表現がここにたまります。" : "Setelah berlatih, topik yang perlu diulang akan muncul di sini."}</p>}</div>
  </section>;
}
