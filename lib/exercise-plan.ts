import type { QuizQuestion } from './learning-content';
export type ExerciseMode = 'choose'|'keyboard'|'tiles'|'listen';
export function exerciseMode(lessonIndex:number, questionIndex:number, question:QuizQuestion):ExerciseMode {
 const slot=(lessonIndex*3+questionIndex)%10;
 if(slot===8 && question.answerId.length<=200 && question.answerJa.length<=200)return 'listen';
 if(slot===6)return 'keyboard';
 // Reserve recognition exercises for close alternatives sharing vocabulary.
 const words=new Set(question.answerId.toLowerCase().split(/\s+/));
 const close=question.choicesId.some(value=>value!==question.answerId && value.toLowerCase().split(/\s+/).some(w=>words.has(w)));
 if((slot===3||slot===9)&&close)return 'choose';
 return 'tiles';
}
