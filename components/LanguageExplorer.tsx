"use client";
import { useMemo, useState } from 'react';
import { lessons, type Direction } from '@/lib/learning-content';
import { matchesLanguageSearch, indonesianRoots, kanaReading, convertKana } from '@/lib/language-tools';
import { createLessonAudio } from '@/lib/lesson-audio';
import { useEffect, useRef } from 'react';
const entries = lessons.flatMap(lesson => lesson.quiz.map(question => ({ lesson, question })));
export function LanguageExplorer({ direction }: { direction: Direction }) {
  const ja = direction === 'ja-id';
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const audio = useRef<ReturnType<typeof createLessonAudio> | null>(null);
  useEffect(() => () => audio.current?.stop(), []);
  const matches = useMemo(() => entries.filter(({ question: q }) => matchesLanguageSearch(query, q.answerJa, q.answerId)), [query]);
  const roots = [...new Set(indonesianRoots(query))];
  return <section className="language-explorer">
    <span className="section-kicker">EXPRESSION EXPLORER</span>
    <h2>{ja ? '覚えた言葉を、使える文へ。' : 'Dari kata menjadi kalimat.'}</h2>
    <p>{ja ? '全教材の例文を検索。membaca から baca の仲間も見つかります。' : 'Cari contoh dari seluruh kursus, termasuk keluarga kata.'}</p>
    <label>{ja ? '日本語・インドネシア語で検索' : 'Cari dalam bahasa Jepang atau Indonesia'}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="membaca / minum / 名前" maxLength={100}/></label>
    {query && <><p className="search-count" role="status">{matches.length} {ja ? '件の例文' : 'contoh'}{roots.length > 0 && ` · ${ja ? '検索用の語根候補' : 'Kandidat kata dasar'}: ${roots.join(' / ')}`}</p><div className="expression-results">{matches.slice(0, 20).map(({ lesson, question: q }) => <article key={q.id}><small>{ja ? lesson.titleJa : lesson.titleId}</small><h3 lang="id">{q.answerId}</h3><p lang="ja">{q.answerJa}</p>{kanaReading(q.answerJa) && <small>{kanaReading(q.answerJa)}</small>}<details><summary>{ja ? 'なぜこの表現？' : 'Mengapa begitu?'}</summary><p>{ja ? q.explanationJa : q.explanationId}</p></details><button type="button" className="outline-button" onClick={() => { audio.current?.stop(); setError(false); audio.current = createLessonAudio(q.id, ja ? q.answerId : q.answerJa, ja ? 'id' : 'ja', () => setError(true)); audio.current.play(1); }}>{ja ? '発音を聞く' : 'Dengarkan'}</button></article>)}</div>{matches.length > 20 && <p>{ja ? '先頭20件を表示しています。単語を加えて絞り込めます。' : '20 hasil pertama. Tambahkan kata untuk mempersempit pencarian.'}</p>}</>}
    {error && <p role="status">{ja ? '音声を取得できませんでした。もう一度お試しください。' : 'Audio tidak tersedia. Coba lagi.'}</p>}
    <details className="kana-helper"><summary>{ja ? 'かな・ローマ字の練習ツール' : 'Alat latihan kana dan romaji'}</summary><KanaTool ja={ja}/></details>
  </section>;
}
function KanaTool({ ja }: { ja: boolean }) {
  const [text, setText] = useState('konnichiwa');
  return <div><label>{ja ? 'ローマ字またはかな' : 'Romaji atau kana'}<input value={text} onChange={e => setText(e.target.value)} maxLength={100}/></label><dl><dt>ひらがな</dt><dd>{convertKana(text, 'hiragana')}</dd><dt>カタカナ</dt><dd>{convertKana(text, 'katakana')}</dd></dl><small>{ja ? '文字変換の練習用です。漢字の読みや翻訳は推測しません。' : 'Konversi huruf, bukan penerjemah atau pembaca kanji.'}</small></div>;
}
