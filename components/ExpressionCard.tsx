"use client";
import { useState } from "react";
import type { Direction, Phrase } from "@/lib/learning-content";
import { insightFor, roleLabels, targetSegments } from "@/lib/language-insights";

export function ExpressionCard({ phrase, direction, onSave }: { phrase: Phrase; direction: Direction; onSave?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const ja = direction === "ja-id";
  const insight = insightFor(phrase.id);
  const segments = insight ? targetSegments(insight, direction) : [];
  const segment = selected === null ? null : segments[selected];
  return <div className="expression-card">
    {insight && <>
      <div className="insight-label">SENTENCE ANATOMY <small>{ja ? "語句をタップして役割を見る" : "Ketuk bagian untuk melihat perannya"}</small></div>
      <div className={`anatomy-tokens ${ja ? "indonesian" : "japanese"}`} lang={ja ? "id" : "ja"}>{segments.map((part, index) => <button type="button" key={index} className={`token role-${part.role}`} aria-pressed={selected === index} onClick={() => setSelected(index)}>{part.text}<small>{roleLabels[part.role][ja ? 0 : 1]}</small></button>)}</div>
      <p className="token-detail" aria-live="polite">{segment ? (ja ? segment.ja : segment.id) : (ja ? "語順だけでなく、助詞と接辞が担う役割も確認できます。" : "Lihat peran partikel dan afiks, bukan hanya urutan kata.")}</p>
      <div className="literal-box"><span>{ja ? "構造を追う逐語訳" : "Terjemahan mengikuti struktur"}</span><p>{ja ? insight.literalJa : insight.literalId}</p><small>{ja ? "自然な言い方は上の例文を確認。逐語訳は文の対応を見るためのものです。" : "Lihat contoh di atas untuk ungkapan alami. Ini hanya bantuan memahami struktur."}</small></div>
      <p className="register-note"><b>{ja ? "使いどころ" : "Konteks"}</b> {ja ? insight.registerJa : insight.registerId}</p>
    </>}
    <details className="why-box"><summary>{ja ? "なぜ、この表現になる？" : "Mengapa ungkapannya seperti ini?"}<span>Why?</span></summary><p>{ja ? phrase.noteJa : phrase.noteId}</p></details>
    {onSave && <button type="button" className="save-expression" onClick={() => { onSave(); setSaved(true); }}>{saved ? (ja ? "復習に登録済み ✓" : "Ditambahkan ke ulasan ✓") : (ja ? "この表現を復習に追加 ＋" : "Tambahkan ke ulasan ＋")}</button>}
  </div>;
}
