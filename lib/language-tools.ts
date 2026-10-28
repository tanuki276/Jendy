import { stemmer } from '@orama/stemmers/indonesian';
import { toHiragana, toKatakana, toRomaji, isKana } from 'wanakana';

// Search assistance only: different affixes must never become equivalent answers.
export function indonesianRoots(text: string): string[] {
  return (text.toLocaleLowerCase('id').match(/[a-z]+/g) ?? []).map(stemmer);
}
export function kanaReading(text: string): string | null {
  return isKana(text) ? toRomaji(text) : null;
}
export function convertKana(text: string, script: 'hiragana' | 'katakana') {
  return script === 'hiragana' ? toHiragana(text) : toKatakana(text);
}
export function matchesLanguageSearch(query: string, japanese: string, indonesian: string) {
  const q = query.normalize('NFKC').trim().toLocaleLowerCase();
  if (!q) return false;
  if (`${japanese} ${indonesian}`.normalize('NFKC').toLocaleLowerCase().includes(q)) return true;
  const roots = indonesianRoots(q);
  const sentenceRoots = new Set(indonesianRoots(indonesian));
  return roots.length > 0 && /^[a-z\s-]+$/.test(q) && roots.every(root => sentenceRoots.has(root));
}
