const assert=require('node:assert/strict');const {JSDOM}=require('jsdom');const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost'});
global.window=dom.window;global.document=dom.window.document;global.localStorage=dom.window.localStorage;global.IS_REACT_ACT_ENVIRONMENT=true;
require('./register.cjs');const React=require('react');const {act}=React;const {createRoot}=require('react-dom/client');const {LessonQuestion}=require('../components/LessonQuestion.tsx');
const {lessons}=require('../lib/learning-content.ts');const question=lessons[0].quiz[0];const root=createRoot(document.getElementById('root'));let current,answer;
window.SpeechRecognition=class{start(){current=this;}abort(){this.aborted=true;}};
function render(mode,key){act(()=>root.render(React.createElement(LessonQuestion,{key,question,direction:'ja-id',choices:question.choicesId,answered:false,mode,onMode(){},onAnswer:value=>answer=value})));}
function click(text){const b=[...document.querySelectorAll('button')].find(b=>b.textContent===text);assert.ok(b,text);act(()=>b.click());}
render('listen','listen');assert.ok(document.querySelector('.tile-bank'));assert.equal(document.querySelector('h3'),null);
click('入力で回答');assert.ok(document.querySelector('textarea'));assert.equal(document.querySelector('h3'),null);
click('パネルで回答');assert.ok(document.querySelector('.tile-bank'));
const listenToggle=document.querySelector('input[type=checkbox]');act(()=>listenToggle.click());assert.equal(localStorage.getItem('jendy:listen-off'),'true');assert.ok(document.querySelector('h3'));
render('listen','persisted');assert.ok(document.querySelector('.tile-bank'));assert.equal(document.querySelector('.listening-prompt'),null);
render('speak','speaking');assert.equal(document.querySelector('.speaking-exercise h3').textContent,question.answerId);
click('マイクで話す');assert.equal(current.lang,'id-ID');act(()=>current.onresult({results:[[{transcript:question.answerId}]]}));click('この文で回答');assert.equal(answer,question.answerId);
click('マイクで話す');act(()=>current.onerror({error:'not-allowed'}));assert.match(document.body.textContent,/許可されていません/);
click('マイクで話す');const last=current;const toggle=document.querySelectorAll('input[type=checkbox]')[1];act(()=>toggle.click());assert.ok(last.aborted);assert.equal(document.querySelector('.speaking-exercise'),null);assert.equal(localStorage.getItem('jendy:speak-off'),'true');
act(()=>root.unmount());console.log('✓ Listening panels/typing keep prompt hidden; preferences persist; speech captures transcript, handles denial and aborts on OFF');dom.window.close();
