"use client";
import { dailyProgress, dueReviews, type LearningState } from '@/lib/learning-state';
import type { Direction } from '@/lib/learning-content';
import Link from 'next/link';
export function DailyMission({ state, direction, onGoal }: { state: LearningState; direction: Direction; onGoal: (goal: number) => void }) {
 const ja=direction==='ja-id', daily=dailyProgress(state), complete=daily.answered>=daily.goal;
 const due=dueReviews(state,direction).length;
 return <section className={`daily-mission ${complete?'achieved':''}`} aria-label={ja?'今日の目標':'Target harian'}>
  <div className="mission-heading"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="#ffe1ec"/><path d="M22 14h20v17c0 14-20 14-20 0zM22 19H12v8c0 8 7 9 11 8M42 19h10v8c0 8-7 9-11 8M32 42v10m-10 0h20" fill="none" stroke="#b7264d" strokeWidth="4" strokeLinecap="round"/><circle cx="32" cy="25" r="4" fill="#b7264d"/></svg><div><small>DAILY MISSION</small><h3>{complete?(ja?'今日の目標達成！':'Target tercapai!'):(ja?`今日も${daily.goal}問から。`:'Sedikit setiap hari.')}</h3></div></div>
  <p>{daily.answered} / {daily.goal} {ja?'問に挑戦':'soal dijawab'}</p><progress max={daily.goal} value={Math.min(daily.answered,daily.goal)} aria-label={ja?'今日の学習進捗':'Progres hari ini'}/>
  <div className="daily-goals" aria-label={ja?'目標を変更':'Ubah target'}>{[6,12,24].map(goal=><button key={goal} aria-pressed={daily.goal===goal} onClick={()=>onGoal(goal)}>{goal} {ja?'問':'soal'}</button>)}</div>
  <p>{ja?'正解':'Benar'} {daily.correct} · {ja?'間違えても学習は前進':'Kesalahan juga bagian dari belajar'}</p>
  <Link href="/review">{due?`${due} ${ja?'件が復習のタイミング':'ungkapan siap diulang'}`:(ja?'復習カードを見る':'Lihat kartu ulasan')} →</Link>
 </section>;
}
