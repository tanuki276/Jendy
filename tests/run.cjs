// Run authored content and scheduling invariants without an extra test dependency.
const assert = require('node:assert/strict');
require('./register.cjs');
const { lessons } = require('../lib/learning-content.ts');
const { expandedLessons, units } = require('../lib/course-content.ts');
const { anatomies, families } = require('../lib/language-insights.ts');
const { buildSession, recordPractice, normalizeRecall, readPracticeStats, practiceBank } = require('../lib/practice.ts');
const { loadLearningState, recordAnswer, recordLessonCompletion, upsertReviewItem, gradeReview, dueReviews } = require('../lib/learning-state.ts');
let checks = 0;
function test(name, run) { run(); checks++; console.log(`✓ ${name}`); }
function seeded(seed) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }
test('48 complete lessons with 30 A1 / 12 A2 / 6 B1', () => {
 assert.equal(lessons.length, 48); assert.equal(expandedLessons.length, 42);
 assert.deepEqual(['A1','A2','B1'].map(level => lessons.filter(l => l.level.startsWith(level)).length), [30,12,6]);
 assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
 for (const lesson of lessons) {
  for (const key of ['titleJa','titleId','grammarJa','grammarId','descriptionJa','descriptionId']) assert.ok(lesson[key]?.trim(), `${lesson.id}:${key}`);
  assert.equal(lesson.phrases.length, 3); assert.equal(lesson.quiz.length, 3);
  for (const phrase of lesson.phrases) for (const key of ['ja','id','noteJa','noteId']) assert.ok(phrase[key]?.trim(), `${lesson.id}:${key}`);
 }
});
test('all 144 question pairs / 288 directional questions have a unique correct answer and bilingual explanation', () => {
 assert.equal(practiceBank.length,144);
 const ids = new Set();
 for (const {lesson, question:q} of practiceBank) {
  assert.ok(!ids.has(q.id), q.id); ids.add(q.id);
  for (const suffix of ['Ja','Id']) {
   for (const key of ['prompt','answer','explanation']) assert.ok(q[key+suffix]?.trim(), `${q.id}:${key}${suffix}`);
   const choices = q['choices'+suffix];
   assert.equal(choices.length,3); assert.equal(new Set(choices).size,3, q.id);
   assert.equal(choices.filter(v => v === q['answer'+suffix]).length,1,q.id);
   assert.ok(choices.every(v => v.trim() && !/TODO|TBD|placeholder/i.test(v)));
  }
  assert.ok(lesson.phrases.length > 0);
 }
});
test('every expanded question preserves its authored source, answer, distractors, and explanation', () => {
 for (let i=0;i<units.length;i++) {
  const rows=units[i][7], lesson=expandedLessons[i];
  rows.forEach(([ja,id,wja,wid,nja,nid], index) => {
   const q=lesson.quiz[index];
   assert.ok(q.promptJa.includes(ja)); assert.ok(q.promptId.includes(id));
   assert.equal(q.answerJa,ja); assert.equal(q.answerId,id);
   assert.deepEqual(new Set(q.choicesJa),new Set([ja,...wja]));
   assert.deepEqual(new Set(q.choicesId),new Set([id,...wid]));
   assert.equal(q.explanationJa,nja); assert.equal(q.explanationId,nid);
  });
 }
});
test('sentence anatomy is attached to actual course sentences, with bilingual roles and notes', () => {
 assert.equal(Object.keys(anatomies).length,12);
 for (const [key,a] of Object.entries(anatomies)) {
  assert.ok(lessons.some(l => l.phrases.some(p => p.id===key)),key);
  for (const lang of ['ja','id']) for (const part of a[lang]) assert.ok(part.text && part.role && part.ja && part.id);
  assert.ok(a.literalJa && a.literalId && a.registerJa && a.registerId);
 }
 assert.equal(families.length,7);
 for (const family of families) { assert.ok(family.words.length>=5); assert.equal(new Set(family.words.map(w=>w[0])).size,family.words.length); }
});
test('unlimited sessions have no duplicate questions, respect level, cover the bank, and change order', () => {
 const seen = new Set(); const schedules = new Set();
 for (let seed=1;seed<=300;seed++) {
  const session=buildSession({},'ja-id','All',false,seeded(seed));
  assert.equal(session.length,12);assert.equal(new Set(session.map(i=>i.question.id)).size,12);
  session.forEach(item => seen.add(item.question.id)); schedules.add(session.map(i=>i.question.id).join('|'));
 }
 assert.equal(seen.size,144);assert.ok(schedules.size>290);
 for (const level of ['A1','A2','B1']) assert.ok(buildSession({},'id-ja',level).every(item=>item.lesson.level.startsWith(level)));
});
test('weaknesses prioritize the right direction and remain within the selected level', () => {
 let stats=recordPractice({},'ja-id',expandedLessons[0].id,false);
 assert.equal(buildSession(stats,'id-ja','All',true).length,0);
 assert.equal(buildSession(stats,'ja-id','B1',true).length,0);
 assert.equal(buildSession(stats,'ja-id','A1',true).length,3);
 assert.ok(buildSession(stats,'ja-id').some(item=>item.lesson.id===expandedLessons[0].id));
 stats=recordPractice(stats,'ja-id',expandedLessons[0].id,true);
 assert.equal(stats[`ja-id:${expandedLessons[0].id}`].attempts,2);
 assert.equal(stats[`ja-id:${expandedLessons[0].id}`].correct,1);
});
test('recall normalization ignores casing, spacing, and sentence punctuation but preserves meaningful small kana and affixes', () => {
 assert.equal(normalizeRecall(' Ｓａｙａ SUDAH makan！'), normalizeRecall('Saya sudah makan'));
 assert.equal(normalizeRecall('私はもう食べました。'),normalizeRecall('私はもう食べました'));
 assert.notEqual(normalizeRecall('Saya belum makan'),normalizeRecall('Saya sudah makan'));
 assert.notEqual(normalizeRecall('きて'),normalizeRecall('きって'));
});
test('practice storage rejects malformed records', () => {
 global.window={};global.localStorage={getItem:()=>JSON.stringify({'bad':{attempts:-1,correct:9,lastWrong:false}, 'ja-id:good':{attempts:2,correct:1,lastWrong:true}})};
 assert.deepEqual(Object.keys(readPracticeStats()),['ja-id:good']);
 global.localStorage={getItem:()=>'{invalid'};assert.deepEqual(readPracticeStats(),{});
 delete global.window; delete global.localStorage;
});
test('answer, direction-specific completion, review persistence and scheduling work together', () => {
 let state=loadLearningState();
 state=recordAnswer(state,true); assert.equal(state.stats.answered,1);assert.equal(state.stats.correct,1);
 const lessonId=lessons[6].id;
 state=recordLessonCompletion(state,`ja-id:${lessonId}`,100);
 assert.equal(state.lessonScores[`id-ja:${lessonId}`],undefined);
 state=upsertReviewItem(state,{lessonId,phraseIndex:0,direction:'ja-id'});
 state=upsertReviewItem(state,{lessonId,phraseIndex:0,direction:'ja-id'});assert.equal(state.reviews.length,1);
 assert.equal(dueReviews(state,'ja-id').length,1);assert.equal(dueReviews(state,'id-ja').length,0);
 for (const [grade,days] of [['good',1],['easy',3],['hard',1]]) {
  const next=gradeReview(state,state.reviews[0].key,grade);assert.equal(next.reviews[0].intervalDays,days);assert.equal(dueReviews(next).length,0);
 }
 const again=gradeReview(state,state.reviews[0].key,'again');
 assert.ok(new Date(again.reviews[0].dueAt)-Date.now()>9*60*1000);
});
test('learning surfaces render on the server in both directions without browser globals', () => {
 const React = require('react'); const { renderToStaticMarkup } = require('react-dom/server');
 const { ExpressionCard } = require('../components/ExpressionCard.tsx');
 const { WordNetwork } = require('../components/WordNetwork.tsx');
 const { PracticeLab } = require('../components/PracticeLab.tsx');
 for (const direction of ['ja-id','id-ja']) {
  for (const lesson of lessons) for (const phrase of lesson.phrases) {
   assert.ok(renderToStaticMarkup(React.createElement(ExpressionCard,{phrase,direction})).includes('Why?'));
  }
  assert.ok(renderToStaticMarkup(React.createElement(WordNetwork,{direction})).includes('baca'));
  assert.ok(renderToStaticMarkup(React.createElement(PracticeLab,{direction,onAnswer:()=>{}})).includes('144'));
 }
});
console.log(`\n${checks} checks passed. All authored question records inspected.`);
