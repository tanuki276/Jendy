const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'http://localhost'});
global.window=dom.window;global.document=dom.window.document;global.HTMLElement=dom.window.HTMLElement;global.localStorage=dom.window.localStorage;global.IS_REACT_ACT_ENVIRONMENT=true;
require('./register.cjs');
const React=require('react');const {act}=React;const {createRoot}=require('react-dom/client');
const {WordOrderGame}=require('../components/WordOrderGame.tsx');const {TapWords}=require('../components/TapWords.tsx');const {wordOrderQuestions}=require('../lib/scenario-course.ts');
const root=createRoot(document.getElementById('root'));
function button(text,scope=document){const b=[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(b,`button: ${text}`);return b;}
function click(b){act(()=>b.click())}
let calls=[];
act(()=>root.render(React.createElement(WordOrderGame,{direction:'ja-id',onAnswer:(...args)=>calls.push(args),onBack:()=>{}})));
click(button('クエストを始める →'));
for(let i=0;i<8;i++){
 const source=document.querySelector('.practice-player h3').textContent;const q=wordOrderQuestions.find(q=>q.ja===source);assert.ok(q);
 assert.equal(button('答えを確認').disabled,true);
 if(i===0){click(button('ヒント'));assert.ok(document.querySelector('[role="status"]').textContent.includes(q.idChunks[0]));}
 const chunks=i===1?[...q.idChunks].reverse():q.idChunks;
 for(const text of chunks){const b=[...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===text);assert.ok(b);click(b);}
 if(i===0){const b=document.querySelector('.tile-answer button');click(b);assert.equal(document.querySelectorAll('.tile-answer button').length,q.idChunks.length-1);click(button('並べ直す'));for(const text of q.idChunks)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===text));}
 const check=button('答えを確認');click(check);click(check);assert.equal(calls.length,i+1,'no double submission');
 assert.ok(document.querySelector(i===1?'.quest-feedback.retry':'.quest-feedback.success'));
 click(button('次へ →'));
}
assert.ok(document.querySelector('.quest-finish').textContent.includes('7 / 8'));
click(button('間違えた1問に再挑戦'));
assert.ok(document.querySelector('.quest-status').textContent.includes('1 / 1'));
const retrySource=document.querySelector('.practice-player h3').textContent;const retry=wordOrderQuestions.find(q=>q.ja===retrySource);
for(const text of retry.idChunks)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===text));
click(button('答えを確認'));click(button('次へ →'));assert.ok(document.querySelector('.quest-finish').textContent.includes('1 / 1'));
assert.equal(calls.length,9);assert.equal(calls.filter(c=>!c[0]).length,1);
console.log('✓ Word-order DOM flow: tiles, undo, reset, hint, duplicate-submit guard, 8-question result, missed-only retry');
act(()=>root.render(React.createElement(WordOrderGame,{key:'reverse',direction:'id-ja',onAnswer:()=>{},onBack:()=>{}})));
click(button('Mulai misi →'));
const reverseSource=document.querySelector('.practice-player h3').textContent;const reverse=wordOrderQuestions.find(q=>q.idText===reverseSource);
for(const text of reverse.jaChunks)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===text));
click(button('Periksa jawaban'));assert.ok(document.querySelector('.quest-feedback.success'));
console.log('✓ Japanese word-order game supports the reverse learning direction');
act(()=>root.render(React.createElement(TapWords,{text:'Jangan makan'})));
click(button('Jangan'));assert.match(document.querySelector('.word-popover').textContent,/禁止/);
click(button('Jangan'));assert.equal(document.querySelector('.word-popover'),null);
click(button('Jangan'));act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'})));assert.equal(document.querySelector('.word-popover'),null);
console.log('✓ Tap meaning opens, toggles closed, and closes on Escape');
const {PracticeLab}=require('../components/PracticeLab.tsx');
let integrated=[];
act(()=>root.render(React.createElement(PracticeLab,{direction:'ja-id',onAnswer:(...args)=>integrated.push(args)})));
click(button('語順クエストに挑戦8問のミッション · ヒントと再挑戦つき→'));
click(button('クエストを始める →'));
const integratedQ=wordOrderQuestions.find(q=>q.ja===document.querySelector('.practice-player h3').textContent);
for(const text of integratedQ.idChunks)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===text));
click(button('答えを確認'));
assert.equal(integrated.length,1);assert.equal(integrated[0][1],integratedQ.lessonId);assert.equal(integrated[0][2],integratedQ.phraseIndex);
const saved=JSON.parse(localStorage.getItem('jendy:practice:v1'));
assert.equal(saved[`ja-id:${integratedQ.lessonId}`].attempts,1);assert.equal(saved[`ja-id:${integratedQ.lessonId}`].correct,1);
console.log('✓ Quest entry updates direction-specific practice statistics and calls the SRS/XP boundary once');
act(()=>root.unmount());dom.window.close();
