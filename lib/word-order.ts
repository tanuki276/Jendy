import type { Direction } from './learning-content';
import { wordOrderQuestions } from './scenario-course';
import { shuffle } from './practice';
export type OrderQuestion = typeof wordOrderQuestions[number];
export type Tile = { id: number; text: string };
export function tilesFor(question: OrderQuestion, direction: Direction, random = Math.random): Tile[] {
 const chunks=direction==='ja-id'?question.idChunks:question.jaChunks;
 const original=chunks.map((text,id)=>({id,text}));
 const tiles=shuffle(original,random);
 if(tiles.every((tile,i)=>tile.id===i)&&tiles.length>1)tiles.push(tiles.shift()!);
 return tiles;
}
export function composeTiles(tiles: Tile[],direction: Direction) {return tiles.map(t=>t.text).join(direction==='ja-id'?' ':'');}
export function matchesOrder(question: OrderQuestion,tiles: Tile[],direction: Direction) {
 const expected=direction==='ja-id'?question.idText:question.ja;
 return composeTiles(tiles,direction)===expected;
}
export function nextHint(question: OrderQuestion,tiles: Tile[],direction: Direction) {
 const chunks=direction==='ja-id'?question.idChunks:question.jaChunks;
 const mismatch=tiles.findIndex((tile,i)=>tile.text!==chunks[i]);
 const index=mismatch===-1?tiles.length:mismatch;
 return index<chunks.length?{index,text:chunks[index]}:null;
}
export function retryQuestions(questions: OrderQuestion[], missed: string[]) {
 const ids=new Set(missed);return questions.filter(q=>ids.has(q.id));
}
