import type { Direction } from "./learning-content";
export type Role = "subject" | "verb" | "object" | "particle" | "modifier" | "affix" | "predicate";
export type Segment = { text: string; role: Role; ja: string; id: string };
export type Anatomy = { ja: Segment[]; id: Segment[]; literalJa: string; literalId: string; registerJa: string; registerId: string };
const s = (text: string, role: Role, ja: string, id: string): Segment => ({ text, role, ja, id });
export const roleLabels: Record<Role, [string, string]> = {
 subject: ["主語・話題", "Subjek/topik"], verb: ["動詞", "Verba"], object: ["対象", "Objek"], particle: ["助詞・前置詞", "Partikel/preposisi"], modifier: ["修飾・時間", "Keterangan"], affix: ["接辞", "Afiks"], predicate: ["述部・状態", "Predikat/keadaan"],
};
const neutral = { registerJa: "普通・丁寧：saya は初対面でも使いやすい形です。日本語はです・ます体。", registerId: "Netral/sopan: saya cocok untuk perkenalan; bahasa Jepang memakai gaya です/ます." };
export const anatomies: Record<string, Anatomy> = {
 "Saya sudah makan": {
  ja: [s("私", "subject", "話題になる人。", "Orang yang menjadi topik."), s("は", "particle", "話題を示す助詞。", "Partikel topik, bukan kata ganti."), s("もう", "modifier", "成立済みを強調。", "Menyoroti keadaan yang sudah tercapai."), s("食べました", "verb", "食べるの丁寧な過去形。", "Bentuk lampau sopan dari 食べる.")],
  id: [s("Saya", "subject", "私。丁寧・中立的。", "Saya, kata ganti netral/sopan."), s("sudah", "modifier", "食事が済んでいる。動詞の過去活用ではありません。", "Tindakan sudah tercapai; bukan konjugasi lampau verba."), s("makan", "verb", "食べる。時制で語形は変わりません。", "Makan; bentuk verba tidak berubah menurut kala.")],
  literalJa: "私／すでに／食べる", literalId: "Saya / [topik] / sudah / makan-[lampau sopan]", ...neutral,
 },
 "Saya belum makan": {
  ja: [s("私", "subject", "話題の人。", "Orang yang dibicarakan."), s("は", "particle", "話題を提示。", "Penanda topik."), s("まだ", "modifier", "未成立の状態。", "Keadaan belum tercapai."), s("食べていません", "verb", "ているの丁寧な否定。ここでは未完了。", "Negasi sopan ている; di sini belum selesai.")],
  id: [s("Saya", "subject", "私。", "Saya."), s("belum", "modifier", "まだ〜ない。今後の成立を排除しません。", "Belum; tidak meniadakan kemungkinan terjadi nanti."), s("makan", "verb", "食べる。", "Makan.")], literalJa: "私／まだ〜ない／食べる", literalId: "Saya / [topik] / belum / makan", ...neutral,
 },
 "Saya sedang belajar": {
  ja: [s("私", "subject", "学ぶ人。", "Orang yang belajar."), s("は", "particle", "話題。", "Topik."), s("今", "modifier", "現在の時点。", "Saat ini."), s("勉強しています", "verb", "勉強する＋ている＋ます。進行中。", "勉強する + ている + ます, proses sedang berlangsung.")],
  id: [s("Saya", "subject", "学ぶ人。", "Pelaku."), s("sedang", "modifier", "動作が進行している。", "Penanda proses sedang berlangsung."), s("belajar", "verb", "学ぶ。ajar の語族。", "Belajar, keluarga kata ajar.")], literalJa: "私／進行中／学ぶ", literalId: "Saya / [topik] / sekarang / sedang belajar", ...neutral,
 },
 "Saya masih bekerja di sini": {
  ja: [s("私", "subject", "働く人。", "Orang yang bekerja."), s("は", "particle", "話題。", "Topik."), s("まだ", "modifier", "継続を強調。", "Masih berlanjut."), s("ここ", "modifier", "現在の場所。", "Tempat ini."), s("で", "particle", "動作を行う場所。", "Tempat kegiatan."), s("働いています", "verb", "就業の状態・習慣が続いている。", "Keadaan bekerja masih berlanjut.")],
  id: [s("Saya", "subject", "私。", "Saya."), s("masih", "modifier", "まだ続いている。", "Keadaan yang berlanjut."), s("bekerja", "verb", "働く。", "Bekerja."), s("di", "particle", "動作の場所。", "Preposisi lokasi."), s("sini", "modifier", "ここ。", "Di tempat ini.")], literalJa: "私／まだ／働く／〜で／ここ", literalId: "Saya / [topik] / masih / di sini / bekerja", ...neutral,
 },
 "Saya pernah ke Bali": {
  ja: [s("私", "subject", "経験者。", "Orang yang mengalami."), s("は", "particle", "話題。", "Topik."), s("バリ", "modifier", "訪問先。", "Tujuan kunjungan."), s("に", "particle", "移動先。", "Tujuan."), s("行ったことがあります", "verb", "過去形＋ことがあるで経験。", "Bentuk-ta + ことがある menyatakan pengalaman.")],
  id: [s("Saya", "subject", "私。", "Saya."), s("pernah", "modifier", "経験がある。", "Penanda pengalaman."), s("ke", "particle", "移動先。pergi が省略されています。", "Tujuan; pergi tidak disebutkan."), s("Bali", "modifier", "バリ。", "Bali.")], literalJa: "私／経験あり／〜へ／バリ", literalId: "Saya / [topik] / Bali / ke / pernah pergi", ...neutral,
 },
 "Saya membaca buku di perpustakaan": {
  ja: [s("図書館", "modifier", "動作の場所。", "Lokasi kegiatan."), s("で", "particle", "存在のにとは異なり動作の場所。", "Tempat kegiatan, berbeda dari に untuk keberadaan."), s("本", "object", "読む対象。", "Benda yang dibaca."), s("を", "particle", "目的語を示す。", "Penanda objek."), s("読みます", "verb", "読むの丁寧形。", "Bentuk sopan dari 読む.")],
  id: [s("Saya", "subject", "読む人。", "Pembaca sebagai pelaku."), s("mem", "affix", "meN- が b の前で mem- に。", "Bentuk meN- sebelum b adalah mem-."), s("baca", "verb", "読むという語根。", "Kata dasar baca."), s("buku", "object", "本。動詞の後ろの目的語。", "Objek setelah verba."), s("di", "particle", "場所の前置詞。分けて書く。", "Preposisi lokasi; ditulis terpisah."), s("perpustakaan", "modifier", "図書館。", "Perpustakaan.")], literalJa: "私／能動＋読む／本／〜で／図書館", literalId: "Perpustakaan / di / buku / [objek] / membaca", ...neutral,
 },
 "Saya di rumah": {
  ja: [s("私", "subject", "存在する人。", "Orang yang berada."), s("は", "particle", "話題。", "Topik."), s("家", "modifier", "存在場所。", "Tempat keberadaan."), s("に", "particle", "いるの場所はに。", "Lokasi dengan いる memakai に."), s("います", "verb", "人の存在を示す。", "Keberadaan manusia.")],
  id: [s("Saya", "subject", "私。", "Saya."), s("di", "particle", "位置を表す。", "Lokasi."), s("rumah", "modifier", "家。動詞なしでも成立する文。", "Rumah; kalimat ini tidak memerlukan verba eksplisit.")], literalJa: "私／〜に／家", literalId: "Saya / [topik] / rumah / di / berada", ...neutral,
 },
 "Saya pergi ke pasar": {
  ja: [s("私", "subject", "移動する人。", "Pelaku perpindahan."), s("は", "particle", "話題。", "Topik."), s("市場", "modifier", "移動先。", "Tujuan."), s("へ", "particle", "方向を示す。にでも可能。", "Arah; に juga bisa untuk tujuan."), s("行きます", "verb", "行くの丁寧形。", "Bentuk sopan dari 行く.")],
  id: [s("Saya", "subject", "私。", "Saya."), s("pergi", "verb", "行く。", "Pergi."), s("ke", "particle", "移動先。位置の di と区別。", "Tujuan, berbeda dari lokasi di."), s("pasar", "modifier", "市場。", "Pasar.")], literalJa: "私／行く／〜へ／市場", literalId: "Saya / [topik] / pasar / ke / pergi", ...neutral,
 },
 "Dia membaca koran": {
  ja: [s("彼", "subject", "読む人。", "Pelaku yang membaca."), s("は", "particle", "話題。", "Topik."), s("新聞", "object", "読む対象。", "Objek bacaan."), s("を", "particle", "対象を示す。", "Penanda objek."), s("読みます", "verb", "文末に置かれる動詞。", "Verba di akhir kalimat.")],
  id: [s("Dia", "subject", "彼・彼女。性別を指定しない代名詞。", "Dia tidak menentukan gender."), s("mem", "affix", "能動の meN-。", "Afiks aktif meN-."), s("baca", "verb", "読むという語根。", "Kata dasar baca."), s("koran", "object", "新聞。", "Surat kabar.")], literalJa: "彼／能動＋読む／新聞", literalId: "Dia / [topik] / koran / [objek] / membaca", ...neutral,
 },
 "Buku ini dibaca banyak orang": {
  ja: [s("この本", "subject", "読まれる対象が話題。", "Buku sebagai penerima tindakan."), s("は", "particle", "話題。", "Topik."), s("多くの人", "modifier", "読む行為者。", "Pelaku pembacaan."), s("に", "particle", "受動文の行為者。", "Pelaku pada kalimat pasif."), s("読まれています", "verb", "読むの受動＋ている。", "Pasif 読む + ている.")],
  id: [s("Buku ini", "subject", "この本。対象が文の前に。", "Buku sebagai topik pasif."), s("di", "affix", "受動の di-。動詞と続けて書く。", "Afiks pasif di-, ditulis serangkai dengan verba."), s("baca", "verb", "読む。", "Baca."), s("banyak orang", "modifier", "行為者。oleh が省かれた形。", "Pelaku; oleh tidak disebutkan.")], literalJa: "本 この／受動＋読む／多くの人", literalId: "Buku ini / [topik] / banyak orang / [pelaku] / dibaca", registerJa: "普通：受動文は本を中心に話したい場面に適します。", registerId: "Netral: pasif cocok saat buku menjadi pusat pembicaraan.",
 },
 "Lagi di jalan": {
  ja: [s("今", "modifier", "現在の時点。", "Sekarang."), s("向かってる", "verb", "向かっているの口語。", "Bentuk santai dari 向かっている.")],
  id: [s("Lagi", "modifier", "ここでは sedang の口語的な役割。", "Di sini berfungsi seperti sedang dalam percakapan."), s("di", "particle", "場所。", "Lokasi."), s("jalan", "modifier", "道。全体で移動中という慣用的な意味。", "Jalan; seluruh ungkapan berarti sedang dalam perjalanan.")], literalJa: "進行中／〜に／道", literalId: "Sekarang / sedang menuju", registerJa: "カジュアル：友達とのチャット向け。仕事では現在地や到着予定も添えます。", registerId: "Santai: cocok untuk chat teman; untuk kerja, tambahkan lokasi atau perkiraan tiba.",
 },
 "Makanan ini kelihatannya enak": {
  ja: [s("この料理", "subject", "見た目を評価する対象。", "Makanan yang diamati."), s("は", "particle", "話題。", "Topik."), s("おいしそうです", "predicate", "おいし＋そう。見た印象で、伝聞ではありません。", "おいし + そう, kesan penampilan; bukan kabar dari orang lain.")],
  id: [s("Makanan ini", "subject", "この料理。", "Makanan ini."), s("kelihatannya", "modifier", "見た印象では。", "Berdasarkan penampilan."), s("enak", "predicate", "おいしい。", "Enak.")], literalJa: "料理 この／見えるところでは／おいしい", literalId: "Makanan ini / [topik] / terlihat-enak-[sopan]", registerJa: "普通・丁寧：見た印象。食べて確認した評価ではありません。", registerId: "Netral/sopan: kesan penampilan, belum tentu sudah dicicipi.",
 },
};
export type Family = { root: string; titleJa: string; titleId: string; noteJa: string; noteId: string; words: [string, string, string][] };
export const families: Family[] = [
 { root: "baca", titleJa: "読む", titleId: "Membaca", noteJa: "di- は受動、場所の di は分かち書き。-kan の機能は語根と文型に依存します。", noteId: "Bedakan afiks di- dari preposisi di. Fungsi -kan bergantung pada kata dan pola kalimat.", words: [["baca", "読む・読みなさい（文脈依存）", "Bentuk dasar / perintah menurut konteks"], ["membaca", "読む（能動）", "Melakukan kegiatan membaca"], ["dibaca", "読まれる", "Bentuk pasif"], ["pembaca", "読者", "Orang yang membaca"], ["bacaan", "読み物", "Bahan untuk dibaca"], ["membacakan", "読み聞かせる", "Membaca untuk orang lain"]] },
 { root: "ajar", titleJa: "学ぶ・教える", titleId: "Belajar dan mengajar", noteJa: "belajar と mengajar では行為者の役割が変わります。接辞を単純に置換せず語族として理解します。", noteId: "Pelaku belajar berbeda dari pelaku mengajar. Pelajari satu keluarga kata dengan peran masing-masing.", words: [["ajar", "教えに関する語根", "Kata dasar"], ["belajar", "学ぶ", "Mempelajari sesuatu"], ["mengajar", "教える", "Memberi pelajaran"], ["pelajar", "学生・学習者", "Orang yang belajar"], ["pengajar", "教える人", "Orang yang mengajar"], ["pembelajaran", "学習・学習過程", "Proses belajar"]] },
 { root: "jalan", titleJa: "道から広がる語族", titleId: "Keluarga kata jalan", noteJa: "語根が同じでも意味は比喩的に広がります。menjalankan は文脈により実行・運営など。", noteId: "Makna dapat meluas secara kiasan. menjalankan dapat berarti melaksanakan atau mengoperasikan.", words: [["jalan", "道", "Jalan"], ["berjalan", "歩く・進行する", "Bergerak dengan kaki / berlangsung"], ["perjalanan", "旅・移動の行程", "Proses bepergian"], ["menjalankan", "実行する・運営する", "Melaksanakan / mengoperasikan"], ["jalan-jalan", "散歩・遊びに出かける", "Bepergian untuk bersantai"]] },
 { root: "tulis", titleJa: "書く", titleId: "Menulis", noteJa: "meN- + tulis では t が脱落し menulis。語根ごとの音変化も一緒に覚えます。", noteId: "t pada tulis luluh menjadi menulis. Perubahan bunyi perlu dipelajari bersama kata dasarnya.", words: [["tulis", "書くという語根", "Kata dasar"], ["menulis", "書く", "Bentuk aktif"], ["ditulis", "書かれる", "Bentuk pasif"], ["penulis", "著者・書き手", "Orang yang menulis"], ["tulisan", "文章・筆跡", "Hasil menulis"]] },
 { root: "kerja", titleJa: "仕事・働く", titleId: "Pekerjaan", noteJa: "pekerja は人、pekerjaan は仕事。語形だけでなく意味の役割も比較します。", noteId: "pekerja adalah orang; pekerjaan adalah kegiatan atau tugas.", words: [["kerja", "仕事・働く（文脈依存）", "Kata dasar / bentuk percakapan"], ["bekerja", "働く", "Melakukan pekerjaan"], ["pekerja", "労働者", "Orang yang bekerja"], ["pekerjaan", "仕事・職業", "Tugas atau profesi"], ["mengerjakan", "取り組む・作業する", "Melaksanakan tugas"]] },
 { root: "書く", titleJa: "日本語の活用と態", titleId: "Konjugasi dan diatesis", noteJa: "可能・使役・受動は意味の役割を変えます。インドネシア語の接辞と一対一に対応するわけではありません。", noteId: "Potensial, kausatif, dan pasif mengubah hubungan makna. Tidak selalu sepadan satu-satu dengan afiks Indonesia.", words: [["書く", "基本形", "Menulis (bentuk kamus)"], ["書ける", "可能", "Bisa menulis"], ["書かせる", "使役", "Menyuruh / membiarkan menulis"], ["書かれる", "受動・尊敬（文脈依存）", "Ditulis / bentuk hormat menurut konteks"], ["書いている", "進行・状態（文脈依存）", "Sedang menulis / keadaan menurut konteks"], ["書かなかった", "否定・過去", "Tidak menulis (lampau)"]] },
 { root: "食べる", titleJa: "一段動詞の変化", titleId: "Perubahan verba ichidan", noteJa: "食べられる は可能・受動・尊敬の解釈があり、文脈で判断します。", noteId: "食べられる dapat bermakna potensial, pasif, atau hormat; konteks menentukan.", words: [["食べる", "食べる", "Makan"], ["食べない", "否定", "Tidak makan"], ["食べた", "過去・完了", "Makan (lampau/selesai)"], ["食べている", "進行（典型的な用法）", "Sedang makan (penggunaan umum)"], ["食べられる", "可能・受動・尊敬", "Bisa makan / dimakan / hormat"], ["食べさせる", "使役", "Menyuruh / membiarkan makan"]] },
];
export function insightFor(idText: string) { return anatomies[idText]; }
export function targetSegments(insight: Anatomy, direction: Direction) { return direction === "ja-id" ? insight.id : insight.ja; }
