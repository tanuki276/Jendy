import {lessons,type Lesson,type QuizQuestion} from './learning-content';
export type SessionQuestion=QuizQuestion&{sourceLessonId:string;sourcePhraseIndex:number;isReview:boolean};
export function buildLessonSession(lesson:Lesson,completed:Set<string>):SessionQuestion[]{
 const index=lessons.findIndex(l=>l.id===lesson.id);
 const wrap=(l:Lesson,i:number,review:boolean):SessionQuestion=>({...l.quiz[i],sourceLessonId:l.id,sourcePhraseIndex:Math.min(i,l.phrases.length-1),isReview:review});
 const fresh=lesson.quiz.map((_,i)=>wrap(lesson,i,false));
 // Only previously completed lessons can contribute review. Never introduce unseen material.
 const pool=lessons.slice(0,index).filter(l=>completed.has(l.id)).slice(-6).flatMap(l=>l.quiz.map((_,i)=>wrap(l,i,true)));
 const result:SessionQuestion[]=[];
 for(let i=0;i<12;i++){
  if(i<fresh.length)result.push(fresh[i]);
  else if(pool.length && i%3===2)result.push(pool[Math.floor(Math.random()*pool.length)]);
  else result.push({...fresh[(i-fresh.length)%fresh.length],isReview:true});
 }
 return result;
}
