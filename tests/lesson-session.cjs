const assert=require('node:assert/strict');require('./register.cjs');
const {lessons}=require('../lib/learning-content.ts');const {buildLessonSession}=require('../lib/lesson-session.ts');
assert.equal(lessons[0].quiz[0].answerId,'Saya');assert.equal(lessons[0].quiz[1].answerId,'Kamu');
assert.ok(lessons.findIndex(l=>l.quiz.some(q=>q.answerId==='Selamat pagi'))>=4);
const empty=buildLessonSession(lessons[0],new Set());assert.equal(empty.length,12);assert.ok(empty.every(q=>q.sourceLessonId===lessons[0].id));assert.equal(empty.filter(q=>q.isReview).length,9);
const seen=new Set([lessons[0].id]);const session=buildLessonSession(lessons[1],seen);
assert.equal(session.length,12);assert.ok(session.some(q=>q.sourceLessonId===lessons[0].id));
for(const q of session){const source=lessons.find(l=>l.id===q.sourceLessonId);assert.equal(source.phrases[q.sourcePhraseIndex].id,q.answerId);assert.ok(q.sourceLessonId===lessons[1].id||seen.has(q.sourceLessonId));}
console.log('✓ Saya/Kamu-first progression, 12-question lessons, previous-completed review only, correct SRS sources');
