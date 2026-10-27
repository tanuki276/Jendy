// Run after `npm run build`: inspect the HTML that Vercel will actually serve.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const destinations = { index: null, login: null, study:'curriculum', lesson:'curriculum', practice:'practice', dictionary:'dictionary', review:'review', dashboard:'dashboard' };
const ids = Object.values(destinations).filter(Boolean);
for (const [page, expected] of Object.entries(destinations)) {
 const html=fs.readFileSync(`.next/server/app/${page}.html`,'utf8');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${page}: one page heading`);
 for (const id of ids) assert.equal(html.includes(`id="${id}"`),id===expected,`${page}: isolated activity ${id}`);
 assert.equal(html.includes('class="hero"'),page==='index',`${page}: home-only hero`);
 assert.equal(html.includes('class="login-page"'),page==='login',`${page}: login-only form`);
 for (const route of ['login','lesson','study','practice','dictionary','review','dashboard']) assert.ok(html.includes(`href="/${route}"`),`${page}: link to ${route}`);
 assert.ok(!/Yuki|ユキ|クラウド|OPTIONAL CLOUD SYNC|同期ログイン|ローカルモード|Cloud boleh berhenti/.test(html),`${page}: names and copy`);
 assert.ok(!/href="#(?:curriculum|practice|dictionary|review|dashboard)"/.test(html),`${page}: real route links`);
 console.log(`✓ /${page==='index'?'':page}: isolated content, navigation, title, and copy`);
}
const { lessons }=(() => {require('./register.cjs');return require('../lib/learning-content.ts');})();
const intro=lessons.find(lesson=>lesson.id==='greetings-01');
assert.ok(intro.phrases.some(p=>p.id==='Nama saya Tini'));
assert.equal(intro.quiz[1].answerId,'Nama saya Tini');
assert.equal(intro.quiz[1].answerJa,'私の名前はティニです');
assert.ok(intro.quiz[1].choicesId.includes('Nama saya Taro'));
assert.ok(intro.quiz[1].choicesJa.includes('私の名前は太郎です'));
console.log('✓ Tini / Taro names match across example, question, answers, and distractors');
