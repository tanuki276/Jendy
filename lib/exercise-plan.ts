import type { QuizQuestion } from './learning-content';
export type ExerciseMode = 'choose'|'keyboard'|'tiles'|'listen';
export function buildExercisePlan(questions:QuizQuestion[],random= Math.random):ExerciseMode[] {
 const plan:ExerciseMode[]=questions.map(()=>'tiles');
 const positions=questions.map((_,i)=>i).slice(1);
 for(let i=positions.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[positions[i],positions[j]]=[positions[j],positions[i]];}
 const count=Math.min(positions.length,Math.max(1,Math.floor(questions.length*.35)));
 for(const index of positions.slice(0,count)){
  const q=questions[index];const words=new Set(q.answerId.toLowerCase().split(/\s+/));
  const close=q.choicesId.some(v=>v!==q.answerId&&v.toLowerCase().split(/\s+/).some(w=>words.has(w)));
  const pool:ExerciseMode[]=['keyboard',...(q.answerId.length<=200&&q.answerJa.length<=200?['listen' as const]:[]),...(close?['choose' as const,'choose' as const]:[])];
  plan[index]=pool[Math.floor(random()*pool.length)];
 }
 return plan;
}
