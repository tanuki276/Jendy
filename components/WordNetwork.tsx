"use client";
import { useState } from "react";
import type { Direction } from "@/lib/learning-content";
import { families } from "@/lib/language-insights";
export function WordNetwork({ direction }: { direction: Direction }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("baca");
  const ja = direction === "ja-id";
  const matching = families.filter(family => `${family.root} ${family.titleJa} ${family.titleId} ${family.words.flat().join(" ")}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const family = matching.find(item => item.root === selected) ?? matching[0];
  return <section className="network-section" id="dictionary">
    <div className="section-kicker">WORD FAMILY NETWORK</div>
    <h2>{ja ? "一語を調べて、つながりまで。" : "Satu kata, satu keluarga makna."}</h2>
    <p>{ja ? "語根・接辞・活用を、別々の暗記からつながる理解へ。" : "Pahami hubungan kata dasar, afiks, dan konjugasi."}</p>
    <label className="dictionary-search">{ja ? "語族辞書を検索" : "Cari keluarga kata"}<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={ja ? "baca、pembaca、書ける、読者…" : "baca, pelajar, 書ける…"} /></label>
    <div className="family-tabs" aria-label={ja ? "語族を選択" : "Pilih keluarga kata"}>{matching.map(item => <button type="button" key={item.root} aria-pressed={family?.root === item.root} onClick={() => setSelected(item.root)}>{item.root}<small>{ja ? item.titleJa : item.titleId}</small></button>)}</div>
    {family ? <div className="family-map"><div className="family-root"><small>ROOT / BASE</small><strong>{family.root}</strong><span>{ja ? family.titleJa : family.titleId}</span></div><div className="family-branches">{family.words.map(([word, meaningJa, meaningId]) => <article key={word}><strong lang={/[ぁ-ん]/.test(word) ? "ja" : "id"}>{word}</strong><p>{ja ? meaningJa : meaningId}</p></article>)}</div><p className="family-note">{ja ? family.noteJa : family.noteId}</p></div> : <p role="status">{ja ? "この語族はまだ収録されていません。baca / ajar / jalan / tulis / kerja / 書く / 食べる を検索できます。" : "Keluarga ini belum tersedia. Coba baca / ajar / jalan / tulis / kerja / 書く / 食べる."}</p>}
  </section>;
}
