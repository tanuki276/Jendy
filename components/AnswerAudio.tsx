"use client";
import { useEffect, useMemo, useState } from 'react';
import { createLessonAudio } from '@/lib/lesson-audio';
export function AnswerAudio({ id, text, ja }: { id: string; text: string; ja: boolean }) {
 const [error,setError]=useState(false);
 const audio=useMemo(()=>createLessonAudio(id,text,ja?'id':'ja',()=>setError(true)),[id,text,ja]);
 useEffect(()=>()=>audio.stop(),[audio]);
 return <div className="answer-audio"><button type="button" className="outline-button" onClick={()=>{setError(false);audio.play(1);}}>{ja?'正しい文を聞く':'Dengarkan jawaban'}</button><button type="button" className="outline-button" onClick={()=>{setError(false);audio.play(.75);}}>{ja?'ゆっくり':'Perlahan'}</button>{error&&<p role="status">{ja?'音声を取得できませんでした。':'Audio tidak tersedia.'}</p>}</div>;
}
