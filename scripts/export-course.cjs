const fs = require('node:fs');
require('../tests/register.cjs');
const { lessons } = require('../lib/learning-content.ts');
const lines = ['# Jendy: complete question catalog', '', 'Generated from the shipped lesson data. 48 lessons, 144 question pairs, 288 directional questions.', '', 'Every option, answer, and explanation is included below. This export does not create extra questions.', ''];
for (const lesson of lessons) {
 lines.push(`## ${lesson.level} — ${lesson.titleJa} / ${lesson.titleId}`, '', `ID: ${lesson.id}`, '', lesson.grammarJa, '', lesson.grammarId, '');
 for (const q of lesson.quiz) {
  lines.push(`### ${q.id}`, '', `**JA → ID:** ${q.promptJa}`, '', ...q.choicesId.map(v=>`- ${v}${v===q.answerId?' ✓':''}`), '', q.explanationJa, '', `**ID → JA:** ${q.promptId}`, '', ...q.choicesJa.map(v=>`- ${v}${v===q.answerJa?' ✓':''}`), '', q.explanationId, '');
 }
}
fs.mkdirSync('docs', {recursive:true});fs.writeFileSync('docs/question-catalog.md',lines.join('\n'));
console.log(`Exported ${lessons.length} lessons / ${lessons.reduce((n,l)=>n+l.quiz.length*2,0)} directional questions.`);
