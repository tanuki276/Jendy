import type { LearningState } from './learning-state';
import {lessons,type Lesson,type QuizQuestion,type Direction} from './learning-content';
export type SessionQuestion=QuizQuestion&{sourceLessonId:string;sourcePhraseIndex:number;isReview:boolean};
export function buildLessonSession(lesson:Lesson,completed:Set<string>,state?:LearningState,direction:Direction="ja-id"):SessionQuestion[]{
 const index=lessons.findIndex(l=>l.id===lesson.id);
 const wrap=(l:Lesson,i:number,review:boolean):SessionQuestion=>({...l.quiz[i],sourceLessonId:l.id,sourcePhraseIndex:Math.min(i,l.phrases.length-1),isReview:review});
 const fresh=lesson.quiz.map((_,i)=>wrap(lesson,i,false));
 // Only previously completed lessons can contribute review. Never introduce unseen material.
 const pool=lessons.slice(0,index).filter(l=>completed.has(l.id)).flatMap(l=>l.quiz.map((_,i)=>wrap(l,i,true)));
 const reviewByKey = new Map(state?.reviews.filter(r=>r.direction===direction).map(r=>[`${r.lessonId}:${r.phraseIndex}`,r]));
 const priority = (q:SessionQuestion) => {
  const item=reviewByKey.get(`${q.sourceLessonId}:${q.sourcePhraseIndex}`);
  if(!item) return 1;
  if(new Date(item.dueAt).getTime()>Date.now()) return 0;
  return 2 + (item.repetitions===0?100:0) + Math.min(90,Math.max(0,(Date.now()-new Date(item.dueAt).getTime())/86400000));
 };
 const ranked=pool.map(q=>({q,rank:priority(q),tie:Math.random()})).sort((a,b)=>b.rank-a.rank||a.tie-b.tie).map(x=>x.q);
 let reviewIndex=0;
 const result:SessionQuestion[]=[];
 for(let i=0;i<12;i++){
  if(i<fresh.length)result.push(fresh[i]);
  else if(pool.length && i%3===2)result.push(ranked[reviewIndex++ % ranked.length]);
  else result.push({...fresh[(i-fresh.length)%fresh.length],isReview:true});
 }
 return result;
}
