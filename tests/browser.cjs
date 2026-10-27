// Start the app first. Install playwright + chromium, or use the Codex runtime.
const assert = require('node:assert/strict');
const fs = require('node:fs');
require('./register.cjs');
const { lessons } = require('../lib/learning-content.ts');
let chromium;
try { ({chromium} = require('playwright')); }
catch { ({chromium} = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES + '/playwright')); }
(async () => {
 const browser = await chromium.launch({headless:true, executablePath:process.env.JENDY_CHROMIUM_PATH || undefined, args:['--no-sandbox', '--disable-dev-shm-usage']});
 try {
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];
 page.on('pageerror', error=>errors.push(error.message));
 page.on('console', message=> {if(message.type()==='error' && /hydration|hydrated|React error/i.test(message.text())) errors.push(message.text());});
 const base=process.env.JENDY_TEST_URL || 'http://127.0.0.1:3000';
 const visit = route => page.goto(new URL(route,base).href);
 await visit('/');
 await page.getByRole('heading',{name:'その訳の先にある、「なぜ？」まで。'}).waitFor();
 const hero=page.locator('.hero-card');
 await hero.getByRole('button',{name:/sudah/}).click();
 assert.match(await hero.locator('.token-detail').innerText(),/過去活用/);
 await hero.locator('summary').click();assert.match(await hero.locator('details').innerText(),/食事が済んだ/);
 await hero.getByRole('button',{name:/この表現を復習に追加/}).click();
 await page.locator('.nav-links').getByRole('link',{name:'復習',exact:true}).click();
 assert.match(page.url(),/\/review$/);
 assert.equal(await page.locator('#curriculum').count(),0);
 assert.equal(await page.locator('.review-top').innerText().then(t=>t.includes('1 DUE')),true);
 console.log('✓ Anatomy, Why?, and SRS save');
 await visit('/dictionary');
 const dict=page.locator('#dictionary');
 await dict.getByLabel('語族辞書を検索').fill('pembaca');
 assert.match(await dict.locator('.family-branches').innerText(),/membacakan/);
 await dict.getByLabel('語族辞書を検索').fill('no-such-word');assert.equal(await dict.locator('.family-map').count(),0);
 await dict.getByLabel('語族辞書を検索').fill('');
 console.log('✓ Word family search and empty state');
 // Test the ENTIRE bank in both directions through the real lesson player.
 await visit('/lesson');
 assert.equal(await page.locator('.hero').count(),0);
 assert.equal(await page.locator('#practice').count(),0);
 for (const direction of ['ja-id','id-ja']) {
  if(direction==='id-ja') await page.locator('.direction-mini').click();
  for (const lesson of lessons) {
   const isJa=direction==='ja-id';const title=isJa?lesson.titleJa:lesson.titleId;
   await page.getByLabel(isJa?'教材を検索':'Cari pelajaran',{exact:true}).fill(title);
   const card=page.locator('.lesson-card').filter({has:page.getByRole('heading',{name:title,exact:true})});
   await card.locator('button').click();
   const modal=page.getByRole('dialog');
   await modal.locator('.translation-question').waitFor();
   for(let q=0;q<lesson.quiz.length;q++) {
    await modal.getByRole('button',{name:isJa?lesson.quiz[q].answerId:lesson.quiz[q].answerJa,exact:true}).click();
    await modal.locator('.quiz-feedback .next-button').click();
   }
   assert.equal(await modal.locator('.result-ring strong').innerText(),'100%');
   await page.keyboard.press('Escape');assert.equal(await modal.count(),0);
  }
  console.log(`✓ All ${lessons.length} lesson players / ${lessons.length*3} questions: ${direction}`);
 }
 await page.getByLabel('Cari pelajaran',{exact:true}).fill('');
 // Reload existing state: no hydration mismatch; progress survives direction change.
 await visit('/dashboard');
 await page.reload();
 await page.waitForFunction(()=>document.querySelector('.dashboard-progress strong')?.textContent==='100%');
 assert.equal(await page.locator('.dashboard-progress strong').innerText(),'100%');
 await page.locator('.direction-mini').click();
 await page.waitForFunction(()=>document.querySelector('.dashboard-progress strong')?.textContent==='100%');
 console.log('✓ Both-direction completion and reload persistence');
 await visit('/practice');
 const practice=page.locator('#practice');
 await practice.getByRole('button',{name:'12問の練習を始める →',exact:true}).click();
 await practice.locator('.choice-grid button').first().click();
 await practice.locator('.practice-feedback').waitFor();
 await practice.getByRole('button',{name:'練習を終える',exact:true}).click();
 const recorded=await page.evaluate(()=>JSON.parse(localStorage.getItem('jendy:practice:v1')));
 assert.equal(Object.values(recorded).reduce((n,v)=>n+v.attempts,0),1);
 await practice.getByLabel('練習方法').selectOption('recall');
 await practice.getByRole('button',{name:'12問の練習を始める →',exact:true}).click();
 await practice.locator('textarea').fill('別の表現を入力');
 await practice.getByRole('button',{name:'模範例と照合',exact:true}).click();
 assert.match(await practice.locator('.practice-feedback').innerText(),/別の正しい表現もあります/);
 await practice.getByRole('button',{name:'練習を終える',exact:true}).click();
 await page.reload();await practice.getByRole('heading',{name:'あなたの復習ポイント'}).waitFor();
 await page.waitForFunction(()=>Object.values(JSON.parse(localStorage.getItem('jendy:practice:v1'))).reduce((n,v)=>n+v.attempts,0)===2);
 console.log('✓ Choice practice, typed recall, and weakness persistence');
 await visit('/lesson');
 await page.getByLabel('レベル',{exact:true}).last().selectOption('B1');
 assert.equal(await page.locator('.lesson-card').count(),6);
 await page.getByLabel('レベル',{exact:true}).last().selectOption('All');
 assert.equal(await page.locator('.lesson-card').count(),12);
 await page.getByRole('button',{name:/さらに12レッスン/}).click();assert.equal(await page.locator('.lesson-card').count(),24);
 console.log('✓ Course filters and pagination');
 fs.mkdirSync('/tmp/jendy-qa',{recursive:true});
 await visit('/');
 await page.screenshot({path:'/tmp/jendy-qa/desktop.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'mobile horizontal overflow');
 await page.screenshot({path:'/tmp/jendy-qa/mobile.png',fullPage:true});
 await page.locator('.nav-links').getByRole('link',{name:'レッスン',exact:true}).click();
 assert.match(page.url(),/\/lesson$/);
 await page.getByLabel('教材を検索',{exact:true}).fill(lessons[6].titleJa);
 await page.locator('.lesson-card button').click();
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')),'閉じる');
 await page.screenshot({path:'/tmp/jendy-qa/mobile-lesson.png',fullPage:true});
 await page.keyboard.press('Escape');
 await visit('/login');
 await page.locator('.login-card form').waitFor();
 assert.equal(await page.getByRole('dialog').count(),0);
 assert.equal(await page.locator('#curriculum').count(),0);
 assert.match(await page.locator('.login-card').innerText(),/ログインせずにレッスンを見る/);
 assert.deepEqual(errors,[]);
 console.log('✓ Mobile layout, keyboard focus, Escape, and zero runtime/hydration errors');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
