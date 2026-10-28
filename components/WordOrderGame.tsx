"use client";
import { useRef, useState } from 'react';
import type { Direction } from '@/lib/learning-content';
import { wordOrderQuestions } from '@/lib/scenario-course';
import { shuffle } from '@/lib/practice';
import { matchesOrder, nextHint, retryQuestions, tilesFor, type OrderQuestion, type Tile } from '@/lib/word-order';
import { CultureBanner, Medal } from './CultureArt';
import { ExpressionCard } from './ExpressionCard';
export function WordOrderGame({direction,onAnswer,onBack}:{direction:Direction;onAnswer:(correct:boolean,lessonId:string,phraseIndex:number)=>void;onBack:()=>void}) {
 const ja=direction==='ja-id';
 const [questions,setQuestions]=useState<OrderQuestion[]>([]);
 const [index,setIndex]=useState(0);const [bank,setBank]=useState<Tile[]>([]);const [picked,setPicked]=useState<Tile[]>([]);
 const [checked,setChecked]=useState(false);const [correct,setCorrect]=useState(false);const [missed,setMissed]=useState<string[]>([]);
 const [score,setScore]=useState(0);const [combo,setCombo]=useState(0);const [bestCombo,setBestCombo]=useState(0);const [hint,setHint]=useState('');
 const lock=useRef(false);const heading=useRef<HTMLHeadingElement>(null);
 const question=questions[index];const finished=questions.length>0&&index>=questions.length;
 function prepare(q:OrderQuestion|undefined){setPicked([]);setBank(q?tilesFor(q,direction):[]);setChecked(false);setCorrect(false);setHint('');lock.current=false;}
 function start(items=shuffle(wordOrderQuestions).slice(0,8)){setQuestions(items);setIndex(0);setScore(0);setCombo(0);setBestCombo(0);setMissed([]);prepare(items[0]);}
 function check(){if(!question||lock.current||picked.length!==bank.length)return;lock.current=true;const result=matchesOrder(question,picked,direction);setCorrect(result);setChecked(true);if(result){setScore(s=>s+1);setCombo(c=>c+1);setBestCombo(Math.max(bestCombo,combo+1));}else{setCombo(0);setMissed(m=>[...m,question.id]);}onAnswer(result,question.lessonId,question.phraseIndex);}
 function next(){setIndex(i=>i+1);prepare(questions[index+1]);heading.current?.focus();}
 return <section id="practice" className="practice-section order-game"><CultureBanner compact/><div className="game-title"><div><div className="section-kicker">KOTOBA / KATA · WORD QUEST</div><h2>{ja?'言葉を並べて、会話をつくろう。':'Susun kata, bangun percakapan.'}</h2></div><button className="outline-button" onClick={onBack}>{ja?'練習方法を選び直す':'Pilih cara latihan'}</button></div>
 {!questions.length?<div className="quest-start"><Medal/><h3>{ja?'8問の語順クエスト':'Misi urutan kata: 8 soal'}</h3><p>{ja?'場面を読み、タイルをタップして模範例の語順を組み立てます。ヒントも再挑戦も何度でも。':'Baca situasi lalu susun ubin sesuai urutan contoh. Petunjuk dan percobaan ulang tersedia tanpa batas.'}</p><p>{ja?`${wordOrderQuestions.length}の会話表現 · HPなし · 広告なし`:`${wordOrderQuestions.length} ungkapan · Tanpa HP · Tanpa iklan`}</p><button className="primary-button" onClick={()=>start()}>{ja?'クエストを始める':'Mulai misi'} →</button></div>:finished?<div className="quest-finish" role="status"><Medal/><h3>{ja?'クエスト完了！':'Misi selesai!'}</h3><strong>{score} / {questions.length}</strong><p>{ja?`最大 ${bestCombo} 連続正解`:`Rangkaian benar terpanjang: ${bestCombo}`}</p><div className="quest-actions">{missed.length>0&&<button className="primary-button" onClick={()=>start(retryQuestions(questions,missed))}>{ja?`間違えた${new Set(missed).size}問に再挑戦`:`Ulangi ${new Set(missed).size} soal yang keliru`}</button>}<button className="outline-button" onClick={()=>start()}>{ja?'新しいクエストへ':'Misi baru'} →</button></div></div>:question&&<div className="practice-player">
 <div className="quest-status"><span>{index+1} / {questions.length}</span><span>{ja?`${combo} 連続正解`:`${combo} benar beruntun`}</span></div><progress aria-label={ja?'クエストの進み具合':'Progres misi'} max={questions.length} value={index+Number(checked)}/>
 <span className="quest-situation">{ja?question.titleJa:question.titleId}</span><h3 tabIndex={-1} ref={heading}>{ja?question.ja:question.idText}</h3><p>{ja?`次の語句「${bank.map(t=>t.text).join(' / ')}」を並べて、上の意味の文章を作ってください。`:`Susun bagian berikut menjadi kalimat sesuai arti di atas: ${bank.map(t=>t.text).join(' / ')}`} </p>
 <div className="tile-answer" aria-label={ja?'組み立てた文':'Kalimat Anda'}>{picked.length?picked.map(tile=><button type="button" disabled={checked} key={tile.id} onClick={()=>setPicked(p=>p.filter(t=>t.id!==tile.id))}>{tile.text}</button>):<span>{ja?'ここに文を組み立てよう':'Susun kalimat di sini'}</span>}</div>
 <div className="tile-bank" aria-label={ja?'使えるタイル':'Ubin tersedia'}>{bank.map(tile=><button type="button" key={tile.id} disabled={checked||picked.some(t=>t.id===tile.id)} onClick={()=>setPicked(p=>[...p,tile])}>{tile.text}</button>)}</div>
 {!checked?<><div className="quest-actions"><button className="outline-button" onClick={()=>{setPicked([]);setHint('')}}>{ja?'並べ直す':'Atur ulang'}</button><button className="outline-button" onClick={()=>{const h=nextHint(question,picked,direction);setHint(h?(ja?`${h.index+1}番目は「${h.text}」`:`Bagian ${h.index+1}: “${h.text}”`):(ja?'すべて並びました。確認しよう。':'Semua sudah tersusun. Periksa jawaban.'))}}>{ja?'ヒント':'Petunjuk'}</button><button className="primary-button" disabled={picked.length!==bank.length} onClick={check}>{ja?'答えを確認':'Periksa jawaban'}</button></div><p role="status">{hint}</p></>:<div className={`quest-feedback ${correct?'success':'retry'}`} aria-live="polite"><h3>{correct?(ja?'できた！':'Berhasil!'):(ja?'模範例の順序を確認しよう':'Perhatikan urutan contoh')}</h3>{!correct&&<p>{ja?'別の語順が自然な場合もあります。このクエストでは示した模範例の順序を練習します。':'Urutan lain juga bisa alami. Misi ini melatih urutan pada contoh yang ditampilkan.'}</p>}<strong lang={ja?'id':'ja'}>{ja?question.idText:question.ja}</strong><p>{ja?question.noteJa:question.noteId}</p><ExpressionCard key={question.id} direction={direction} phrase={{ja:question.ja,id:question.idText,noteJa:question.noteJa,noteId:question.noteId}}/><button className="primary-button" onClick={next}>{ja?'次へ':'Lanjut'} →</button></div>}
 </div>}
 </section>;
}
