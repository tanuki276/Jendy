const assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'http://localhost/lesson'});
global.self=dom.window;global.window=dom.window;global.document=dom.window.document;global.HTMLElement=dom.window.HTMLElement;global.localStorage=dom.window.localStorage;global.IS_REACT_ACT_ENVIRONMENT=true;
require('./register.cjs');const React=require('react');const {act}=React;const {createRoot}=require('react-dom/client');
const {AppRouterContext}=require('next/dist/shared/lib/app-router-context.shared-runtime');
const {JendyApp}=require('../components/JendyApp.tsx');const {lessons}=require('../lib/learning-content.ts');
const root=createRoot(document.getElementById('root'));const router={push(){},replace(){},prefetch(){return Promise.resolve()},refresh(){},back(){},forward(){}};
function render(view,key){act(()=>root.render(React.createElement(AppRouterContext.Provider,{value:router},React.createElement(JendyApp,{view,key}))))}
function click(el){assert.ok(el);act(()=>el.click())}
function button(text,scope=document){const b=[...scope.querySelectorAll('button')].find(b=>b.textContent.trim()===text);assert.ok(b,text);return b}
render('lesson','lesson');click(document.querySelector('.lesson-card .lesson-action'));
assert.ok(document.querySelector('.quiz-stage'));assert.equal(document.querySelector('.learn-stage'),null);
assert.match(document.querySelector('.question-instruction').textContent,/インドネシア語に訳/);
assert.equal(document.querySelector('.translation-question h3').textContent,lessons[0].quiz[0].answerJa);
click(button('キーボード入力'));assert.ok(document.querySelector('textarea'));
const input=document.querySelector('textarea');
act(()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(input,'selamat pagi!');input.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
assert.equal(button('答えを確認').disabled,false);
click(button('答えを確認'));assert.match(document.querySelector('.quiz-feedback strong').textContent,/正解/);
click(document.querySelector('.quiz-feedback .next-button'));
assert.ok(document.querySelector('textarea'),'keyboard mode persists to the next question');
click(button('選択式'));assert.ok(document.querySelector('.choice-grid'));
for(let i=1;i<3;i++){
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
act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'})));
render('study','study');assert.equal(document.querySelector('.stage-path'),null);click(document.querySelector('.lesson-card .lesson-action'));
assert.ok(document.querySelector('.learn-stage'));assert.equal(document.querySelector('.quiz-stage'),null);
for(let i=0;i<lessons[0].phrases.length;i++)click(document.querySelector('.player-actions .next-button'));
assert.equal(document.querySelector('[role=dialog]'),null);assert.equal(document.querySelector('.quiz-stage'),null);
console.log('✓ Standalone study mode reads all examples then exits without forcing a quiz');
render('lesson','reverse');click(document.querySelector('.direction-mini'));click(document.querySelector('.lesson-card .lesson-action'));
assert.match(document.querySelector('.question-instruction').textContent,/ke bahasa Jepang/);
assert.equal(document.querySelector('.translation-question h3').textContent,lessons[0].quiz[0].answerId);
click(button('Ketik jawaban'));
const japaneseInput=document.querySelector('textarea');
act(()=>{Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype,'value').set.call(japaneseInput,lessons[0].quiz[0].answerJa);japaneseInput.dispatchEvent(new dom.window.Event('input',{bubbles:true}));});
click(button('Periksa jawaban'));assert.equal(document.querySelector('.quiz-feedback strong').textContent,'Benar');
console.log('✓ Reverse translation asks Indonesian → Japanese and accepts Japanese keyboard input');
act(()=>root.unmount());dom.window.close();
