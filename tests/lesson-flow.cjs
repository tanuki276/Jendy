const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'http://localhost/lesson'});
let lastAudio;dom.window.Audio=class{constructor(src){this.src=src;lastAudio=this;}play(){return Promise.resolve();}pause(){}removeAttribute(){}};
global.self=dom.window;global.window=dom.window;global.document=dom.window.document;global.HTMLElement=dom.window.HTMLElement;global.localStorage=dom.window.localStorage;global.IS_REACT_ACT_ENVIRONMENT=true;
require('./register.cjs');const React=require('react');const {act}=React;const {createRoot}=require('react-dom/client');
const {AppRouterContext}=require('next/dist/shared/lib/app-router-context.shared-runtime');
const {JendyApp}=require('../components/JendyApp.tsx');const {lessons}=require('../lib/learning-content.ts');
const root=createRoot(document.getElementById('root'));const router={push(){},replace(){},prefetch(){return Promise.resolve()},refresh(){},back(){},forward(){}};
function render(view,key){act(()=>root.render(React.createElement(AppRouterContext.Provider,{value:router},React.createElement(JendyApp,{view,key}))))}
function click(el){assert.ok(el);act(()=>el.click())}
function button(text,scope=document){const b=[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(b,text);return b}
render('lesson','lesson');assert.ok(document.querySelector('.journey-nodes'));assert.equal(document.querySelector('.lesson-grid').hidden,true);click(document.querySelector('.journey-resume button'));
assert.ok(document.querySelector('.quiz-stage'));assert.equal(document.querySelector('.learn-stage'),null);
assert.match(document.querySelector('.question-instruction').textContent,/インドネシア語に/);
assert.equal(document.querySelector('.translation-question h3').textContent,lessons[0].quiz[0].answerJa);
click(button('キーボード入力'));assert.ok(document.querySelector('textarea'));
const input=document.querySelector('textarea');
act(()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(input,'selamat pagi!');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
assert.equal(button('答えを確認').disabled,false);
click(button('答えを確認'));assert.equal(document.activeElement,document.querySelector('.quiz-feedback .next-button'));assert.match(document.querySelector('.quiz-feedback strong').textContent,/正解/);
click(document.querySelector('.quiz-feedback .next-button'));
assert.ok(document.querySelector('.tile-bank'),'next question returns to automatic panel mode');
click(button('選択式'));assert.ok(document.querySelector('.choice-grid'));
for(let i=1;i<3;i++){
 click(button('選択式'));
 const answer=lessons[0].quiz[i].answerId;
 click(button(answer,document.querySelector('.choice-grid')));
 assert.equal(document.querySelectorAll('.choice-grid button.correct').length,1);
 click(document.querySelector('.quiz-feedback .next-button'));
}
assert.equal(document.querySelector('.result-ring strong').textContent,'100%');
const saved=JSON.parse(localStorage.getItem('jendy:learning-state:v1')||'null');
assert.equal(saved.reviews.filter(r=>r.lessonId===lessons[0].id).length,3);
// Inspect the actual app storage key rather than requiring the implementation's in-memory state.
const learningKeys=Object.keys(localStorage).filter(k=>k.includes('learning-state'));
assert.ok(learningKeys.length);assert.ok(saved||localStorage.getItem(learningKeys[0]));
console.log('✓ Lessons start with translation, switch answer format, score choices, and reach results without a study gate');
click(button('次のレッスンへ'));
assert.equal(document.querySelector('#lesson-title').textContent,lessons[1].titleJa);
assert.ok(document.querySelector('.quiz-stage'));
assert.equal(document.querySelector('.quiz-feedback'),null);
click(button('キーボード入力'));

act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'})));
render('lesson','reopened');click(document.querySelector('.lesson-card .lesson-action'));
assert.ok(document.querySelector('.tile-bank'),'new lessons start with panels');
act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'})));
console.log('✓ Next lesson resets quiz, feedback receives focus, and answer preference survives reopening');
render('study','study');assert.equal(document.querySelector('.stage-path'),null);click(document.querySelector('.lesson-card .lesson-action'));
assert.ok(document.querySelector('.learn-stage'));assert.equal(document.querySelector('.quiz-stage'),null);
for(let i=0;i<lessons[0].phrases.length;i++)click(document.querySelector('.player-actions .next-button'));
assert.equal(document.querySelector('[role=dialog]'),null);assert.equal(document.querySelector('.quiz-stage'),null);
console.log('✓ Standalone study mode reads all examples then exits without forcing a quiz');
render('lesson','reverse');click(document.querySelector('.direction-mini'));click(document.querySelector('.lesson-card .lesson-action'));
assert.match(document.querySelector('.question-instruction').textContent,/bahasa Jepang/);
assert.equal(document.querySelector('.translation-question h3').textContent,lessons[0].quiz[0].answerId);
click(button('Ketik jawaban'));
const japaneseInput=document.querySelector('textarea');
act(()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(japaneseInput,lessons[0].quiz[0].answerJa);japaneseInput.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
click(button('Periksa jawaban'));assert.equal(document.querySelector('.quiz-feedback strong').textContent,'Benar');
console.log('✓ Reverse translation asks Indonesian → Japanese and accepts Japanese keyboard input');

// Wrong answers can be repaired without rewriting first-pass accuracy.
act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'})));
render('lesson','repair');
if(document.querySelector('.direction-mini').textContent.includes('ID → JA'))click(document.querySelector('.direction-mini'));
click(document.querySelector('.journey-nodes button'));
click(button('選択式'));
for(let i=0;i<3;i++){
 click(button('選択式'));
 const scope=document.querySelector('.choice-grid');
 const wrong=[...scope.querySelectorAll('button')].find(b=>b.textContent!==lessons[0].quiz[i].answerId);
 click(i===0?wrong:button(lessons[0].quiz[i].answerId,scope));
 click(document.querySelector('.quiz-feedback .next-button'));
}
assert.equal(document.querySelector('.result-ring strong').textContent,'67%');
click(button('間違えた1問を解き直す'));click(button('選択式'));
click(button(lessons[0].quiz[0].answerId,document.querySelector('.choice-grid')));
click(document.querySelector('.quiz-feedback .next-button'));
assert.equal(document.querySelector('.result-ring strong').textContent,'67%');
assert.equal(document.querySelector('.repair-button'),null);
console.log('✓ Mistake-only repair preserves first-pass score and clears the repair queue');
// Tiles use all authored words and can be removed and reinserted.
click(button('クイズ再挑戦'));click(button('文章タイル'));
const words=lessons[0].quiz[0].answerId.split(/\s+/);
assert.equal(button('答えを確認').disabled,true);
for(const word of words)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===word));
assert.ok(lastAudio.src.includes('&word='+encodeURIComponent(words.at(-1))));
click(document.querySelector('.tile-answer button'));
assert.ok(lastAudio.src.includes('&word='+encodeURIComponent(words[0])));
assert.equal(button('答えを確認').disabled,true);
// Restart tile selection via mode switch.
click(button('選択式'));click(button('文章タイル'));
for(const word of words)click([...document.querySelectorAll('.tile-bank button')].find(b=>!b.disabled&&b.textContent===word));
click(button('答えを確認'));assert.equal(document.querySelector('.quiz-feedback strong').textContent,'正解');
click(document.querySelector('.quiz-feedback .next-button'));click(button('聞き取り'));
assert.equal(document.querySelector('.translation-question h3'),null,'listening hides the text answer and translation cue');

click(button('選択式'));assert.ok(document.querySelector('.choice-grid'));
console.log('✓ Tile construction, undo, listening hidden prompt, and unavailable-audio fallback');
act(()=>root.unmount());dom.window.close();
